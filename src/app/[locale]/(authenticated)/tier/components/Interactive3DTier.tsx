'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierInfo, tierStyles } from '@/app/api/tiers/tiers'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import { cn } from '@/app/api/utils/utils'
import type { ThreeElements } from '@react-three/fiber'

interface Interactive3DTierProps {
  tier: ProfileTier
  className?: string
}

function TierBadge3D({ tier }: { tier: ProfileTier }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const style = tierStyles[tier]
  const info = tierInfo[tier]

  // Load the texture for the badge
  const texture = useTexture(
    tier === ProfileTier.FREE
      ? 'https://ipfs.io/ipfs/bafkreieeswhm4qgx2x3i7hw2jbmnrt7zkgogdk676kk25tkbr5wisyv5za'
      : tier === ProfileTier.PRO
        ? 'https://ipfs.io/ipfs/QmQnkRY6b2ckAbYQtn7btBWw3p2LcL2tZReFxViJ3aayk3'
        : tier === ProfileTier.GROUP
          ? 'https://ipfs.io/ipfs/QmRNqHVG9VHBafsd9ypQt82rZwVMd14Qt2DWXiK5dptJRs'
          : 'https://ipfs.io/ipfs/QmXYZ...' // OG badge
  )

  // Animate the badge
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 0.1]} />
      <meshStandardMaterial
        map={texture}
        emissive={new THREE.Color(style.color)}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function ParticleField({ tier }: { tier: ProfileTier }) {
  const particlesRef = useRef<THREE.Points>(null)
  const style = tierStyles[tier]

  // Create particles
  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x += 0.001
    }
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return (
    <points ref={particlesRef}>
      <primitive object={geometry} />
      <pointsMaterial size={0.02} color={style.color} transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function Scene({ tier }: { tier: ProfileTier }) {
  const style = tierStyles[tier]

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={2} color={style.color} />
      <ParticleField tier={tier} />
      <TierBadge3D tier={tier} />
    </>
  )
}

export function Interactive3DTier({ tier, className }: Interactive3DTierProps) {
  const [mounted, setMounted] = useState(false)
  const info = tierInfo[tier]
  const style = tierStyles[tier]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative w-full aspect-square max-w-md mx-auto', className)}
    >
      <Suspense
        fallback={
          <div
            className={cn(
              'w-full h-full rounded-lg flex items-center justify-center',
              style.bgColor,
              style.borderColor,
              'border-2'
            )}
          >
            <style.icon className={cn('w-8 h-8 animate-pulse', style.color)} />
          </div>
        }
      >
        <Canvas>
          <Scene tier={tier} />
        </Canvas>
      </Suspense>
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center'>
        <h3 className={cn('text-lg font-bold', style.color)}>{info.title}</h3>
        <p className='text-sm text-github-fg-muted'>{info.description}</p>
      </div>
    </motion.div>
  )
}
