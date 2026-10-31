import {
  flagshipProjectSlug,
  getProjectBySlug,
  profile,
  projectGalleryPath,
  projectTagLabels,
  projects,
  publicAsset,
  parseProjectGallerySlug,
  skills,
  soloProjectScope,
  whatsappHref,
  type Project,
} from '../data/content'

export type GuideLink = { label: string; href: string }

export type GuideReply = {
  text: string
  links?: GuideLink[]
}

export type GuideTurn = { role: 'user' | 'guide'; text: string; links?: GuideLink[] }

export type GuideContext = { history: GuideTurn[] }

export const guideSuggestedPrompts = [
  'About Sameer',
  'Open project galleries',
  'Phone number',
  'Contact & hiring',
] as const

const PROJECT_ALIASES: Record<string, string[]> = {
  'new-electro-palace': ['electro', 'palace', 'ecommerce', 'e-commerce', 'electropalace', 'new electro'],
  'shahco-print-bridge': ['print bridge', 'printbridge', 'printing', 'shahco print', 'shah&co print'],
  'shahco-scanner-software': ['scanner', 'barcode', 'billing app', 'bill scanning', 'shahco scanner'],
  'sulanza-website': ['sulanza', 'marketing site', 'sulanza tech'],
  'accounting-software': ['accounting', 'accounts', 'saas', 'flagship', 'ledger', 'finance app'],
}

function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^\w\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function includesAny(hay: string, needles: string[]) {
  return needles.some(n => hay.includes(n))
}

function findProject(query: string): Project | undefined {
  const q = normalize(query)
  for (const p of projects) {
    if (q.includes(normalize(p.slug))) return p
    if (q.includes(normalize(p.name))) return p
    const aliases = PROJECT_ALIASES[p.slug] ?? []
    if (aliases.some(a => q.includes(normalize(a)))) return p
  }
  return undefined
}

function galleryLinks(filter?: (p: Project) => boolean): GuideLink[] {
  return projects
    .filter(p => p.images?.length)
    .filter(p => (filter ? filter(p) : true))
    .map(p => ({
      label: `${p.name} (${p.images!.length} screens)`,
      href: projectGalleryPath(p.slug),
    }))
}

function projectSummary(p: Project) {
  return `${p.name} (${p.category}): ${p.solution}`
}

const telHref = `tel:${profile.phone.replace(/\s/g, '')}`

function replyFullContact(intro?: string): GuideReply {
  return {
    text:
      intro ??
      `${profile.name} — ${profile.title}, ${profile.location}. ${profile.availability}\n\nPhone: ${profile.phone}\nEmail: ${profile.email}`,
    links: [
      { label: 'Contact section', href: '#contact' },
      { label: `Call ${profile.phone}`, href: telHref },
      { label: 'WhatsApp', href: whatsappHref(profile.whatsapp) },
      { label: 'Email', href: `mailto:${profile.email}` },
      { label: 'LinkedIn', href: profile.linkedin },
      ...(profile.github ? [{ label: 'GitHub', href: profile.github }] : []),
      { label: 'Download resume', href: publicAsset(profile.resumeFile) },
    ],
  }
}

function replyPhone(): GuideReply {
  return {
    text: `Phone number listed on this portfolio:\n${profile.phone}\n\nUse call/SMS or WhatsApp — both are on the Contact section with copy buttons.`,
    links: [
      { label: `Call ${profile.phone}`, href: telHref },
      { label: 'WhatsApp', href: whatsappHref(profile.whatsapp) },
      { label: 'Contact section', href: '#contact' },
    ],
  }
}

function replyEmail(): GuideReply {
  return {
    text: `Email for hiring and projects:\n${profile.email}`,
    links: [
      { label: `Email ${profile.name.split(' ')[0]}`, href: `mailto:${profile.email}` },
      { label: 'Contact section', href: '#contact' },
    ],
  }
}

