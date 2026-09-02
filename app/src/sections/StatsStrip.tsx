import Reveal from '@/components/Reveal'

const STATS = [
  {
    value: '02 Aug 2026',
    label: 'In force since',
    note: 'Art. 12 record-keeping is enforceable for Annex III high-risk AI systems.',
    accent: 'var(--signal)',
  },
  {
    value: '≥ 6 months',
    label: 'Minimum log retention',
    note: 'Art. 26(6) & 19 — per log entry, longer where Union or national law requires.',
    accent: 'var(--pass)',
  },
  {
    value: '€15M / 3%',
    label: 'Tier-2 penalty ceiling',
    note: 'Art. 99 — the higher of €15M or 3% of global annual turnover.',
    accent: 'var(--fail)',
  },
  {
    value: 'Lifetime',
    label: 'Recording window',
    note: 'Art. 12(1) — automatic event recording over the system’s entire lifetime.',
    accent: 'var(--warn)',
  },
]

export default function StatsStrip() {
  return (
    <section className="hairline-t hairline-b" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            i={i}
            className="px-6 py-8 sm:px-8"
            // vertical dividers
          >
            <div
              className="h-full"
              style={{ borderLeft: i % 4 !== 0 ? undefined : undefined }}
            >
              <div className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: s.accent }}>
                {s.label}
              </div>
              <div className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-1)' }}>
                {s.value}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
