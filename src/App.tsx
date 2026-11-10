import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import LocalMemory from './pages/LocalMemory'

import UsageDashboard from './pages/UsageDashboard'

import { lazy, Suspense } from 'react'
const PersonalUsage = lazy(() => import('./pages/PersonalUsage'))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LocalMemory />} />
      <Route path="/dashboard/personal" element={<Suspense fallback={<p role="status">Loading personal workspace…</p>}><PersonalUsage /></Suspense>} />
      <Route path="/dashboard" element={<UsageDashboard />} />
      <Route path="/enterprise" element={<Home />} />
      <Route path="/local-memory" element={<LocalMemory />} />
    </Routes>
  )
}
