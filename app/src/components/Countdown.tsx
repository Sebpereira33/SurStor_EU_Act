import { useEffect, useState } from 'react'

const ENFORCEMENT = new Date('2026-08-02T00:00:00+02:00').getTime()

function parts() {
  const diff = Date.now() - ENFORCEMENT // milliseconds Art. 12 has been in force
  const past = diff >= 0
  const abs = Math.abs(diff)
  return {
    past,
    d: Math.floor(abs / 86_400_000),
    h: Math.floor((abs % 86_400_000) / 3_600_000),
    m: Math.floor((abs % 3_600_000) / 60_000),
    s: Math.floor((abs % 60_000) / 1000),
  }
}

/** Live clock on Art. 12 enforcement — counts down before 2 Aug 2026, counts days in force after. */
export default function Countdown({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState(parts)

  useEffect(() => {
    const id = setInterval(() => setT(parts()), 1000)
    return () => clearInterval(id)
  }, [])

  const cells = [
    { v: t.d, label: 'days' },
    { v: t.h, label: 'hours' },
    { v: t.m, label: 'min' },
    { v: t.s, label: 'sec' },
  ]

  if (compact) {
    return (
      <span className="font-mono2 text-xs tabular-nums" style={{ color: 'var(--signal)' }}>
        {t.past ? `day ${String(t.d).padStart(3, '0')} of enforcement` : `T-${t.d}d ${String(t.h).padStart(2, '0')}:${String(t.m).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`}
      </span>
    )
  }

  return (
    <div className="flex items-end gap-5 sm:gap-7">
      {cells.map((c) => (
        <div key={c.label} className="flex flex-col items-start">
          <span
            className="font-mono2 text-3xl font-bold tabular-nums sm:text-4xl"
            style={{ color: 'var(--text-1)' }}
          >
            {String(c.v).padStart(c.label === 'days' ? 3 : 2, '0')}
          </span>
          <span className="font-mono2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  )
}
