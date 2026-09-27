import { useState } from 'react'
import { Slider } from '../Field.jsx'

const PRESETS = {
  Alcista: { o: 30, c: 75, h: 85, l: 22 },
  Bajista: { o: 72, c: 30, h: 80, l: 20 },
  Martillo: { o: 70, c: 78, h: 80, l: 15 },
  'Estrella fugaz': { o: 32, c: 25, h: 88, l: 22 },
  Doji: { o: 50, c: 51, h: 78, l: 24 },
}

export default function CandleWidget() {
  const [v, setV] = useState(PRESETS.Alcista)
  const set = (k) => (x) => {
    const n = { ...v, [k]: x }
    n.h = Math.max(n.h, n.o, n.c)
    n.l = Math.min(n.l, n.o, n.c)
    setV(n)
  }
  const bull = v.c >= v.o
  const Y = (x) => 190 - x * 1.7
  const top = Y(Math.max(v.o, v.c))
  const bot = Y(Math.min(v.o, v.c))
  const color = bull ? 'var(--up)' : 'var(--down)'
  const body = Math.abs(v.c - v.o)
  const range = v.h - v.l || 1
  const upper = v.h - Math.max(v.o, v.c)
  const lower = Math.min(v.o, v.c) - v.l

  let read = bull ? 'Vela alcista: los compradores cerraron por encima de la apertura.' : 'Vela bajista: los vendedores cerraron por debajo de la apertura.'
  if (body / range < 0.1) read = 'Doji: apertura y cierre casi iguales → indecisión.'
  else if (lower > body * 2 && upper < body) read = 'Mecha inferior larga: rechazo de precios bajos (martillo / pin bar alcista).'
  else if (upper > body * 2 && lower < body) read = 'Mecha superior larga: rechazo de precios altos (estrella fugaz / pin bar bajista).'
  else if (body / range > 0.8) read += ' Cuerpo grande y mechas cortas: mucha convicción.'

  const Label = ({ y, text, val }) => (
    <g>
      <line x1="120" x2="165" y1={y} y2={y} stroke="var(--muted)" strokeDasharray="3 3" />
      <text x="170" y={y + 4} className="svg-label">{text} <tspan className="svg-dim">{val}</tspan></text>
    </g>
  )

  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-tag">Interactivo</span>
        <h4>Anatomía de una vela</h4>
      </div>
      <div className="chips">
        {Object.keys(PRESETS).map((k) => (
          <button key={k} className="chip" onClick={() => setV(PRESETS[k])}>{k}</button>
        ))}
      </div>
      <div className="widget-grid">
        <svg viewBox="0 0 280 200" className="candle-svg" role="img" aria-label="Vela japonesa">
          <line x1="100" x2="100" y1={Y(v.h)} y2={Y(v.l)} stroke={color} strokeWidth="3" />
          <rect x="80" y={top} width="40" height={Math.max(2, bot - top)} rx="3" fill={color} />
          <Label y={Y(v.h)} text="Máximo" val={v.h} />
          <Label y={Y(bull ? v.c : v.o)} text={bull ? 'Cierre' : 'Apertura'} val={bull ? v.c : v.o} />
          <Label y={Y(bull ? v.o : v.c)} text={bull ? 'Apertura' : 'Cierre'} val={bull ? v.o : v.c} />
          <Label y={Y(v.l)} text="Mínimo" val={v.l} />
          <text x="20" y={(top + bot) / 2 + 4} className="svg-dim">cuerpo</text>
          {upper > 6 && <text x="20" y={(Y(v.h) + top) / 2 + 4} className="svg-dim">mecha</text>}
          {lower > 6 && <text x="20" y={(Y(v.l) + bot) / 2 + 4} className="svg-dim">mecha</text>}
        </svg>
        <div className="stack">
          <Slider label="Apertura" value={v.o} min={5} max={95} onChange={set('o')} />
          <Slider label="Cierre" value={v.c} min={5} max={95} onChange={set('c')} />
          <Slider label="Máximo" value={v.h} min={5} max={100} onChange={set('h')} />
          <Slider label="Mínimo" value={v.l} min={0} max={95} onChange={set('l')} />
        </div>
      </div>
      <p className="widget-read" style={{ borderColor: color }}>{read}</p>
    </div>
  )
}
