import Reveal from '@/components/Reveal'
import BeforeAfter from '@/components/BeforeAfter'

const mono = { fontFamily: '"Space Mono", monospace' } as const

/** Flow diagram: many tools/models → user's SurStor pool → any tool/model. */
function PortabilityDiagram() {
  const sources = ['chatgpt', 'claude', 'mistral', 'gemini', 'copilot', 'in-house LLM']
  const targets = ['any agent', 'any model', 'your CRM', 'your vault', 'regulator', 'new vendor']

  return (
    <svg viewBox="0 0 980 330" className="w-full" role="img" aria-label="Outputs from many AI tools and models flow into the user's SurStor pool, and from there into any tool, model or destination the user chooses.">
      {/* sources */}
      <text x={10} y={16} fill="#a0afc3" fontSize={9} letterSpacing={2} style={mono}>
        OUTPUT COMES FROM
      </text>
      {sources.map((s, i) => {
        const y = 30 + i * 47
        return (
          <g key={s}>
            <rect x={10} y={y} width={150} height={36} rx={6} fill="#1e3049" stroke="#30445f" strokeWidth={1} />
            <text x={22} y={y + 22} fill="#c5d0df" fontSize={10.5} style={mono}>
              {s}
            </text>
            <path d={`M160 ${y + 18} C 260 ${y + 18}, 260 165, 330 165`} fill="none" stroke="#82b4d8" strokeWidth={1} strokeDasharray="3 5" opacity={0.65}>
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </path>
          </g>
        )
      })}

      {/* user pool */}
      <text x={335} y={16} fill="#ffaa32" fontSize={9} letterSpacing={2} style={mono}>
        YOUR SURSTOR POOL — YOU OWN THE KEYS
      </text>
      <rect x={330} y={90} width={300} height={150} rx={10} fill="#16243a" stroke="#ffaa32" strokeOpacity={0.55} strokeWidth={1.25} />
      <text x={350} y={122} fill="#f1f5fa" fontSize={13} fontWeight={700} style={mono}>
        portable memory pool
      </text>
      <text x={350} y={142} fill="#c5d0df" fontSize={10} style={mono}>
        normalized, encrypted, hash-chained
      </text>
      <text x={350} y={160} fill="#c5d0df" fontSize={10} style={mono}>
        owner: you · region: eu · exit: anytime
      </text>
      <rect x={350} y={176} width={196} height={20} rx={4} fill="rgba(255,170,50,0.1)" />
      <text x={358} y={190} fill="#ffaa32" fontSize={9} style={mono}>
        provenance: model + version + timestamp
      </text>
      <rect x={350} y={204} width={196} height={20} rx={4} fill="rgba(130,180,216,0.1)" />
      <text x={358} y={218} fill="#82b4d8" fontSize={9} style={mono}>
        export: full-fidelity · no lock-in
      </text>

      {/* targets */}
      <text x={780} y={16} fill="#a0afc3" fontSize={9} letterSpacing={2} style={mono}>
        YOU CHOOSE WHERE IT GOES
      </text>
      {targets.map((t, i) => {
        const y = 30 + i * 47
        return (
          <g key={t}>
            <path d={`M630 165 C 700 165, 700 ${y + 18}, 780 ${y + 18}`} fill="none" stroke="#ffaa32" strokeWidth={1} strokeDasharray="3 5" opacity={0.65}>
              <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            </path>
            <rect x={780} y={y} width={150} height={36} rx={6} fill="#1e3049" stroke="#30445f" strokeWidth={1} />
            <text x={792} y={y + 22} fill="#c5d0df" fontSize={10.5} style={mono}>
              {t}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const POINTS = [
  {
    idx: '01',
    title: 'Your output is your property',
    body: 'Whatever you create with any tool or model — prompts, answers, code, analyses, decisions — is captured into your pool under your keys. Not scattered across vendor accounts. Not subject to someone else’s retention policy. Yours.',
  },
  {
    idx: '02',
    title: 'Move it between tools and models',
    body: 'Switch from one model to another, or run several side by side, and carry the full context with you. Yesterday’s conversation with one assistant becomes today’s grounding for a different one — the tool changes, the memory doesn’t.',
  },
  {
    idx: '03',
    title: 'You decide where it lives',
    body: 'Allocate pools by purpose: client work in one, R&D in another, regulated records in a third — each pinned to EU regions with its own access and retention rules. Every allocation is provable, and leaving is a full-fidelity export, not a negotiation.',
  },
]

export default function Portability() {
  return (
    <section id="ownership" className="hairline-t py-24 sm:py-32" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal i={0}>
          <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
            03 / Ownership &amp; portability
          </div>
        </Reveal>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <Reveal i={1}>
            <h2 className="font-display max-w-[24ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
              More than a record of what models said
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[44ch] text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
              SurStor doesn’t just log LLM output for compliance. It turns everything you create with AI into an
              asset you own — movable between tools, models and agents, allocated wherever you decide.
            </p>
          </Reveal>
        </div>

        <BeforeAfter />
        <Reveal i={3}>
          <div className="panel noise relative mt-14 overflow-hidden p-4 sm:p-8">
            <PortabilityDiagram />
          </div>
        </Reveal>

        <div className="mt-4 grid grid-cols-1 gap-px lg:grid-cols-3" style={{ background: 'var(--line)' }}>
          {POINTS.map((p, i) => (
            <Reveal key={p.idx} i={i} className="h-full">
              <article className="group flex h-full flex-col p-7" style={{ background: 'var(--surface)' }}>
                <span className="font-mono2 text-xs" style={{ color: 'var(--text-3)' }}>
                  {p.idx}
                </span>
                <h3 className="font-display mt-4 text-xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {p.body}
                </p>
                <div
                  className="mt-6 h-px w-8 transition-all duration-500 group-hover:w-full"
                  style={{ background: 'var(--signal)' }}
                />
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal i={2}>
          <p className="mt-10 max-w-[70ch] text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
            Why it matters beyond convenience: Article 12 asks <em style={{ color: 'var(--text-2)' }}>what</em> your
            systems did. Ownership answers <em style={{ color: 'var(--text-2)' }}>whose</em> record it is. When the
            audit trail and the working memory live in the same user-owned pool, compliance stops being a copy you
            maintain for a regulator — it becomes the thing itself.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
