import { useState, type FormEvent } from 'react'
import Reveal from '@/components/Reveal'
import { useLanguage } from '@/i18n'

export function CTA() {
  const { t } = useLanguage()
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
            {t('ctaEyebrow')}
          </div>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display mt-5 text-5xl leading-[1.02] font-bold sm:text-6xl">
            {t('ctaTitleA')}
            <br />
            <span className="signal-text signal-glow">{t('ctaTitleB')}</span>
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-6 max-w-[50ch] text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
            {t('ctaBody')}
          </p>
        </Reveal>
        <Reveal i={3}>
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('ctaPlaceholder')}
              className="h-12 flex-1 rounded px-4 font-mono2 text-sm outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--line-strong)', color: 'var(--text-1)' }}
            />
            <button
              type="submit"
              className="cta-breathe h-12 rounded px-6 font-mono2 text-sm font-bold uppercase tracking-[0.08em] transition-transform active:scale-95"
              style={{ background: 'var(--signal)', color: '#0c1626' }}
            >
              {t('ctaButton')}
            </button>
          </form>
        </Reveal>
        <Reveal i={4}>
          <p className="mt-5 font-mono2 text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
            {t('ctaFine')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLanguage()
  const cols = [
    {
      h: 'footerPlatform',
      links: ['footerLogPools', 'footerRetention', 'footerExport', 'footerAgents', 'footerPortable', 'footerStatus'],
    },
    {
      h: 'footerCompliance',
      links: ['footerGuide', 'footerRetentionGuide', 'footerGdpr', 'footerPenalties', 'footerTrust'],
    },
    {
      h: 'footerCompany',
      links: ['footerAbout', 'footerResidency', 'footerCareers', 'footerContact'],
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
              {t('footerDescription')}
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--text-3)' }}>
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--pass)' }} />
              {t('footerSystems')}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                {t(c.h)}
              </div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm transition-colors" style={{ color: 'var(--text-2)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--signal)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
                    >
                      {t(l)}
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
            {t('footerLegal')}
          </span>
        </div>
      </div>
    </footer>
  )
}
