import { useMemo, useState } from 'react'
import { Slider, Segmented } from '../Field.jsx'
import { genCandles } from '../../utils.js'

function sma(vals, p) {
  return vals.map((_, i) => (i < p - 1 ? null : vals.slice(i - p + 1, i + 1).reduce((a, b) => a + b, 0) / p))
}
function ema(vals, p) {
  const k = 2 / (p + 1)
  let prev = null
  return vals.map((v, i) => {
    if (i < p - 1) return null
    if (prev === null) prev = vals.slice(0, p).reduce((a, b) => a + b, 0) / p
    else prev = v * k + prev * (1 - k)
    return prev
  })
}

export default function MAWidget() {
  const [type, setType] = useState('EMA')
  const [fast, setFast] = useState(9)
  const [slow, setSlow] = useState(30)
  const candles = useMemo(() => genCandles(110, 21, 100, 0.04, 1.1), [])
  const closes = candles.map((c) => c.c)
  const fn = type === 'EMA' ? ema : sma
  const mf = fn(closes, fast)
  const ms = fn(closes, slow)

  const W = 600, H = 240, pad = 8
  const min = Math.min(...candles.map((c) => c.l))
  const max = Math.max(...candles.map((c) => c.h))
  const X = (i) => pad + (i + 0.5) * ((W - pad * 2) / candles.length)
  const Y = (v) => pad + (1 - (v - min) / (max - min)) * (H - pad * 2)
  const bw = ((W - pad * 2) / candles.length) * 0.6
  const line = (arr) => arr.map((v, i) => (v == null ? '' : `${arr[i - 1] == null ? 'M' : 'L'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`)).join(' ')

  const crosses = []
  for (let i = 1; i < closes.length; i++) {
    if (mf[i - 1] == null || ms[i - 1] == null) continue
    const a = mf[i - 1] - ms[i - 1], b = mf[i] - ms[i]
    if (a <= 0 && b > 0) crosses.push([i, 'up'])
    if (a >= 0 && b < 0) crosses.push([i, 'down'])
  }

  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>Juega con las medias móviles</h4></div>
      <Segmented options={['SMA', 'EMA']} value={type} onChange={setType} label="Tipo de media" />
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Gráfico de velas con medias móviles">
        {candles.map((c, i) => {
          const col = c.c >= c.o ? 'var(--up)' : 'var(--down)'
          return (
            <g key={i}>
              <line x1={X(i)} x2={X(i)} y1={Y(c.h)} y2={Y(c.l)} stroke={col} strokeWidth="1" />
              <rect x={X(i) - bw / 2} y={Y(Math.max(c.o, c.c))} width={bw} height={Math.max(1, Math.abs(Y(c.o) - Y(c.c)))} fill={col} />
            </g>
          )
        })}
        <path d={line(ms)} fill="none" stroke="var(--violet)" strokeWidth="2.5" />
        <path d={line(mf)} fill="none" stroke="var(--accent)" strokeWidth="2.5" />
        {crosses.map(([i, dir]) => (
          <circle key={i} cx={X(i)} cy={Y(mf[i])} r="5" fill="none" stroke={dir === 'up' ? 'var(--up)' : 'var(--down)'} strokeWidth="2" />
        ))}
      </svg>
      <div className="legend">
        <span><i style={{ background: 'var(--accent)' }} /> {type} {fast} (rápida)</span>
        <span><i style={{ background: 'var(--violet)' }} /> {type} {slow} (lenta)</span>
        <span className="muted">○ cruces: {crosses.length}</span>
      </div>
      <div className="two-col">
        <Slider label="Media rápida" value={fast} min={3} max={50} onChange={(v) => setFast(Math.min(v, slow - 1))} />
        <Slider label="Media lenta" value={slow} min={10} max={100} onChange={(v) => setSlow(Math.max(v, fast + 1))} />
      </div>
      <p className="widget-read">Observa cómo la media corta sigue de cerca al precio y la larga filtra el ruido. Cuantos más cruces ves, más señales falsas habría dado en las zonas laterales.</p>
    </div>
  )
}
