import { useMemo, useState } from 'react'
import { Slider, Stat } from '../Field.jsx'
import { fmt, rng } from '../../utils.js'

const SIMS = 40

export default function MonteCarlo() {
  const [win, setWin] = useState(45)
  const [rr, setRr] = useState(2)
  const [risk, setRisk] = useState(1)
  const [trades, setTrades] = useState(100)
  const [seed, setSeed] = useState(1)

  const sim = useMemo(() => {
    const r = rng(seed * 9973)
    const paths = []
    const finals = [], dds = [], streaks = []
    for (let s = 0; s < SIMS; s++) {
      let eq = 100, peak = 100, maxDD = 0, streak = 0, maxStreak = 0
      const path = [eq]
      for (let t = 0; t < trades; t++) {
        const riskAmt = eq * (risk / 100)
        if (r() < win / 100) { eq += riskAmt * rr; streak = 0 }
        else { eq -= riskAmt; streak++; maxStreak = Math.max(maxStreak, streak) }
        peak = Math.max(peak, eq)
        maxDD = Math.max(maxDD, (peak - eq) / peak)
        path.push(eq)
      }
      paths.push(path); finals.push(eq); dds.push(maxDD); streaks.push(maxStreak)
    }
    const sorted = [...finals].sort((a, b) => a - b)
    return {
      paths,
      median: sorted[Math.floor(SIMS / 2)],
      best: sorted[SIMS - 1],
      worst: sorted[0],
      profitable: finals.filter((f) => f > 100).length / SIMS,
      worstDD: Math.max(...dds),
      avgDD: dds.reduce((a, b) => a + b, 0) / SIMS,
      maxStreak: Math.max(...streaks),
      bestIdx: finals.indexOf(sorted[SIMS - 1]),
      worstIdx: finals.indexOf(sorted[0]),
    }
  }, [win, rr, risk, trades, seed])

  const exp = (win / 100) * rr - (1 - win / 100)
  const W = 600, H = 260, pad = 10
  const all = sim.paths.flat()
  const min = Math.min(...all, 100), max = Math.max(...all, 100)
  const X = (i) => pad + (i / trades) * (W - pad * 2)
  const Y = (v) => pad + (1 - (v - min) / (max - min || 1)) * (H - pad * 2)
  const d = (p) => p.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')

  return (
    <div className="widget">
      <div className="widget-head"><span className="widget-tag">Simulador</span><h4>Simulador de curva de capital</h4></div>
      <p className="muted small">{SIMS} simulaciones aleatorias de tu sistema. Cada línea es un posible futuro con las mismas estadísticas.</p>
      <div className="two-col">
        <Slider label="Tasa de acierto" value={win} min={20} max={80} suffix=" %" onChange={setWin} />
        <Slider label="Ratio medio (R)" value={rr} min={0.5} max={4} step={0.1} format={(x) => `1:${fmt(x, 1)}`} onChange={setRr} />
        <Slider label="Riesgo por operación" value={risk} min={0.25} max={10} step={0.25} suffix=" %" format={(x) => fmt(x)} onChange={setRisk} />
        <Slider label="Número de operaciones" value={trades} min={20} max={300} step={10} onChange={setTrades} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" role="img" aria-label="Curvas de capital simuladas">
        <line x1={pad} x2={W - pad} y1={Y(100)} y2={Y(100)} stroke="var(--muted)" strokeDasharray="4 4" />
        {sim.paths.map((p, i) => (
          <path key={i} d={d(p)} fill="none" stroke={p[p.length - 1] >= 100 ? 'var(--up)' : 'var(--down)'} strokeOpacity="0.25" strokeWidth="1.2" />
        ))}
        <path d={d(sim.paths[sim.bestIdx])} fill="none" stroke="var(--up)" strokeWidth="2.2" />
        <path d={d(sim.paths[sim.worstIdx])} fill="none" stroke="var(--down)" strokeWidth="2.2" />
        <text x={pad + 4} y={Y(100) - 6} className="svg-dim">Capital inicial</text>
      </svg>
      <div className="stat-grid">
        <Stat label="Expectativa" value={`${exp >= 0 ? '+' : ''}${fmt(exp)} R`} tone={exp >= 0 ? 'up' : 'down'} />
        <Stat label="Resultado mediano" value={`${fmt(sim.median - 100, 1)} %`} tone={sim.median >= 100 ? 'up' : 'down'} />
        <Stat label="Mejor / peor" value={`${fmt(sim.best - 100, 0)}% / ${fmt(sim.worst - 100, 0)}%`} />
        <Stat label="Simulaciones en beneficio" value={`${fmt(sim.profitable * 100, 0)} %`} />
        <Stat label="Drawdown máx. (peor caso)" value={`−${fmt(sim.worstDD * 100, 1)} %`} tone="down" />
        <Stat label="Racha perdedora más larga" value={`${sim.maxStreak} seguidas`} />
      </div>
      <button className="btn ghost" onClick={() => setSeed((s) => s + 1)}>↻ Simular de nuevo</button>
      {risk >= 5 && <p className="note warn-note">Con un {fmt(risk)}% de riesgo por operación, fíjate en el drawdown del peor caso. Por eso los profesionales arriesgan 0,5–2%.</p>}
    </div>
  )
}
