import { useState } from 'react'

const steps = [
  { title: 'Build and start your node', detail: 'From the SurStor source checkout, with Java 21+, Maven and the required Covia artifacts installed locally:', code: 'mvn package\njava -jar surstor-node/target/surstor-node.jar start --config config/surstor.toml' },
  { title: 'Connect an MCP client', detail: 'Use a client that supports streamable HTTP. This is an example MCP configuration; the configuration location depends on your client.', code: JSON.stringify({ mcpServers: { surstor: { type: 'http', url: 'http://127.0.0.1:8484/mcp' } } }, null, 2) },
  { title: 'Store your first artifact', detail: 'Call surstor_store from the connected client with these arguments. Save the returned id for the next step.', code: JSON.stringify({ content: 'The launch proposal is due on 25 September.', sessionId: 'first-session' }, null, 2) },
  { title: 'Retrieve and verify', detail: 'Call surstor_retrieve with the returned id. Then call surstor_verify with the same id and deep: true to check the session chain as well.', code: '// surstor_retrieve arguments\n{ "id": "<returned-id>" }\n\n// surstor_verify arguments\n{ "id": "<returned-id>", "deep": true }' },
]

function Step({ step, index }: { step: typeof steps[number]; index: number }) {
  const [status, setStatus] = useState('')
  async function copy() {
    try { await navigator.clipboard.writeText(step.code); setStatus('Copied') }
    catch { setStatus('Select the code below to copy it manually.') }
  }
  return <article className="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold"><span className="mr-3 font-mono2 text-sm text-[var(--signal)]">0{index + 1}</span>{step.title}</h3><button onClick={copy} aria-label={`Copy ${step.title.toLowerCase()}`} className="rounded border border-[var(--line-strong)] px-3 py-1 text-sm hover:border-[var(--signal)] focus-visible:outline focus-visible:outline-[var(--signal)]">Copy</button></div><p className="mt-4 text-sm leading-relaxed text-[var(--text-2)]">{step.detail}</p><pre className="mt-5 overflow-x-auto rounded-lg bg-[var(--surface-2)] p-4 text-xs leading-6"><code>{step.code}</code></pre><p role="status" className="mt-2 min-h-5 text-xs text-[var(--signal)]">{status}</p></article>
}

export default function Quickstart() {
  return <section id="quickstart" className="hairline-t scroll-mt-24 bg-[var(--surface)] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">Build with SurStor / Developer quickstart</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">Your first verifiable artifact.</h2><p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">Connect your AI workflow to the current local node. Store an output, retrieve its provenance, and verify the record.</p><div className="mt-7 rounded-lg border border-[var(--line-strong)] p-5 text-sm leading-relaxed text-[var(--text-2)]"><strong className="text-white">Local developer setup.</strong> Requires a SurStor source checkout. Build the required Covia dependencies from source first, following the checkout’s INTEGRATION_NOTES.md; they are not available from Maven Central. The node trusts local callers and must remain bound to 127.0.0.1.</div><div className="mt-8 grid gap-5 lg:grid-cols-2">{steps.map((step, index) => <Step key={step.title} step={step} index={index} />)}</div><p className="mt-6 text-sm text-[var(--text-2)]">Next: use <code>surstor_search</code> to find artifacts by meaning, or <code>surstor_export</code> to create a portable session bundle for offline verification.</p></div><div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">← Back to your guided journey</a></div></section>
}
