import { useEffect, useState } from 'react'
import { Slider, Segmented, Stat } from '../Field.jsx'
import { fmt } from '../../utils.js'

/* ---------- Unidad de riesgo a partir de tus límites ---------- */
export function RiskUnitWidget() {
  const [maxDD, setMaxDD] = useState(10)
  const [streak, setStreak] = useState(10)
  const [weekly, setWeekly] = useState(3)
  const [daily, setDaily] = useState(1)
  const raw = maxDD / streak
  const udr = Math.max(0.25, Math.floor(raw * 4) / 4)
  const perWeek = Math.floor(weekly / udr + 1e-9)
  const perDay = Math.floor(daily / udr + 1e-9)
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Calculadora</span><h4>¿Cuál debe ser tu unidad de riesgo?</h4></div>
      <p className="muted small">La unidad de riesgo no se elige al azar: sale de lo que estás dispuesto a perder como máximo y de la peor racha que puede tener tu estrategia.</p>
      <div className="two-col">
        <Slider label="Pérdida máxima total de la cuenta" value={maxDD} min={3} max={25} suffix=" %" onChange={setMaxDD} />
        <Slider label="Peor racha de pérdidas esperada (con margen)" value={streak} min={3} max={20} suffix=" seguidas" onChange={setStreak} />
        <Slider label="Límite de pérdida semanal" value={weekly} min={1} max={10} step={0.5} suffix=" %" format={(x) => fmt(x, 1)} onChange={setWeekly} />
        <Slider label="Límite de pérdida diaria" value={daily} min={0.5} max={5} step={0.25} suffix=" %" format={(x) => fmt(x)} onChange={setDaily} />
      </div>
      <div className="stat-grid">
        <Stat label="Unidad de riesgo máxima" value={`${fmt(udr)} %`} tone="accent" />
        <Stat label="Pérdidas seguidas hasta tu límite total" value={`${Math.floor(maxDD / udr + 1e-9)}`} />
        <Stat label="Pérdidas por semana antes de parar" value={`${perWeek}`} />
        <Stat label="Pérdidas por día antes de parar" value={`${perDay}`} />
      </div>
      {perDay === 0 && <p className="note warn-note">Tu límite diario es menor que una sola unidad de riesgo: súbelo o reduce la unidad.</p>}
      <p className="muted small">Redondeado hacia abajo en pasos de 0,25%. La mayoría de traders trabaja entre 0,5% y 2%.</p>
    </div>
  )
}

