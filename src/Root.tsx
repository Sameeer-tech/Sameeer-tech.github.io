import { useEffect, useState } from 'react'
import App from './App'
import ProjectGalleryPage from './components/ProjectGalleryPage'
import { parseProjectGallerySlug } from './data/content'

export default function Root() {
  const [gallerySlug, setGallerySlug] = useState(() => parseProjectGallerySlug(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setGallerySlug(parseProjectGallerySlug(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (gallerySlug) return <ProjectGalleryPage slug={gallerySlug} />
  return <App />
}
