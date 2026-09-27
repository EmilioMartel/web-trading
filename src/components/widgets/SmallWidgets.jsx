import { useState } from 'react'
import { Slider, Segmented, Stat } from '../Field.jsx'
import { fmt, money } from '../../utils.js'

/* ---------- Valor del pip ---------- */
export function PipValueWidget() {
  const [lots, setLots] = useState(0.1)
  const [pips, setPips] = useState(30)
  const pipVal = lots * 10
  const pl = pipVal * pips
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>¿Cuánto vale un pip? (EUR/USD)</h4></div>
      <div className="stack">
        <Slider label="Tamaño de posición" value={lots} min={0.01} max={2} step={0.01} suffix=" lotes" format={(x) => fmt(x)} onChange={setLots} />
        <Slider label="Movimiento del precio" value={pips} min={-100} max={100} step={1} suffix=" pips" onChange={setPips} />
      </div>
      <div className="stat-grid">
        <Stat label="Unidades" value={(lots * 100000).toLocaleString('es-ES')} />
        <Stat label="Valor por pip" value={money(pipVal)} />
        <Stat label="Resultado" value={money(pl)} tone={pl >= 0 ? 'up' : 'down'} />
      </div>
    </div>
  )
}

/* ---------- Ratio riesgo/beneficio ---------- */
export function RRWidget() {
  const [stop, setStop] = useState(20)
  const [rr, setRr] = useState(2)
  const [risk, setRisk] = useState(50)
  const tp = stop * rr
  const be = 1 / (1 + rr)
  const total = stop + tp
  const H = 220
  const stopH = (stop / total) * (H - 20)
  const tpH = H - 20 - stopH
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>Visualiza tu ratio riesgo/beneficio</h4></div>
      <div className="widget-grid">
        <svg viewBox={`0 0 260 ${H}`} className="rr-svg" role="img" aria-label="Posición larga con stop y objetivo">
          <rect x="60" y="10" width="170" height={tpH} fill="var(--up)" opacity="0.22" stroke="var(--up)" />
          <rect x="60" y={10 + tpH} width="170" height={stopH} fill="var(--down)" opacity="0.22" stroke="var(--down)" />
          <line x1="40" x2="250" y1={10 + tpH} y2={10 + tpH} stroke="var(--text)" strokeWidth="2" />
          <text x="145" y={10 + tpH / 2} textAnchor="middle" className="svg-label">TP +{fmt(tp, 0)} pips</text>
          <text x="145" y={10 + tpH + stopH / 2 + 4} textAnchor="middle" className="svg-label">SL −{stop} pips</text>
          <text x="4" y={14 + tpH} className="svg-dim">Entrada</text>
        </svg>
        <div className="stack">
          <Slider label="Distancia del stop" value={stop} min={5} max={100} suffix=" pips" onChange={setStop} />
          <Slider label="Ratio (R)" value={rr} min={0.5} max={5} step={0.25} format={(x) => `1:${fmt(x, 2).replace(/,00$/, '')}`} onChange={setRr} />
          <Slider label="Riesgo por operación" value={risk} min={10} max={500} step={10} suffix=" €" onChange={setRisk} />
        </div>
      </div>
      <div className="stat-grid">
        <Stat label="Pérdida si falla" value={`−${fmt(risk, 0)} €`} tone="down" />
        <Stat label="Ganancia si acierta" value={`+${fmt(risk * rr, 0)} €`} tone="up" />
        <Stat label="Acierto mínimo" value={`${fmt(be * 100, 1)} %`} />
      </div>
    </div>
  )
}

/* ---------- Drawdown ---------- */
export function DrawdownWidget() {
  const [loss, setLoss] = useState(30)
  const need = (loss / (100 - loss)) * 100
  const rows = [10, 20, 30, 40, 50, 60, 75, 90]
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>¿Cuánto necesitas para recuperarte?</h4></div>
      <Slider label="Pérdida de la cuenta" value={loss} min={1} max={90} suffix=" %" onChange={setLoss} />
      <div className="dd-bars">
        <div className="dd-row"><span>Pierdes</span><div className="dd-track"><div className="dd-fill down" style={{ width: `${Math.min(100, loss / 3)}%` }} /></div><b className="mono">−{loss}%</b></div>
        <div className="dd-row"><span>Necesitas</span><div className="dd-track"><div className="dd-fill up" style={{ width: `${Math.min(100, need / 3)}%` }} /></div><b className="mono">+{fmt(need, 1)}%</b></div>
      </div>
      <div className="table-wrap">
        <table className="mini-table">
          <thead><tr><th>Pérdida</th>{rows.map((r) => <th key={r}>−{r}%</th>)}</tr></thead>
          <tbody><tr><td>Para recuperar</td>{rows.map((r) => <td key={r} className="mono">+{fmt((r / (100 - r)) * 100, 0)}%</td>)}</tr></tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------- Fibonacci ---------- */
const FIB = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
export function FibWidget() {
  const [dir, setDir] = useState('Alcista')
  const [hi, setHi] = useState(2450)
  const [lo, setLo] = useState(2350)
  const [sel, setSel] = useState(0.618)
  const up = dir === 'Alcista'
  const price = (r) => (up ? hi - (hi - lo) * r : lo + (hi - lo) * r)
  const Y = (r) => (up ? 20 + r * 160 : 180 - r * 160)
  const selY = Y(sel)
  // trayectoria: impulso + retroceso hasta el nivel elegido + continuación
  const path = up
    ? `M20,180 L60,130 L80,145 L140,20 L200,${selY} L250,10`
    : `M20,20 L60,70 L80,55 L140,180 L200,${selY} L250,190`
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>Retrocesos de Fibonacci</h4></div>
      <Segmented options={['Alcista', 'Bajista']} value={dir} onChange={setDir} label="Dirección del impulso" />
      <div className="widget-grid">
        <svg viewBox="0 0 395 200" className="fib-svg" role="img" aria-label="Niveles de Fibonacci">
          {FIB.map((r) => (
            <g key={r} onClick={() => setSel(r)} style={{ cursor: 'pointer' }}>
              <line x1="0" x2="270" y1={Y(r)} y2={Y(r)} stroke={r === sel ? 'var(--accent)' : 'var(--line)'} strokeWidth={r === sel ? 2 : 1} strokeDasharray={r === 0 || r === 1 ? '' : '4 3'} />
              <text x="276" y={Y(r) + 4} className={r === sel ? 'svg-label accent' : 'svg-dim'}>{(r * 100).toFixed(1)}% · {fmt(price(r), 1)}</text>
            </g>
          ))}
          <rect x="0" y={Math.min(Y(0.618), Y(0.786))} width="270" height={Math.abs(Y(0.786) - Y(0.618))} fill="var(--accent)" opacity="0.1" />
          <path d={path} fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="200" cy={selY} r="5" fill="var(--accent)" />
        </svg>
        <div className="stack">
          <label className="field"><span className="field-label">Máximo del impulso</span><input type="number" value={hi} onChange={(e) => setHi(+e.target.value)} /></label>
          <label className="field"><span className="field-label">Mínimo del impulso</span><input type="number" value={lo} onChange={(e) => setLo(+e.target.value)} /></label>
          <p className="muted small">Toca un nivel del gráfico para simular hasta dónde retrocede el precio. La franja resaltada es la zona 61,8%–78,6%.</p>
        </div>
      </div>
    </div>
  )
}
