import { useEffect, useRef } from 'react'

// A restrained, locally rendered network inspired by performative-ui's node graph.
export default function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const host = canvas.parentElement!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, width = 0, height = 0, last = 0, visible = true
    const pointer = { x: -1000, y: -1000 }
    const nodes = Array.from({ length: 32 }, (_, i) => ({ x: ((i * 137.5) % 997) / 997, y: ((i * 233.7) % 991) / 991, phase: i * 1.7 }))
    const draw = (time: number) => {
      if (time - last < 32 && !motion.matches) { frame = requestAnimationFrame(draw); return }
      last = time
      ctx.clearRect(0, 0, width, height)
      const points = nodes.map(n => ({ x: n.x * width + (motion.matches ? 0 : Math.sin(time / 7000 + n.phase) * 12), y: n.y * height + (motion.matches ? 0 : Math.cos(time / 9000 + n.phase) * 12) }))
      points.forEach((p, i) => {
        const near = motion.matches ? 0 : Math.max(0, 1 - Math.hypot(p.x - pointer.x, p.y - pointer.y) / 200)
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j], distance = Math.hypot(p.x - q.x, p.y - q.y)
          if (distance > 180) continue
          ctx.strokeStyle = `rgba(130,180,216,${(1 - distance / 180) * (0.14 + near * 0.25)})`
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke()
        }
        ctx.fillStyle = i % 3 === 0 ? `rgba(255,170,50,${0.25 + near * 0.4})` : `rgba(130,180,216,${0.2 + near * 0.4})`
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8 + near, 0, Math.PI * 2); ctx.fill()
      })
      if (!motion.matches && visible && !document.hidden) frame = requestAnimationFrame(draw)
    }
    const restart = () => { cancelAnimationFrame(frame); if (visible && !document.hidden) { last = 0; frame = requestAnimationFrame(draw) } }
    const resize = () => { const box = host.getBoundingClientRect(); width = box.width; height = box.height; const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); restart() }
    const move = (e: PointerEvent) => { const box = host.getBoundingClientRect(); pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top }
    const leave = () => { pointer.x = pointer.y = -1000 }
    const observer = new ResizeObserver(resize)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart() })
    observer.observe(host); intersection.observe(host)
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave)
    motion.addEventListener('change', restart); document.addEventListener('visibilitychange', restart)
    resize()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); motion.removeEventListener('change', restart); document.removeEventListener('visibilitychange', restart) }
  }, [])
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
