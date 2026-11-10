import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import './usage-dashboard.css'

// Fictional daily aggregates from a fixed 30-day sample. Null means unreported.
const sample = [
  {day: 2, model: 'Model A', tool: 'Editor', requests: 12, input: 8400, output: 2110, cost: 0.08, kind: 'Reported', currency: 'USD'},
  {day: 1, model: 'Model B', tool: 'CLI', requests: 6, input: 3200, output: null, cost: null, kind: '', currency: ''},
  {day: 0, model: 'Model A', tool: 'CLI', requests: 4, input: 1900, output: 730, cost: 0.03, kind: 'Estimated', currency: 'USD'},
  {day: 9, model: 'Model B', tool: 'Editor', requests: 9, input: null, output: 1430, cost: 0.06, kind: 'Reported', currency: 'EUR'},
  {day: 18, model: 'Model A', tool: 'Editor', requests: 7, input: 4100, output: 890, cost: null, kind: '', currency: ''},
]
const number = (n: number) => n.toLocaleString('en-US')
export default function UsageDashboard() {
  const [days, setDays] = useState(30), [model, setModel] = useState('All'), [tool, setTool] = useState('All')
  useEffect(() => { const old = document.title; document.title = 'Usage dashboard | SurStor'; window.scrollTo(0,0); return () => { document.title = old } }, [])
  const rows = sample.filter(r => r.day < days && (model === 'All' || r.model === model) && (tool === 'All' || r.tool === tool))
  function tokens(key: 'input'|'output') { const values = rows.flatMap(r => r[key] === null ? [] : [r[key]]); return values.length ? number(values.reduce((a,b) => a+b,0)) : '—' }
  const costs = new Map<string, number>(); rows.forEach(r => { if (r.cost !== null) { const k = `${r.currency} · ${r.kind}`; costs.set(k,(costs.get(k) ?? 0) + r.cost) } })
  const requests = rows.reduce((n,r) => n+r.requests,0)
  return <div className="usage-page"><header><Link to="/" className="usage-brand"><img src="/surstor-logo-transparent.png" alt="" width="36" height="36"/>SurStor</Link><Link to="/">Back to homepage</Link></header><main>
    <p className="usage-kicker">SURSTOR / USAGE ANALYTICS</p><h1>Usage dashboard</h1><p className="usage-lead">See which models and tools account for your requests, tokens, and costs.</p>
    <p><Link to="/dashboard/personal">Sign in to see my usage →</Link></p>
    <aside><strong>Sample workspace</strong><p>Explore fictional activity from a 30-day period. This preview never reads your prompts, saved outputs, or local usage records.</p></aside>
    <section aria-label="Filter sample usage" className="usage-filters"><label>Sample period<select aria-label="Sample period" value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select></label><label>Model<select aria-label="Model" value={model} onChange={e=>setModel(e.target.value)}>{['All','Model A','Model B'].map(v=><option key={v}>{v}</option>)}</select></label><label>Tool<select aria-label="Tool" value={tool} onChange={e=>setTool(e.target.value)}>{['All','Editor','CLI'].map(v=><option key={v}>{v}</option>)}</select></label><button onClick={()=>{setDays(30);setModel('All');setTool('All')}}>Reset filters</button></section>
    <section className="usage-metrics" aria-label="Filtered usage">{[['Requests',number(requests)],['Known input tokens',tokens('input')],['Known output tokens',tokens('output')],['Unpriced requests',number(rows.reduce((n,r)=>n+(r.cost === null ? r.requests : 0),0))]].map(([k,v])=><article key={k}><span>{k}</span><strong>{v}</strong></article>)}</section>
    <section className="usage-panel"><h2>Activity by model and tool</h2><p role="status">{requests ? `${requests} requests match your filters.` : 'No sample activity matches these filters.'} Missing counts appear as a dash.</p><div className="usage-scroll"><table><thead><tr>{['Sample day','Model','Tool','Requests','Input','Output'].map(v=><th key={v} scope="col">{v}</th>)}</tr></thead><tbody>{[...rows].sort((a,b)=>a.day-b.day).map(r=><tr key={r.day}><td>Day {30-r.day}</td><td>{r.model}</td><td>{r.tool}</td><td>{r.requests}</td><td>{r.input === null ? '—' : number(r.input)}</td><td>{r.output === null ? '—' : number(r.output)}</td></tr>)}</tbody></table></div></section>
    <section className="usage-panel"><h2>Cost breakdown</h2><p>Reported costs and estimates are shown separately for each currency. An unpriced request has no supplied cost.</p>{costs.size ? <dl>{[...costs].map(([key,v])=><div key={key}><dt>{key}</dt><dd>{v.toFixed(2)}</dd></div>)}</dl> : <p>No priced requests in this selection.</p>}</section>
    <section className="usage-panel"><h2>View your own usage</h2><p>If you already run the SurStor Usage Dashboard on this device, open it to connect and view your workspace. Enter your credential only in your local dashboard.</p><a href="http://127.0.0.1:8790/" target="_blank" rel="noopener noreferrer">Open local dashboard ↗</a></section>
  </main></div>
}
