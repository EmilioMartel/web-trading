import { useEffect, useRef, useState } from 'react'
import { genCandles, rng } from '../utils.js'

// Gráfico de velas "en directo" decorativo para la portada
export default function HeroChart() {
  const N = 42
  const [candles, setCandles] = useState(() => genCandles(N, 3, 100, 0.12, 1))
  const r = useRef(rng(99))
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setCandles((cs) => {
        const next = [...cs]
        const last = { ...next[next.length - 1] }
        const tick = (r.current() - 0.46) * 0.9
        last.c += tick
        last.h = Math.max(last.h, last.c)
        last.l = Math.min(last.l, last.c)
        next[next.length - 1] = last
        if (r.current() < 0.12) {
          next.shift()
          next.push({ o: last.c, c: last.c, h: last.c, l: last.c })
        }
        return next
      })
    }, 350)
    return () => clearInterval(id)
  }, [reduce])

  const W = 520, H = 300
  const min = Math.min(...candles.map((c) => c.l)) - 1
  const max = Math.max(...candles.map((c) => c.h)) + 1
  const X = (i) => 10 + (i + 0.5) * ((W - 70) / N)
  const Y = (v) => 10 + (1 - (v - min) / (max - min)) * (H - 20)
  const bw = ((W - 70) / N) * 0.62
  const last = candles[candles.length - 1]
  const up = last.c >= last.o

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="hero-chart" aria-hidden>
      {[0.2, 0.4, 0.6, 0.8].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--line)" />)}
      {candles.map((c, i) => {
        const col = c.c >= c.o ? 'var(--up)' : 'var(--down)'
        return (
          <g key={i}>
            <line x1={X(i)} x2={X(i)} y1={Y(c.h)} y2={Y(c.l)} stroke={col} strokeWidth="1.4" />
            <rect x={X(i) - bw / 2} y={Y(Math.max(c.o, c.c))} width={bw} height={Math.max(1.5, Math.abs(Y(c.o) - Y(c.c)))} rx="1" fill={col} />
          </g>
        )
      })}
      <line x1="0" x2={W - 62} y1={Y(last.c)} y2={Y(last.c)} stroke={up ? 'var(--up)' : 'var(--down)'} strokeDasharray="3 3" />
      <rect x={W - 60} y={Y(last.c) - 11} width="58" height="22" rx="4" fill={up ? 'var(--up)' : 'var(--down)'} />
      <text x={W - 31} y={Y(last.c) + 4} textAnchor="middle" className="hero-price">{(2300 + last.c * 1.5).toFixed(2)}</text>
    </svg>
  )
}
