import { useState } from 'react'
import { NumberField, Slider, Stat } from '../Field.jsx'
import { money, fmt } from '../../utils.js'

export default function Compound() {
  const [start, setStart] = useState(1000)
  const [monthly, setMonthly] = useState(100)
  const [ret, setRet] = useState(3)
  const [months, setMonths] = useState(36)

  const n = (x) => (typeof x === 'number' && isFinite(x) ? x : 0)
  const data = []
  let eq = n(start), contrib = n(start)
  data.push({ eq, contrib })
  for (let m = 1; m <= months; m++) {
    eq = eq * (1 + ret / 100) + n(monthly)
    contrib += n(monthly)
    data.push({ eq, contrib })
  }
  const last = data[data.length - 1]
  const W = 600, H = 220, pad = 10
  const max = Math.max(...data.map((d) => d.eq), 1)
  const X = (i) => pad + (i / months) * (W - pad * 2)
  const Y = (v) => H - pad - (v / max) * (H - pad * 2)
  const area = (key) => `M${X(0)},${Y(0)} ` + data.map((d, i) => `L${X(i).toFixed(1)},${Y(d[key]).toFixed(1)}`).join(' ') + ` L${X(months)},${Y(0)} Z`
  const annual = (Math.pow(1 + ret / 100, 12) - 1) * 100

  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Calculadora</span><h4>Interés compuesto</h4></div>
      <div className="form-grid">
        <NumberField label="Capital inicial" value={start} onChange={setStart} suffix="€" />
        <NumberField label="Aportación mensual" value={monthly} onChange={setMonthly} suffix="€" />
      </div>
      <div className="two-col">
        <Slider label="Rentabilidad mensual" value={ret} min={0} max={10} step={0.25} suffix=" %" format={(x) => fmt(x)} onChange={setRet} />
        <Slider label="Duración" value={months} min={6} max={120} step={6} suffix=" meses" onChange={setMonths} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Crecimiento del capital">
        <path d={area('eq')} fill="var(--up)" opacity="0.25" />
        <path d={area('contrib')} fill="var(--accent)" opacity="0.35" />
      </svg>
      <div className="legend">
        <span><i style={{ background: 'var(--up)' }} /> Beneficio compuesto</span>
        <span><i style={{ background: 'var(--accent)' }} /> Dinero aportado</span>
      </div>
      <div className="stat-grid">
        <Stat label="Capital final" value={money(last.eq, 'EUR', 0)} tone="up" />
        <Stat label="Total aportado" value={money(last.contrib, 'EUR', 0)} />
        <Stat label="Beneficio" value={money(last.eq - last.contrib, 'EUR', 0)} tone="accent" />
        <Stat label="Equivale al año a" value={`${fmt(annual, 1)} %`} />
      </div>
      {ret > 4 && <p className="note warn-note">Un {fmt(ret)}% mensual equivale a un {fmt(annual, 0)}% anual. Muy pocos gestores profesionales lo mantienen en el tiempo: sé realista con tus expectativas.</p>}
    </div>
  )
}
