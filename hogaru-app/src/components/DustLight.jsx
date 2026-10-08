import { useEffect, useRef } from 'react'

// Motas de polvo flotando en un haz de luz — el único momento de
// movimiento ambiental de la app, y está atado al tema (una casa
// limpia, luz de sol) en vez de ser un bokeh genérico.
export default function DustLight({ density = 34, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let particles = []
    let width = 0
    let height = 0

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * devicePixelRatio
      canvas.height = height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      particles = Array.from({ length: density }, () => spawn())
    }

    function spawn() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.8,
        speedY: -(0.06 + Math.random() * 0.14),
        speedX: (Math.random() - 0.5) * 0.08,
        drift: Math.random() * Math.PI * 2,
        opacity: 0.15 + Math.random() * 0.35,
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        p.drift += 0.004
        p.x += p.speedX + Math.sin(p.drift) * 0.05
        p.y += p.speedY
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 153, 43, ${p.opacity})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    window.addEventListener('resize', resize)

    if (!prefersReducedMotion) {
      tick()
    } else {
      // Estático: una sola pasada, sin loop de animación.
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 153, 43, ${p.opacity})`
        ctx.fill()
      }
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
