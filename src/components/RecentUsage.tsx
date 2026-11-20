import { useEffect,useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
type Event={id:string;occurred_at:string;model:string;integration:string}
export default function RecentUsage({client,refresh,onDelete}:{client:SupabaseClient;refresh:number;onDelete:()=>void}) {
  const [events,setEvents]=useState<Event[]>([]),[message,setMessage]=useState(''),[pending,setPending]=useState<string|null>(null)
  useEffect(()=>{let active=true;void client.rpc('surstor_recent_events').then(result=>{if(active){if(result.error)setMessage('Could not load recent events.');else setEvents(result.data)}});return()=>{active=false}},[client,refresh])
  async function remove(id:string) {
    const result=await client.rpc('surstor_delete_event',{event_id:id})
    if(result.error){setMessage('Could not delete event.');return}
    setPending(null);setMessage('Event deleted.');onDelete()
  }
  return <section className="usage-panel"><h2>Recent events</h2><p>Up to 50 recent requests. Delete a setup test here to remove it from your totals.</p>
    <ul>{events.map(e=><li key={e.id} className="usage-filters"><span>{new Date(e.occurred_at).toLocaleString()} · {e.model} · {e.integration}</span>
      {pending===e.id?<><span>Permanently delete this event?</span><button onClick={()=>remove(e.id)}>Confirm delete</button><button onClick={()=>setPending(null)}>Cancel</button></>:<button onClick={()=>setPending(e.id)}>Delete</button>}
    </li>)}</ul><p role="status">{message}</p></section>
}
