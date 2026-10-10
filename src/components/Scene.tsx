import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { prefersReducedMotion } from '../hooks'

// A sparse graph of connected nodes: systems, services, data. Reacts to cursor and scroll.
function Network({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null)
  const { points, links } = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 1.3, t = Math.random() * Math.PI * 2, u = Math.acos(2 * Math.random() - 1)
      p.set([r * Math.sin(u) * Math.cos(t), r * Math.sin(u) * Math.sin(t), r * Math.cos(u)], i * 3)
    }
    const l: number[] = []
    for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
      const d = Math.hypot(p[i*3]-p[j*3], p[i*3+1]-p[j*3+1], p[i*3+2]-p[j*3+2])
      if (d < 1.7) l.push(p[i*3], p[i*3+1], p[i*3+2], p[j*3], p[j*3+1], p[j*3+2])
    }
    return { points: p, links: new Float32Array(l) }
  }, [count])

  useFrame(({ pointer }, dt) => {
    const g = group.current; if (!g) return
    const scroll = Math.min(window.scrollY / window.innerHeight, 3)
    g.rotation.y += dt * 0.06
    g.rotation.x += (pointer.y * 0.25 + scroll * 0.3 - g.rotation.x) * 0.04
    g.position.x += (pointer.x * 0.2 - g.position.x) * 0.04
    g.position.y += (scroll * 0.6 - g.position.y) * 0.05
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry>
        <pointsMaterial color="#e8b04a" size={0.05} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[links, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#8a93a3" transparent opacity={0.22} />
      </lineSegments>
    </group>
  )
}

export default function Scene({ mobile }: { mobile: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={mobile ? 1 : [1, 1.5]}
      gl={{ antialias: !mobile, powerPreference: 'low-power' }}
      frameloop={prefersReducedMotion() ? 'demand' : 'always'}
    >
      <Network count={mobile ? 40 : 90} />
    </Canvas>
  )
}
