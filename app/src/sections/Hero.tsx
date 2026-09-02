import Reveal from '@/components/Reveal'
import LogStream from '@/components/LogStream'
import Countdown from '@/components/Countdown'

export default function Hero() {
  return (
    <section id="top" className="noise relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="grid-overlay absolute inset-0" aria-hidden="true" />
      {/* signal glow */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,158,64,0.09), transparent)' }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* left — copy */}
        <div>
          <Reveal i={0}>
            <div
              className="mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 font-mono2 text-[11px] uppercase tracking-[0.16em]"
              style={{ border: '1px solid var(--line-strong)', color: 'var(--text-2)', background: 'rgba(18,19,22,0.7)' }}
            >
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--signal)' }} />
              Regulation (EU) 2024/1689 · Article 12
            </div>
          </Reveal>

          <Reveal i={1}>
            <h1 className="font-display text-5xl leading-[1.02] font-bold sm:text-6xl lg:text-[4.4rem]">
              Every AI decision,
              <br />
              <span className="signal-text signal-glow">on the record.</span>
            </h1>
          </Reveal>

          <Reveal i={2}>
            <p className="mt-7 max-w-[52ch] text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
              Article 12 of the EU AI Act obliges high-risk AI systems to record events automatically, over their
              entire lifetime. SurStor is the record-keeping layer built for exactly that — tamper-evident log
              pools, hosted on EU-sovereign infrastructure. And beyond compliance: every output you create with
              any tool or model becomes your property, portable between them, allocated wherever you choose.
            </p>
          </Reveal>

          <Reveal i={3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="cta-breathe rounded px-6 py-3.5 font-mono2 text-sm font-bold uppercase tracking-[0.08em] transition-transform active:scale-95"
                style={{ background: 'var(--signal)', color: '#0a0b0d' }}
              >
                Start recording →
              </a>
              <a
                href="#article-12"
                className="rounded px-6 py-3.5 font-mono2 text-sm uppercase tracking-[0.08em] transition-colors"
                style={{ border: '1px solid var(--line-strong)', color: 'var(--text-2)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--signal)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
              >
                Read the obligation
              </a>
            </div>
          </Reveal>

          <Reveal i={4}>
            <div className="hairline-t mt-12 pt-6">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                  Art. 12 in force for Annex III systems
                </span>
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--signal)' }}>
                  since 02 Aug 2026
                </span>
              </div>
              <Countdown />
            </div>
          </Reveal>
        </div>

        {/* right — live log terminal */}
        <Reveal i={2} className="lg:pl-6">
          <div className="float-y">
            <div
              className="overflow-hidden rounded-xl"
              style={{
                background: 'rgba(18,19,22,0.86)',
                border: '1px solid var(--line)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 24px 80px -32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,158,64,0.04), 0 0 48px -12px rgba(255,158,64,0.10)',
              }}
            >
              {/* window chrome */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--line)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#3a3f47' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#3a3f47' }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--signal)' }} />
                </div>
                <span className="font-mono2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
                  surstor · pool/hr-screening-eu · eu-central
                </span>
                <span
                  className="pulse-dot rounded px-1.5 py-0.5 font-mono2 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: 'rgba(95,168,199,0.12)', color: 'var(--pass)' }}
                >
                  live
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <LogStream />
              </div>
              <div
                className="flex items-center justify-between px-4 py-2.5 font-mono2 text-[9px] uppercase tracking-[0.16em]"
                style={{ borderTop: '1px solid var(--line)', color: 'var(--text-3)' }}
              >
                <span>hash-chained · append-only</span>
                <span>retention ≥ 183 days</span>
              </div>
            </div>

            {/* mini integrity strip */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: 'seq', v: '481,204' },
                { k: 'merkle root', v: 'f0c3…77aa' },
                { k: 'region', v: 'DE-FRA-1' },
              ].map((s) => (
                <div key={s.k} className="rounded-md px-3 py-2.5" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div className="font-mono2 text-[9px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-3)' }}>
                    {s.k}
                  </div>
                  <div className="font-mono2 text-xs font-bold" style={{ color: 'var(--text-1)' }}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