/* ---------- Matriz tasa de acierto × ratio ---------- */
const WR = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
const RR = [1, 1.5, 2, 2.5, 3, 4]
export function WinRateMatrix() {
  const [sel, setSel] = useState([40, 2])
  const [w, r] = sel
  const e = (w / 100) * r - (1 - w / 100)
  const wins = Math.round(w / 10), losses = 10 - wins
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>Tasa de acierto vs ratio: ¿es rentable?</h4></div>
      <p className="muted small">Cada casilla muestra la expectativa en R por operación. Verde = rentable, rojo = pierde dinero. Toca una casilla.</p>
      <div className="table-wrap">
        <table className="matrix">
          <thead><tr><th>Acierto ↓ / Ratio →</th>{RR.map((x) => <th key={x}>1:{fmt(x, x % 1 ? 1 : 0)}</th>)}</tr></thead>
          <tbody>
            {WR.map((wr) => (
              <tr key={wr}>
                <th>{wr}%</th>
                {RR.map((rr) => {
                  const ev = (wr / 100) * rr - (1 - wr / 100)
                  const a = Math.min(1, Math.abs(ev) / 1.2)
                  const on = wr === w && rr === r
                  return (
                    <td key={rr} className={`mono ${on ? 'on' : ''}`} onClick={() => setSel([wr, rr])}
                      style={{ background: ev >= 0 ? `color-mix(in srgb, var(--up) ${8 + a * 45}%, transparent)` : `color-mix(in srgb, var(--down) ${8 + a * 45}%, transparent)` }}>
                      {ev >= 0 ? '+' : ''}{fmt(ev)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="widget-read">
        Con un <b>{w}%</b> de acierto y ratio <b>1:{fmt(r, r % 1 ? 1 : 0)}</b>, de cada 10 operaciones arriesgando 1%: ganas {wins} × {fmt(r, r % 1 ? 1 : 0)}% = <b className="up">+{fmt(wins * r, 1)}%</b>, pierdes {losses} × 1% = <b className="down">−{losses}%</b> → resultado <b className={wins * r - losses >= 0 ? 'up' : 'down'}>{wins * r - losses >= 0 ? '+' : ''}{fmt(wins * r - losses, 1)}%</b>. Expectativa: {e >= 0 ? '+' : ''}{fmt(e)} R por operación.
      </p>
    </div>
  )
}

/* ---------- Beneficios parciales ---------- */
export function PartialsWidget() {
  const [w, setW] = useState(40)
  const [r, setR] = useState(2)
  const [at, setAt] = useState(1)
  const [pct, setPct] = useState(50)
  const [q, setQ] = useState(0)
  const atE = Math.min(at, Math.max(0.5, r - 0.5))
  const W = w / 100, P = pct / 100, Q = q / 100
  const noPartial = W * r - (1 - W)
  const winGain = P * atE + (1 - P) * r
  const loserTouch = P * atE - (1 - P) // perdedora que tocó el parcial y luego fue a stop
  const withPartial = W * winGain + (1 - W) * ((1 - Q) * -1 + Q * loserTouch)
  const better = withPartial > noPartial + 1e-9
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Simulador</span><h4>¿Te conviene cerrar parciales?</h4></div>
      <div className="two-col">
        <Slider label="Tasa de acierto" value={w} min={20} max={80} suffix=" %" onChange={setW} />
        <Slider label="Ratio del take profit (R)" value={r} min={1} max={5} step={0.5} format={(x) => `1:${fmt(x, 1)}`} onChange={setR} />
        <Slider label="Cierro parcial al llegar a" value={atE} min={0.5} max={Math.max(0.5, r - 0.5)} step={0.5} format={(x) => `${fmt(x, 1)} R`} onChange={setAt} />
        <Slider label="Porcentaje que cierro" value={pct} min={10} max={90} step={10} suffix=" %" onChange={setPct} />
        <Slider label="Perdedoras que tocan el parcial antes del stop" value={q} min={0} max={80} step={5} suffix=" %" onChange={setQ} />
      </div>
      <div className="stat-grid">
        <Stat label="Sin parciales" value={`${noPartial >= 0 ? '+' : ''}${fmt(noPartial)} R / op.`} tone={noPartial >= 0 ? 'up' : 'down'} />
        <Stat label="Con parciales" value={`${withPartial >= 0 ? '+' : ''}${fmt(withPartial)} R / op.`} tone={withPartial >= 0 ? 'up' : 'down'} />
        <Stat label="Ganancia de una ganadora" value={`${fmt(r, 1)} R → ${fmt(winGain, 2)} R`} />
        <Stat label="En 100 operaciones (1% riesgo)" value={`${fmt(noPartial * 100, 0)}% vs ${fmt(withPartial * 100, 0)}%`} />
      </div>
      <p className="widget-read">
        {better
          ? 'Con estos datos los parciales mejoran el resultado: muchas operaciones perdedoras pasan antes por tu nivel de parcial.'
          : 'Con estos datos los parciales empeoran el resultado: recortas tus ganadoras y casi no salvas perdedoras. Compruébalo con tu propio backtest antes de usarlos.'}
      </p>
    </div>
  )
}

/* ---------- Checklist ---------- */
const TEMPLATES = {
  'Filtros de riesgo': [
    'No hay noticias de alto impacto en las próximas horas',
    'No he llegado a mi límite de pérdida diaria ni semanal',
    'No vengo de un stop loss hace un momento (no busco "recuperar")',
    'Estoy tranquilo y descansado, sin problemas personales que me afecten',
    'He calculado el lotaje para arriesgar exactamente mi unidad de riesgo',
  ],
  'Técnico': [
    'Tendencia clara en la temporalidad mayor (o rango bien definido)',
    'El precio está en una zona con al menos 2 confluencias (S/R, canal, línea, Fibonacci)',
    'Cambio de estructura con cierre de cuerpo (no solo mecha)',
    'Confirmación de velas en la zona (envolvente, pinzas, rechazo)',
    'Stop detrás de la estructura y ratio coherente con mi estrategia',
  ],
  'Institucional': [
    'Estructura externa clara y a favor de mi operación',
    'El precio está en un POI válido (order block / FVG) en descuento o premium',
    'Se ha tomado liquidez antes de la reacción',
    'Cambio de estructura interno con fuerza (deja imbalance)',
    'Objetivo en un punto de liquidez claro y sin liquidez en contra cerca',
  ],
}
const KEY = 'emfx-checklist-v1'
const loadCL = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null } catch { return null } }

export function ChecklistWidget() {
  const [tpl, setTpl] = useState('Filtros de riesgo')
  const [custom, setCustom] = useState(() => loadCL()?.custom || {})
  const [checked, setChecked] = useState({})
  const [draft, setDraft] = useState('')
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ custom })) } catch {} }, [custom])
  useEffect(() => setChecked({}), [tpl])
  const items = [...TEMPLATES[tpl], ...(custom[tpl] || [])]
  const done = items.filter((_, i) => checked[i]).length
  const all = done === items.length && items.length > 0
  const add = () => {
    const t = draft.trim(); if (!t) return
    setCustom((c) => ({ ...c, [tpl]: [...(c[tpl] || []), t] })); setDraft('')
  }
  const remove = (i) => {
    const ci = i - TEMPLATES[tpl].length
    setCustom((c) => ({ ...c, [tpl]: (c[tpl] || []).filter((_, k) => k !== ci) }))
    setChecked({})
  }
  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Checklist</span><h4>¿Puedo abrir esta operación?</h4></div>
      <Segmented options={Object.keys(TEMPLATES)} value={tpl} onChange={setTpl} label="Checklist" />
      <ul className="checklist">
        {items.map((it, i) => (
          <li key={it + i} className={checked[i] ? 'on' : ''}>
            <label>
              <input type="checkbox" checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} />
              <span className="box" aria-hidden>{checked[i] ? '✓' : ''}</span>
              <span className="grow">{it}</span>
            </label>
            {i >= TEMPLATES[tpl].length && <button className="chip" onClick={() => remove(i)} aria-label="Eliminar">✕</button>}
          </li>
        ))}
      </ul>
      <div className="row gap">
        <input className="text-input grow" placeholder="Añade tu propia condición…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
        <button className="btn ghost sm" onClick={add}>Añadir</button>
      </div>
      <div className={`verdict ${all ? 'go' : 'stop'}`}>
        {all ? '✓ Todo cumplido: puedes operar según tu plan.' : `✗ ${items.length - done} condición(es) sin cumplir: no se opera. No entrar tiene riesgo cero.`}
      </div>
    </div>
  )
}
