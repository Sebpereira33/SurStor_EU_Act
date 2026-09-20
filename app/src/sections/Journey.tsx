import { useState } from 'react'

const paths = [
  { name: 'Developers', goal: 'Keep the context behind your code.', scenario: 'An AI assistant produces a patch. Save its output and provenance, then compare it with the next revision.', steps: ['Store drafts and code outputs in a session.', 'Retrieve the agent, model and timestamp behind each artifact.', 'Compare text versions with surstor_diff.'], demo: '#demo', action: 'Explore a sample session', next: '#quickstart', nextLabel: 'Connect your local node' },
  { name: 'AI agent builders', goal: 'Follow the work between agents.', scenario: 'A research agent hands a brief to a writing agent. Keep their outputs in one traceable session.', steps: ['Capture each agent’s output with an agent ID.', 'Follow the session’s sequence of linked records.', 'Retrieve earlier artifacts for the next step in your workflow.'], demo: '#demo', action: 'Follow the sample handoff', next: '#quickstart', nextLabel: 'Connect your local node' },
  { name: 'Researchers', goal: 'Find the work you remember.', scenario: 'You remember a conclusion, but not the wording or the session. Search stored artifacts by meaning and recover the original.', steps: ['Save your analyses and model outputs.', 'Search your local node with a natural-language question.', 'Retrieve the full artifact with its recorded provenance.'], demo: '#search-demo', action: 'Explore search examples', next: '#quickstart', nextLabel: 'Set up local search' },
  { name: 'Compliance teams', goal: 'Check the integrity of a record.', scenario: 'A reviewer needs to inspect an AI workflow. Export its session and check the records independently.', steps: ['Capture artifacts with provenance metadata.', 'Verify content bindings, session links and signatures.', 'Export a session bundle for offline verification.'], demo: '#integrity-demo', action: 'Try the integrity exercise', next: '#contact', nextLabel: 'Discuss your requirements' },
]
const control = 'rounded-lg border border-[var(--line-strong)] px-4 py-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)] hover:border-[var(--signal)]'

export default function Journey() {
  const [selected, setSelected] = useState(0)
  const [stage, setStage] = useState(0)
  const path = paths[selected]
  return <section id="journey" className="hairline-t scroll-mt-24 py-24 sm:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Find your path / Guided tour</p>
      <h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">What will you build with SurStor?</h2>
      <p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">Choose your workflow. See how it fits, explore an example, and find your next step.</p>
      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--text-2)]" aria-label="Journey progress">
        {['Choose your use case', 'Explore the workflow', 'Take the next step'].map((label, i) => <li key={label} aria-current={stage === i ? 'step' : undefined} className={stage === i ? 'font-bold text-[var(--signal)]' : ''}>{i + 1}. {label}</li>)}
      </ol>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.6fr]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="Choose your use case">
          {paths.map((item, i) => <button key={item.name} aria-pressed={selected === i} className={`${control} text-left ${selected === i ? 'border-[var(--signal)] bg-[var(--surface-2)]' : 'bg-[var(--surface)]'}`} onClick={() => { setSelected(i); setStage(0) }}><span className="block text-lg font-bold">{item.name}</span><span className="mt-1 block text-[var(--text-2)]">{item.goal}</span></button>)}
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8" aria-live="polite">
          <p className="font-mono2 text-xs uppercase tracking-wider text-[var(--signal)]">{path.name} / {stage === 0 ? 'Your use case' : stage === 1 ? 'Your workflow' : 'Your next step'}</p>
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">{path.goal}</h3>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--text-2)]">{path.scenario}</p>
          {stage === 0 && <button className={`${control} mt-7 bg-[var(--signal)] font-bold text-black`} onClick={() => setStage(1)}>Show my workflow →</button>}
          {stage === 1 && <><ol className="mt-6 space-y-4">{path.steps.map((step, i) => <li key={step} className="flex gap-3"><span className="font-mono2 text-[var(--signal)]">0{i + 1}</span><span>{step}</span></li>)}</ol><div className="mt-7 flex flex-wrap gap-3"><a href={path.demo} className={`${control} bg-[var(--signal)] font-bold text-black`}>{path.action} ↗</a><button className={control} onClick={() => setStage(2)}>How do I get started? →</button><button className={control} onClick={() => setStage(0)}>Back</button></div><p className="mt-4 text-sm text-[var(--text-2)]">The demos use illustrative data. <a href="#journey" className="underline underline-offset-4">Return to your journey</a> at any time.</p></>}
          {stage === 2 && <><p className="mt-6 text-[var(--text-2)]">{selected === 3 ? 'Tell us about your review process and the records you need. Integrity verification supports review; it does not establish regulatory compliance on its own.' : 'Start with the source-based local node and an MCP-compatible client. You will need Java 21+, Maven and the Covia build dependencies.'}</p><div className="mt-7 flex flex-wrap gap-3"><a href={path.next} className={`${control} bg-[var(--signal)] font-bold text-black`}>{path.nextLabel} ↗</a><a href={path.demo} className={control}>Try the example first</a><button className={control} onClick={() => setStage(1)}>Back to workflow</button></div></>}
        </div>
      </div>
    </div>
  </section>
}
