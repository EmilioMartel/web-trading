import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import LotCalculator from '../components/widgets/LotCalculator.jsx'
import MonteCarlo from '../components/widgets/MonteCarlo.jsx'
import SessionsWidget from '../components/widgets/SessionsWidget.jsx'
import Compound from '../components/widgets/Compound.jsx'
import { RRWidget, DrawdownWidget, FibWidget } from '../components/widgets/SmallWidgets.jsx'
import { RiskUnitWidget, WinRateMatrix, PartialsWidget, ChecklistWidget } from '../components/widgets/RiskWidgets.jsx'

// Iconos de línea (24×24)
const ICONS = {
  calc: 'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2',
  shield: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4',
  check: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  scale: 'M12 4v16M5 20h14M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0zM6 8h12',
  grid: 'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16',
  split: 'M4 18l6-6 4 4 6-8M14 8h6v6',
  dice: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  fib: 'M4 5h16M4 9.5h16M4 13h16M4 16h16M4 19h16M6 19L18 5',
  down: 'M3 6l6 6 4-4 8 8M21 10v6h-6',
  growth: 'M3 20h18M6 16v-3M10 16v-6M14 16V8M18 16V4',
}

function Icon({ name }) {
  return (
    <svg className="tool-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  )
}

const GROUPS = [
  {
    name: 'Gestión del riesgo',
    tools: [
      { id: 'lotaje', label: 'Tamaño de posición', desc: 'Calcula el lotaje según tu riesgo y tu stop', icon: 'calc', C: LotCalculator },
      { id: 'unidad', label: 'Unidad de riesgo', desc: 'Cuánto arriesgar por operación', icon: 'shield', C: RiskUnitWidget },
      { id: 'rr', label: 'Riesgo/beneficio', desc: 'Ratio entre stop y objetivo', icon: 'scale', C: RRWidget },
      { id: 'acierto', label: 'Acierto vs ratio', desc: '¿Tu sistema es rentable?', icon: 'grid', C: WinRateMatrix },
      { id: 'parciales', label: 'Parciales', desc: 'Cierres parciales y su efecto', icon: 'split', C: PartialsWidget },
      { id: 'drawdown', label: 'Drawdown', desc: 'Lo que cuesta recuperar una caída', icon: 'down', C: DrawdownWidget },
    ],
  },
  {
    name: 'Planificación',
    tools: [
      { id: 'checklist', label: 'Checklist', desc: 'Repasa tu plan antes de entrar', icon: 'check', C: ChecklistWidget },
      { id: 'simulador', label: 'Simulador', desc: 'Posibles curvas de capital de tu sistema', icon: 'dice', C: MonteCarlo },
      { id: 'compuesto', label: 'Interés compuesto', desc: 'Cómo crece la cuenta con el tiempo', icon: 'growth', C: Compound },
    ],
  },
  {
    name: 'Análisis',
    tools: [
      { id: 'sesiones', label: 'Sesiones', desc: 'Horarios de los mercados en tu hora', icon: 'clock', C: SessionsWidget },
      { id: 'fibonacci', label: 'Fibonacci', desc: 'Niveles de retroceso clave', icon: 'fib', C: FibWidget },
    ],
  },
]
const TOOLS = GROUPS.flatMap((g) => g.tools)

function ToolMenu({ tab, onPick }) {
  return (
    <nav className="tool-menu" aria-label="Herramientas">
      {GROUPS.map((g) => (
        <div key={g.name} className="tool-group">
          <span className="tool-group-name">{g.name}</span>
          {g.tools.map((t) => (
            <button key={t.id} className={`tool-link ${tab === t.id ? 'on' : ''}`} aria-current={tab === t.id ? 'page' : undefined} onClick={() => onPick(t.id)}>
              <Icon name={t.icon} />
              <span className="tool-link-text">
                <b>{t.label}</b>
                <span>{t.desc}</span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}

export default function Tools() {
  const initial = TOOLS.find((t) => t.id === window.location.hash.slice(1))?.id || 'lotaje'
  const [tab, setTab] = useState(initial)
  const [open, setOpen] = useState(false)
  const i = TOOLS.findIndex((t) => t.id === tab)
  const T = TOOLS[i]
  const prev = TOOLS[i - 1]
  const next = TOOLS[i + 1]

  const pick = (id) => {
    setTab(id); setOpen(false)
    history.replaceState({}, '', `#${id}`)
    const panel = document.querySelector('.tools-main')
    if (panel && panel.getBoundingClientRect().top < 0) window.scrollTo({ top: window.scrollY + panel.getBoundingClientRect().top - 90, behavior: 'smooth' })
  }

  // Menú móvil: bloquea el scroll de fondo y se cierra con Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.querySelector('.tool-drawer .tool-link.on')?.scrollIntoView({ block: 'center' })
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="container page">
      <header className="page-head">
        <span className="eyebrow">Caja de herramientas</span>
        <h1>Herramientas para traders</h1>
        <p className="lead muted">Calculadoras y simuladores gratuitos. Úsalas antes de cada operación o para entender mejor tu sistema.</p>
      </header>

      {/* Selector para móvil */}
      <button className="tool-picker" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <Icon name={T.icon} />
        <span className="tool-link-text"><span>Herramienta {i + 1} de {TOOLS.length}</span><b>{T.label}</b></span>
        <span className="tool-picker-cta">Cambiar ▾</span>
      </button>

      <div className="tools-layout">
        <aside className="tools-side">
          <ToolMenu tab={tab} onPick={pick} />
        </aside>

        <div className="tools-main">
          <div className="tool-panel"><T.C key={T.id} /></div>
          <div className="tool-pager">
            {prev ? <button className="btn ghost sm" onClick={() => pick(prev.id)}>← {prev.label}</button> : <span />}
            {next ? <button className="btn ghost sm" onClick={() => pick(next.id)}>{next.label} →</button> : <span />}
          </div>
        </div>
      </div>

      {/* Panel lateral deslizante en móvil (en <body> para quedar por encima de todo) */}
      {createPortal(
      <div className={`tool-drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="tool-drawer-bg" onClick={() => setOpen(false)} />
        <div className="tool-drawer-panel" role="dialog" aria-modal="true" aria-label="Elegir herramienta">
          <div className="tool-drawer-head">
            <b>Herramientas</b>
            <button className="btn ghost sm" onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
          </div>
          <ToolMenu tab={tab} onPick={pick} />
        </div>
      </div>,
        document.body,
      )}
    </div>
  )
}
