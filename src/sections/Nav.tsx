import { useEffect, useState } from 'react'
import Countdown from '@/components/Countdown'
import { useLanguage } from '@/i18n'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { t } = useLanguage()
  const links = [
    { href: '#article-12', label: t('navArticle') },
    { href: '#journey', label: t('navWorkflow') },
    { href: '#ownership', label: t('navOwnership') },
    { href: '#demo', label: t('navDemo') },
    { href: '#quickstart', label: t('navDevelopers') },
    { href: '#faq', label: t('navFaq') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: scrolled ? 'rgba(var(--bg-rgb), 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}surstor-logo-transparent.png`} alt="SurStor" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" />
          <span className="font-display text-xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>SurStor</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono2 text-xs uppercase tracking-[0.14em] transition-colors"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--signal)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-2)')}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden flex-col items-end lg:flex">
            <span className="font-mono2 text-[9px] uppercase tracking-[0.18em]" style={{ color: 'var(--text-3)' }}>
              Art. 12 — live
            </span>
            <Countdown compact />
          </div>
          <a
            href="#contact"
            className="cta-breathe rounded px-4 py-2 font-mono2 text-xs font-bold uppercase tracking-[0.1em] transition-transform active:scale-95"
            style={{ background: 'var(--signal)', color: '#0c1626' }}
          >
            {t('requestAccess')}
          </a>
        </div>
      </div>
    </header>
  )
}