function replyWhatsApp(): GuideReply {
  return {
    text: `WhatsApp is set up for ${profile.phone}. Tap below to open a chat — useful for quick questions or sharing a brief.`,
    links: [
      { label: 'Open WhatsApp', href: whatsappHref(profile.whatsapp) },
      { label: 'Contact section', href: '#contact' },
    ],
  }
}

function replyLocation(): GuideReply {
  return {
    text: `${profile.name} is based in ${profile.location}. ${profile.availability}`,
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  }
}

function replySocial(): GuideReply {
  return {
    text: `Public profiles linked from this portfolio:`,
    links: [
      { label: 'LinkedIn', href: profile.linkedin },
      ...(profile.github ? [{ label: 'GitHub', href: profile.github }] : []),
      { label: 'Contact section', href: '#contact' },
    ],
  }
}

/** Phone, email, WhatsApp, location, social — including informal phrasing. */
function tryContactIntent(q: string): GuideReply | null {
  const n = normalize(q)
  const excludesProject = includesAny(n, [
    'account number',
    'accounting number',
    'invoice',
    'chart of',
    'transaction',
    'version number',
    'serial',
  ])

  const wantsPhone =
    !excludesProject &&
    (includesAny(n, [
      'phone number',
      'phone no',
      'mobile number',
      'cell number',
      'contact number',
      'whatsapp number',
      'give me the number',
      'give me number',
      'give number',
      'share the number',
      'share number',
      'what is the number',
      'what s the number',
      'whats the number',
      'his number',
      'her number',
      'your number',
      'ur number',
      'call him',
      'call her',
      'call sameer',
      'reach by phone',
      'text him',
      'text her',
      'sms',
    ]) ||
      (/\b(give|share|send|tell|need|want|get)\b/.test(n) && /\b(number|phone|mobile|cell)\b/.test(n)) ||
      (/\b(number|phone|mobile|cell)\b/.test(n) && /\b(please|plz|what|which)\b/.test(n)) ||
      (n === 'number' || n === 'phone' || n === 'mobile'))

  if (wantsPhone) {
    if (includesAny(n, ['whatsapp', 'whats app', 'wa '])) return replyWhatsApp()
    return replyPhone()
  }

  if (includesAny(n, ['whatsapp', 'whats app', 'wa me', 'whats app me']) && !includesAny(n, ['gallery', 'screenshot', 'project page'])) {
    return replyWhatsApp()
  }

  const wantsEmail =
    includesAny(n, ['email address', 'e mail', 'email id', 'mail id', 'gmail']) ||
    (includesAny(n, ['email', 'mailto', 'inbox']) && !includesAny(n, ['gallery'])) ||
    (/\b(give|share|send|tell|need|want)\b/.test(n) && includesAny(n, ['email', 'mail']))

  if (wantsEmail) return replyEmail()

  if (includesAny(n, ['linkedin', 'linked in'])) {
    return {
      text: `LinkedIn profile for ${profile.name}:`,
      links: [{ label: 'Open LinkedIn', href: profile.linkedin }, { label: 'Contact', href: '#contact' }],
    }
  }

  if (includesAny(n, ['github', 'git hub', 'git hub profile']) && !findProject(q)) {
    if (!profile.github) return replyFullContact('GitHub is not listed — here are other ways to reach out:')
    return {
      text: `GitHub profile linked from this portfolio:`,
      links: [{ label: 'Open GitHub', href: profile.github }, { label: 'Projects on site', href: '#projects' }],
    }
  }

  if (
    includesAny(n, ['where are you', 'where do you live', 'based in', 'location', 'city', 'country', 'karachi', 'pakistan']) &&
    !includesAny(n, ['project', 'gallery', 'server'])
  ) {
    return replyLocation()
  }

  if (
    includesAny(n, [
      'contact info',
      'contact details',
      'contact information',
      'how to contact',
      'how to reach',
      'get in touch',
      'reach out',
      'reach you',
      'talk to',
      'speak to',
      'connect with',
      'social media',
      'social link',
      'links',
    ]) &&
    !includesAny(n, ['project link', 'live link', 'repo link'])
  ) {
    if (includesAny(n, ['social', 'linkedin', 'github', 'profile'])) return replySocial()
    return replyFullContact()
  }

  if (
    includesAny(n, ['contact', 'hire', 'hiring', 'freelance', 'work together', 'message him', 'message her', 'collaborate']) &&
    !includesAny(n, ['form', 'gallery'])
  ) {
    return replyFullContact()
  }

  return null
}

