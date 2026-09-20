import { useState, type FormEvent } from 'react'
import Reveal from '@/components/Reveal'

export function CTA() {
  const [email, setEmail] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const addr = email.trim()
    window.location.href = `mailto:contact@surstor.net?subject=${encodeURIComponent('SurStor access request')}${addr ? `&body=${encodeURIComponent(`Work email: ${addr}\n\nWe'd like to discuss Article 12 record-keeping for our AI systems.`)}` : ''}`
  }

  return (
    <section id="contact" className="hairline-t noise relative overflow-hidden py-28 sm:py-36">
      <div className="grid-overlay absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -bottom-52 left-1/2 h-[440px] w-[720px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,170,50,0.1), transparent)' }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal i={0}>
          <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
            07 / Get ready
          </div>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display mt-5 text-5xl leading-[1.02] font-bold sm:text-6xl">
            Be auditable.
            <br />
            <span className="signal-text signal-glow">Starting today.</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-6 max-w-[50ch] text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
            Article 12 is not a policy you write — it is infrastructure you run, and it is already in force.
            SurStor onboards EU teams in days, with record-keeping live before your next deployment.
          </p>
        </Reveal>
        <Reveal i={3}>
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="work email"
              className="h-12 flex-1 rounded px-4 font-mono2 text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--line-strong)', color: 'var(--text-1)' }}
            />
            <button
              type="submit"
              className="cta-breathe h-12 rounded px-6 font-mono2 text-sm font-bold uppercase tracking-[0.08em] transition-transform active:scale-95"
              style={{ background: 'var(--signal)', color: '#0c1626' }}
            >
              Request access
            </button>
          </form>
        </Reveal>
        <Reveal i={4}>
          <p className="mt-5 font-mono2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
            eu regions only · no credit card · dpa on day one
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const cols = [
    {
      h: 'Platform',
      links: ['Log pools', 'Retention engine', 'Authority export', 'Agent pools', 'Portable memory', 'Status'],
    },
    {
      h: 'Compliance',
      links: ['Article 12 guide', 'Art. 26(6) retention', 'GDPR interplay', 'Art. 99 penalties', 'Trust center'],
    },
    {
      h: 'Company',
      links: ['About', 'EU data residency', 'Careers', 'Contact'],
    },
  ]
  return (
    <footer className="hairline-t" style={{ background: 'var(--surface)' }}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,0.7fr)]">
          <div>
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}surstor-logo-transparent.png`} alt="SurStor" width={64} height={64} className="h-16 w-16 shrink-0 object-contain" />
              <span className="font-display text-2xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>SurStor</span>
            </div>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed" style={{ color: 'var(--text-3)' }}>
              The record-keeping layer for Europe’s AI economy. Decentralized storage, hash-chained logs,
              EU-sovereign by design.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-3)' }}>
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--pass)' }} />
              all systems operational — de-fra · nl-ams · ie-dub · se-sto
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                {c.h}
              </div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm transition-colors" style={{ color: 'var(--text-2)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--signal)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="hairline-t mt-14 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono2 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-3)' }}>
            © 2026 SurStor — built for Regulation (EU) 2024/1689
          </span>
          <span className="max-w-[52ch] text-[11px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            SurStor provides record-keeping infrastructure. Content on this site is informational and does not
            constitute legal advice.
          </span>
        </div>
      </div>
    </footer>
  )
}
