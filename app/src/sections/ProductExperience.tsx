import { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n'

const records = [
  { id: 'demo-001', title: 'recordBrief', type: 'recordBriefType', agent: 'research-agent', model: 'Sample model A', time: '09:00:00 UTC', content: 'recordBriefContent' },
  { id: 'demo-002', title: 'recordProposal', type: 'recordProposalType', agent: 'writing-agent', model: 'Sample model B', time: '09:02:18 UTC', content: 'recordProposalContent' },
  { id: 'demo-003', title: 'recordReview', type: 'recordReviewType', agent: 'review-agent', model: 'Sample model A', time: '09:04:32 UTC', content: 'recordReviewContent' },
]
const queries = [
  { label: 'queryDue', index: 0, why: 'searchWhy1' },
  { label: 'queryBudget', index: 1, why: 'searchWhy2' },
  { label: 'queryApproval', index: 2, why: 'searchWhy3' },
]
const button = 'rounded border border-[var(--line-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--signal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]'
const panel = 'rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8'

export default function ProductExperience() {
  const { t } = useLanguage()
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState(0)
  const [content, setContent] = useState(t(records[0].content))
  const [result, setResult] = useState<'valid' | 'changed' | null>(null)
  const [exported, setExported] = useState(false)
  const record = records[selected]

  useEffect(() => { setContent(t(records[selected].content)); setResult(null) }, [t, selected])

  function downloadSample() {
    const sample = records.map(item => ({ ...item, title: t(item.title), type: t(item.type), content: t(item.content) }))
    const blob = new Blob([JSON.stringify({ format: 'surstor-website-demo/1', notice: t('demoNotice'), session: 'launch-planning', records: sample }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'surstor-sample-session.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setExported(true)
  }

  return <>
    <section id="demo" className="hairline-t scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('demoEyebrow')}</p>
        <h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('demoTitle')}</h2>
        <p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">{t('demoBody')}</p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm"><a href="#search-demo" className={button}>{t('demoSearch')}</a><a href="#integrity-demo" className={button}>{t('demoIntegrity')}</a><a href="#quickstart" className={button}>{t('demoConnect')}</a></div>
        <div className="mt-10 overflow-hidden rounded-xl border border-[var(--line-strong)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-2)] p-5"><div><p className="font-mono2 text-xs text-[var(--signal)]">{t('demoSession')}</p><p className="mt-1 font-semibold">{t('demoSessionName')}</p></div><button className={button} onClick={downloadSample}>{t('demoDownload')}</button></div>
          <div className="grid md:grid-cols-[0.8fr_1.5fr]"><div className="flex flex-col gap-3 bg-[var(--surface)] p-5" aria-label={t('demoSession')}>
            {records.map((item, i) => <button key={item.id} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`${button} text-left ${selected === i ? 'border-[var(--signal)] bg-[var(--surface-2)]' : ''}`}><span className="font-mono2 text-xs text-[var(--text-2)]">0{i + 1} / {t(item.type)}</span><span className="mt-2 block text-lg font-semibold">{t(item.title)}</span></button>)}
          </div><div className="min-w-0 p-6 sm:p-8" aria-live="polite"><p className="font-mono2 text-xs text-[var(--signal)]">{record.id}</p><h3 className="mt-3 text-2xl font-bold">{t(record.title)}</h3><p className="mt-5 rounded-lg bg-[var(--surface-2)] p-5 leading-relaxed text-[var(--text-2)]">{t(record.content)}</p><dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">{[[t('demoAgent'), record.agent], [t('demoModel'), record.model], [t('demoCaptured'), record.time], [t('demoPrevious'), selected ? records[selected - 1].id : t('demoStart')]].map(([key, value]) => <div key={key}><dt className="text-[var(--text-2)]">{key}</dt><dd className="mt-1 font-mono2 text-xs">{value}</dd></div>)}</dl></div></div>
        </div>
        <p className="mt-4 text-sm text-[var(--text-2)]" role="status">{exported ? t('demoDownloaded') : ''}{t('demoNotice')}</p>
      </div><div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">{t('backJourney')}</a></div>
    </section>

    <section id="search-demo" className="hairline-t scroll-mt-24 bg-[var(--surface)] py-24 sm:py-32"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2"><div><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('searchEyebrow')}</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('searchTitleA')}<br />{t('searchTitleB')}</h2><p className="mt-5 text-lg leading-relaxed text-[var(--text-2)]">{t('searchBody')}</p><p className="mt-6 text-sm leading-relaxed text-[var(--text-2)]">{t('searchLocal')}</p></div><div className={panel}><p className="font-mono2 text-xs text-[var(--signal)]">{t('searchChoose')}</p><div className="mt-5 flex flex-col gap-3">{queries.map((item, i) => <button key={item.label} className={`${button} text-left ${query === i ? 'border-[var(--signal)]' : ''}`} aria-pressed={query === i} onClick={() => setQuery(i)}>{t(item.label)}</button>)}</div><div className="mt-6 border-t border-[var(--line)] pt-6" aria-live="polite"><p className="text-sm text-[var(--text-2)]">{t('searchMatch')}</p><h3 className="mt-2 text-xl font-bold">{t(records[queries[query].index].title)}</h3><p className="mt-3 text-[var(--text-2)]">{t(records[queries[query].index].content)}</p><p className="mt-4 text-sm text-[var(--signal)]">{t(queries[query].why)}</p></div><p className="mt-6 text-xs leading-relaxed text-[var(--text-2)]">{t('searchNotice')}</p></div></div><div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">{t('backJourney')}</a></div></section>

    <section id="integrity-demo" className="hairline-t scroll-mt-24 py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('integrityEyebrow')}</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('integrityTitleA')}<br />{t('integrityTitleB')}</h2><p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">{t('integrityBody')}</p><div className="mt-10 grid gap-6 lg:grid-cols-2"><div className={panel}><label htmlFor="sample-record" className="font-semibold">{t('integrityLabel')}</label><textarea id="sample-record" className="mt-4 min-h-44 w-full rounded border border-[var(--line-strong)] bg-[var(--bg)] p-4 text-base leading-relaxed focus:outline focus:outline-[var(--signal)]" value={content} onChange={e => { setContent(e.target.value); setResult(null) }} /><div className="mt-4 flex flex-wrap gap-3"><button className={`${button} bg-[var(--signal)] font-bold text-black`} onClick={() => setResult(content === t(records[0].content) ? 'valid' : 'changed')}>{t('integrityCheck')}</button><button className={button} onClick={() => { setContent(`${t(records[0].content)} [changed]`); setResult(null) }}>{t('integrityChanged')}</button><button className={button} onClick={() => { setContent(t(records[0].content)); setResult(null) }}>{t('integrityReset')}</button></div><div role="status" className="mt-5 min-h-12 font-semibold">{result === 'valid' ? t('integrityValid') : result === 'changed' ? t('integrityDetected') : t('integrityReady')}</div></div><div className={panel}><h3 className="text-2xl font-bold">{t('integrityHow')}</h3><ol className="mt-6 space-y-5 text-[var(--text-2)]"><li><strong className="text-white">01 / {t('integrityBinding')}</strong> Check that stored content matches its content-addressed reference.</li><li><strong className="text-white">02 / {t('integrityContinuity')}</strong> Follow the links between events to detect gaps or broken references.</li><li><strong className="text-white">03 / {t('integritySignature')}</strong> Verify the record’s Ed25519 signature.</li><li><strong className="text-white">04 / {t('integritySchedule')}</strong> Check the cited schedule and estimated-cost calculation.</li></ol><p className="mt-7 border-t border-[var(--line)] pt-5 text-sm text-[var(--text-2)]">{t('integrityFootnote')}</p></div></div></div><div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">{t('backJourney')}</a></div></section>
  </>
}