function tryHelpIntent(q: string): GuideReply | null {
  if (includesAny(q, ['help', 'what can you do', 'what do you do', 'commands', 'options', 'menu', 'stuck', 'confused'])) {
    return {
      text: `I can help with:\n• Projects and screenshot galleries\n• Skills and experience\n• Phone, email, WhatsApp, LinkedIn\n• Resume download\n\nTry "open project galleries", "phone number", or a project name.`,
      links: [
        { label: 'All projects', href: '#projects' },
        { label: 'Contact details', href: '#contact' },
        ...galleryLinks().slice(0, 2),
      ],
    }
  }
  if (/^(thanks|thank you|thx|ok thanks|cheers)\b/.test(q)) {
    return {
      text: `Glad to help. If you're hiring or have a project in mind, ${profile.email} and WhatsApp are the fastest follow-ups.`,
      links: [
        { label: 'Contact', href: '#contact' },
        { label: 'WhatsApp', href: whatsappHref(profile.whatsapp) },
      ],
    }
  }
  return null
}

function lastGuideTurn(history: GuideTurn[]): GuideTurn | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'guide') return history[i]
  }
}

function lastUserTurn(history: GuideTurn[]): GuideTurn | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'user') return history[i]
  }
}

function galleryLinksFromTurn(turn: GuideTurn): GuideLink[] {
  return (turn.links ?? []).filter(l => l.href.startsWith('#/projects/'))
}

function slugFromGalleryHref(href: string) {
  return parseProjectGallerySlug(href.split('?')[0]) ?? undefined
}

function isSelectionQuery(q: string) {
  return (
    includesAny(q, [
      'show',
      'open',
      'view',
      'see',
      'go to',
      'take me',
      'launch',
      'visit',
      'display',
      'that one',
      'this one',
      'the one',
      'those',
      'pick',
      'choose',
      'select',
      'link',
      'gallery',
    ]) ||
    /^(yes|yeah|yep|yup|ok|okay|sure|please|thanks|go ahead)\b/.test(q) ||
    /\b(first|second|third|fourth|fifth|last|\d+(st|nd|rd|th)?)\b/.test(q)
  )
}

