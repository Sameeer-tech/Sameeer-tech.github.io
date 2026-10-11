// All site content lives here.
export const profile = {
  name: 'Sameer Abdul Basit',
  title: 'Full-Stack Developer',
  location: 'Karachi, Pakistan',
  photo: 'profile-pic.jpeg',
  email: 'sameerabdulbasit2006@gmail.com',
  phone: '+923122287470',
  linkedin: 'https://www.linkedin.com/in/sameer-abdul-basit',
  github: 'https://github.com/Sameeer-tech',
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'approach', label: 'Approach' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const aboutAreas = ['Web development', 'Mobile applications', 'Desktop software', 'SaaS and POS systems', 'Database-driven applications', 'APIs, deployment and debugging', 'Client projects']

export interface Skill { name: string; use: string; projects: string[] }
export const skills: Skill[] = [
  { name: 'HTML5 / CSS', use: 'Semantic, responsive interfaces.', projects: ['New Electro Palace', 'Sulanza Tech Website'] },
  { name: 'JavaScript', use: 'Interactive frontends and tooling.', projects: ['New Electro Palace', 'Sulanza Tech Website'] },
  { name: 'TypeScript', use: 'Typed React code bases.', projects: ['Accounting Software', 'Sulanza Tech Website'] },
  { name: 'React', use: 'Component-based web interfaces.', projects: ['Accounting Software', 'Sulanza Tech Website'] },
  { name: 'Node.js', use: 'APIs and build tooling.', projects: ['POS SaaS Application', 'Accounting Software'] },
  { name: 'PHP', use: 'Server-side web applications.', projects: ['New Electro Palace'] },
  { name: 'Flutter', use: 'Cross-platform mobile and desktop apps.', projects: ['Shah&Co Print Bridge', 'Shah&Co Scanner Software', 'POS SaaS Application'] },
  { name: 'MySQL', use: 'Relational, database-driven systems.', projects: ['POS SaaS Application', 'Accounting Software'] },
  { name: 'MongoDB', use: 'Document storage.', projects: [] },
  { name: 'REST APIs', use: 'Connecting clients to back ends.', projects: ['POS SaaS Application', 'Accounting Software'] },
  { name: 'Three.js', use: 'Interactive 3D on the web.', projects: ['This portfolio'] },
  { name: 'GSAP', use: 'Scroll and interface motion.', projects: ['This portfolio'] },
  { name: 'Git / GitHub', use: 'Version control and deployment.', projects: ['This portfolio'] },
]

export interface Project {
  slug: string
  name: string; category: string; problem: string; solution: string
  tech: string[]; features: string[]; images?: string[]; live?: string; repo?: string
  demo?: { user: string; password: string; hint?: string }
}

export function publicAsset(path: string) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${import.meta.env.BASE_URL}${clean}`
}

export function projectGalleryPath(slug: string) {
  return `#/projects/${slug}`
}

