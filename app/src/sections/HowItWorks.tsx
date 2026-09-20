import { Cable, FilePlus2, Search, ShieldCheck } from 'lucide-react'

const steps = [
  {
    title: 'Connect',
    icon: Cable,
    description: 'Connect an MCP-compatible client to your local SurStor node. Your workflow decides which outputs to capture.',
    detail: 'Your workflow → your node',
    href: '#quickstart',
    link: 'Set up your connection',
  },
  {
    title: 'Store',
    icon: FilePlus2,
    description: 'Save an output with its session, agent and model details. SurStor records its provenance and links it into the session history.',
    detail: 'Output → recorded artifact',
    href: '#demo',
    link: 'Explore a sample record',
  },
  {
    title: 'Find',
    icon: Search,
    description: 'Search stored work by meaning, then retrieve the original artifact and its provenance. Search runs on your local node.',
    detail: 'Question → original work',
    href: '#search-demo',
    link: 'Try the search examples',
  },
  {
    title: 'Verify and export',
    icon: ShieldCheck,
    description: 'Check content bindings, session links and signatures. Export a session bundle for independent, offline verification.',
    detail: 'Session → portable evidence',
    href: '#integrity-demo',
    link: 'Explore integrity checks',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="hairline-t scroll-mt-24 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="font-mono2 text-xs uppercase tracking-[0.2em] text-[var(--signal)]">How SurStor works / Four steps</p>
        <h2 id="how-it-works-title" className="font-display mt-5 text-4xl font-bold sm:text-5xl">From AI output to a record you can check.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">Connect once, capture the work that matters, and keep a way to find and verify it later.</p>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="flex items-center justify-between text-[var(--signal)]">
                <span className="font-mono2 text-xs">STEP 0{index + 1}</span>
                <step.icon aria-hidden="true" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-2xl font-bold">{step.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--text-2)]">{step.description}</p>
              <p className="mt-6 border-t border-[var(--line)] pt-4 font-mono2 text-xs leading-relaxed text-[var(--text-2)]">{step.detail}</p>
              <a href={step.href} className="mt-5 rounded text-sm font-semibold text-[var(--signal)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]">{step.link} <span aria-hidden="true">↗</span></a>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[var(--text-2)]">This workflow describes the current local node. The examples below use sample data; verification checks record integrity, not the truth of the original content.</p>
      </div>
    </section>
  )
}