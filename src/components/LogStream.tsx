import { useEffect, useRef, useState } from 'react'

interface LogLine {
  ts: string
  level: 'INFO' | 'AUDIT' | 'CHAIN' | 'WARN'
  msg: string
}

const TEMPLATES: Array<Pick<LogLine, 'level' | 'msg'>> = [
  { level: 'INFO', msg: 'inference.completed model=cv-screen-v4 tokens_in=1,842 latency_ms=212' },
  { level: 'CHAIN', msg: 'hashchain.append seq=481,203 prev=a91f…c2 digest=7be4…09da' },
  { level: 'AUDIT', msg: 'art12(2)(a) risk-signal scan — no anomaly in window T-5m' },
  { level: 'INFO', msg: 'agent.pool.write pool=hr-screening-eu region=de-fra-1 bytes=48,211' },
  { level: 'INFO', msg: 'decision.recorded system=credit-rag-2 out=review_required conf=0.71' },
  { level: 'CHAIN', msg: 'merkle.root.committed epoch=11,204 root=f0c3…77aa region=nl-ams-2' },
  { level: 'AUDIT', msg: 'art12(2)(b) post-market monitor tick — drift 0.004 < 0.05' },
  { level: 'INFO', msg: 'retention.policy.enforced min=183d pool=claims-eu pinned=true' },
  { level: 'WARN', msg: 'latency.p95 842ms > 800ms — event captured, operator notified' },
  { level: 'INFO', msg: 'human_oversight.review user=ops-118 action=override_accepted' },
  { level: 'AUDIT', msg: 'art12(2)(c) deployer oversight snapshot exported → EU database' },
  { level: 'CHAIN', msg: 'timestamp.qualified source=eIDAS-QTSP tsa=eu-trusted seq=481,204' },
  { level: 'INFO', msg: 'input.verified schema=annex-iii.v2 source=de-fra-1 integrity=ok' },
  { level: 'AUDIT', msg: 'authority.export.request id=MSA-2026-0441 status=fulfilled 1.2s' },
]

const LEVEL_COLOR: Record<LogLine['level'], string> = {
  INFO: 'var(--text-3)',
  AUDIT: 'var(--pass)',
  CHAIN: 'var(--signal)',
  WARN: 'var(--warn)',
}

function stamp(offsetSec: number) {
  const d = new Date(Date.now() + offsetSec * 1000)
  const p = (n: number, l = 2) => String(n).padStart(l, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}Z`
}

/** A live, self-appending log stream — the product telling its own story. */
export default function LogStream({ maxLines = 9, intervalMs = 1600 }: { maxLines?: number; intervalMs?: number }) {
  const [lines, setLines] = useState<LogLine[]>(() =>
    TEMPLATES.slice(0, 5).map((t, k) => ({ ...t, ts: stamp(-(5 - k) * 2) })),
  )
  const idx = useRef(5)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) => {
        const t = TEMPLATES[idx.current % TEMPLATES.length]
        idx.current += 1
        const next = [...prev, { ...t, ts: stamp(0) }]
        return next.length > maxLines ? next.slice(next.length - maxLines) : next
      })
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, maxLines])

  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  return (
    <div ref={boxRef} className="overflow-hidden font-mono2 text-[11px] leading-[1.9] sm:text-xs">
      {lines.map((l, k) => (
        <div key={`${l.ts}-${k}`} className="log-chunk flex gap-2 whitespace-nowrap">
          <span className="shrink-0" style={{ color: 'var(--text-3)' }}>
            {l.ts}
          </span>
          <span className="w-12 shrink-0 font-bold" style={{ color: LEVEL_COLOR[l.level] }}>
            {l.level}
          </span>
          <span className="truncate" style={{ color: 'var(--text-2)' }}>
            {l.msg}
          </span>
        </div>
      ))}
      <div className="flex gap-2">
        <span style={{ color: 'var(--text-3)' }}>{stamp(1)}</span>
        <span className="cursor-blink" style={{ color: 'var(--signal)' }}>
          ▊
        </span>
      </div>
    </div>
  )
}
