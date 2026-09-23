import { useState } from 'react'
import { useLanguage } from '@/i18n'

const copy = {
  en: { title: 'Same work. A clearer record.', intro: 'Compare scattered outputs with a connected SurStor session.', before: 'Before: scattered outputs', after: 'After: a SurStor session', loose: ['A brief in a chat', 'A draft in a document', 'A decision in an email'], missing: 'Context must be pieced together manually.', linked: 'One session connects the original brief, draft and review.', proof: 'Recorded provenance · linked history · integrity verification', note: 'Illustrative comparison using the same three sample records. No live storage or verification.', action: 'Explore the records →' },
  es: { title: 'El mismo trabajo. Un registro más claro.', intro: 'Compara resultados dispersos con una sesión conectada de SurStor.', before: 'Antes: resultados dispersos', after: 'Después: una sesión de SurStor', loose: ['Un resumen en un chat', 'Un borrador en un documento', 'Una decisión en un correo'], missing: 'El contexto debe reconstruirse manualmente.', linked: 'Una sesión conecta el resumen original, el borrador y la revisión.', proof: 'Procedencia registrada · historial enlazado · verificación de integridad', note: 'Comparación ilustrativa con los mismos tres registros de ejemplo. Sin almacenamiento ni verificación en vivo.', action: 'Explorar los registros →' },
  fr: { title: 'Le même travail. Une trace plus claire.', intro: 'Comparez des résultats dispersés à une session SurStor reliée.', before: 'Avant : résultats dispersés', after: 'Après : une session SurStor', loose: ['Un brief dans un chat', 'Un brouillon dans un document', 'Une décision dans un e-mail'], missing: 'Le contexte doit être reconstitué manuellement.', linked: 'Une session relie le brief original, le brouillon et la revue.', proof: 'Provenance enregistrée · historique relié · vérification d’intégrité', note: 'Comparaison illustrative des trois mêmes exemples. Aucun stockage ni vérification en direct.', action: 'Explorer les enregistrements →' },
}

export default function BeforeAfter() {
  const { language, t } = useLanguage()
  const c = copy[language]
  const [after, setAfter] = useState(false)
  return <div id="comparison" className="mt-12 scroll-mt-24 rounded-xl border border-[var(--line-strong)] bg-[var(--bg)] p-5 sm:p-8">
    <h3 className="font-display text-2xl font-bold sm:text-3xl">{c.title}</h3>
    <p className="mt-3 text-[var(--text-2)]">{c.intro}</p>
    <div role="group" aria-label={c.title} className="my-6 flex flex-wrap gap-2">{[false, true].map(value => <button key={String(value)} type="button" aria-pressed={after === value} onClick={() => setAfter(value)} className="rounded-md border px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]" style={{ background: after === value ? 'var(--signal)' : 'var(--surface)', color: after === value ? '#0c1626' : 'var(--text-2)', borderColor: 'var(--line-strong)' }}>{value ? c.after : c.before}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">
      <p className="mb-4 font-mono2 text-sm text-[var(--signal)]">{after ? 'launch-planning / demo-001 → demo-002 → demo-003' : c.missing}</p>
      <div className="grid gap-4 md:grid-cols-3">{['Brief', 'Proposal', 'Review'].map((record, index) => <article key={record} className="min-w-0 rounded-lg border bg-[var(--surface)] p-5" style={{ borderColor: after ? 'var(--signal)' : 'var(--line)' }}>
        <p className="font-mono2 text-xs text-[var(--text-2)]">{after ? `demo-00${index + 1}` : c.loose[index]}</p>
        <h4 className="mt-3 text-lg font-bold">{t(`record${record}`)}</h4>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">{t(`record${record}Content`)}</p>
        {after && <p className="mt-5 border-t border-[var(--line)] pt-3 text-xs text-[var(--signal)]">{t('demoAgent')}: {['research-agent', 'writing-agent', 'review-agent'][index]}<br />{t('demoModel')}: {index === 1 ? 'B' : 'A'} · {['09:00:00', '09:02:18', '09:04:32'][index]} UTC</p>}
      </article>)}</div>
      <p className="mt-5 text-sm text-[var(--text-2)]">{after ? c.linked : c.missing}</p>
      {after && <p className="mt-2 text-sm text-[var(--signal)]">{c.proof}</p>}
    </div>
    <p className="mt-5 text-xs leading-relaxed text-[var(--text-2)]">{c.note}</p>
    <a href="#demo" className="mt-5 inline-block text-sm text-[var(--signal)] underline underline-offset-4">{c.action}</a>
  </div>
}