function parseOrdinalIndex(q: string, length: number): number | null {
  if (length <= 0) return null
  const n = normalize(q)
  if (/\blast\b/.test(n)) return length - 1
  if (/\b(third|3rd|#3)\b/.test(n) || includesAny(n, ['number 3'])) return Math.min(2, length - 1)
  if (/\b(second|2nd|#2)\b/.test(n) || includesAny(n, ['number 2'])) return Math.min(1, length - 1)
  if (/\b(first|1st|#1)\b/.test(n) || includesAny(n, ['first one', 'the first', 'number 1']) || n === '1') return 0
  const num = n.match(/\b([1-9])\b/)
  if (num) {
    const idx = parseInt(num[1], 10) - 1
    if (idx >= 0 && idx < length) return idx
  }
  return null
}

function matchLinkByWords(q: string, links: GuideLink[]): GuideLink | undefined {
  const words = normalize(q).split(' ').filter(w => w.length > 3)
  if (!words.length) return undefined
  let best: { link: GuideLink; score: number } | undefined
  for (const link of links) {
    const label = normalize(link.label)
    let score = 0
    for (const w of words) {
      if (label.includes(w)) score++
    }
    if (score > 0 && (!best || score > best.score)) best = { link, score }
  }
  return best?.link
}

function replyForGalleryLink(link: GuideLink): GuideReply {
  const slug = slugFromGalleryHref(link.href)
  const project = slug ? getProjectBySlug(slug) : undefined
  if (project?.images?.length) {
    return {
      text: `${project.name} — ${project.images.length} screenshots plus a case study (role, timeline, technical notes). Opening the gallery below.`,
      links: [
        { label: `Open ${project.name} gallery`, href: link.href },
        ...(project.live ? [{ label: 'Live site', href: project.live }] : []),
      ],
    }
  }
  return {
    text: `Here is the link you asked for: ${link.label}.`,
    links: [link],
  }
}

function tryContextualAnswer(q: string, ctx: GuideContext): GuideReply | null {
  const lastGuide = lastGuideTurn(ctx.history)
  const choices = lastGuide ? galleryLinksFromTurn(lastGuide) : []
  const fallbackChoices = lastGuide?.links?.length ? lastGuide.links : []

  if (lastGuide && isSelectionQuery(q)) {
    const pool = choices.length ? choices : fallbackChoices
    if (pool.length) {
      const idx = parseOrdinalIndex(q, pool.length)
      if (idx !== null && pool[idx]) return replyForGalleryLink(pool[idx])

      const byWord = matchLinkByWords(q, pool)
      if (byWord?.href.startsWith('#/projects/')) return replyForGalleryLink(byWord)

      if (/^(yes|yeah|yep|yup|ok|okay|sure|please|go ahead)\b/.test(q) && choices.length === 1) {
        return replyForGalleryLink(choices[0])
      }
    }
  }

  const prevUser = lastUserTurn(ctx.history)
  if (prevUser && includesAny(q, ['more', 'details', 'tell me', 'about it', 'that project', 'this project'])) {
    const project = findProject(prevUser.text) ?? findProject(lastGuide?.text ?? '')
    if (project) {
      const links: GuideLink[] = [{ label: 'Projects section', href: '#projects' }]
      if (project.images?.length) {
        links.unshift({ label: `${project.name} gallery`, href: projectGalleryPath(project.slug) })
      }
      return {
        text: `${projectSummary(project)}\n\nScope: ${soloProjectScope}`,
        links,
      }
    }
  }

  if (includesAny(q, ['same', 'another', 'else', 'other gallery', 'different project']) && choices.length > 1) {
    const lastIdx = parseOrdinalIndex(lastUserTurn(ctx.history)?.text ?? '', choices.length)
    const next = lastIdx !== null ? (lastIdx + 1) % choices.length : 0
    return {
      text: 'Here is another gallery from the list I shared:',
      links: [choices[next], ...choices.filter((_, i) => i !== next).slice(0, 2)],
    }
  }

  return null
}

function suggestFromContext(raw: string, ctx: GuideContext): GuideReply {
  const q = normalize(raw)
  const contact = tryContactIntent(q)
  if (contact) return contact
  const help = tryHelpIntent(q)
  if (help) return help

  const lastGuide = lastGuideTurn(ctx.history)
  const galleries = lastGuide ? galleryLinksFromTurn(lastGuide) : []

  if (galleries.length) {
    const numbered = galleries.map((l, i) => `${i + 1}. ${l.label}`).join('\n')
    return {
      text: `I didn't catch that, but you can refer to the galleries I listed:\n${numbered}\nTry "open the first one", "show scanner gallery", or tap a link.`,
      links: galleries,
    }
  }

  if (lastGuide?.links?.length) {
    const numbered = lastGuide.links.map((l, i) => `${i + 1}. ${l.label}`).join('\n')
    return {
      text: `I'm not sure what "${q.trim()}" refers to. From my last reply, you can pick:\n${numbered}\nOr ask about contact, skills, or a project by name.`,
      links: lastGuide.links,
    }
  }

  const hints: string[] = []
  if (/\b(number|phone|call|mobile)\b/.test(q)) hints.push('phone number')
  if (/\b(email|mail)\b/.test(q)) hints.push('email address')
  if (/\b(gallery|screenshot|screens)\b/.test(q)) hints.push('open project galleries')
  if (!hints.length) hints.push('open project galleries', 'phone number', 'contact details')

  return {
    text: `I don't have that on this portfolio, but you can ask for: ${hints.join(', ')}. Here are useful starting points:`,
    links: [
      { label: `Phone — ${profile.phone}`, href: telHref },
      { label: 'Email & contact', href: '#contact' },
      { label: 'All projects', href: '#projects' },
      ...galleryLinks().slice(0, 2),
    ],
  }
}

/** Answers from portfolio content only — no external AI API. */
export function answerPortfolioGuide(raw: string, ctx: GuideContext = { history: [] }): GuideReply {
  const q = normalize(raw)
  if (!q) {
    return {
      text: 'Ask about projects, skills, galleries, or how to get in touch. I only use information from this portfolio.',
      links: [{ label: 'Browse projects', href: '#projects' }],
    }
  }

  const contextual = tryContextualAnswer(q, ctx)
  if (contextual) return contextual

  const contactHit = tryContactIntent(q)
  if (contactHit) return contactHit

  const helpHit = tryHelpIntent(q)
  if (helpHit) return helpHit

  if (/^(hi|hello|hey|salam|assalam)\b/.test(q) || includesAny(q, ['good morning', 'good evening'])) {
    return {
      text: `Hello — I'm the portfolio guide for ${profile.name}, ${profile.title} in ${profile.location}. I can point you to projects, screenshot galleries, skills, and contact options.`,
      links: [
        { label: 'About section', href: '#about' },
        { label: 'All projects', href: '#projects' },
      ],
    }
  }

  if (includesAny(q, ['resume', 'cv', 'pdf'])) {
    return {
      text: `You can download ${profile.name}'s resume as a PDF from the portfolio.`,
      links: [
        { label: 'Download resume (PDF)', href: publicAsset(profile.resumeFile) },
        { label: 'Contact', href: '#contact' },
      ],
    }
  }

  if (includesAny(q, ['skill', 'stack', 'technology', 'tech ', 'flutter', 'php', 'react', 'mysql', 'tailwind'])) {
    const skillHit = skills.find(s => q.includes(normalize(s.name.split('/')[0].trim())))
    if (skillHit) {
      return {
        text: `${skillHit.name}: ${skillHit.use}${skillHit.projects.length ? ` Used in: ${skillHit.projects.join(', ')}.` : ''}`,
        links: [{ label: 'Technology section', href: '#skills' }],
      }
    }
    const names = skills.map(s => s.name).join(', ')
    return {
      text: `Core technologies on this site include ${names}. Each skill in the Technology section links to example projects.`,
      links: [{ label: 'Open Technology', href: '#skills' }],
    }
  }

  if (includesAny(q, ['experience', 'job', 'sulanza', 'work history', 'education'])) {
    return {
      text: `${profile.name} documents experience and education on this portfolio (including work at Sulanza Tech). ${profile.soloBuildLine}`,
      links: [{ label: 'Experience & education', href: '#experience' }],
    }
  }

  if (includesAny(q, ['available', 'availability', 'freelance', 'full time', 'full-time', 'remote'])) {
    return {
      text: profile.availability,
      links: [{ label: 'Get in touch', href: '#contact' }],
    }
  }

  if (includesAny(q, ['about', 'who are you', 'who is', 'introduce', 'background'])) {
    return {
      text: `${profile.name} is a ${profile.title} in ${profile.location}. ${profile.soloBuildLine}`,
      links: [
        { label: 'About section', href: '#about' },
        { label: 'Projects', href: '#projects' },
      ],
    }
  }

  if (includesAny(q, ['demo', 'login', 'password', 'admin'])) {
    const flagship = projects.find(p => p.slug === flagshipProjectSlug)
    if (flagship?.demo) {
      return {
        text: `The ${flagship.name} live demo uses the credentials shown on the project card and gallery (for reviewers only). ${flagship.demo.hint ?? ''}`.trim(),
        links: [
          { label: 'Flagship gallery', href: projectGalleryPath(flagship.slug) },
          { label: 'Live demo', href: flagship.live! },
          { label: 'Projects list', href: '#projects' },
        ],
      }
    }
  }

  if (includesAny(q, ['ai', 'artificial', 'assisted'])) {
    const withAi = projects.filter(p => p.features.some(f => /ai/i.test(f)) || /ai/i.test(p.solution))
    const names = withAi.map(p => p.name).join(' and ')
    return {
      text: `AI-related work mentioned on this portfolio includes ${names || 'project features documented in the Projects section'}. Open a gallery for screenshots and case-study notes.`,
      links: galleryLinks(p => withAi.some(x => x.slug === p.slug)),
    }
  }

  const wantsGallery = includesAny(q, [
    'gallery',
    'galleries',
    'screenshot',
    'screenshots',
    'screen shot',
    'picture',
    'pictures',
    'images',
    'show me',
    'see the',
    'open the',
    'visual',
  ]) && !/\b(first|second|third|last|\d)\b/.test(q)

  const project = findProject(raw)

  if (project && wantsGallery) {
    if (!project.images?.length) {
      return {
        text: `${project.name} is listed on the portfolio but has no screenshot gallery yet.`,
        links: [{ label: 'Back to projects', href: '#projects' }],
      }
    }
    return {
      text: `${project.name} has ${project.images.length} screenshots with a case study. I can send you to the gallery now.`,
      links: [
        { label: `Open ${project.name} gallery`, href: projectGalleryPath(project.slug) },
        ...(project.live ? [{ label: 'Live site', href: project.live }] : []),
      ],
    }
  }

  if (project && !wantsGallery) {
    const links: GuideLink[] = [{ label: 'Project on home page', href: '#projects' }]
    if (project.images?.length) {
      links.unshift({ label: `Screenshot gallery (${project.images.length})`, href: projectGalleryPath(project.slug) })
    }
    if (project.live) links.push({ label: 'Live site', href: project.live })
    if (project.repo) links.push({ label: 'Source / releases', href: project.repo })
    return {
      text: projectSummary(project) + ` Scope: ${soloProjectScope}`,
      links,
    }
  }

  if (wantsGallery) {
    if (includesAny(q, ['flutter', 'mobile', 'desktop', 'print', 'scanner'])) {
      const links = galleryLinks(p => p.tags.includes('mobile') || p.tags.includes('desktop'))
      return {
        text: 'Flutter and desktop-style apps on this portfolio include Print Bridge and Scanner Software. Pick a gallery below.',
        links: links.length ? links : galleryLinks(),
      }
    }
    if (includesAny(q, ['web', 'website', 'php'])) {
      const links = galleryLinks(p => p.tags.includes('web'))
      return {
        text: 'Web projects with screenshot galleries are listed below. Each opens the full case study and images.',
        links,
      }
    }
    return {
      text: 'Every project with screenshots has its own gallery page. Choose one to view UI and read the case study.',
      links: galleryLinks(),
    }
  }

  if (includesAny(q, ['flagship', 'best project', 'strongest', 'featured'])) {
    const p = projects.find(x => x.slug === flagshipProjectSlug)!
    return {
      text: `Flagship project: ${projectSummary(p)}`,
      links: [
        { label: 'Open gallery', href: projectGalleryPath(p.slug) },
        { label: 'Projects section', href: '#projects' },
        ...(p.live ? [{ label: 'Live demo', href: p.live }] : []),
      ],
    }
  }

  if (includesAny(q, ['project', 'portfolio', 'built', 'work', 'client', 'app', 'website'])) {
    const lines = projects.map(p => `• ${p.name} (${projectTagLabels[p.tags[0]] ?? p.category})`).join('\n')
    return {
      text: `${profile.name} lists ${projects.length} projects on this site:\n${lines}\nAsk for a gallery by name (e.g. “show accounting screenshots”).`,
      links: [
        { label: 'All projects', href: '#projects' },
        ...galleryLinks().slice(0, 3),
      ],
    }
  }

  if (includesAny(q, ['flutter'])) {
    const flutterProjects = projects.filter(p => p.tech.some(t => /flutter/i.test(t)))
    return {
      text: flutterProjects.map(p => projectSummary(p)).join(' '),
      links: galleryLinks(p => flutterProjects.some(f => f.slug === p.slug)),
    }
  }

  return suggestFromContext(raw, ctx)
}
