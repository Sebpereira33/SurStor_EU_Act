import { useState } from 'react'

const records = [
  { id: 'demo-001', title: 'Client brief', type: 'Source note', agent: 'research-agent', model: 'Sample model A', time: '09:00:00 UTC', content: 'The client needs the launch proposal by Friday, 25 September. The approved project budget is $12,000.' },
  { id: 'demo-002', title: 'Launch proposal', type: 'AI draft', agent: 'writing-agent', model: 'Sample model B', time: '09:02:18 UTC', content: 'Launch in two phases: an internal pilot followed by a public release. Submit the proposal on 25 September and keep delivery within the approved $12,000 budget.' },
  { id: 'demo-003', title: 'Review decision', type: 'Review note', agent: 'review-agent', model: 'Sample model A', time: '09:04:32 UTC', content: 'The proposal is ready for human review. The public release still needs approval from the client before it can proceed.' },
]
const queries = [
  { label: 'When is the proposal due?', index: 0, why: 'A question about timing leads back to the deadline in the original brief.' },
  { label: 'What is the spending limit?', index: 1, why: '“Spending limit” connects to the approved budget, even without those exact words.' },
  { label: 'Who needs to approve the release?', index: 2, why: 'The review note captures the remaining approval dependency.' },
]
const button = 'rounded border border-[var(--line-strong)] px-4 py-2 text-sm transition-colors hover:border-[var(--signal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]'
const panel = 'rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8'

