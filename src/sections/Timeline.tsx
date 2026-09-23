import Reveal from '@/components/Reveal'
import Countdown from '@/components/Countdown'

const MILESTONES = [
  {
    date: '01 Aug 2024',
    title: 'AI Act enters into force',
    body: 'Regulation (EU) 2024/1689 becomes law. The compliance clock starts.',
    state: 'done',
  },
  {
    date: '02 Feb 2025',
    title: 'Prohibited practices banned',
    body: 'Art. 5 — social scoring, subliminal manipulation and other unacceptable-risk practices are outlawed.',
    state: 'done',
  },
  {
    date: '02 Aug 2025',
    title: 'GPAI & governance live',
    body: 'Obligations for general-purpose AI models (Arts. 51–56) and the EU governance framework take effect.',
    state: 'done',
  },
  {
    date: '02 Aug 2026',
    title: 'High-risk rules in force — including Article 12',
    body: 'Full application for Annex III high-risk systems. Automatic event recording, retention and authority access are enforceable now. This is the obligation that matters to you.',
    state: 'now',
  },
  {
    date: '02 Aug 2027',
    title: 'Sectoral products follow',
    body: 'AI embedded in products under existing harmonisation law — medical devices, machinery, vehicles — joins the regime.',
    state: 'next',
  },
] as const

const PENALTIES = [
  { tier: 'Tier 1', scope: 'Prohibited practices (Art. 5)', fine: '€35M or 7%', color: 'var(--fail)' },
  { tier: 'Tier 2', scope: 'High-risk obligations — incl. Art. 12 record-keeping', fine: '€15M or 3%', color: 'var(--warn)' },
  { tier: 'Tier 3', scope: 'Inaccurate information to authorities', fine: '€7.5M or 1%', color: 'var(--pass)' },
]

export default function Timeline() {
  return (
    <section id="timeline" className="hairline-t py-24 sm:py-32" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal i={0}>
          <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
            05 / Enforcement timeline
          </div>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display mt-5 max-w-[24ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
            Enforcement is no longer hypothetical
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* timeline */}
          <div className="relative pl-8">
            <div className="absolute top-1 bottom-1 left-[5px] w-px" style={{ background: 'var(--line-strong)' }} />
            {MILESTONES.map((m, i) => {
              const active = m.state === 'now'
              return (
                <Reveal key={m.date} i={i} className="relative pb-10 last:pb-0">
                  <span
                    className="absolute top-1.5 -left-8 block h-[11px] w-[11px] rounded-full"
                    style={{
                      background: active ? 'var(--signal)' : m.state === 'done' ? 'var(--pass)' : 'var(--bg)',
                      border: `2px solid ${active ? 'var(--signal)' : m.state === 'done' ? 'var(--pass)' : 'var(--line-strong)'}`,
                      boxShadow: active ? '0 0 16px rgba(255,170,50,0.5)' : 'none',
                      marginLeft: '1px',
                    }}
                  />
                  <div className="font-mono2 text-[11px] uppercase tracking-[0.2em]" style={{ color: active ? 'var(--signal)' : 'var(--text-3)' }}>
                    {m.date}
                  </div>
                  <h3 className="font-display mt-2 text-xl font-bold tracking-tight sm:text-2xl" style={{ color: 'var(--text-1)' }}>
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    {m.body}
                  </p>
                  {active && (
                    <div className="mt-5 inline-flex flex-col gap-3 rounded-lg p-5" style={{ background: 'var(--bg)', border: '1px solid var(--line-strong)' }}>
                      <span className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                        in force for
                      </span>
                      <Countdown />
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>

          {/* penalties */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal i={1}>
              <div className="panel noise relative overflow-hidden p-7">
                <div className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                  Art. 99 — what non-compliance costs
                </div>
                <div className="mt-6 space-y-5">
                  {PENALTIES.map((p) => (
                    <div key={p.tier} className="flex items-start justify-between gap-4 pb-5" style={{ borderBottom: '1px solid var(--line)' }}>
                      <div>
                        <div className="font-mono2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: p.color }}>
                          {p.tier}
                        </div>
                        <div className="mt-1.5 text-sm leading-snug" style={{ color: 'var(--text-2)' }}>
                          {p.scope}
                        </div>
                      </div>
                      <div className="font-display shrink-0 text-lg font-bold whitespace-nowrap" style={{ color: 'var(--text-1)' }}>
                        {p.fine}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-xs leading-relaxed" style={{ color: 'var(--text-3)' }}>
                  Whichever is higher, of global annual turnover. Record-keeping failures sit squarely in Tier 2 —
                  and handing authorities incomplete or unverifiable logs is itself a separate Tier 3 violation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
