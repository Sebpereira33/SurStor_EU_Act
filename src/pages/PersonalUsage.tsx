import { useEffect, useState } from 'react'
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'
import { Link } from 'react-router'
import './usage-dashboard.css'
import UsageConnectionGuide from '@/components/UsageConnectionGuide'

type Group = {model:string;provider:string;tool:string;requests:number;input:number|null;output:number|null}
type Summary = {groups:Group[];costs:{currency:string;kind:string;amount:string}[];unpriced:number}

function Workspace({client}:{client:SupabaseClient}) {
  const [days,setDays]=useState(30), [refresh,setRefresh]=useState(0)
  const [data,setData]=useState<Summary|null>(null), [error,setError]=useState(''), [key,setKey]=useState(''), [deviceMessage,setDeviceMessage]=useState(''), [busy,setBusy]=useState(false)
  useEffect(()=>{ let current=true;setData(null);setError('')
    async function load(){
      try {
        let result=await client.rpc('surstor_summary',{days})
        if(result.error?.code==='42501'){
          const opened=await client.rpc('surstor_open_workspace')
          if(opened.error) throw opened.error
          result=await client.rpc('surstor_summary',{days})
        }
        if(result.error) throw result.error
        if(current)setData(result.data as Summary)
      } catch { if(current)setError('Could not open your workspace. Refresh to try again, or contact contact@surstor.net.') }
    }
    void load()
    return ()=>{current=false}
  },[client,days,refresh])
  async function copyKey() {
    try {
      await navigator.clipboard.writeText(key)
      setDeviceMessage('API key copied.')
    } catch {
      setDeviceMessage('Select the API key and use your device’s Copy command.')
    }
  }
  async function device(enable:boolean){setBusy(true);setKey('');setDeviceMessage('')
    try {const {data,error}=await client.rpc('surstor_device',{enable});if(error) throw error
      if(enable)setKey(data);setDeviceMessage(enable?'Copy this key now. It will not be shown again.':'Your device key has been revoked.')
    } catch {setDeviceMessage('Could not change the device key.')} finally {setBusy(false)}}
  return <><section className="usage-filters"><label>Reporting period<select value={days} onChange={e=>setDays(+e.target.value)}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select></label><button onClick={()=>setRefresh(v=>v+1)}>Refresh usage</button></section>
    <div role="status">{error || (!data?'Loading your workspaceâ€¦':data.groups.length?'':'No requests reported for this period. Connect your reporting tool below.')}</div>
    {data && <><section className="usage-panel"><h2>Usage by model and tool</h2><div className="usage-scroll"><table><thead><tr>{['Provider / model','Tool','Requests','Known input tokens','Known output tokens'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{data.groups.map(g=><tr key={JSON.stringify([g.provider,g.model,g.tool])}><td>{g.provider} / {g.model}</td><td>{g.tool}</td><td>{g.requests}</td><td>{g.input?.toLocaleString()??'â€”'}</td><td>{g.output?.toLocaleString()??'â€”'}</td></tr>)}</tbody></table></div><p>A dash means no count was reported.</p></section>
    <section className="usage-panel"><h2>Reported costs and estimates</h2><p>{data.unpriced} unpriced requests.</p>{data.costs.map(c=><p key={c.currency+c.kind}>{c.currency} {c.amount} Â· {c.kind==='estimated'?'Estimated':'Provider-reported'}</p>)}</section>
    <section className="usage-panel"><h2>Connect your reporting tool</h2><p>Configure the SurStor reporting bridge with <code>SURSTOR_USAGE_URL=https://www.surstor.net</code> and your API key as <code>SURSTOR_USAGE_DEVICE_TOKEN</code>. Usage appears after your tool reports a request.</p><p>Each workspace has one API key. Creating a new one immediately replaces the old one.</p><div className="usage-filters"><button disabled={busy} onClick={()=>device(true)}>Create or replace API key</button><button disabled={busy} onClick={()=>device(false)}>Revoke API key</button></div><p role="status">{deviceMessage}</p>{key && <div className="usage-filters usage-key-row">
      <label htmlFor="usage-api-key">API key</label>
      <input id="usage-api-key" readOnly spellCheck={false} value={key} onFocus={e=>e.target.select()}/>
      <button type="button" onClick={copyKey}>Copy</button>
      <button type="button" onClick={()=>{setKey('');setDeviceMessage('')}}>Hide</button>
    </div>}</section></>}
  </>
}
export default function PersonalUsage(){
  const [client,setClient]=useState<SupabaseClient|null>(null),[session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
  useEffect(()=>{let current=true;let stop:(()=>void)|undefined
    const old=document.title;document.title='My usage | SurStor'
    async function init(){try {const r=await fetch('/api/dashboard-config',{cache:'no-store'});if(!r.ok)throw Error();const cfg=await r.json();if(!current)return
      const params = [new URLSearchParams(location.search), new URLSearchParams(location.hash.slice(1))]
      const failed = params.some(p => p.has('error') || p.has('error_code'))
      const returning = params.some(p => p.has('code'))
      if (failed) history.replaceState(history.state, '', location.pathname)
      const c=createClient(cfg.url,cfg.key,{auth:{flowType:'pkce',storageKey:'surstor-pilot-auth'}})
      const {data}=c.auth.onAuthStateChange((event,s)=>{
        if (!current) return
        if (returning && event === 'INITIAL_SESSION') {
          history.replaceState(history.state, '', location.pathname)
        }
        setSession(s)
        setReady(true)
      })
      stop=()=>data.subscription.unsubscribe();setClient(c)
    }catch{if(current){setReady(true);setMessage('Personal usage is not available on this deployment yet.')}}}
    void init();return ()=>{current=false;stop?.();document.title=old}
  },[])
  async function createWorkspace() {
    if (!client || busy) return
    setBusy(true)
    setMessage('')
    try {
      const {error} = await client.auth.signInAnonymously()
      if (error) setMessage(error.status === 429
        ? 'Too many workspaces were requested. Please try again later.'
        : 'Could not create your workspace. Please try again.')
    } catch {
      setMessage('Could not reach SurStor. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }
  return <div className="usage-page">
    <header><Link to="/">SurStor</Link><Link to="/dashboard">Sample dashboard</Link></header>
    <main>
      <p className="usage-kicker">SURSTOR / PERSONAL WORKSPACE</p>
      <h1>My usage</h1>
      {!ready ? <p>Loading your workspace…</p> : client && (session
        ? <Workspace key={session.user.id} client={client}/>
        : <section className="usage-panel">
            <h2>Connect your agent or IDE</h2>
            <p>Create a workspace, then generate an API key for your tool. Return in this browser to see its usage. Clearing site data removes your access to this workspace.</p>
            <button disabled={busy} onClick={createWorkspace}>{busy ? 'Creating workspace…' : 'Create workspace'}</button>
          </section>)}
      <p role="status">{message}</p><UsageConnectionGuide/>
    </main>
  </div>
}
