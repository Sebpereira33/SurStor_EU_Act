import { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n'

const copy = {
  en: { title: 'Watch an output become a record.', note: 'Interactive simulation · sample data only, no node connected.', stages: ['Create', 'Store', 'Verify'], start: 'Run sample workflow', replay: 'Replay workflow', skip: 'Show result', ready: 'Ready when you are.', writing: 'Creating a sample agent output…', storing: 'Saving the sample to a session…', done: 'Simulation complete: one sample record stored and verified.', stored: 'Sample record stored', verified: 'Sample integrity check passed' },
  es: { title: 'Mira cómo un resultado se convierte en un registro.', note: 'Simulación interactiva · datos de ejemplo, sin nodo conectado.', stages: ['Crear', 'Guardar', 'Verificar'], start: 'Iniciar flujo de ejemplo', replay: 'Repetir flujo', skip: 'Mostrar resultado', ready: 'Listo cuando quieras.', writing: 'Creando un resultado de agente de ejemplo…', storing: 'Guardando el ejemplo en una sesión…', done: 'Simulación completada: un registro de ejemplo guardado y verificado.', stored: 'Registro de ejemplo guardado', verified: 'Comprobación de integridad simulada correcta' },
  fr: { title: 'Voyez un résultat devenir un enregistrement.', note: 'Simulation interactive · données fictives, aucun nœud connecté.', stages: ['Créer', 'Enregistrer', 'Vérifier'], start: 'Lancer le flux d’exemple', replay: 'Rejouer le flux', skip: 'Afficher le résultat', ready: 'Prêt quand vous le souhaitez.', writing: 'Création d’un résultat d’agent fictif…', storing: 'Enregistrement de l’exemple dans une session…', done: 'Simulation terminée : un enregistrement fictif conservé et vérifié.', stored: 'Exemple enregistré', verified: 'Contrôle d’intégrité simulé réussi' },
}

export default function InteractiveWorkflow() {
  const { language, t } = useLanguage()
  const c = copy[language]
  const words = t('recordProposalContent').split(' ')
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => { setStep(0); setCount(0) }, [language])
  useEffect(() => {
    if (!step || step === 3) return
    if (reduced) { setStep(3); return }
    const timer = window.setTimeout(() => {
      if (step === 1 && count < words.length) setCount(count + 1)
      else setStep(step + 1)
    }, step === 1 && count < words.length ? 65 : 900)
    return () => window.clearTimeout(timer)
  }, [step, count, words.length, reduced])
  const status = step === 0 ? c.ready : step === 1 ? c.writing : step === 2 ? c.storing : c.done
  const button = 'rounded-md border border-[var(--signal)] px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]'
  return <div className="mt-10 rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] p-5 sm:p-8">
    <h3 className="font-display text-2xl font-bold">{c.title}</h3>
    <p className="mt-2 text-sm text-[var(--text-2)]">{c.note}</p>
    <ol className="my-6 grid grid-cols-3 gap-2">{c.stages.map((label, index) => <li key={label} className="rounded-md border p-3 text-sm" style={{ borderColor: step > index ? 'var(--signal)' : 'var(--line)', color: step > index ? 'var(--signal)' : 'var(--text-2)' }}><span className="block font-mono2 text-xs">0{index + 1} {step > index + 1 || step === 3 ? '✓' : ''}</span>{label}</li>)}</ol>
    <div className="min-h-40 rounded-lg bg-[var(--bg)] p-5 leading-relaxed">
      <p aria-hidden="true">{step === 0 ? '—' : step >= 2 ? words.join(' ') : words.slice(0, count).join(' ')}</p>
      <p className="sr-only">{step ? words.join(' ') : c.ready}</p>
      {step >= 2 && <p className="mt-4 text-sm text-[var(--signal)]">✓ {c.stored} · demo-002</p>}
      {step === 3 && <p className="mt-2 text-sm text-[var(--pass)]">✓ {c.verified}</p>}
    </div>
    <p role="status" className="mt-4 min-h-12 text-sm text-[var(--text-2)]">{status}</p>
    <div className="flex flex-wrap gap-3"><button className={`${button} bg-[var(--signal)] text-[#0c1626] disabled:opacity-50`} disabled={step === 1 || step === 2} onClick={() => { setCount(0); setStep(reduced ? 3 : 1) }}>{step === 3 ? c.replay : c.start}</button>{step > 0 && step < 3 && <button className={button} onClick={() => setStep(3)}>{c.skip}</button>}</div>
  </div>
}
