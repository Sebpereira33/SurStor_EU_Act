import { useEffect, useState } from 'react'
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js'
import { Link } from 'react-router'
import './usage-dashboard.css'
import UsageConnectionGuide from '@/components/UsageConnectionGuide'

type Group = {model:string;provider:string;tool:string;requests:number;input:number|null;output:number|null}
type Summary = {groups:Group[];costs:{currency:string;kind:string;amount:string}[];unpriced:number}

function Workspace({client}:{client:SupabaseClient}) {
  const [days,setDays]=useState(30), [refresh,setRefresh]=useState(0)
  const [data,setData]=useState<Summary|null>(null), [error,setError]=useState('')
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
  return <><section className="usage-filters"><label>Reporting period<select value={days} onChange={e=>setDays(+e.target.value)}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option></select></label><button onClick={()=>setRefresh(v=>v+1)}>Refresh usage</button></section>
    <div role="status">{error || (!data?'Loading your workspace…':data.groups.length?'':'No requests reported for this period. Connect your reporting tool below.')}</div>
    {data && <><section className="usage-panel"><h2>Usage by model and tool</h2><div className="usage-scroll"><table><thead><tr>{['Provider / model','Tool','Requests','Known input tokens','Known output tokens'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{data.groups.map(g=><tr key={JSON.stringify([g.provider,g.model,g.tool])}><td>{g.provider} / {g.model}</td><td>{g.tool}</td><td>{g.requests}</td><td>{g.input?.toLocaleString()??'—'}</td><td>{g.output?.toLocaleString()??'—'}</td></tr>)}</tbody></table></div><p>A dash means no count was reported.</p></section>
    <section className="usage-panel"><h2>Reported costs and estimates</h2><p>{data.unpriced} unpriced requests.</p>{data.costs.map(c=><p key={c.currency+c.kind}>{c.currency} {c.amount} · {c.kind==='estimated'?'Estimated':'Provider-reported'}</p>)}</section>
    </>}
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
  const [register,setRegister]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const guest=Boolean(session?.user.is_anonymous)
  const creating=register || guest
  async function authenticate(e:React.FormEvent) {
    e.preventDefault()
    if (!client || busy) return
    setBusy(true)
    setMessage('')
    try {
      const credentials={email:email.trim(),password}
      if (guest) {
        const change=await client.auth.updateUser(credentials)
        if(change.error) throw change.error
        const login=await client.auth.signInWithPassword(credentials)
        if(login.error) throw login.error
      } else if (creating) {
        const result=await client.auth.signUp(credentials)
        if(result.error) throw result.error
        if(!result.data.session) throw Error('Could not open your account. Try signing in.')
      } else {
        const result=await client.auth.signInWithPassword(credentials)
        if(result.error) throw result.error
      }
      setPassword('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not complete sign-in. Please try again.')
    } finally { setBusy(false) }
  }
  return <div className="usage-page">
    <header><Link to="/">SurStor</Link><Link to="/dashboard">Sample dashboard</Link></header>
    <main><p className="usage-kicker">SURSTOR / PERSONAL WORKSPACE</p><h1>My usage</h1>
      {!ready && <p>Loading your workspace…</p>}
      {ready && client && (!session || guest) && <section className="usage-panel">
        <h2>{guest ? 'Add a login to this workspace' : creating ? 'Create an account' : 'Sign in'}</h2>
        {guest && <p>Add an email and password to keep your existing usage when you switch devices.</p>}
        <form className="usage-filters usage-login" onSubmit={authenticate}>
          <label>Email<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label>
          <label>Password<input required type="password" minLength={creating ? 8 : undefined} autoComplete={creating ? 'new-password' : 'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label>
          <button disabled={busy}>{busy ? 'Please wait…' : guest ? 'Save login' : creating ? 'Create account' : 'Sign in'}</button>
          {!guest && <button type="button" disabled={busy} onClick={()=>{setRegister(!register);setMessage('')}}>{creating ? 'Use existing account' : 'Create an account'}</button>}
        </form></section>}
      {client && session && <>
        {!guest && <div className="usage-filters"><span>{session.user.email}</span><button onClick={async()=>{const result=await client.auth.signOut({scope:'local'});setMessage(result.error?'Could not sign out.':'')}}>Sign out</button></div>}
        <Workspace key={session.user.id} client={client}/>
      </>}
      <p role="status">{message}</p><UsageConnectionGuide/>
    </main></div>
}
