import { useState } from 'react'
import { useLanguage } from '@/i18n'

const paths = [
  { name: 'devName', goal: 'devGoal', scenario: 'devScenario', steps: ['devStep1', 'devStep2', 'devStep3'], demo: '#demo', action: 'devAction', next: '#quickstart', nextLabel: 'devNext' },
  { name: 'agentName', goal: 'agentGoal', scenario: 'agentScenario', steps: ['agentStep1', 'agentStep2', 'agentStep3'], demo: '#demo', action: 'agentAction', next: '#quickstart', nextLabel: 'devNext' },
  { name: 'researcherName', goal: 'researcherGoal', scenario: 'researcherScenario', steps: ['researcherStep1', 'researcherStep2', 'researcherStep3'], demo: '#search-demo', action: 'researcherAction', next: '#quickstart', nextLabel: 'researcherNext' },
  { name: 'complianceName', goal: 'complianceGoal', scenario: 'complianceScenario', steps: ['complianceStep1', 'complianceStep2', 'complianceStep3'], demo: '#integrity-demo', action: 'complianceAction', next: '#contact', nextLabel: 'complianceNext' },
]
const control = 'rounded-lg border border-[var(--line-strong)] px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)] hover:border-[var(--signal)]'

export default function Journey() {
  const [selected, setSelected] = useState(0)
  const [stage, setStage] = useState(0)
  const { t } = useLanguage()
  const path = paths[selected]
  return <section id="journey" className="hairline-t scroll-mt-24 py-24 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('journeyEyebrow')}</p>
      <h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('journeyTitle')}</h2>
      <p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">{t('journeyBody')}</p>
      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--text-2)]" aria-label="Journey progress">
        {[t('journeyChoose'), t('journeyExplore'), t('journeyNext')].map((label, i) => <li key={label} aria-current={stage === i ? 'step' : undefined} className={stage === i ? 'font-bold text-[var(--signal)]' : ''}>{i + 1}. {label}</li>)}
      </ol>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label={t('journeyChoose')}>
          {paths.map((item, i) => <button key={item.name} aria-pressed={selected === i} className={`${control} text-left ${selected === i ? 'border-[var(--signal)] bg-[var(--surface-2)]' : 'bg-[var(--surface)]'}`} onClick={() => { setSelected(i); setStage(0) }}><span className="block text-lg font-bold">{t(item.name)}</span><span className="mt-1 block text-[var(--text-2)]">{t(item.goal)}</span></button>)}
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8" aria-live="polite">
          <p className="font-mono2 text-xs uppercase tracking-wider text-[var(--signal)]">{t(path.name)} / {stage === 0 ? t('journeyChoose') : stage === 1 ? t('journeyExplore') : t('journeyNext')}</p>
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{t(path.goal)}</h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--text-2)]">{t(path.scenario)}</p>
          {stage === 0 && <button className={`${control} mt-7 bg-[var(--signal)] font-bold text-black`} onClick={() => setStage(1)}>{t('journeyShow')}</button>}
          {stage === 1 && <><ol className="mt-6 space-y-4">{path.steps.map((step, i) => <li key={step} className="flex gap-3"><span className="font-mono2 text-[var(--signal)]">0{i + 1}</span><span>{t(step)}</span></li>)}</ol><div className="mt-7 flex flex-wrap gap-3"><a href={path.demo} className={`${control} bg-[var(--signal)] font-bold text-black`}>{t(path.action)} ↗</a><button className={control} onClick={() => setStage(2)}>{t('journeyStart')}</button><button className={control} onClick={() => setStage(0)}>{t('journeyBack')}</button></div><p className="mt-4 text-sm text-[var(--text-2)]">{t('journeyIllustrative')} <a href="#journey" className="underline underline-offset-4">{t('journeyReturn')}</a>.</p></>}
          {stage === 2 && <><p className="mt-6 text-[var(--text-2)]">{selected === 3 ? t('complianceScenario') : t('quickSetupBody')}</p><div className="mt-7 flex flex-wrap gap-3"><a href={path.next} className={`${control} bg-[var(--signal)] font-bold text-black`}>{t(path.nextLabel)} ↗</a><a href={path.demo} className={control}>{t('journeyExample')}</a><button className={control} onClick={() => setStage(1)}>{t('journeyBack')}</button></div></>}
        </div>
      </div>
    </div>
  </section>
}
