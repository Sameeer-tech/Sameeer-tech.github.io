import { useEffect, useState } from 'react'
import { nav, profile } from '../data/content'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setOpen(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <header className={`bar${open ? ' bar-open' : ''}`}>
      <a href="#top" className="brand" aria-label={`${profile.name} — home`}>
        <span className="brand-full">{profile.name}</span>
        <span className="brand-short" aria-hidden="true">
          Sameer Basit
        </span>
      </a>
      <button
        type="button"
        className="bar-toggle"
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen(v => !v)}
      >
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="site-nav" className="bar-nav" aria-label="Primary">
        <ul>
          {nav.map(n => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
