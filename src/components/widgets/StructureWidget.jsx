import { useState } from 'react'
import { Segmented } from '../Field.jsx'

const MODES = {
  Alcista: {
    pts: [[20, ''], [55, 'H'], [38, 'HL'], [72, 'HH'], [54, 'HL'], [90, 'HH'], [70, 'HL'], [104, 'HH']],
    breaks: [[1, 3, 'BOS'], [3, 5, 'BOS'], [5, 7, 'BOS']],
    text: 'Máximos más altos (HH) y mínimos más altos (HL). Cada ruptura de un máximo previo es un BOS: la tendencia continúa. Busca compras en los retrocesos (HL).',
  },
  Bajista: {
    pts: [[104, ''], [70, 'L'], [88, 'LH'], [52, 'LL'], [70, 'LH'], [34, 'LL'], [52, 'LH'], [18, 'LL']],
    breaks: [[1, 3, 'BOS'], [3, 5, 'BOS'], [5, 7, 'BOS']],
    text: 'Máximos más bajos (LH) y mínimos más bajos (LL). Cada nuevo mínimo es un BOS bajista. Busca ventas en los retrocesos (LH).',
  },
  Rango: {
    pts: [[40, ''], [82, 'R'], [34, 'S'], [80, 'R'], [32, 'S'], [83, 'R'], [35, 'S'], [80, 'R']],
    breaks: [],
    zone: true,
    text: 'El precio oscila entre soporte (S) y resistencia (R) sin crear nuevos máximos ni mínimos. Las estrategias de tendencia fallan aquí: o se opera en los extremos o se espera la ruptura.',
  },
  'Cambio (CHoCH)': {
    pts: [[20, ''], [55, 'H'], [38, 'HL'], [74, 'HH'], [56, 'HL'], [92, 'HH'], [42, ''], [68, 'LH'], [26, 'LL']],
    breaks: [[1, 3, 'BOS'], [3, 5, 'BOS'], [4, 6, 'CHoCH', true], [6, 8, 'BOS', true]],
    text: 'Tendencia alcista hasta que el precio rompe el último mínimo más alto (HL): eso es un CHoCH, el primer aviso de cambio. Después aparece un LH y un nuevo LL: estructura bajista confirmada.',
  },
}

export default function StructureWidget({ initial = 'Alcista' }) {
  const [mode, setMode] = useState(initial)
  const m = MODES[mode]
  const n = m.pts.length
  const X = (i) => 20 + i * (380 / (n - 1))
  const Y = (v) => 200 - v * 1.7
  const d = m.pts.map(([v], i) => `${i ? 'L' : 'M'}${X(i)},${Y(v)}`).join(' ')

  const crossX = (levelIdx, targetIdx) => {
    const lvl = m.pts[levelIdx][0]
    for (let i = levelIdx + 1; i <= targetIdx; i++) {
      const a = m.pts[i - 1][0], b = m.pts[i][0]
      if ((a - lvl) * (b - lvl) <= 0 && a !== b && i - 1 !== levelIdx) {
        return X(i - 1) + ((lvl - a) / (b - a)) * (X(i) - X(i - 1))
      }
    }
    return X(targetIdx)
  }

  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Interactivo</span><h4>Estructura de mercado</h4></div>
      <Segmented options={Object.keys(MODES)} value={mode} onChange={setMode} label="Tipo de estructura" />
      <svg viewBox="0 0 420 200" className="structure-svg" role="img" aria-label={`Estructura ${mode}`}>
        {m.zone && (
          <>
            <rect x="0" y={Y(86)} width="420" height={Y(78) - Y(86)} fill="var(--down)" opacity="0.14" />
            <rect x="0" y={Y(38)} width="420" height={Y(30) - Y(38)} fill="var(--up)" opacity="0.14" />
          </>
        )}
        {m.breaks.map(([from, to, label, bear], k) => {
          const y = Y(m.pts[from][0])
          const x2 = crossX(from, to)
          const col = label === 'CHoCH' ? 'var(--accent)' : bear ? 'var(--down)' : 'var(--up)'
          return (
            <g key={k}>
              <line x1={X(from)} x2={x2} y1={y} y2={y} stroke={col} strokeDasharray="4 3" strokeWidth="1.5" />
              <text x={(X(from) + x2) / 2} y={y + (m.pts[from][0] > m.pts[to][0] ? 14 : -6)} textAnchor="middle" className="svg-tag" fill={col}>{label}</text>
            </g>
          )
        })}
        <path d={d} fill="none" stroke="var(--text)" strokeWidth="2.5" strokeLinejoin="round" className="draw" key={mode} />
        {m.pts.map(([v, l], i) => {
          if (!l) return null
          const isHigh = i > 0 && i < n - 1 ? v > m.pts[i - 1][0] : v > m.pts[i - 1][0]
          return (
            <g key={i}>
              <circle cx={X(i)} cy={Y(v)} r="4" fill="var(--bg-elev)" stroke="var(--text)" strokeWidth="2" />
              <text x={X(i)} y={Y(v) + (isHigh ? -10 : 20)} textAnchor="middle" className="svg-label">{l}</text>
            </g>
          )
        })}
      </svg>
      <p className="widget-read">{m.text}</p>
    </div>
  )
}
