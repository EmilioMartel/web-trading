import { useEffect, useState } from 'react'
import LotCalculator from '../components/widgets/LotCalculator.jsx'
import MonteCarlo from '../components/widgets/MonteCarlo.jsx'
import SessionsWidget from '../components/widgets/SessionsWidget.jsx'
import Compound from '../components/widgets/Compound.jsx'
import { RRWidget, DrawdownWidget, FibWidget } from '../components/widgets/SmallWidgets.jsx'
import { RiskUnitWidget, WinRateMatrix, PartialsWidget, ChecklistWidget } from '../components/widgets/RiskWidgets.jsx'

const TOOLS = [
  { id: 'lotaje', label: 'Tamaño de posición', C: LotCalculator },
  { id: 'unidad', label: 'Unidad de riesgo', C: RiskUnitWidget },
  { id: 'checklist', label: 'Checklist', C: ChecklistWidget },
  { id: 'rr', label: 'Riesgo/beneficio', C: RRWidget },
  { id: 'acierto', label: 'Acierto vs ratio', C: WinRateMatrix },
  { id: 'parciales', label: 'Parciales', C: PartialsWidget },
  { id: 'simulador', label: 'Simulador', C: MonteCarlo },
  { id: 'sesiones', label: 'Sesiones', C: SessionsWidget },
  { id: 'fibonacci', label: 'Fibonacci', C: FibWidget },
  { id: 'drawdown', label: 'Drawdown', C: DrawdownWidget },
  { id: 'compuesto', label: 'Interés compuesto', C: Compound },
]

export default function Tools() {
  const initial = TOOLS.find((t) => t.id === window.location.hash.slice(1))?.id || 'lotaje'
  const [tab, setTab] = useState(initial)
  const T = TOOLS.find((t) => t.id === tab)
  useEffect(() => {
    document.querySelector('.tabs .on')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [tab])
  const pick = (id) => { setTab(id); history.replaceState({}, '', `#${id}`) }
  return (
    <div className="container page">
      <header className="page-head">
        <span className="eyebrow">Caja de herramientas</span>
        <h1>Herramientas para traders</h1>
        <p className="lead muted">Calculadoras y simuladores gratuitos. Úsalas antes de cada operación o para entender mejor tu sistema.</p>
      </header>
      <div className="tabs" role="tablist">
        {TOOLS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => pick(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="tool-panel"><T.C key={T.id} /></div>
    </div>
  )
}
