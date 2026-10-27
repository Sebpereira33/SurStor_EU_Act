import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const commands = 'git clone https://github.com/SurStor/SurStor_Memory.git\ncd SurStor_Memory\ndocker compose -f compose.registry.yaml pull\ndocker compose -f compose.registry.yaml up -d\ndocker compose -f compose.registry.yaml ps'
const config = '{\n  "mcpServers": {\n    "surstor": {\n      "type": "http",\n      "url": "http://127.0.0.1:8484/mcp"\n    }\n  }\n}'
const stages = [
  { label: 'Start Docker', title: 'Start your local node', code: commands, copy: 'Copy Docker commands', note: 'Run each command only after the previous one succeeds. In an existing, updated checkout, skip the clone and cd lines.', result: 'Example checkpoint: the container reports healthy and publishes 127.0.0.1:8484.' },
  { label: 'Connect client', title: 'Give your client a memory connection', code: config, copy: 'Copy MCP configuration', note: 'Adapt this example to your MCP client’s configuration format. Keep the client on the host and the node bound to 127.0.0.1:8484.', result: 'Example checkpoint: your client lists the SurStor tools. Your local model still runs separately.' },
  { label: 'Recall a record', title: 'Try one complete memory cycle', code: 'Save this note in SurStor: "Start with a small local pilot."\nKeep the returned record ID.\nRetrieve that record and verify it.', copy: 'Copy example prompt', note: 'This is a natural-language prompt for your connected AI client, not a terminal command. After saving, restart the container and retrieve the same record ID again.', result: 'Illustrative result: the original note is retrieved with its model and session details. Verification checks record integrity, not whether the note is true.' },
]
export default function DockerWalkthrough() {
  const [step, setStep] = useState(0)
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState('')
  const stage = stages[step]
  function select(index: number) { setStep(index); setShown(false); setCopied('') }
  async function copy() {
    try { await navigator.clipboard.writeText(stage.code); setCopied('Copied to clipboard.') }
    catch { setCopied('Select the text below and copy it manually.') }
  }
  return <div className="lm-config lm-walkthrough">
    <div className="lm-console-bar"><span>DOCKER / GUIDED SETUP</span><span>PREVIEW</span></div>
    <div className="lm-walkthrough-steps" role="group" aria-label="Installation steps">{stages.map((item, index) => <button key={item.label} aria-pressed={step === index} onClick={() => select(index)}><span>0{index + 1}</span>{item.label}</button>)}</div>
    <div className="lm-walkthrough-heading"><h3>{stage.title}</h3><p>{stage.note}</p><button onClick={copy}>{stage.copy}</button><p role="status">{copied}</p></div>
    <pre><code>{stage.code}</code></pre>
    <div className="lm-walkthrough-preview"><p className="lm-footnote">Interactive guide only. This page does not run commands, connect to Docker, or check your machine.</p><button onClick={() => setShown(!shown)} aria-expanded={shown} aria-controls="docker-example">{shown ? 'Hide example checkpoint' : 'Show example checkpoint'}</button><div id="docker-example" hidden={!shown}><p className="lm-step-enter"><Check size={16}/>{stage.result}</p></div></div>
    <div className="lm-journey-bottom"><span>STEP {step + 1} OF 3</span><button onClick={() => select((step + 1) % 3)}>{step === 2 ? 'Back to setup' : 'Next step'}<ArrowRight size={16}/></button></div>
    <div className="lm-config-note"><p>Records persist in a Docker volume. Use <code>docker compose -f compose.registry.yaml stop</code> to stop the node. Keep the same Compose project; <code>down -v</code> deletes saved data. The node trusts local callers and has no user authentication.</p></div>
  </div>
}
