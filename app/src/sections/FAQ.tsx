import Reveal from '@/components/Reveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FAQS = [
  {
    q: 'What events does Article 12 actually require us to log?',
    a: 'The regulation names purposes, not a closed event list: anything needed to identify risk situations (Art. 79(1)), support post-market monitoring (Art. 72), and let deployers monitor operation (Art. 26(5)). In practice that means inputs and outputs, model and data versions, decisions and confidence, human overrides, and operational anomalies. Remote biometric systems have an explicit minimum: usage periods, reference databases, matched inputs and verifying personnel (Art. 12(3)). SurStor schemas map directly to these categories.',
  },
  {
    q: 'How long must logs be kept?',
    a: 'At least six months from creation (Art. 26(6) for deployers, Art. 19 for providers) — per log entry, not per deployment. Sectoral law or the GDPR can require longer. SurStor enforces a 183-day floor by default and extends retention per pool, so a misconfigured lifecycle rule can never delete a record early.',
  },
  {
    q: 'We buy our AI system from a vendor. Is logging their problem?',
    a: 'No. The provider must design the logging capability in; the deployer must retain the logs and produce them to market surveillance authorities on request. Outsourcing the system does not outsource the obligation. SurStor sits between both parties as neutral, verifiable infrastructure either side can point to.',
  },
  {
    q: 'How do logs interact with the GDPR?',
    a: 'Logs that contain personal data fall under both regimes: AI Act retention minimums and GDPR storage-limitation principles apply together, and the longer lawful period wins. SurStor pools support purpose tagging, pseudonymisation and policy-driven extension so the two regimes reconcile instead of colliding.',
  },
  {
    q: 'Does this cover agentic and multi-agent systems?',
    a: 'Yes — that is where SurStor started. Shared data pools let collaborating agents read and write with full attribution: every action is tied to the agent identity, model version and supervising human. When autonomous agents make decisions across organisational boundaries, the audit trail is the only thing that travels with the decision.',
  },
  {
    q: 'Does SurStor only record LLM output?',
    a: 'No. Recording is the compliance baseline — but the same pools hold everything you create with AI: prompts, answers, code, analyses, agent actions. Because it all lives under your keys, you can move output between tools and models, carry context from one vendor to another, and decide where each pool is allocated. Your AI-generated information becomes your property, not your vendor\'s.',
  },
  {
    q: 'Article 12 is already in force — what if we are not ready?',
    a: 'Since 2 August 2026, Art. 12 record-keeping is enforceable for Annex III high-risk systems. Failures sit in Tier 2 of Art. 99: up to €15 million or 3% of global annual turnover, whichever is higher — and authorities can suspend the system itself. Producing unverifiable logs is a separate Tier 3 violation even when everything else is compliant. The fastest path out of exposure is infrastructure that starts recording today.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal i={0}>
            <div className="font-mono2 text-xs uppercase tracking-[0.24em]" style={{ color: 'var(--signal)' }}>
              06 / Questions
            </div>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-5 max-w-[16ch] text-4xl leading-[1.05] font-bold sm:text-5xl">
              Asked by every compliance team we meet
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 max-w-[42ch] text-base leading-relaxed" style={{ color: 'var(--text-2)' }}>
              Straight answers on scope, retention and responsibility. For anything else, our EU compliance
              engineers answer within one business day.
            </p>
          </Reveal>
        </div>

        <Reveal i={1}>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: 'var(--line)' }}>
                <AccordionTrigger className="py-6 text-left font-display text-lg font-bold tracking-tight hover:no-underline" style={{ color: 'var(--text-1)' }}>
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono2 text-xs font-normal" style={{ color: 'var(--text-3)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {f.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-7 pl-9 text-[15px] leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
