import Reveal from '@/components/Reveal'

const CLAUSES = [
  {
    ref: 'Art. 12(1)',
    title: 'Automatic recording, for life',
    body: 'High-risk AI systems shall technically allow for the automatic recording of events — logs — over the lifetime of the system. Manual record-keeping does not qualify: the capability must be designed in, not bolted on.',
    quote: '“High-risk AI systems shall technically allow for the automatic recording of events (logs) over the lifetime of the system.”',
  },
  {
    ref: 'Art. 12(2)(a)',
    title: 'Risk identification',
    body: 'Logs must let you identify situations that may result in the system presenting a risk under Art. 79(1), or amounting to a substantial modification — before they become incidents.',
  },
  {
    ref: 'Art. 12(2)(b)',
    title: 'Post-market monitoring',
    body: 'Logging must facilitate the post-market monitoring system required by Art. 72: systematic collection, documentation and analysis of performance data across the system’s deployment.',
  },
  {
    ref: 'Art. 12(2)(c)',
    title: 'Operational oversight',
    body: 'Logs must support the deployer’s monitoring duty under Art. 26(5) — tracking that the system operates within the provider’s instructions for use, every day it runs.',
  },
  {
    ref: 'Art. 12(3)',
    title: 'Biometric minimums',
    body: 'For remote biometric identification (Annex III, 1(a)) the floor is explicit: period of each use with start and end timestamps, the reference database checked, the input data that matched, and the identity of the natural persons who verified results.',
  },
]

export default function Article12() {
  return (
    <section id="article-12" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* sticky intro */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal i={0}>
            <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
              01 / The obligation
            </div>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-5 max-w-[18ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
              What Article 12 actually demands
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
              The regulation is precise on objectives and thin on operational detail. What counts as an event, how
              logs stay intact, and who can prove they weren’t altered — that part is on you. These are the five
              clauses your logging architecture has to answer.
            </p>
          </Reveal>
          <Reveal i={3}>
            <div className="mt-8 rounded-lg p-5" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <div className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                Provider vs. deployer
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Providers must <em style={{ color: 'var(--text-1)' }}>design in</em> the logging capability. Deployers
                must <em style={{ color: 'var(--text-1)' }}>retain the logs</em> for at least six months and produce
                them to market surveillance authorities on request. Buying a vendor’s system transfers neither duty.
              </p>
            </div>
          </Reveal>
        </div>

        {/* clause list */}
        <div>
          {CLAUSES.map((c, i) => (
            <Reveal key={c.ref} i={Math.min(i, 4)}>
              <article
                className="group py-8 first:pt-0"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-mono2 shrink-0 rounded px-2 py-1 text-[11px] font-bold"
                    style={{ background: 'rgba(255,158,64,0.1)', color: 'var(--signal)' }}
                  >
                    {c.ref}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{c.title}</h3>
                </div>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {c.body}
                </p>
                {c.quote && (
                  <blockquote
                    className="mt-5 pl-5 font-mono2 text-[13px] leading-relaxed"
                    style={{ borderLeft: '2px solid var(--signal)', color: 'var(--text-3)' }}
                  >
                    {c.quote}
                    <footer className="mt-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
                      Regulation (EU) 2024/1689, Art. 12(1)
                    </footer>
                  </blockquote>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
