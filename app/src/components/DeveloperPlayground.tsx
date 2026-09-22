import { useState } from 'react'
import { useLanguage } from '@/i18n'

const copy = {
  en: { title: 'Explore the calls.', note: 'Interactive examples only. Nothing is sent to a node. Responses are simplified illustrations, not an API schema.', operations: ['Store', 'Retrieve', 'Verify'], descriptions: ['Save an output in a session. Keep the returned record ID.', 'Use the saved record ID to recover its content and provenance.', 'Check the record and its session chain with deep verification.'], request: 'MCP tool arguments', response: 'Illustrative response', show: 'Show sample response', empty: 'Select an operation, then reveal its sample response.', hint: 'Replace demo-002 with the ID returned by your own node.', copied: 'Request copied', failed: 'Copy unavailable. Select and copy the code manually.' },
  es: { title: 'Explora las llamadas.', note: 'Solo ejemplos interactivos. No se envía nada a un nodo. Las respuestas son ilustraciones simplificadas, no un esquema de API.', operations: ['Guardar', 'Recuperar', 'Verificar'], descriptions: ['Guarda un resultado en una sesión. Conserva el ID devuelto.', 'Usa el ID guardado para recuperar el contenido y su procedencia.', 'Comprueba el registro y su cadena de sesión con verificación profunda.'], request: 'Argumentos de la herramienta MCP', response: 'Respuesta ilustrativa', show: 'Mostrar respuesta de ejemplo', empty: 'Elige una operación y muestra su respuesta de ejemplo.', hint: 'Sustituye demo-002 por el ID devuelto por tu nodo.', copied: 'Solicitud copiada', failed: 'No se puede copiar. Selecciona y copia el código manualmente.' },
  fr: { title: 'Explorez les appels.', note: 'Exemples interactifs uniquement. Rien n’est envoyé à un nœud. Les réponses sont des illustrations simplifiées, pas un schéma d’API.', operations: ['Enregistrer', 'Récupérer', 'Vérifier'], descriptions: ['Enregistrez un résultat dans une session. Conservez l’identifiant renvoyé.', 'Utilisez cet identifiant pour récupérer le contenu et sa provenance.', 'Contrôlez l’enregistrement et sa chaîne de session avec une vérification approfondie.'], request: 'Arguments de l’outil MCP', response: 'Réponse illustrative', show: 'Afficher la réponse d’exemple', empty: 'Choisissez une opération, puis affichez sa réponse d’exemple.', hint: 'Remplacez demo-002 par l’identifiant renvoyé par votre nœud.', copied: 'Requête copiée', failed: 'Copie indisponible. Sélectionnez et copiez le code manuellement.' },
}

export default function DeveloperPlayground() {
  const { language, t } = useLanguage()
  const c = copy[language]
  const [operation, setOperation] = useState(0)
  const [shown, setShown] = useState(false)
  const [status, setStatus] = useState('')
  const names = ['surstor_store', 'surstor_retrieve', 'surstor_verify']
  const requests = [{ content: t('recordProposalContent'), sessionId: 'launch-planning' }, { id: 'demo-002' }, { id: 'demo-002', deep: true }]
  const responses = [{ id: 'demo-002', sessionId: 'launch-planning' }, { id: 'demo-002', content: t('recordProposalContent'), sessionId: 'launch-planning', agent: 'writing-agent', model: 'sample-model-b' }, { id: 'demo-002', contentMatches: true, sessionChainValid: true, signatureValid: true }]
  const request = JSON.stringify(requests[operation], null, 2)
  const button = 'rounded-md border border-[var(--line-strong)] px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]'
  async function copyRequest() { try { await navigator.clipboard.writeText(request); setStatus('copied') } catch { setStatus('failed') } }
  return <div className="mt-8 overflow-hidden rounded-xl border border-[var(--line-strong)] bg-[var(--bg)]">
    <div className="border-b border-[var(--line)] p-5 sm:p-7"><h3 className="font-display text-2xl font-bold">{c.title}</h3><p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-2)]">{c.note}</p></div>
    <div role="tablist" aria-label={c.title} className="flex flex-wrap gap-2 bg-[var(--surface-2)] p-3">{c.operations.map((label, index) => <button key={index} id={`call-tab-${index}`} role="tab" aria-selected={operation === index} aria-controls="call-panel" tabIndex={operation === index ? 0 : -1} onClick={() => { setOperation(index); setShown(false); setStatus('') }} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (index + 1) % 3 : e.key === 'ArrowLeft' ? (index + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1; if (next >= 0) { e.preventDefault(); setOperation(next); setShown(false); setStatus(''); document.getElementById(`call-tab-${next}`)?.focus() } }} className={button} style={{ color: operation === index ? '#0c1626' : 'var(--text-2)', background: operation === index ? 'var(--signal)' : 'transparent' }}>{label}</button>)}</div>
    <div id="call-panel" role="tabpanel" aria-labelledby={`call-tab-${operation}`} tabIndex={0} className="p-5 sm:p-7">
      <p className="font-mono2 text-sm text-[var(--signal)]">{names[operation]}</p><p className="mt-3 text-sm text-[var(--text-2)]">{c.descriptions[operation]}</p>
      <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="min-w-0"><div className="mb-3 flex items-center justify-between gap-3"><h4 className="text-sm font-semibold">{c.request}</h4><button className={button} onClick={copyRequest}>{t('copy')}</button></div><pre className="min-h-60 overflow-x-auto rounded-lg bg-[var(--surface-2)] p-4 text-xs leading-6 text-[var(--text-1)]"><code>{request}</code></pre></div>
        <div className="min-w-0"><h4 className="mb-3 py-2 text-sm font-semibold">{c.response}</h4><div aria-live="polite" className="min-h-60 rounded-lg border border-[var(--line)] p-4">{shown ? <pre className="overflow-x-auto text-xs leading-6 text-[var(--pass)]"><code>{JSON.stringify(responses[operation], null, 2)}</code></pre> : <p className="text-sm text-[var(--text-2)]">{c.empty}</p>}</div></div>
      </div>
      <p className="my-4 text-xs text-[var(--text-2)]">{c.hint}</p><button className={`${button} bg-[var(--signal)] font-semibold text-[#0c1626]`} onClick={() => setShown(true)}>{c.show}</button><p role="status" className="mt-3 min-h-5 text-xs text-[var(--signal)]">{status === 'copied' ? c.copied : status === 'failed' ? c.failed : ''}</p>
    </div>
  </div>
}
