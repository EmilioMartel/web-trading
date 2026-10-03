import { useEffect, useMemo, useRef, useState } from 'react'

/*
  Gráfico de ejemplo (ilustrativo) con velas generadas a partir de los puntos
  de giro (swings) y anotaciones: zonas, líneas, Fibonacci, posición (SL/TP)…
  Admite "pasos": el alumno avanza vela a vela mientras se explica el concepto.
*/

const COL = {
  up: 'var(--up)', down: 'var(--down)', accent: 'var(--accent)', violet: 'var(--violet)',
  text: 'var(--text)', muted: 'var(--muted)', blue: '#38bdf8',
}
const col = (c) => COL[c] || c || COL.accent

// Generador de velas a partir de swings (en src/candles.js)
export { buildCandles } from '../candles.js'
import { buildCandles } from '../candles.js'

const fibLabel = (r) => (r === 0 || r === 1 ? String(r) : r.toString().replace('0.', '0.'))

export default function ChartExample({ spec }) {
  const candles = useMemo(() => buildCandles(spec), [spec])
  const steps = spec.steps || null
  const [s, setS] = useState(0)
  const [playing, setPlaying] = useState(false)
  const prevShown = useRef(0)
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 560px)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 560px)')
    if (!mq) return
    const on = () => setNarrow(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  const n = candles.length
  const shown = steps ? Math.min(n, (steps[s].to ?? n - 1) + 1) : n
  const stepIdx = steps ? s : Infinity

  useEffect(() => {
    if (!playing || !steps) return
    if (s >= steps.length - 1) { setPlaying(false); return }
    const id = setTimeout(() => setS((x) => x + 1), 2200)
    return () => clearTimeout(id)
  }, [playing, s, steps])
  useEffect(() => { prevShown.current = shown })

  // Escalas
  const W = 560, H = narrow ? 440 : 300, padL = 8, padR = 64, padT = 16, padB = 16
  const ys = candles.flatMap((c) => [c.h, c.l])
  ;(spec.ann || []).forEach((a) => {
    ;['y', 'y1', 'y2', 'entry', 'sl', 'tp'].forEach((k) => typeof a[k] === 'number' && ys.push(a[k]))
    if (a.t === 'fib') (a.levels || [0, 0.5, 0.618, 0.786, 1]).forEach((lv) => ys.push(a.y2 + (a.y1 - a.y2) * lv))
  })
  let min = Math.min(...ys), max = Math.max(...ys)
  const pad = (max - min) * 0.06 || 1
  min -= pad; max += pad
  const slot = (W - padL - padR) / n
  const X = (i) => padL + (i + 0.5) * slot
  const XR = W - padR
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB)
  const bw = Math.min(26, Math.max(2, slot * 0.62))

  const visible = (a) => (a.step ?? 0) <= stepIdx && (a.until === undefined || !steps || stepIdx <= a.until)

  const renderAnn = (a, k) => {
    if (!visible(a)) return null
    const c = col(a.c)
    const x2 = a.x2 === undefined ? null : a.x2
    switch (a.t) {
      case 'zone': {
        const xa = X(a.x1) - slot / 2, xb = x2 === null ? XR : X(x2) + slot / 2
        const ya = Y(Math.max(a.y1, a.y2)), yb = Y(Math.min(a.y1, a.y2))
        return (
          <g key={k} className="ann">
            <rect x={xa} y={ya} width={Math.max(0, xb - xa)} height={Math.max(2, yb - ya)} fill={c} opacity={a.o ?? 0.16} stroke={c} strokeOpacity="0.5" strokeDasharray={a.dash ? '4 3' : ''} />
            {a.label && <text x={a.lx !== undefined ? X(a.lx) : xa + 4} y={a.lb ? yb + 13 : ya - 5} className="cx-label" fill={c}>{a.label}</text>}
          </g>
        )
      }
      case 'h': {
        const xa = a.x1 === undefined ? padL : X(a.x1), xb = x2 === null ? XR : X(x2)
        return (
          <g key={k} className="ann">
            <line x1={xa} x2={xb} y1={Y(a.y)} y2={Y(a.y)} stroke={c} strokeWidth={a.w || 1.6} strokeDasharray={a.dash === false ? '' : '5 4'} />
            {a.label && <text x={a.lx !== undefined ? X(a.lx) : xb - 4} y={Y(a.y) + (a.lb ? 15 : -6)} className="cx-label" fill={c} textAnchor={a.lx !== undefined ? 'middle' : 'end'}>{a.label}</text>}
          </g>
        )
      }
      case 'line': {
        let xa = X(a.x1), ya = Y(a.y1), xb = X(a.x2), yb = Y(a.y2)
        if (a.ext) { const m = (yb - ya) / (xb - xa); yb = yb + m * (XR - xb); xb = XR }
        return (
          <g key={k} className="ann">
            <line x1={xa} x2={xb} y1={ya} y2={yb} stroke={c} strokeWidth={a.w || 1.8} strokeDasharray={a.dash ? '6 4' : ''} />
            {a.label && <text x={xb + 4} y={yb + 4} className="cx-label" fill={c}>{a.label}</text>}
          </g>
        )
      }
      case 'txt':
        return <text key={k} x={X(a.x)} y={Y(a.y) + (a.pos === 'b' ? 16 : -8)} textAnchor="middle" className="cx-label ann" fill={c}>{a.text}</text>
      case 'pt':
        return (
          <g key={k} className="ann">
            <circle cx={X(a.x)} cy={Y(a.y)} r="4" fill="var(--bg-elev)" stroke={c} strokeWidth="2" />
            <text x={X(a.x)} y={Y(a.y) + (a.pos === 'b' ? 18 : -9)} textAnchor="middle" className="cx-label" fill={c}>{a.text}</text>
          </g>
        )
      case 'arrow': {
        const x = X(a.x), y = Y(a.y), d = a.dir === 'down' ? 1 : -1
        return <path key={k} className="ann" d={`M${x},${y} l-7,${-d * 12} h4 v${-d * 12} h6 v${d * 12} h4 z`} fill={c} opacity="0.9" transform={`translate(0,${d * -4})`} />
      }
      case 'fib': {
        const levels = a.levels || [0, 0.5, 0.618, 0.786, 1]
        const xa = X(Math.min(a.x1, a.x2)), xb = a.x3 !== undefined ? X(a.x3) : XR
        return (
          <g key={k} className="ann">
            <line x1={X(a.x1)} y1={Y(a.y1)} x2={X(a.x2)} y2={Y(a.y2)} stroke="var(--muted)" strokeDasharray="2 3" />
            {levels.map((lv) => {
              const p = a.y2 + (a.y1 - a.y2) * lv
              const tone = lv < 0 ? COL.blue : lv === 0.618 || lv === 0.786 || lv === 0.705 ? COL.accent : lv === 0.5 ? COL.violet : COL.muted
              return (
                <g key={lv}>
                  <line x1={xa} x2={xb} y1={Y(p)} y2={Y(p)} stroke={tone} strokeWidth={lv === 0.618 || lv === 0.786 ? 1.5 : 1} strokeDasharray={lv === 0 || lv === 1 ? '' : '4 3'} opacity="0.9" />
                  <text x={xb + 4} y={Y(p) + 4} className="cx-fib" fill={tone}>{fibLabel(lv)}</text>
                </g>
              )
            })}
            {a.band && (() => { const p1 = a.y2 + (a.y1 - a.y2) * 0.618, p2 = a.y2 + (a.y1 - a.y2) * 0.786; return <rect x={xa} width={xb - xa} y={Y(Math.max(p1, p2))} height={Math.abs(Y(p1) - Y(p2))} fill={COL.accent} opacity="0.12" /> })()}
          </g>
        )
      }
      case 'trade': {
        const xa = X(a.x) - slot / 2, xb = a.x2 === undefined ? XR : X(a.x2) + slot / 2
        const rr = Math.abs((a.tp - a.entry) / (a.entry - a.sl))
        const yE = Y(a.entry), yS = Y(a.sl), yT = Y(a.tp)
        return (
          <g key={k} className="ann">
            <rect x={xa} width={xb - xa} y={Math.min(yE, yT)} height={Math.abs(yT - yE)} fill={COL.up} opacity="0.18" stroke={COL.up} strokeOpacity="0.6" />
            <rect x={xa} width={xb - xa} y={Math.min(yE, yS)} height={Math.abs(yS - yE)} fill={COL.down} opacity="0.18" stroke={COL.down} strokeOpacity="0.6" />
            <line x1={xa} x2={xb} y1={yE} y2={yE} stroke="var(--text)" strokeWidth="1.5" />
            <text x={XR + 4} y={yT + 4} className="cx-label" fill={COL.up}>TP</text>
            <text x={XR + 4} y={yE + 4} className="cx-label" fill="var(--text)">Entrada</text>
            <text x={XR + 4} y={yS + 4} className="cx-label" fill={COL.down}>SL</text>
            <text x={(xa + xb) / 2} y={(yE + yT) / 2 + 4} textAnchor="middle" className="cx-rr">1:{rr.toFixed(Math.abs(rr - Math.round(rr)) < 0.05 ? 0 : 1).replace('.', ',')}</text>
          </g>
        )
      }
      default:
        return null
    }
  }

  const grid = [0.2, 0.4, 0.6, 0.8].map((g) => padT + g * (H - padT - padB))

  return (
    <figure className="chart-ex">
      <div className="cx-head">
        <div>
          {spec.title && <b>{spec.title}</b>}
          {spec.symbol && <span className="mono muted small"> · {spec.symbol}</span>}
        </div>
        <span className="cx-tag">Ejemplo ilustrativo</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title || 'Gráfico de ejemplo'}>
        {grid.map((y) => <line key={y} x1="0" x2={XR} y1={y} y2={y} stroke="var(--line)" />)}
        <line x1={XR} x2={XR} y1="0" y2={H} stroke="var(--line)" />
        {(spec.ann || []).filter((a) => a.t === 'zone' || a.t === 'fib' || a.t === 'trade').map(renderAnn)}
        {candles.slice(0, shown).map((cd, i) => {
          const up = cd.c >= cd.o
          const cc = cd.col ? col(cd.col) : up ? COL.up : COL.down
          const isNew = steps && i >= prevShown.current && s > 0
          return (
            <g key={i} className={isNew ? 'cin' : ''} style={isNew ? { animationDelay: `${(i - prevShown.current) * 60}ms` } : undefined}>
              <line x1={X(i)} x2={X(i)} y1={Y(cd.h)} y2={Y(cd.l)} stroke={cc} strokeWidth="1.3" />
              <rect x={X(i) - bw / 2} y={Y(Math.max(cd.o, cd.c))} width={bw} height={Math.max(1.5, Math.abs(Y(cd.o) - Y(cd.c)))} fill={cc} rx="1" />
            </g>
          )
        })}
        {(spec.ann || []).filter((a) => !(a.t === 'zone' || a.t === 'fib' || a.t === 'trade')).map(renderAnn)}
      </svg>
      {steps ? (
        <div className="cx-steps">
          <p className="cx-text" aria-live="polite"><span className="mono cx-n">{s + 1}/{steps.length}</span>{steps[s].text}</p>
          <div className="cx-ctrl">
            <button className="btn ghost sm" onClick={() => { setPlaying(false); setS((x) => Math.max(0, x - 1)) }} disabled={s === 0} aria-label="Paso anterior">←</button>
            <button className="btn ghost sm" onClick={() => { if (s >= steps.length - 1) { setS(0); setPlaying(true) } else setPlaying((p) => !p) }}>
              {playing ? '❚❚ Pausa' : s >= steps.length - 1 ? '↺ Repetir' : '▶ Reproducir'}
            </button>
            <button className="btn primary sm" onClick={() => { setPlaying(false); setS((x) => Math.min(steps.length - 1, x + 1)) }} disabled={s >= steps.length - 1} aria-label="Paso siguiente">Siguiente →</button>
          </div>
        </div>
      ) : (
        spec.note && <figcaption className="cx-text">{spec.note}</figcaption>
      )}
    </figure>
  )
}
