import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const { pathname, search, hash } = window.location
const authParams = [new URLSearchParams(search), new URLSearchParams(hash.slice(1))]
if (pathname === '/' && authParams.some(params => params.has('error_code') || params.has('code'))) {
  window.history.replaceState(window.history.state, '', '/dashboard/personal' + search + hash)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
