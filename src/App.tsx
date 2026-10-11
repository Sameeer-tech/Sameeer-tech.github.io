import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile, publicAsset, whatsappHref } from './data/content'
import SiteHeader from './components/SiteHeader'
import { hasWebGL, prefersReducedMotion, useIsMobile } from './hooks'
import ErrorBoundary from './components/ErrorBoundary'
import { About, Approach, Contact, Experience, Footer, Projects, Skills, Testimonial } from './components/Sections'

gsap.registerPlugin(ScrollTrigger)
const Scene = lazy(() => import('./components/Scene')) // three.js loads after first paint

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const mobile = useIsMobile()
  const [gl] = useState(hasWebGL)

  useEffect(() => {
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) })
      if (reduced) tl.set('.loader', { autoAlpha: 0 })
      else tl.from('.loader span', { yPercent: 110, duration: 0.6, ease: 'power3.out', stagger: 0.04 })
        .to('.loader', { autoAlpha: 0, duration: 0.4, delay: 0.3 })
        .from('.hero [data-in]', { y: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.1')
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el =>
          gsap.from(el, { y: 36, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }))
        gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.2, start: 0, end: 'max' } })
      }
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      <div className="loader" aria-hidden="true">
        <p>{[...profile.name.toUpperCase()].map((c, i) => <span key={i}>{c === ' ' ? '\u00a0' : c}</span>)}</p>
      </div>
      <div className="progress" ref={bar} aria-hidden="true" />
      <a className="skip" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">
        <section className="hero" id="top">
          {gl && (
            <div className="scene" aria-hidden="true">
              <ErrorBoundary><Suspense fallback={null}>{loaded || prefersReducedMotion() ? <Scene mobile={mobile} /> : null}</Suspense></ErrorBoundary>
            </div>
          )}
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="mono" data-in>{profile.location}</p>
              <h1 data-in>{profile.name}<span>{profile.title}</span></h1>
              <p className="lead" data-in>I build web applications, software systems, mobile apps and business tools: the kind that run a shop floor, not just a demo.</p>
              <p className="mono hero-avail" data-in>{profile.availability}</p>
              <p className="cta-row" data-in>
                <a className="cta" href="#projects">View Projects</a>
                <a className="cta ghost" href="#contact">Let's Work Together</a>
                <a className="cta ghost" href={whatsappHref(profile.whatsapp)} target="_blank" rel="noreferrer">WhatsApp</a>
              </p>
            </div>
            <figure className="hero-photo" data-in>
              <img
                src={publicAsset(profile.photo)}
                alt={`Portrait of ${profile.name}, ${profile.title}`}
                width={280}
                height={280}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          </div>
        </section>
        <About /><Skills /><Projects /><Approach /><Testimonial /><Experience /><Contact />
      </main>
      <Footer />
    </div>
  )
}
