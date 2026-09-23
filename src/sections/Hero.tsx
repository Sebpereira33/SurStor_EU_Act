import Reveal from '@/components/Reveal'
import HeroNetwork from '@/components/HeroNetwork'
import LogStream from '@/components/LogStream'
import Countdown from '@/components/Countdown'
import { useLanguage } from '@/i18n'

export default function Hero() {
  const { t } = useLanguage()
  return (
    <section id="top" className="noise relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="grid-overlay absolute inset-0" aria-hidden="true" />
      <HeroNetwork />
      {/* signal glow */}
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(255,170,50,0.09), transparent)' }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* left — copy */}
        <div>
          <Reveal i={0}>
            <div
              className="mb-7 inline-flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-3 font-mono2 text-[11px] uppercase tracking-[0.16em]"
              style={{ border: '1px solid var(--line-strong)', color: 'var(--text-2)', background: 'rgba(22,36,58,0.7)' }}
            >
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--signal)' }} />
              {t('heroBadge')}
            </div>
          </Reveal>

          <Reveal i={1}>
            <h1 className="font-display text-5xl leading-[1.02] font-bold sm:text-6xl lg:text-[4.4rem]">
              {t('heroTitleA')}
              <br />
              <span className="signal-text signal-glow">{t('heroTitleB')}</span>
            </h1>
          </Reveal>

          <Reveal i={2}>
            <p className="mt-7 max-w-[52ch] text-lg leading-relaxed" style={{ color: 'var(--text-2)' }}>
              {t('heroBody')}
            </p>
          </Reveal>

          <Reveal i={3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#journey"
                className="cta-breathe rounded px-6 py-3.5 font-mono2 text-sm font-bold uppercase tracking-[0.08em] transition-transform active:scale-95"
                style={{ background: 'var(--signal)', color: '#0c1626' }}
              >
                {t('heroWorkflow')}
              </a>
              <a
                href="#article-12"
                className="rounded px-6 py-3.5 font-mono2 text-sm uppercase tracking-[0.08em] transition-colors"
                style={{ border: '1px solid var(--line-strong)', color: 'var(--text-2)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--signal)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line-strong)')}
              >
                {t('heroObligation')}
              </a>
            </div>
          </Reveal>

          <Reveal i={4}>
            <div className="hairline-t mt-12 pt-6">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-3)' }}>
                  {t('heroInForce')}
                </span>
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--signal)' }}>
                  {t('heroSince')}
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
                background: 'rgba(22,36,58,0.86)',
                border: '1px solid var(--line)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 24px 80px -32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,170,50,0.04), 0 0 48px -12px rgba(255,170,50,0.10)',
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
                  style={{ background: 'rgba(130,180,216,0.12)', color: 'var(--pass)' }}
                >
                  {t('heroLive')}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <LogStream />
              </div>
              <div
                className="flex items-center justify-between px-4 py-2.5 font-mono2 text-[9px] uppercase tracking-[0.16em]"
                style={{ borderTop: '1px solid var(--line)', color: 'var(--text-3)' }}
              >
                <span>{t('heroHash')}</span>
                <span>{t('heroRetention')}</span>
              </div>
            </div>

            {/* mini integrity strip */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { k: t('heroSeq'), v: '481,204' },
                { k: t('heroMerkle'), v: 'f0c3…77aa' },
                { k: t('heroRegion'), v: 'DE-FRA-1' },
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
