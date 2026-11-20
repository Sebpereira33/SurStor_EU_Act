import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
type Token={id:string;name:string;created_at:string;last_used_at:string|null;revoked_at:string|null}
export default function UploadTokens({client}:{client:SupabaseClient}) {
  const [tokens,setTokens]=useState<Token[]>([]),[name,setName]=useState(''),[secret,setSecret]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false)
  async function load() {
    const result=await client.rpc('surstor_tokens')
    if(result.error) throw result.error
    setTokens(result.data)
  }
  useEffect(()=>{void load().catch(()=>setMessage('Could not load upload tokens.'))},[client])
  async function create(e:React.FormEvent) {
    e.preventDefault();setBusy(true);setMessage('')
    try {
      const result=await client.rpc('surstor_create_token',{label:name})
      if(result.error) throw result.error
      setSecret(result.data);setName('');setMessage('Save this token now. It is shown once.')
      await load()
    } catch {setMessage('Could not create token. Use a name and keep at most 20 active tokens.')}
    finally {setBusy(false)}
  }
  async function revoke(id:string) {
    setBusy(true)
    try {
      const result=await client.rpc('surstor_revoke_token',{token_id:id})
      if(result.error) throw result.error
      setSecret('');await load();setMessage('Token revoked.')
    } catch {setMessage('Could not revoke token. Try again.')}
    finally {setBusy(false)}
  }
  return <section className="usage-panel" id="upload-tokens">
    <h2>Upload tokens</h2><p>Give each device a named token to report usage. Tokens can only check their connection and upload events. Use your email and password to manage the dashboard.</p>
    <form className="usage-filters usage-login" onSubmit={create}>
      <label>Device name<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Laptop Claude Code"/></label>
      <button disabled={busy}>Create upload token</button>
    </form>
    {secret && <div className="usage-filters usage-login"><label>New upload token<input readOnly value={secret} onFocus={e=>e.target.select()}/></label><button onClick={async()=>{try {await navigator.clipboard.writeText(secret);setMessage('Token copied.')}catch{setMessage('Select the token and use Copy.')}}}>Copy</button><button onClick={()=>setSecret('')}>Hide</button></div>}
    <p role="status">{message}</p>
    <ul>{tokens.map(t=><li key={t.id} className="usage-filters"><strong>{t.name}</strong><span>{t.revoked_at?'Revoked':t.last_used_at?'Last upload '+new Date(t.last_used_at).toLocaleString():'No uploads yet'}</span>{!t.revoked_at&&<button disabled={busy} onClick={()=>revoke(t.id)}>Revoke</button>}</li>)}</ul>
  </section>
}
