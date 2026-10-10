import { useEffect, useState } from 'react'
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  useEffect(() => {
    const q = window.matchMedia('(max-width: 768px)'); const f = () => setM(q.matches)
    q.addEventListener('change', f); return () => q.removeEventListener('change', f)
  }, [])
  return m
}
export function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}
