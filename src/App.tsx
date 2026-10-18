import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import LocalMemory from './pages/LocalMemory'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/local-memory" element={<LocalMemory />} />
    </Routes>
  )
}
