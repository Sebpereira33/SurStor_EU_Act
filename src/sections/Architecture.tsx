import Reveal from '@/components/Reveal'

const mono = { fontFamily: '"Space Mono", monospace' } as const

function Node({
  x,
  y,
  w = 150,
  title,
  sub,
  accent = 'var(--line-strong)',
}: {
  x: number
  y: number
  w?: number
  title: string
  sub: string
  accent?: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={54} rx={6} fill="#1e3049" stroke={accent} strokeWidth={1} />
      <text x={x + 12} y={y + 22} fill="#f1f5fa" fontSize={11} fontWeight={700} style={mono}>
        {title}
      </text>
      <text x={x + 12} y={y + 40} fill="#a0afc3" fontSize={9} style={mono}>
        {sub}
      </text>
    </g>
  )
}

function Flow({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="#ffaa32"
      strokeWidth={1.25}
      strokeDasharray="4 6"
      strokeLinecap="round"
      opacity={0.75}
    >
      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.2s" begin={`${delay}s`} repeatCount="indefinite" />
    </path>
  )
}

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal i={0}>
          <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
            04 / Architecture
          </div>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display mt-5 max-w-[22ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
            From event to evidence, in one pass
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
            Records flow from your systems into hash-chained EU pools the moment they happen. What your agents write,
            your compliance team queries — and your regulator verifies independently.
          </p>
        </Reveal>

        <Reveal i={3}>
          <div className="panel noise relative mt-14 overflow-hidden p-4 sm:p-8">
            <svg viewBox="0 0 980 360" className="w-full" role="img" aria-label="SurStor data flow: AI systems and agents write events into the SurStor hash-chained EU storage layer, which serves deployers, post-market monitoring and market surveillance authorities.">
              {/* sources */}
              <text x={10} y={18} fill="#a0afc3" fontSize={9} letterSpacing={2} style={mono}>
                SOURCES — YOUR STACK
              </text>
              <Node x={10} y={30} title="high-risk AI system" sub="art. 12(1) events" />
              <Node x={10} y={100} title="AI agents" sub="multi-agent pools" />
              <Node x={10} y={170} title="human oversight" sub="art. 14(5) actions" />
              <Node x={10} y={240} title="MLOps / drift signals" sub="art. 72 telemetry" />

              {/* flows in */}
              <Flow d="M165 57 C 250 57, 250 160, 330 160" />
              <Flow d="M165 127 C 240 127, 250 165, 330 168" delay={0.2} />
              <Flow d="M165 197 C 240 197, 250 180, 330 176" delay={0.4} />
              <Flow d="M165 267 C 250 267, 250 185, 330 182" delay={0.6} />

              {/* SurStor core */}
              <text x={335} y={18} fill="#ffaa32" fontSize={9} letterSpacing={2} style={mono}>
                SURSTOR — EU REGIONS ONLY
              </text>
              <rect x={330} y={130} width={300} height={120} rx={10} fill="#16243a" stroke="#ffaa32" strokeOpacity={0.5} strokeWidth={1.25} />
              <text x={350} y={158} fill="#f1f5fa" fontSize={13} fontWeight={700} style={mono}>
                hash-chained log pools
              </text>
              <text x={350} y={178} fill="#c5d0df" fontSize={10} style={mono}>
                append-only · qualified timestamps
              </text>
              <text x={350} y={196} fill="#c5d0df" fontSize={10} style={mono}>
                DE-FRA · NL-AMS · IE-DUB · SE-STO
              </text>
              <rect x={350} y={212} width={180} height={20} rx={4} fill="rgba(255,170,50,0.1)" />
              <text x={358} y={226} fill="#ffaa32" fontSize={9} style={mono}>
                merkle epoch committed · 11,204
              </text>

              {/* flows out */}
              <Flow d="M630 150 C 700 150, 700 70, 780 70" delay={0.15} />
              <Flow d="M630 180 C 710 180, 710 180, 780 180" delay={0.35} />
              <Flow d="M630 210 C 700 210, 700 292, 780 292" delay={0.55} />

              {/* consumers */}
              <text x={780} y={18} fill="#a0afc3" fontSize={9} letterSpacing={2} style={mono}>
                CONSUMERS — PROOF OUT
              </text>
              <Node x={780} y={42} title="deployer console" sub="art. 26(5) oversight" accent="#82b4d8" />
              <Node x={780} y={152} title="post-market monitor" sub="art. 72 analysis" accent="#82b4d8" />
              <Node x={780} y={262} title="market surveillance" sub="verifiable export" accent="#d9a24a" />
            </svg>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { n: '< 40 ms', t: 'ingest-to-chained latency per event, p95' },
            { n: '100%', t: 'of records verifiable against the public chain root' },
            { n: '0', t: 'bytes of log data stored outside the European Union' },
          ].map((s, i) => (
            <Reveal key={s.t} i={i}>
              <div className="hairline rounded-lg px-6 py-5" style={{ background: 'var(--surface)' }}>
                <div className="font-display text-3xl font-bold" style={{ color: 'var(--signal)' }}>
                  {s.n}
                </div>
                <div className="mt-1.5 text-sm" style={{ color: 'var(--text-2)' }}>
                  {s.t}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
