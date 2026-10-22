import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Network() {
  const group = useRef<THREE.Group>(null!)
  const { pts, lines } = useMemo(() => {
    const n = 160
    const p: number[] = []
    const v: THREE.Vector3[] = []
    for (let k = 0; k < n; k++) {
      const phi = Math.acos(1 - (2 * (k + 0.5)) / n)
      const th = Math.PI * (1 + Math.sqrt(5)) * k
      const r = 3.2 + (Math.sin(k * 12.9898) * 0.5)
      const x = r * Math.cos(th) * Math.sin(phi), y = r * Math.sin(th) * Math.sin(phi), z = r * Math.cos(phi)
      v.push(new THREE.Vector3(x, y, z)); p.push(x, y, z)
    }
    const l: number[] = []
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (v[a].distanceTo(v[b]) < 1.25) l.push(v[a].x, v[a].y, v[a].z, v[b].x, v[b].y, v[b].z)
    return { pts: new Float32Array(p), lines: new Float32Array(l) }
  }, [])
  useFrame((_, dt) => { group.current.rotation.y += dt * 0.12; group.current.rotation.x += dt * 0.03 })
  return (
    <group ref={group}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry>
        <pointsMaterial size={0.09} color="#6ea0ff" sizeAttenuation transparent opacity={0.95} />
      </points>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[lines, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.28} />
      </lineSegments>
    </group>
  )
}

export function Hero3D({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 11], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Network />
      </Canvas>
    </div>
  )
}
