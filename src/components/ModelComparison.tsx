import { useEffect, useState } from 'react'
import { Check, Terminal } from 'lucide-react'

const examples = [
  { task: 'Draft a launch plan', prompt: 'Create a short launch plan for a local-first notes app.', outputs: [
    { model: 'Local model A', version: 'Sample version 1', id: 'plan-001', text: 'Start with a small pilot. Invite ten users, collect feedback on search and editing, then fix the most common issues before a wider release.', focus: 'A staged rollout with user feedback.' },
    { model: 'Local model B', version: 'Sample version 2', id: 'plan-002', text: 'Prepare a walkthrough, a setup guide, and a sample notebook. Launch to a local-AI community, then use support questions to prioritize the next update.', focus: 'Launch materials and community onboarding.' },
  ] },
  { task: 'Explain a technical choice', prompt: 'Explain why a personal notes app might use a local database.', outputs: [
    { model: 'Local model A', version: 'Sample version 1', id: 'notes-001', text: 'A local database keeps notes available without an internet connection. Reading and writing happen on the device, so everyday use does not require a hosted service.', focus: 'Offline access and independence from a service.' },
    { model: 'Local model B', version: 'Sample version 2', id: 'notes-002', text: 'Local storage gives the user direct control over the files. The application still needs a backup strategy, and synchronization between devices must be designed separately.', focus: 'Control, backup, and synchronization trade-offs.' },
  ] },
]

export default function ModelComparison() {
  const [task, setTask] = useState(0)
  const [filter, setFilter] = useState('all')
  const [visibleWords, setVisibleWords] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const example = examples[task]
  const maxWords = Math.max(...example.outputs.map(output => output.text.split(' ').length))
  const streaming = visibleWords !== null && visibleWords < maxWords && !reducedMotion
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    function update() { setReducedMotion(media.matches); if (media.matches) setVisibleWords(null) }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (!streaming) return
    const timer = window.setInterval(() => setVisibleWords(count => count === null ? null : count + 1), 65)
    return () => window.clearInterval(timer)
  }, [streaming])
  function changeTask(value: number) { setTask(value); setVisibleWords(null) }
  function replay() { setFilter('all'); setVisibleWords(0) }

  return <section id="local-demo" className="lm-wrap lm-section lm-compare">
    <p className="lm-eyebrow">02 / DIFFERENT MODELS. ORIGINAL RESULTS.</p>
    <div className="lm-section-heading"><h2>See who produced what.<br /><em>Compare without the guesswork.</em></h2><p>Keep each model’s output attached to its source. Review the originals together, spot different approaches, and decide what to use next.</p></div>
    <div className="lm-compare-controls"><label htmlFor="comparison-task">Sample task<select id="comparison-task" value={task} onChange={event => changeTask(Number(event.target.value))}>{examples.map((item, index) => <option value={index} key={item.task}>{item.task}</option>)}</select></label><div role="group" aria-label="Filter outputs by model">{[['all', 'Compare both'], ['Local model A', 'Model A'], ['Local model B', 'Model B']].map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div></div>
    <div className="lm-shared-prompt"><span className="lm-eyebrow">SAME PROMPT / TWO SAVED OUTPUTS</span><p>{example.prompt}</p></div>
    <div className="lm-stream-controls"><div><span className="lm-eyebrow">SAMPLE PLAYBACK</span><p role="status">{reducedMotion ? 'Reduced motion enabled. Both samples are shown in full.' : streaming ? 'Playing preset responses. No live model is connected.' : 'Both originals are ready to compare. Playback illustrates how outputs appear.'}</p></div><div><button onClick={replay} disabled={reducedMotion || streaming}>Replay sample responses</button><button onClick={() => { setVisibleWords(null); setFilter('all') }} disabled={!streaming}>Show both instantly</button></div></div>
    <div className="lm-output-grid">{example.outputs.filter(output => filter === 'all' || output.model === filter).map(output => <article key={output.id}><div className="lm-output-head"><span><Terminal size={18}/>{output.model}</span><span>{output.version}</span></div><p className="lm-output-text"><span className="sr-only">{output.text}</span><span aria-hidden="true">{streaming ? output.text.split(' ').slice(0, visibleWords ?? 0).join(' ') : output.text}{streaming && (visibleWords ?? 0) < output.text.split(' ').length && <span className="lm-stream-caret" />}</span></p><div className="lm-output-focus"><small>APPROACH IN THIS EXAMPLE</small><p>{output.focus}</p></div><div className="lm-output-meta"><code>{output.id}</code><span><Check size={14}/> Original retained</span></div></article>)}</div>
    <p className="lm-footnote">Preset examples, not live AI responses or model benchmarks. Playback speed does not represent model performance. Filters change this view only; both saved examples stay intact. In your workflow, model labels come from your client’s recorded metadata.</p>
  </section>
}
