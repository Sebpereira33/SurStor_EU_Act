import { Cable, FilePlus2, Search, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/i18n'

const steps = [
  { title: 'howConnect', icon: Cable, body: 'howConnectBody', detail: 'howConnectDetail', href: '#quickstart', link: 'howConnectLink' },
  { title: 'howStore', icon: FilePlus2, body: 'howStoreBody', detail: 'howStoreDetail', href: '#demo', link: 'howStoreLink' },
  { title: 'howFind', icon: Search, body: 'howFindBody', detail: 'howFindDetail', href: '#search-demo', link: 'howFindLink' },
  { title: 'howVerify', icon: ShieldCheck, body: 'howVerifyBody', detail: 'howVerifyDetail', href: '#integrity-demo', link: 'howVerifyLink' },
]

export default function HowItWorks() {
  const { t } = useLanguage()
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="hairline-t scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('howEyebrow')}</p>
        <h2 id="how-it-works-title" className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('howTitle')}</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">{t('howBody')}</p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="flex items-center justify-between text-[var(--signal)]">
                <span className="font-mono2 text-xs">STEP 0{index + 1}</span>
                <step.icon aria-hidden="true" size={24} strokeWidth={1.5} />
              </div>
                <h3 className="mt-6 text-2xl font-bold">{t(step.title)}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-2)]">{t(step.body)}</p>
              <p className="mt-6 border-t border-[var(--line)] pt-4 font-mono2 text-xs leading-relaxed text-[var(--text-2)]">{t(step.detail)}</p>
              <a href={step.href} className="mt-5 rounded text-sm font-semibold text-[var(--signal)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]">{t(step.link)} <span aria-hidden="true">↗</span></a>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[var(--text-2)]">{t('howDisclaimer')}</p>
      </div>
    </section>
  )
}
