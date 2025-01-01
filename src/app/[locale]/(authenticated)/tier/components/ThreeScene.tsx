'use client'

import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, extend, type ThreeElements } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierInfo, tierStyles } from '@/app/api/tiers/tiers'

// Extend Three.js elements
extend({
  Mesh: THREE.Mesh,
  BoxGeometry: THREE.BoxGeometry,
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  Points: THREE.Points,
  PointsMaterial: THREE.PointsMaterial,
  AmbientLight: THREE.AmbientLight,
  PointLight: THREE.PointLight,
  SpotLight: THREE.SpotLight,
})

// Declare JSX types for Three.js elements
declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: ThreeElements['mesh']
    boxGeometry: ThreeElements['boxGeometry']
    meshStandardMaterial: ThreeElements['meshStandardMaterial']
    points: ThreeElements['points']
    pointsMaterial: ThreeElements['pointsMaterial']
    primitive: ThreeElements['primitive']
    ambientLight: ThreeElements['ambientLight']
    pointLight: ThreeElements['pointLight']
    spotLight: ThreeElements['spotLight']
  }
}

// Helper function to convert Tailwind color class to hex color
const getColorFromStyle = (colorClass: keyof typeof colorMap) => {
  // Default colors for each tier
  const colorMap = {
    'text-github-fg-default': '#c9d1d9',
    'text-github-accent-fg': '#58a6ff',
    'text-github-success-fg': '#3fb950',
    'text-github-done-fg': '#a371f7',
  } as const
  return colorMap[colorClass] || '#c9d1d9'
}

// Memoize texture URLs
const getTextureUrl = (tier: ProfileTier) => {
  switch (tier) {
    case ProfileTier.FREE:
      return 'https://ipfs.io/ipfs/bafkreieeswhm4qgx2x3i7hw2jbmnrt7zkgogdk676kk25tkbr5wisyv5za'
    case ProfileTier.PRO:
      return 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
    case ProfileTier.GROUP:
    case ProfileTier.OG:
      return 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'
    default:
      return 'https://ipfs.io/ipfs/bafkreieeswhm4qgx2x3i7hw2jbmnrt7zkgogdk676kk25tkbr5wisyv5za'
  }
}

function TierBadge3D({ tier }: { tier: ProfileTier }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const style = tierStyles[tier]

  // Memoize geometry and material properties
  const geometry = useMemo(() => new THREE.BoxGeometry(2, 2, 0.15), [])
  const textureUrl = useMemo(() => getTextureUrl(tier), [tier])
  const emissiveColor = useMemo(
    () => new THREE.Color(getColorFromStyle(style.color as keyof typeof colorMap)),
    [style.color]
  )

  // Load the texture for the badge
  const texture = useTexture(textureUrl)

  // Animate the badge with improved motion
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.y += 0.003
      // More natural floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      // Subtle tilt
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
  })

  return (
    <mesh
      ref={meshRef}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
      rotation={[0.1, 0, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial
        map={texture}
        emissive={emissiveColor}
        emissiveIntensity={0.7}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

function ParticleField({ tier }: { tier: ProfileTier }) {
  const particlesRef = useRef<THREE.Points>(null)
  const style = tierStyles[tier]

  // Memoize particle geometry and material properties
  const { geometry, positions } = useMemo(() => {
    const particleCount = 500 // Reduced for better performance
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return { geometry, positions }
  }, [])

  const particleColor = useMemo(
    () => getColorFromStyle(style.color as keyof typeof colorMap),
    [style.color]
  )

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x += 0.001
    }
  })

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial size={0.02} color={particleColor} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function Scene({ tier }: { tier: ProfileTier }) {
  const style = tierStyles[tier]
  const spotlightColor = useMemo(
    () => getColorFromStyle(style.color as keyof typeof colorMap),
    [style.color]
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        enableDamping
        dampingFactor={0.05}
      />
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2.5}
        color={spotlightColor}
        castShadow
      />
      <ParticleField tier={tier} />
      <TierBadge3D tier={tier} />
    </>
  )
}

export default function ThreeScene({ tier }: { tier: ProfileTier }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
      <Scene tier={tier} />
    </Canvas>
  )
}
