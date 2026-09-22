import { useState } from 'react'
import { useLanguage } from '@/i18n'
import DeveloperPlayground from '@/components/DeveloperPlayground'

const steps = [
  { title: 'Build and start your node', titleKey: 'quickStep1', detail: 'From the SurStor source checkout, with Java 21+, Maven and the required Covia artifacts installed locally:', detailKey: 'quickStep1Detail', code: 'mvn package\njava -jar surstor-node/target/surstor-node.jar start --config config/surstor.toml' },
  { title: 'Connect an MCP client', titleKey: 'quickStep2', detail: 'Use a client that supports streamable HTTP. This is an example MCP configuration; the configuration location depends on your client.', detailKey: 'quickStep2Detail', code: JSON.stringify({ mcpServers: { surstor: { type: 'http', url: 'http://127.0.0.1:8484/mcp' } } }, null, 2) },
  { title: 'Store your first artifact', titleKey: 'quickStep3', detail: 'Call surstor_store from the connected client with these arguments. Save the returned id for the next step.', detailKey: 'quickStep3Detail', code: JSON.stringify({ content: 'The launch proposal is due on 25 September.', sessionId: 'first-session' }, null, 2) },
  { title: 'Retrieve and verify', titleKey: 'quickStep4', detail: 'Call surstor_retrieve with the returned id. Then call surstor_verify with the same id and deep: true to check the session chain as well.', detailKey: 'quickStep4Detail', code: '// surstor_retrieve arguments\n{ "id": "<returned-id>" }\n\n// surstor_verify arguments\n{ "id": "<returned-id>", "deep": true }' },
]

function Step({ step, index }: { step: typeof steps[number]; index: number }) {
  const { t } = useLanguage()
  const [status, setStatus] = useState('')
  async function copy() {
    try { await navigator.clipboard.writeText(step.code); setStatus(t('copied')) }
    catch { setStatus(t('copyFallback')) }
  }
  return <article className="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-bold"><span className="mr-3 font-mono2 text-sm text-[var(--signal)]">0{index + 1}</span>{t(step.titleKey)}</h3><button onClick={copy} aria-label={`${t('copy')} ${t(step.titleKey).toLowerCase()}`} className="rounded border border-[var(--line-strong)] px-3 py-1 text-sm hover:border-[var(--signal)] focus-visible:outline focus-visible:outline-[var(--signal)]">{t('copy')}</button></div><p className="mt-4 text-sm leading-relaxed text-[var(--text-2)]">{t(step.detailKey)}</p><pre className="mt-5 overflow-x-auto rounded-lg bg-[var(--surface-2)] p-4 text-xs leading-6"><code>{step.code}</code></pre><p role="status" className="mt-2 min-h-5 text-xs text-[var(--signal)]">{status}</p></article>
}

export default function Quickstart() {
  const { t } = useLanguage()
  return <section id="quickstart" className="hairline-t scroll-mt-24 bg-[var(--surface)] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">{t('quickEyebrow')}</p><h2 className="font-display mt-5 text-4xl font-bold sm:text-5xl">{t('quickTitle')}</h2><p className="mt-5 max-w-2xl text-lg text-[var(--text-2)]">{t('quickBody')}</p><div className="mt-7 rounded-lg border border-[var(--line-strong)] p-5 text-sm leading-relaxed text-[var(--text-2)]"><strong className="text-white">{t('quickSetup')}</strong> {t('quickSetupBody')}</div><div className="mt-8 grid gap-5 lg:grid-cols-2">{steps.slice(0, 2).map((step, index) => <Step key={step.title} step={step} index={index} />)}</div><DeveloperPlayground /><p className="mt-6 text-sm text-[var(--text-2)]">{t('quickNext')} <code>surstor_search</code> {t('quickSearch')} <code>surstor_export</code> {t('quickExport')}</p></div><div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8"><a href="#journey" className="text-sm text-[var(--signal)] underline underline-offset-4">{t('backJourney')}</a></div></section>
}
