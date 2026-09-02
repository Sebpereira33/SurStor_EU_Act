import Nav from '@/sections/Nav'
import Hero from '@/sections/Hero'
import StatsStrip from '@/sections/StatsStrip'
import Article12 from '@/sections/Article12'
import Platform from '@/sections/Platform'
import Portability from '@/sections/Portability'
import Architecture from '@/sections/Architecture'
import Timeline from '@/sections/Timeline'
import FAQ from '@/sections/FAQ'
import { CTA, Footer } from '@/sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Nav />
      <main>
        <Hero />
        <StatsStrip />
        <Article12 />
        <Platform />
        <Portability />
        <Architecture />
        <Timeline />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
