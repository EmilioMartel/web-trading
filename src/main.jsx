import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import { captureSource } from './lib/source.js'

captureSource()

// Vercel Web Analytics (sin cookies). Solo en la web publicada: hay que activarlo en el panel de Vercel.
if (!import.meta.env.DEV) {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments) }
  const s = document.createElement('script')
  s.defer = true
  s.src = '/_vercel/insights/script.js'
  document.head.appendChild(s)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
