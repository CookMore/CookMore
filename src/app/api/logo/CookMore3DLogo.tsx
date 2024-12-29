'use client'

import { useRef, useEffect, useState } from 'react'
import { ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'
import { tierStyles } from '@/app/api/tiers/tiers'
import { cn } from '@/app/api/utils/utils'

interface CookMore3DLogoProps {
  tier: ProfileTier
  className?: string
}

export function CookMore3DLogo({ tier, className }: CookMore3DLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rotation = 0
    let animationFrame: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      color: string
    }> = []

    const createParticles = () => {
      const particleCount = 50
      particles = []
      const color = tierStyles[tier].color
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          alpha: Math.random(),
          color,
        })
      }
    }

    const updateParticles = () => {
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha = Math.max(0, p.alpha - 0.01)

        if (p.alpha <= 0) {
          p.x = canvas.width / 2
          p.y = canvas.height / 2
          p.alpha = 1
        }
      })
    }

    const drawParticles = () => {
      particles.forEach((p) => {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const draw = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      if (isHovered) {
        updateParticles()
        drawParticles()
      }

      ctx.save()
      const centerX = canvas.width / (2 * window.devicePixelRatio)
      const centerY = canvas.height / (2 * window.devicePixelRatio)
      ctx.translate(centerX, centerY)

      // Mouse interaction
      if (isHovered) {
        const dx = mousePos.current.x - centerX
        const dy = mousePos.current.y - centerY
        const angle = Math.atan2(dy, dx) * 0.1
        ctx.rotate(angle)
      }

      const yOffset = Math.sin(Date.now() * 0.001) * (isHovered ? 15 : 10)
      ctx.translate(0, yOffset)
      ctx.rotate(rotation)

      // Text shadow/glow effect
      const glowSize = isHovered ? 30 : 20
      const glowSteps = 3
      for (let i = 0; i < glowSteps; i++) {
        ctx.shadowColor = tierStyles[tier].color
        ctx.shadowBlur = glowSize - (i * glowSize) / glowSteps
        ctx.fillStyle = tierStyles[tier].color
        ctx.font = `bold ${isHovered ? 36 : 32}px Inter`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('CookMore', 0, 0)
      }

      ctx.restore()
      rotation += isHovered ? 0.01 : 0.005
      animationFrame = requestAnimationFrame(draw)
    }

    createParticles()
    draw()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', () => setIsHovered(true))
    canvas.addEventListener('mouseleave', () => setIsHovered(false))

    return () => {
      cancelAnimationFrame(animationFrame)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', () => setIsHovered(true))
      canvas.removeEventListener('mouseleave', () => setIsHovered(false))
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [tier, isHovered])

  return <canvas ref={canvasRef} className={cn('w-full h-full cursor-pointer', className)} />
}
