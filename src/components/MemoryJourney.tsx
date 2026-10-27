import { useState } from 'react'
import { ArrowRight, Database, Check, Terminal } from 'lucide-react'

export default function MemoryJourney() {
  const [step, setStep] = useState(0)
  const labels = ['Save with Model A', 'Switch to Model B', 'Recall your original']
  return <div className="lm-console lm-journey">
    <div className="lm-console-bar"><span>ONE MEMORY / TWO MODELS</span><span>INTERACTIVE EXAMPLE</span></div>
    <div className="lm-console-body">
      <div className="lm-journey-steps" role="group" aria-label="Explore switching models">{labels.map((label, index) => <button key={label} aria-pressed={step === index} onClick={() => setStep(index)}><span>0{index + 1}</span>{label}</button>)}</div>
      <div className="lm-journey-route"><span className={step === 0 ? 'is-active' : ''}><Terminal size={18}/>Model A</span><span className="lm-journey-wire" key={step} aria-hidden="true"><ArrowRight size={18}/></span><span className="lm-journey-store"><Database size={22}/>SurStor</span><span className="lm-journey-wire" aria-hidden="true"><ArrowRight size={18}/></span><span className={step > 0 ? 'is-active' : ''}><Terminal size={18}/>Model B</span></div>
      <div className="lm-journey-record"><small>RECORD 001 · MODEL A · PROJECT PLANNING</small><h3>Start with a small local pilot.</h3><p>Keep project notes on this machine. Test the workflow with one team before expanding.</p><span><Check size={14}/> Original saved output · unchanged</span></div>
      <div className="lm-journey-context" aria-live="polite" aria-atomic="true"><div key={step} className="lm-step-enter"><strong>{['Your first result has a home.', 'A different model. The same saved history.', 'Bring the original into your next session.'][step]}</strong><p>{['In this example, the client saves Model A’s output with its model and session details.', 'Model B is now selected. Record 001 stays intact; a new response can be saved as its own record.', 'Your client retrieves Record 001 and supplies it to Model B as context. SurStor does not transfer unsaved chats automatically.'][step]}</p>{step === 2 && <span className="lm-recalled">Record 001 → Model B context</span>}</div></div>
      <div className="lm-journey-bottom"><span>0{step + 1} / 03</span><button onClick={() => setStep((step + 1) % 3)}>{step === 2 ? 'Replay example' : 'Next step'}<ArrowRight size={16}/></button></div>
      <p className="lm-footnote">Simulated workflow. No model is running and nothing is saved by this demo.</p>
    </div>
  </div>
}
