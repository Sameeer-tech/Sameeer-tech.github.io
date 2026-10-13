import { useState } from 'react'
import {
  aboutAreas,
  education,
  experience,
  flagshipProjectSlug,
  principles,
  profile,
  projectGalleryPath,
  projects,
  publicAsset,
  soloProjectScope,
  skills,
  testimonial,
  whatsappHref,
  type Project,
  type Skill,
} from '../data/content'
import { ProjectDemoAccess } from './ProjectDemoAccess'

const Head = ({ n, id, title }: { n: string; id: string; title: string }) => (
  <header className="head" data-reveal><span className="idx">{n}</span><h2 id={id}>{title}</h2></header>
)

export const About = () => (
  <section id="about" aria-labelledby="h-about" className="sec">
    <Head n="01" id="h-about" title="About" />
    <div className="two about-grid">
      <div className="about-intro" data-reveal>
        <figure className="about-photo">
          <img src={publicAsset(profile.photo)} alt="" width={160} height={160} loading="lazy" decoding="async" />
        </figure>
        <div className="about-copy">
          <p className="lead">
            I'm Sameer, a software developer in {profile.location}. I build web applications, mobile and desktop apps, and the back-end systems behind them, mostly for real businesses with real workflows.
          </p>
          <p className="mono build-note">{profile.soloBuildLine}</p>
        </div>
      </div>
      <ul className="tags" data-reveal>{aboutAreas.map(a => <li key={a}>{a}</li>)}</ul>
    </div>
  </section>
)

export function Skills() {
  const [active, setActive] = useState<Skill>(() => skills.find(s => s.name.startsWith('Flutter')) ?? skills[0])
  return (
    <section id="skills" aria-labelledby="h-skills" className="sec">
      <Head n="02" id="h-skills" title="Technology" />
      <div className="skills" data-reveal>
        <ul className="skill-list">
          {skills.map(s => (
            <li key={s.name}>
              <button className={s === active ? 'on' : ''} onMouseEnter={() => setActive(s)} onFocus={() => setActive(s)} onClick={() => setActive(s)}>{s.name}</button>
            </li>
          ))}
        </ul>
        <div className="skill-detail" aria-live="polite">
          <h3>{active.name}</h3>
          <p>{active.use}</p>
          {active.projects.length > 0 && <p className="mono">Used in: {active.projects.join(', ')}</p>}
        </div>
      </div>
    </section>
  )
}

function ProjectCase({ p, index, flagship }: { p: Project; index: number; flagship?: boolean }) {
  return (
    <article className={`case${flagship ? ' case-flagship' : ''}`} data-reveal>
      <div className="case-top">
        <span className="mono">
          {flagship ? 'Flagship' : String(index + 1).padStart(2, '0')} / {p.category}
        </span>
        <h3>{p.name}</h3>
      </div>
      <dl>
        <div><dt>Scope</dt><dd>{soloProjectScope}</dd></div>
        <div><dt>Problem</dt><dd>{p.problem}</dd></div>
        <div><dt>Solution</dt><dd>{p.solution}</dd></div>
        <div><dt>Outcomes</dt><dd><ul className="outcomes">{p.outcomes.map(o => <li key={o}>{o}</li>)}</ul></dd></div>
        <div><dt>Key functionality</dt><dd>{p.features.join(' · ')}</dd></div>
        <div><dt>Technologies</dt><dd className="mono">{p.tech.join(' · ')}</dd></div>
        {p.demo && (
          <div className="demo-access-cell">
            <dt>Demo access</dt>
            <dd><ProjectDemoAccess demo={p.demo} /></dd>
          </div>
        )}
      </dl>
      {(p.live || p.repo || p.images?.length) && (
        <p className="links">
          {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live site</a>}
          {p.repo && <a href={p.repo} target="_blank" rel="noreferrer">Source</a>}
          {p.images?.length ? <a href={projectGalleryPath(p.slug)}>Screenshots ({p.images.length})</a> : null}
        </p>
      )}
    </article>
  )
}

export const Projects = () => {
  const ordered = [...projects].sort((a, b) => {
    if (a.slug === flagshipProjectSlug) return -1
    if (b.slug === flagshipProjectSlug) return 1
    return 0
  })
  let n = 0
  return (
    <section id="projects" aria-labelledby="h-projects" className="sec">
      <Head n="03" id="h-projects" title="Projects" />
      {ordered.map(p => {
        const flagship = p.slug === flagshipProjectSlug
        const index = flagship ? -1 : n++
        return <ProjectCase key={p.slug} p={p} index={index} flagship={flagship} />
      })}
    </section>
  )
}

export const Testimonial = () => {
  if (!testimonial.quote.trim()) return null
  return (
    <section id="endorsement" aria-labelledby="h-endorsement" className="sec testimonial-sec">
      <Head n="—" id="h-endorsement" title="Kind words" />
      <blockquote className="testimonial" data-reveal>
        <p>&ldquo;{testimonial.quote}&rdquo;</p>
        <footer>
          <strong>{testimonial.author}</strong>
          <span className="mono">{testimonial.role}</span>
        </footer>
      </blockquote>
    </section>
  )
}

export const Approach = () => (
  <section id="approach" aria-labelledby="h-approach" className="sec">
    <Head n="04" id="h-approach" title="Build. Understand. Improve." />
    <div className="grid4">{principles.map(([t, d]) => <div key={t} data-reveal><h3>{t}</h3><p>{d}</p></div>)}</div>
  </section>
)

export const Experience = () => (
  <section id="experience" aria-labelledby="h-exp" className="sec">
    <Head n="05" id="h-exp" title="Experience & Education" />
    <div className="two">
      <div data-reveal>
        {experience.map(e => (
          <div key={`${e.org}-${e.period}`} className="row exp-row">
            <h3>{e.org}</h3>
            {e.role && <p className="exp-role">{e.role}</p>}
            {e.period && <p className="mono">{e.period}</p>}
            {e.details.length > 0 && (
              <ul className="exp-details">
                {e.details.map(d => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div data-reveal>
        {education.map(e => <div key={e.school} className="row"><h3>{e.school}</h3>{(e.program || e.period) && <p className="mono">{[e.program, e.period].filter(Boolean).join(' · ')}</p>}</div>)}
      </div>
    </div>
  </section>
)

export const Contact = () => (
  <section id="contact" aria-labelledby="h-contact" className="sec contact">
    <Head n="06" id="h-contact" title="Let's work together" />
    <p className="lead" data-reveal>Have a project, a system to extend or a bug nobody can find? Send a message.</p>
    <p className="cta-row" data-reveal>
      <a className="cta" href={publicAsset(profile.resumeFile)} download target="_blank" rel="noreferrer">Download resume (PDF)</a>
    </p>
    <a className="cta big" data-reveal href={`mailto:${profile.email}`}>{profile.email}</a>
    <p className="links" data-reveal>
      <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
      <a href={whatsappHref(profile.whatsapp)} target="_blank" rel="noreferrer">WhatsApp</a>
      <a href={profile.linkedin}>LinkedIn</a>
      {profile.github ? <a href={profile.github}>GitHub</a> : null}
    </p>
  </section>
)

export const Footer = () => (
  <footer className="foot"><div><strong>{profile.name}</strong><span>{profile.title}</span></div>
    <div className="links">
      <a href={profile.linkedin}>LinkedIn</a>
      {profile.github ? <a href={profile.github}>GitHub</a> : null}
    </div>
    <small>© {new Date().getFullYear()} {profile.name}</small></footer>
)
