import { useCallback, useEffect, useState } from 'react'
import { getProjectBySlug, profile, publicAsset, type Project } from '../data/content'
import { ProjectDemoAccess } from './ProjectDemoAccess'

type Props = { slug: string }

const DEFAULT_TITLE = 'Sameer Abdul Basit — Full-Stack Developer, Karachi, Pakistan'

const SHOT_LABELS: Record<string, string> = {
  home: 'Homepage',
  home1: 'Homepage highlight',
  products: 'Product catalog',
  pricehub: 'Price hub',
  pricehub1: 'Price hub detail',
  aboutus: 'About us',
  aboutus1: 'About us detail',
  contactus: 'Contact',
  authorization: 'Official authorisation',
  authorization1: 'Dealer certificates',
  footer: 'Footer & contact',
  'shahco-01': 'Manage devices',
  'shahco-02': 'Add printer',
  'shahco-03': 'Connection flow',
  'shahco-04': 'Printer setup',
  'shahco-05': 'Print workflow',
  'shahco-06': 'App interface',
  chartofaccounts: 'Chart of accounts',
  transactions: 'Transactions',
  manual: 'Manual entry',
  bulkentry: 'Bulk entry',
  csvfilesimport: 'CSV import',
  reports: 'Reports',
  usermanagement: 'User management',
  'aiassisted-accounting': 'AI-assisted accounting',
}

function shotLabel(path: string, index: number) {
  const base = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
  if (SHOT_LABELS[base]) return SHOT_LABELS[base]
  if (SHOT_LABELS[base.toLowerCase()]) return SHOT_LABELS[base.toLowerCase()]
  const words = base.replace(/[-_]+/g, ' ').replace(/\d+/g, ' ').trim()
  if (words) return words.replace(/\b\w/g, c => c.toUpperCase())
  return `Screen ${index + 1}`
}

function GalleryLightbox({
  project,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  project: Project
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const images = project.images!
  const src = images[index]
  const label = shotLabel(src, index)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onNext, onPrev])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${project.name} — ${label}`}>
      <button type="button" className="lightbox-backdrop" onClick={onClose} aria-label="Close preview" />
      <div className="lightbox-panel">
        <header className="lightbox-bar">
          <p className="mono">{label}</p>
          <span className="mono lightbox-count">
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
            Close
          </button>
        </header>
        <figure className="lightbox-figure">
          <img src={publicAsset(src)} alt={`${project.name} — ${label}`} />
        </figure>
        <div className="lightbox-nav">
          <button type="button" className="cta ghost" onClick={onPrev} disabled={index === 0}>
            Previous
          </button>
          <button type="button" className="cta ghost" onClick={onNext} disabled={index === images.length - 1}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProjectGalleryPage({ slug }: Props) {
  const project = getProjectBySlug(slug)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (project?.name) document.title = `${project.name} — Project gallery · ${profile.name}`
    else document.title = DEFAULT_TITLE
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [project?.name])

  const openAt = useCallback((i: number) => setLightbox(i), [])
  const close = useCallback(() => setLightbox(null), [])

  if (!project?.images?.length) {
    return (
      <div className="gallery-page">
        <header className="gallery-top">
          <a className="brand" href="#top" aria-label={`${profile.name} — home`}>
            {profile.name}
          </a>
          <a className="gallery-back" href="#projects">
            ← Projects
          </a>
        </header>
        <main className="gallery-main sec">
          <h1 className="gallery-title">Project not found</h1>
          <p className="lead">This gallery does not exist or has no screenshots yet.</p>
          <p className="cta-row">
            <a className="cta" href="#projects">
              Back to portfolio
            </a>
          </p>
        </main>
      </div>
    )
  }

  const images = project.images
  const isMobileShots = slug === 'shahco-print-bridge'

  return (
    <div className="gallery-page">
      <div className="progress gallery-progress" aria-hidden="true" style={{ transform: 'scaleX(1)' }} />
      <header className="gallery-top">
        <a className="brand" href="#top" aria-label={`${profile.name} — home`}>
          {profile.name}
        </a>
        <p className="gallery-top-title">{project.name}</p>
        <a className="gallery-back" href="#projects">
          ← Projects
        </a>
      </header>

      <main className="gallery-main">
        <section className="gallery-hero sec">
          <div className="gallery-hero-copy">
            <header className="head gallery-head-row">
              <span className="idx">Gallery</span>
              <h1 className="gallery-title">{project.name}</h1>
            </header>
            <p className="mono gallery-cat">{project.category}</p>
            <p className="lead">{project.solution}</p>
            <ul className="gallery-tech" aria-label="Technologies">
              {project.tech.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="cta-row gallery-cta-row">
              <a className="cta ghost" href="#projects">
                Back to projects
              </a>
              {project.live && (
                <a className="cta" href={project.live} target="_blank" rel="noreferrer">
                  Visit live site
                </a>
              )}
              {project.repo && (
                <a className="cta ghost" href={project.repo} target="_blank" rel="noreferrer">
                  View source
                </a>
              )}
            </p>
          </div>
          <aside className="gallery-meta" aria-label="Project summary">
            <p className="mono">Screenshots</p>
            <p className="gallery-stat">{images.length}</p>
            {project.demo && <ProjectDemoAccess demo={project.demo} />}
            <p className="mono gallery-meta-note">Click any image to open a full preview. Use arrow keys inside the viewer.</p>
          </aside>
        </section>

        <section className="gallery-shots sec" aria-labelledby="gallery-shots-heading">
          <h2 id="gallery-shots-heading" className="visually-hidden">
            {project.name} screenshots
          </h2>
          <div className={`gallery-grid${isMobileShots ? ' gallery-grid--mobile' : ''}`}>
            {images.map((src, j) => {
              const label = shotLabel(src, j)
              return (
                <article className="gallery-card" key={src}>
                  <button type="button" className="gallery-shot" onClick={() => openAt(j)} aria-label={`Open ${label}`}>
                    <img src={publicAsset(src)} alt={`${project.name} — ${label}`} loading={j < 4 ? 'eager' : 'lazy'} decoding="async" />
                    <span className="gallery-shot-hover mono">View full size</span>
                  </button>
                  <figcaption className="gallery-cap">
                    <span className="mono gallery-cap-idx">{String(j + 1).padStart(2, '0')}</span>
                    <span>{label}</span>
                  </figcaption>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="foot gallery-foot">
        <div>
          <strong>{profile.name}</strong>
          <span>{profile.title}</span>
        </div>
        <a className="mono" href="#contact">
          Contact
        </a>
      </footer>

      {lightbox !== null && (
        <GalleryLightbox
          project={project}
          index={lightbox}
          onClose={close}
          onPrev={() => setLightbox(i => (i === null ? null : Math.max(0, i - 1)))}
          onNext={() => setLightbox(i => (i === null ? null : Math.min(images.length - 1, i + 1)))}
        />
      )}
    </div>
  )
}
