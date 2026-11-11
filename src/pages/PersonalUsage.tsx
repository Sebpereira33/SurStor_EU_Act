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
  async function device(enable:boolean){setBusy(true);setKey('');setDeviceMessage('')
    try {const {data,error}=await client.rpc('surstor_device',{enable});if(error) throw error
      if(enable)setKey(data);setDeviceMessage(enable?'Copy this key now. It will not be shown again.':'Your device key has been revoked.')
    } catch {setDeviceMessage('Could not change the device key.')} finally {setBusy(false)}}
  return <><section className="usage-filters"><label>Reporting period<select value={days} onChange={e=>setDays(+e.target.value)}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select></label><button onClick={()=>setRefresh(v=>v+1)}>Refresh usage</button></section>
    <div role="status">{error || (!data?'Loading your workspace…':data.groups.length?'':'No requests reported for this period. Connect your reporting tool below.')}</div>
    {data && <><section className="usage-panel"><h2>Usage by model and tool</h2><div className="usage-scroll"><table><thead><tr>{['Provider / model','Tool','Requests','Known input tokens','Known output tokens'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{data.groups.map(g=><tr key={JSON.stringify([g.provider,g.model,g.tool])}><td>{g.provider} / {g.model}</td><td>{g.tool}</td><td>{g.requests}</td><td>{g.input?.toLocaleString()??'—'}</td><td>{g.output?.toLocaleString()??'—'}</td></tr>)}</tbody></table></div><p>A dash means no count was reported.</p></section>
    <section className="usage-panel"><h2>Reported costs and estimates</h2><p>{data.unpriced} unpriced requests.</p>{data.costs.map(c=><p key={c.currency+c.kind}>{c.currency} {c.amount} · {c.kind==='estimated'?'Estimated':'Provider-reported'}</p>)}</section>
    <section className="usage-panel"><h2>Connect your reporting tool</h2><p>Configure the SurStor reporting bridge with <code>SURSTOR_USAGE_URL=https://www.surstor.net</code> and your upload key as <code>SURSTOR_USAGE_DEVICE_TOKEN</code>. Your tool must report usage; signing in does not import local history.</p><p>Each workspace has one upload key. Creating a new one immediately replaces the old one.</p><div className="usage-filters"><button disabled={busy} onClick={()=>device(true)}>Create or replace upload key</button><button disabled={busy} onClick={()=>device(false)}>Revoke upload key</button></div><p role="status">{deviceMessage}</p>{key && <label>Device upload key<input readOnly value={key} onFocus={e=>e.target.select()}/><button onClick={()=>setKey('')}>Hide</button></label>}</section></>}
  </>
}
export default function PersonalUsage(){
  const [client,setClient]=useState<SupabaseClient|null>(null),[session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[message,setMessage]=useState(''),[email,setEmail]=useState(''),[busy,setBusy]=useState(false)
  useEffect(()=>{let current=true;let stop:(()=>void)|undefined
    const old=document.title;document.title='My usage | SurStor'
    async function init(){try {const r=await fetch('/api/dashboard-config',{cache:'no-store'});if(!r.ok)throw Error();const cfg=await r.json();if(!current)return
      const params = [new URLSearchParams(location.search), new URLSearchParams(location.hash.slice(1))]
      const failed = params.some(p => p.has('error') || p.has('error_code'))
      const returning = params.some(p => p.has('code'))
      const retry = 'Request a new sign-in link and open the newest email in this browser.'
      if (failed) {
        setMessage('This sign-in link is invalid or has expired. ' + retry)
        history.replaceState(history.state, '', location.pathname)
      }
      const c=createClient(cfg.url,cfg.key,{auth:{flowType:'pkce',storageKey:'surstor-pilot-auth'}})
      const {data}=c.auth.onAuthStateChange((event,s)=>{
        if (!current) return
        if (returning && event === 'INITIAL_SESSION') {
          history.replaceState(history.state, '', location.pathname)
          if (!s) setMessage('Sign-in could not be completed. ' + retry)
        }
        setSession(s)
        setReady(true)
      })
      stop=()=>data.subscription.unsubscribe();setClient(c)
    }catch{if(current){setReady(true);setMessage('Personal usage is not available on this deployment yet.')}}}
    void init();return ()=>{current=false;stop?.();document.title=old}
  },[])
  async function login(e:React.FormEvent){e.preventDefault();if(!client)return;setBusy(true)
    try {const {error}=await client.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+'/dashboard/personal'}});setMessage(error?'Could not send a sign-in link. Check the address or try again later.':'Check your email and open the sign-in link in this browser.')}finally{setBusy(false)}}
  return <div className="usage-page"><header><Link to="/">SurStor</Link><Link to="/dashboard">Sample dashboard</Link></header><main><p className="usage-kicker">SURSTOR / PERSONAL WORKSPACE</p><h1>My usage</h1>{!ready?<p>Loading sign-in…</p>:session&&client?<><div className="usage-filters"><span>Signed in as {session.user.email}</span><button onClick={async()=>{const {error}=await client.auth.signOut({scope:'local'});setMessage(error?'Could not sign out. Please try again.':'')}}>Sign out</button></div><Workspace key={session.user.id} client={client}/></>:client?<form className="usage-filters" onSubmit={login}><label>Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><button disabled={busy}>Email me a sign-in link</button><p>New here? Your first sign-in creates a private workspace.</p></form>:null}<p role="status">{message}</p><UsageConnectionGuide/></main></div>
}