export default function ProductExperience() {
  const [selected, setSelected] = useState(0)
  const [query, setQuery] = useState(0)
  const [content, setContent] = useState(records[0].content)
  const [result, setResult] = useState<'valid' | 'changed' | null>(null)
  const [exported, setExported] = useState(false)
  const record = records[selected]

  function downloadSample() {
    const blob = new Blob([JSON.stringify({ format: 'surstor-website-demo/1', notice: 'Illustrative sample data only. Not a signed SurStor export or verifiable production bundle.', session: 'launch-planning', records }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'surstor-sample-session.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setExported(true)
  }

  return (
    <>
      <section id="demo" className="hairline-t scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Explore SurStor / Product tour</p>
          <h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">Every output has a story.</h2>
          <p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">Follow a brief through an AI workflow. Open a record to see what was saved, who produced it, and where it belongs.</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href="#search-demo" className={button}>Try search ↗</a>
            <a href="#integrity-demo" className={button}>Test integrity ↗</a>
            <a href="#quickstart" className={button}>Connect your node ↗</a>
          </div>
          <div className="mt-10 rounded-xl border border-[var(--line-strong)] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-2)] p-5">
              <div><p className="font-mono2 text-xs text-[var(--signal)]">SAMPLE SESSION</p><p className="mt-1 font-semibold">Launch planning / 3 records</p></div>
              <button className={button} onClick={downloadSample}>Download sample JSON ↓</button>
            </div>
            <div className="grid md:grid-cols-[0.8fr_1.5fr]">
              <div className="flex flex-col gap-3 bg-[var(--surface)] p-5" aria-label="Sample records">
                {records.map((item, i) => <button key={item.id} aria-pressed={selected === i} onClick={() => setSelected(i)} className={`${button} text-left ${selected === i ? 'border-[var(--signal)] bg-[var(--surface-2)]' : ''}`}>
                  <span className="font-mono2 text-xs text-[var(--text-2)]">0{i + 1} / {item.type}</span><span className="mt-2 block text-lg font-semibold">{item.title}</span>
                </button>)}
              </div>
              <div className="min-w-0 p-6 sm:p-8" aria-live="polite">
                <p className="font-mono2 text-xs text-[var(--signal)]">{record.id}</p>
                <h3 className="mt-3 text-2xl font-bold">{record.title}</h3>
                <p className="mt-5 rounded-lg bg-[var(--surface-2)] p-5 leading-relaxed text-[var(--text-2)]">{record.content}</p>
                <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {[['Agent', record.agent], ['Model', record.model], ['Captured · 18 Sep 2026', record.time], ['Previous record', selected ? records[selected - 1].id : 'Session start']].map(([key, value]) => <div key={key}><dt className="text-[var(--text-2)]">{key}</dt><dd className="mt-1 font-mono2 text-xs">{value}</dd></div>)}
                </dl>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--text-2)]" role="status">{exported ? 'Sample downloaded. ' : ''}Illustrative data, kept in your browser. This tour is not connected to a node; the download is not a signed SurStor bundle.</p>
        </div>
      <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">← Back to your guided journey</a></div></section>

      <section id="search-demo" className="hairline-t scroll-mt-24 bg-[var(--surface)] py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Find it again / Semantic search</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">Remember the meaning.<br />Find the work.</h2><p className="mt-5 text-lg leading-relaxed text-[var(--text-2)]">Your wording can change. Your work is still there. SurStor’s local node searches stored artifacts by meaning and returns records you can retrieve in full.</p><p className="mt-6 text-sm leading-relaxed text-[var(--text-2)]">Embeddings and search run on the node using a bundled model. No external embedding API is needed. The search index can be rebuilt from the stored records.</p></div>
          <div className={panel}><p className="font-mono2 text-xs text-[var(--signal)]">CHOOSE AN EXAMPLE QUESTION</p><div className="mt-5 flex flex-col gap-3">{queries.map((item, i) => <button key={item.label} className={`${button} text-left ${query === i ? 'border-[var(--signal)]' : ''}`} aria-pressed={query === i} onClick={() => setQuery(i)}>{item.label}</button>)}</div><div className="mt-6 border-t border-[var(--line)] pt-6" aria-live="polite"><p className="text-sm text-[var(--text-2)]">Illustrative match</p><h3 className="mt-2 text-xl font-bold">{records[queries[query].index].title}</h3><p className="mt-3 text-[var(--text-2)]">{records[queries[query].index].content}</p><p className="mt-4 text-sm text-[var(--signal)]">{queries[query].why}</p></div><p className="mt-6 text-xs leading-relaxed text-[var(--text-2)]">These are curated examples, not live semantic-search results. Connect a local node to search your own artifacts.</p></div>
        </div>
      <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">← Back to your guided journey</a></div></section>

      <section id="integrity-demo" className="hairline-t scroll-mt-24 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Trust the record / Integrity playground</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">Change the record.<br />See the difference.</h2><p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">Edit the sample below, then check it against its original. Even a small change leaves a different record.</p><div className="mt-10 grid gap-6 lg:grid-cols-2"><div className={panel}><label htmlFor="sample-record" className="font-semibold">Editable sample record</label><textarea id="sample-record" className="mt-4 min-h-44 w-full rounded border border-[var(--line-strong)] bg-[var(--bg)] p-4 text-base leading-relaxed focus:outline focus:outline-[var(--signal)]" value={content} onChange={e => { setContent(e.target.value); setResult(null) }} /><div className="mt-4 flex flex-wrap gap-3"><button className={`${button} bg-[var(--signal)] font-bold text-black`} onClick={() => setResult(content === records[0].content ? 'valid' : 'changed')}>Check record</button><button className={button} onClick={() => { setContent(records[0].content.replace('$12,000', '$20,000')); setResult(null) }}>Try a changed budget</button><button className={button} onClick={() => { setContent(records[0].content); setResult(null) }}>Reset</button></div><div role="status" className="mt-5 min-h-12 font-semibold">{result === 'valid' ? '✓ Unchanged — the sample matches the original.' : result === 'changed' ? '✕ Change detected — the sample no longer matches.' : 'Ready. Check the original or make an edit first.'}</div></div><div className={panel}><h3 className="text-2xl font-bold">How the real node verifies work</h3><ol className="mt-6 space-y-5 text-[var(--text-2)]"><li><strong className="text-white">01 / Content binding.</strong> Check that stored content matches its content-addressed reference.</li><li><strong className="text-white">02 / Session continuity.</strong> Follow the links between events to detect gaps or broken references.</li><li><strong className="text-white">03 / Node signature.</strong> Verify the record’s Ed25519 signature.</li><li><strong className="text-white">04 / Cost schedule.</strong> Check the cited schedule and estimated-cost calculation.</li></ol><p className="mt-7 border-t border-[var(--line)] pt-5 text-sm text-[var(--text-2)]">This browser exercise compares text only. Real SurStor verification uses hashes, session links and signatures; it establishes integrity, not whether the original content is true.</p></div></div></div>
      <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">← Back to your guided journey</a></div></section>
    </>
  )
}