export function parseProjectGallerySlug(hash: string) {
  const m = hash.match(/^#\/projects\/([^/?#]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

export function getProjectBySlug(slug: string) {
  return projects.find(p => p.slug === slug)
}
// problem/solution are drafted from the brief; review and refine them.
export const projects: Project[] = [
  {
    slug: 'new-electro-palace',
    name: 'New Electro Palace', category: 'E-commerce website',
    problem: 'An electronics and home-appliance business needed an online catalog it could manage itself.',
    solution: 'A responsive storefront with a product catalog, search-friendly pages and product management.',
    tech: ['HTML5', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    features: ['Product catalog', 'Responsive frontend', 'SEO', 'Product management', 'Business-focused UX'],
    live: 'https://newelectropalace.pk/',
    images: [
      'new-electro-palace/home.png',
      'new-electro-palace/home1.png',
      'new-electro-palace/products.png',
      'new-electro-palace/pricehub.png',
      'new-electro-palace/pricehub1.png',
      'new-electro-palace/aboutus.png',
      'new-electro-palace/aboutus1.png',
      'new-electro-palace/Contactus.png',
      'new-electro-palace/authorization.png',
      'new-electro-palace/authorization1.png',
      'new-electro-palace/footer.png',
    ],
  },
  {
    slug: 'shahco-print-bridge',
    name: 'Shah&Co Print Bridge', category: 'Mobile / desktop software',
    problem: 'Business printing workflows needed to work reliably from mobile and desktop devices.',
    solution: 'A Flutter application that connects to printing devices for everyday business tasks.',
    tech: ['Flutter'],
    features: ['Printing workflows', 'Barcode and receipt functionality', 'Device interaction'],
    images: [
      'shahco-printing-app/shahco-01.jpeg',
      'shahco-printing-app/shahco-02.jpeg',
      'shahco-printing-app/shahco-03.jpeg',
      'shahco-printing-app/shahco-04.jpeg',
      'shahco-printing-app/shahco-05.jpeg',
      'shahco-printing-app/shahco-06.jpeg',
    ],
    repo: 'https://github.com/Sameeer-tech/Shah-Co-Print-Bridge-Releases',
  },
  {
    slug: 'shahco-scanner-software',
    name: 'Shah&Co Scanner Software', category: 'Desktop software',
    problem: 'Retail and billing teams needed fast barcode scanning, billing history and price-range control on desktop.',
    solution: 'A desktop application for scanning, bulk billing, customer blacklisting and searchable billing history.',
    tech: ['Flutter', 'Dart'],
    features: ['Barcode scanning', 'Bulk billing', 'Price ranges', 'Billing history', 'Customer blacklisting'],
    repo: 'https://github.com/Sameeer-tech/billscanningapp',
    images: [
      'shahco-scanner-software/scanner.png',
      'shahco-scanner-software/bulk-billing.png',
      'shahco-scanner-software/ranges.png',
      'shahco-scanner-software/history.png',
      'shahco-scanner-software/blacklisting.png',
    ],
  },
  {
    slug: 'sulanza-website',
    name: 'Sulanza Tech Website', category: 'Marketing website',
    problem: 'Sulanza needed a modern company site to present services, portfolio work and enterprise offerings.',
    solution: 'A responsive marketing website with service pages, portfolio showcase, AI features and contact flows.',
    tech: ['HTML5', 'CSS', 'JavaScript', 'React', 'TypeScript'],
    features: ['Service pages', 'Portfolio showcase', 'Enterprise solutions', 'AI feature highlights', 'Contact & about'],
    live: 'https://sulanza.com/',
    images: [
      'sulanza-web/home.png',
      'sulanza-web/home1.png',
      'sulanza-web/services.png',
      'sulanza-web/enterprise-solution.png',
      'sulanza-web/portfolio.png',
      'sulanza-web/portfolio1.png',
      'sulanza-web/persnol-ai-type-feature.png',
      'sulanza-web/aboutus.png',
      'sulanza-web/contactus.png',
    ],
  },
  {
    slug: 'accounting-software',
    name: 'Accounting Software', category: 'SaaS / business software',
    problem: 'Teams needed a clear way to record transactions, manage accounts and pull reports without spreadsheet chaos.',
    solution: 'A web-based accounting system with chart of accounts, bulk and manual entry, CSV import, reporting and role-based user management.',
    tech: ['React', 'TypeScript', 'Node.js', 'MySQL', 'REST APIs'],
    features: ['Chart of accounts', 'Transactions & bulk entry', 'CSV import', 'Financial reports', 'User management', 'AI-assisted workflows'],
    live: 'https://accounting-software.gt.tc/',
    demo: { user: 'admin', password: 'admin123', hint: 'Sign in on the live site to explore accounts, transactions and reports.' },
    images: [
      'accounting-software/home.png',
      'accounting-software/chartofaccounts.png',
      'accounting-software/transactions.png',
      'accounting-software/manual.png',
      'accounting-software/bulkentry.png',
      'accounting-software/csvfilesimport.png',
      'accounting-software/reports.png',
      'accounting-software/usermanagement.png',
      'accounting-software/Aiassisted-accounting.png',
    ],
  },
  {
    slug: 'pos-saas',
    name: 'POS SaaS Application', category: 'SaaS / business software',
    problem: 'Shops need point-of-sale tooling that works across phones and PCs.',
    solution: 'A database-driven POS system covering daily business operations on multiple devices.',
    tech: ['Flutter', 'Node.js', 'MySQL', 'REST APIs'],
    features: ['Multi-device experience', 'Database-driven workflows', 'Operational UI'],
  },
]

export const principles = [
  ['Understand first', 'Read and map an existing system before changing it. Preserve the workflows people already rely on.'],
  ['Debug systematically', 'Reproduce, isolate, fix, verify. No guessing in production code.'],
  ['Build practical software', 'Features should solve an operational problem for the people using them.'],
  ['Ship reliably', 'Performance, clean structure and repeatable deployment are part of the work.'],
]

export const experience = [
  {
    org: 'Sulanza Tech',
    role: 'Full-Stack Developer',
    period: 'Jan 2026 – Jun 2026 · Karachi, Pakistan',
    details: [
      'Shipped client-facing web and business software (e-commerce, accounting, POS-style systems).',
      'Built cross-platform Flutter apps for operational workflows such as printing and device integration.',
      'Worked with PHP, JavaScript, Node.js, MySQL, and REST APIs on production-oriented features.',
    ],
  },
]

export const education = [
  {
    school: 'National Inter College',
    program: 'Intermediate in Commerce (I.Com)',
    period: '2025 – Present · Karachi',
  },
  {
    school: 'Aptech Pakistan',
    program: 'ACCP — Web / Multimedia Management & Webmaster',
    period: '2024 – Present · Karachi',
  },
]
