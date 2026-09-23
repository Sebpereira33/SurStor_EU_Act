import { useLayoutEffect, useState } from 'react'
import { useLanguage } from '@/i18n'

const palettes = ['original', 'forest', 'midnight', 'plum'] as const
type Palette = typeof palettes[number]
const labels = {
  en: ['Original', 'Forest & Mint', 'Midnight & Ice', 'Plum & Gold'],
  es: ['Original', 'Bosque y menta', 'Medianoche y hielo', 'Ciruela y oro'],
  fr: ['Original', 'Forêt et menthe', 'Minuit et glace', 'Prune et or'],
}
const swatches = ['#ffaa32', '#7de2ba', '#83caff', '#f3c77a']

export default function PalettePreview() {
  const { language } = useLanguage()
  const [palette, setPalette] = useState<Palette>(() => {
    const value = new URLSearchParams(window.location.search).get('palette')
    return palettes.includes(value as Palette) ? value as Palette : 'original'
  })
  const enabled = new URLSearchParams(window.location.search).has('palette')
  useLayoutEffect(() => {
    document.documentElement.dataset.palette = palette
    return () => { delete document.documentElement.dataset.palette }
  }, [palette])
  if (!enabled) return null
  const title = { en: 'Color preview', es: 'Vista de colores', fr: 'Aperçu des couleurs' }[language]
  return <aside aria-label={title} className="fixed bottom-16 right-3 z-[100] max-w-[calc(100vw-1.5rem)] rounded-xl border border-[var(--line-strong)] bg-[var(--bg)] p-3 shadow-2xl">
    <label htmlFor="palette-preview" className="mb-2 block text-xs font-semibold text-[var(--text-2)]">{title}</label>
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-4 w-4 rounded-full" style={{ background: swatches[palettes.indexOf(palette)] }} />
      <select id="palette-preview" value={palette} onChange={e => {
        const next = e.target.value as Palette
        setPalette(next)
        const url = new URL(window.location.href)
        url.searchParams.set('palette', next)
        window.history.replaceState(null, '', url)
      }} className="rounded border border-[var(--line)] bg-[var(--surface)] p-2 text-sm text-[var(--text-1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--signal)]">
        {palettes.map((value, index) => <option key={value} value={value}>{labels[language][index]}</option>)}
      </select>
    </div>
  </aside>
}
