import Reveal from '@/components/Reveal'

const CAPS = [
  {
    idx: 'A',
    name: 'Append-only log pools',
    sub: 'art. 12(1) — automatic recording',
    body: 'Every event your system emits lands in a write-once pool. Entries are hash-chained the moment they arrive; a single altered byte breaks the chain and is detected on the next verification pass.',
  },
  {
    idx: 'B',
    name: 'EU-sovereign residency',
    sub: 'data stays in the union',
    body: 'Pools pin to EU regions — Frankfurt, Amsterdam, Dublin, Stockholm. Data never leaves the Union, and residency is provable per record, not per marketing slide.',
  },
  {
    idx: 'C',
    name: 'Automatic capture API',
    sub: 'zero operator intervention',
    body: 'One SDK call wraps any model invocation, agent action or human override. Structured events with qualified timestamps — the system records itself, exactly as Art. 12 intends.',
  },
  {
    idx: 'D',
    name: 'Retention engine',
    sub: 'art. 26(6) — ≥ 6 months',
    body: 'Policies default to 183 days and extend per pool to meet sectoral or GDPR-driven requirements. Retention is enforced by the storage layer — nothing expires early, nothing deletes silently.',
  },
  {
    idx: 'E',
    name: 'Authority export',
    sub: 'evidence on request',
    body: 'When a market surveillance authority asks, you export a verifiable bundle — records, chain proofs and integrity attestations — in seconds, not a forensic engagement.',
  },
  {
    idx: 'F',
    name: 'Agent-native attribution',
    sub: 'multi-agent ready',
    body: 'Shared data pools for collaborating agents, with every action attributable to the agent, model version and human overseer that produced it. Built for the agent economy, auditable for the EU.',
  },
]

export default function Platform() {
  return (
    <section id="platform" className="hairline-t py-24 sm:py-32" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal i={0}>
          <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
            02 / The platform
          </div>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Reveal i={1}>
            <h2 className="font-display max-w-[20ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
              Storage engineered as a compliance instrument
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[40ch] text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
              SurStor is a decentralized storage network with a single job: make every AI event
              provably recorded, retained and retrievable.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: 'var(--line)' }}>
          {CAPS.map((c, i) => (
            <Reveal key={c.idx} i={i % 3} className="h-full">
              <article className="group relative flex h-full flex-col justify-between p-7 transition-colors" style={{ background: 'var(--surface)' }}>
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono2 text-2xl font-bold" style={{ color: 'var(--line-strong)' }}>
                      {c.idx}
                    </span>
                    <span className="font-mono2 text-[9px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
                      {c.sub}
                    </span>
                  </div>
                  <h3 className="font-display mt-5 text-xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
                    {c.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    {c.body}
                  </p>
                </div>
                <div
                  className="mt-6 h-px w-8 transition-all duration-500 group-hover:w-full"
                  style={{ background: 'var(--signal)' }}
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
