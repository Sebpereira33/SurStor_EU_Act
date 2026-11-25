import { useId, useState } from 'react'

type Usage = {provider:string;model:string;input:number|null;output:number|null}
export type ModelCost = {provider:string;model:string;currency:string;kind:string;amount:string}
export default function ModelUsageChart({groups,costs,unpriced,sample=false}:{groups:Usage[];costs:ModelCost[];unpriced:number;sample?:boolean}) {
  const id=useId()
  const [metric,setMetric]=useState('tokens'),[selectedCurrency,setCurrency]=useState('')
  const currencies=[...new Set(costs.map(c=>c.currency))].sort()
  const currency=currencies.includes(selectedCurrency)?selectedCurrency:currencies[0]??'USD'
  const models=new Map<string,{label:string;input:number|null;output:number|null;reported:number|null;estimated:number|null}>()
  const key=(provider:string,model:string)=>JSON.stringify([provider,model])
  const add=(a:number|null,b:number|null)=>b===null?a:(a??0)+b
  for(const g of groups){
    const k=key(g.provider,g.model)
    const row=models.get(k)??{label:`${g.provider} / ${g.model}`,input:null,output:null,reported:null,estimated:null}
    row.input=add(row.input,g.input);row.output=add(row.output,g.output);models.set(k,row)
  }
  for(const c of costs){
    const row=models.get(key(c.provider,c.model))
    if(!row||c.currency!==currency)continue
    const amount=Number(c.amount)
    if(!Number.isFinite(amount))continue
    if(c.kind==='provider_reported')row.reported=add(row.reported,amount)
    if(c.kind==='estimated')row.estimated=add(row.estimated,amount)
  }
  const rows=[...models.entries()].map(([key,r])=>({key,...r,values:metric==='tokens'?[r.input,r.output]:[r.reported,r.estimated]}))
  const max=Math.max(0,...rows.flatMap(r=>r.values.filter((v):v is number=>v!==null)))
  const labels=metric==='tokens'?['Input tokens','Output tokens']:['Provider-reported','Estimated']
  const format=(n:number)=>metric==='tokens'?n.toLocaleString():`${currency} ${n.toLocaleString(undefined,{maximumFractionDigits:6})}`
  return <section className="usage-panel model-chart" aria-labelledby={id}>
    <h2 id={id}>Compare models</h2>
    <div className="usage-filters"><label>Show<select value={metric} onChange={e=>setMetric(e.target.value)}><option value="tokens">Token use</option><option value="price">Price</option></select></label>
      {metric==='price'&&currencies.length>0&&<label>Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>}
    </div>
    <p role="status">{sample?'Fictional sample data. ':''}{metric==='tokens'?'Known token counts across tools. Input includes cache tokens; missing counts are not treated as zero.':`Reported costs and estimates are shown separately. ${unpriced} requests have no price. Currencies are never combined; no price is inferred from token counts.`}</p>
    {rows.length===0?<p>No usage in this period.</p>:<>
      <p className="model-chart-scale">Scale: 0 – {format(max)}{metric==='tokens'?' tokens':''}</p>
      <ul className="model-chart-rows" aria-label={metric==='tokens'?'Token use by model':'Costs by model'}>{rows.map(row=><li key={row.key}>
        <h3>{row.label}</h3>
        {row.values.map((value,i)=><div className="model-chart-series" key={labels[i]}>
          <div className="model-chart-label"><span>{labels[i]}</span><strong>{value===null?'Not reported':format(value)}</strong></div>
          <div className="model-chart-track" aria-hidden="true"><div className={`model-chart-bar series-${i}`} style={{width:`${value!==null&&max>0?value/max*100:0}%`}}/></div>
        </div>)}
      </li>)}</ul>
    </>}
  </section>
}
