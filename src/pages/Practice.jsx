import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AuthGate from '../components/AuthGate.jsx'
import { useProgress, progress } from '../hooks/useProgress.js'
import { makeScenario, simulate, evaluate, fmtPrice, fmtDist, fmtR, VISIBLE } from '../practice/engine.js'

/*
  Modo práctica: el alumno ve un gráfico, decide (comprar, vender o no operar), coloca stop y objetivo
  y después se revelan las velas siguientes. Se evalúa la decisión y el resultado por separado.
*/

const padL = 6, padT = 14, padB = 14

function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 640px)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 640px)')
    if (!mq) return
    const on = () => setNarrow(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return narrow
}

function PracticeChart({ sc, frame, shown, dir, sl, tp, exit, done, onDrag }) {
  const narrow = useNarrow()
  // En móvil el lienzo es más estrecho y alto para que las velas y los textos se lean bien
  const W = narrow ? 400 : 720
  const H = narrow ? 460 : 380
  const padR = narrow ? 78 : 86
  const svg = useRef(null)
  const drag = useRef(null)
  const n = sc.candles.length
  const vis = sc.candles.slice(0, shown)

  // Escala vertical fija (calculada solo con lo visible al empezar, para no intuir el futuro).
  // No cambia mientras se arrastran el stop y el objetivo; solo se amplía si las velas nuevas se salen.
  let min = frame.min, max = frame.max
  if (shown > VISIBLE || done) {
    const ys = vis.slice(VISIBLE).flatMap((c) => [c.h, c.l])
    if (done && sc.keyLevel) ys.push(sc.keyLevel)
    const span = frame.max - frame.min
    if (ys.length) { min = Math.min(min, Math.min(...ys) - span * 0.04); max = Math.max(max, Math.max(...ys) + span * 0.04) }
  }
  const slot = (W - padL - padR) / n
  const X = (i) => padL + (i + 0.5) * slot
  const XR = W - padR
  const Y = (v) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB)
  const toPrice = (py) => min + (1 - (py - padT) / (H - padT - padB)) * (max - min)
  const bw = Math.max(2, slot * 0.64)

  const pointerPrice = (e) => {
    const rect = svg.current.getBoundingClientRect()
    return toPrice(((e.clientY - rect.top) / rect.height) * H)
  }
  // Arrastre relativo: la línea se mueve lo mismo que el puntero desde donde se cogió (sin saltos)
  const start = (kind, value) => (e) => {
    if (!onDrag) return
    e.preventDefault()
    drag.current = { kind, from: value, ptr: pointerPrice(e) }
    setDragging(kind)
    svg.current.setPointerCapture?.(e.pointerId)
  }
  const move = (e) => {
    const d = drag.current
    if (!d) return
    e.preventDefault()
    onDrag(d.kind, d.from + (pointerPrice(e) - d.ptr))
  }
  const end = () => { drag.current = null; setDragging(null) }
  const [dragging, setDragging] = useState(null)

  // Móvil: al tocar una línea no debe desplazarse la página
  useEffect(() => {
    const el = svg.current
    if (!el) return
    const onStart = (e) => { if (e.target.closest?.('.pr-handle')) e.preventDefault() }
    const onMove = (e) => { if (drag.current) e.preventDefault() }
    el.addEventListener('touchstart', onStart, { passive: false })
    el.addEventListener('touchmove', onMove, { passive: false })
    return () => { el.removeEventListener('touchstart', onStart); el.removeEventListener('touchmove', onMove) }
  }, [])

  const ticks = [0.15, 0.38, 0.62, 0.85].map((g) => min + g * (max - min))
  const xE = X(VISIBLE - 1) + slot / 2
  const xEnd = exit != null ? X(exit) + slot / 2 : XR
  const trade = dir !== 'none' && sl != null

  return (
    <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className={`pr-svg ${narrow ? 'narrow' : ''} ${onDrag ? 'editing' : ''} ${dragging ? 'dragging' : ''}`} onPointerMove={move} onPointerUp={end} onPointerCancel={end} role="img" aria-label={`Gráfico de ${sc.inst.name}`}>
      {ticks.map((v) => (
        <g key={v}>
          <line x1="0" x2={XR} y1={Y(v)} y2={Y(v)} stroke="var(--line)" />
          <text x={XR + 6} y={Y(v) + 4} className="pr-axis">{fmtPrice(sc.inst, v)}</text>
        </g>
      ))}
      <line x1={XR} x2={XR} y1="0" y2={H} stroke="var(--line)" />
      {/* Zona del futuro (aún oculta) */}
      {shown <= VISIBLE && <rect x={xE} y="0" width={XR - xE} height={H} fill="var(--bg-soft)" opacity="0.55" />}
      {shown <= VISIBLE && <text x={(xE + XR) / 2} y={H / 2} textAnchor="middle" className="pr-future">?</text>}

      {/* Nivel clave del escenario (al terminar) */}
      {done && sc.keyLevel && (
        <g className="ann">
          <line x1={padL} x2={XR} y1={Y(sc.keyLevel)} y2={Y(sc.keyLevel)} stroke="var(--violet)" strokeDasharray="6 4" strokeWidth="1.5" />
          <text x={padL + 4} y={Y(sc.keyLevel) - 6} className="pr-label" fill="var(--violet)">{sc.type.startsWith('range') ? (sc.type === 'range-top' ? 'Techo del rango' : 'Suelo del rango') : sc.type === 'trend-up' ? 'Soporte (máximo anterior)' : 'Resistencia (mínimo anterior)'}</text>
        </g>
      )}
      {done && sc.rangeOther && (
        <line x1={padL} x2={XR} y1={Y(sc.rangeOther)} y2={Y(sc.rangeOther)} stroke="var(--violet)" strokeDasharray="6 4" strokeWidth="1.2" opacity="0.6" />
      )}

      {/* Operación */}
      {trade && (
        <g>
          <rect x={xE} width={Math.max(0, xEnd - xE)} y={Math.min(Y(sc.entry), Y(tp))} height={Math.abs(Y(tp) - Y(sc.entry))} fill="var(--up)" opacity="0.14" />
          <rect x={xE} width={Math.max(0, xEnd - xE)} y={Math.min(Y(sc.entry), Y(sl))} height={Math.abs(Y(sl) - Y(sc.entry))} fill="var(--down)" opacity="0.14" />
          <line x1={xE} x2={XR} y1={Y(sc.entry)} y2={Y(sc.entry)} stroke="var(--text)" strokeWidth="1.2" />
        </g>
      )}

      {vis.map((c, i) => {
        const up = c.c >= c.o
        const cc = up ? 'var(--up)' : 'var(--down)'
        const future = i >= VISIBLE
        return (
          <g key={i} className={future ? 'cin' : ''} opacity={exit != null && i > exit ? 0.35 : 1}>
            <line x1={X(i)} x2={X(i)} y1={Y(c.h)} y2={Y(c.l)} stroke={cc} strokeWidth="1.2" />
            <rect x={X(i) - bw / 2} y={Y(Math.max(c.o, c.c))} width={bw} height={Math.max(1.2, Math.abs(Y(c.o) - Y(c.c)))} fill={cc} rx="0.8" />
          </g>
        )
      })}

      {/* Líneas arrastrables de stop y objetivo */}
      {trade && [['tp', tp, 'var(--up)', 'TP'], ['sl', sl, 'var(--down)', 'SL']].map(([k, v, c, lab]) => (
        <g key={k} className={onDrag ? `pr-handle ${dragging === k ? 'active' : ''}` : ''} onPointerDown={start(k, v)}>
          <line x1={xE} x2={XR} y1={Y(v)} y2={Y(v)} stroke={c} strokeWidth="2" strokeDasharray={onDrag ? '' : '5 3'} />
          {onDrag && <rect x={xE} y={Y(v) - (narrow ? 22 : 16)} width={W - xE} height={narrow ? 44 : 32} fill="transparent" />}
          <rect x={XR + 2} y={Y(v) - 10} width={padR - 4} height="20" rx="5" fill={c} />
          <text x={XR + padR / 2} y={Y(v) + 4} textAnchor="middle" className="pr-tag">{lab} {fmtPrice(sc.inst, v)}</text>
          {onDrag && <g transform={`translate(${xE + (XR - xE) / 2},${Y(v)})`}><rect x="-17" y="-8" width="34" height="16" rx="8" fill="var(--bg-elev)" stroke={c} /><text y="4" textAnchor="middle" className="pr-grip" fill={c}>⇕</text></g>}
        </g>
      ))}
      {trade && (
        <g>
          <rect x={XR + 2} y={Y(sc.entry) - 10} width={padR - 4} height="20" rx="5" fill="var(--text)" />
          <text x={XR + padR / 2} y={Y(sc.entry) + 4} textAnchor="middle" className="pr-tag inv">{fmtPrice(sc.inst, sc.entry)}</text>
        </g>
      )}
      {exit != null && done && (
        <circle cx={X(exit)} cy={Y(simulateExitPrice(sc, dir, sl, tp))} r="5" fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="2.5" />
      )}
    </svg>
  )
}
const simulateExitPrice = (sc, dir, sl, tp) => simulate(sc, dir, sl, tp).price

function Spark({ hist }) {
  if (!hist || hist.length < 2) return null
  let acc = 0
  const pts = [0, ...hist.map((r) => (acc += r))]
  const min = Math.min(...pts), max = Math.max(...pts)
  const w = 160, h = 40
  const x = (i) => (i / (pts.length - 1)) * w
  const y = (v) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6)
  const last = pts[pts.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="pr-spark" aria-label="Evolución de tus últimas operaciones">
      <line x1="0" x2={w} y1={y(0)} y2={y(0)} stroke="var(--line)" strokeDasharray="3 3" />
      <polyline points={pts.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={last >= 0 ? 'var(--up)' : 'var(--down)'} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function Stats() {
  const { practice: p } = useProgress()
  const winRate = p.n ? Math.round((p.wins / p.n) * 100) : 0
  const quality = p.d ? Math.round((p.good / p.d) * 100) : 0
  return (
    <div className="pr-stats">
      <div className="stat card"><b className="mono">{p.d || 0}</b><span>Escenarios</span></div>
      <div className="stat card"><b className="mono">{p.n ? `${winRate}%` : '—'}</b><span>Acierto ({p.n || 0} operaciones)</span></div>
      <div className="stat card"><b className={`mono ${(p.r || 0) >= 0 ? 'up' : 'down'}`}>{fmtR(p.r || 0)}</b><span>Resultado total</span><Spark hist={p.hist} /></div>
      <div className="stat card"><b className="mono">{p.d ? `${quality}%` : '—'}</b><span>Decisiones perfectas</span></div>
    </div>
  )
}

export default function Practice() {
  const [sc, setSc] = useState(() => makeScenario())
  const [phase, setPhase] = useState('decide') // decide | plan | play | done
  const [dir, setDir] = useState(null)
  const [sl, setSl] = useState(null)
  const [tp, setTp] = useState(null)
  const [shown, setShown] = useState(VISIBLE)
  const [hint, setHint] = useState(false)
  const [res, setRes] = useState(null)
  const timer = useRef(null)

  const risk = sl != null ? Math.abs(sc.entry - sl) : 0
  const rr = sl != null ? Math.abs(tp - sc.entry) / (risk || 1) : 0

  const choose = useCallback((d) => {
    if (phase !== 'decide') return
    setDir(d)
    if (d === 'none') { play(d, null, null); return }
    const s = d === 'long' ? sc.entry - sc.atr * 1.1 : sc.entry + sc.atr * 1.1
    const r = Math.abs(sc.entry - s)
    setSl(s); setTp(d === 'long' ? sc.entry + 2 * r : sc.entry - 2 * r)
    setPhase('plan')
  }, [phase, sc]) // eslint-disable-line react-hooks/exhaustive-deps

  // Marco de precios del gráfico: rango visible con margen arriba y abajo para colocar stop y objetivo
  const frame = useMemo(() => {
    const vis = sc.candles.slice(0, VISIBLE)
    const lo = Math.min(...vis.map((c) => c.l)), hi = Math.max(...vis.map((c) => c.h))
    const span = hi - lo
    return { min: lo - span * 0.3, max: hi + span * 0.3 }
  }, [sc])

  const onDrag = useCallback((kind, raw) => {
    const minDist = sc.atr * 0.15
    const edge = (frame.max - frame.min) * 0.02
    const price = Math.min(frame.max - edge, Math.max(frame.min + edge, raw))
    if (kind === 'sl') {
      const v = dir === 'long' ? Math.min(price, sc.entry - minDist) : Math.max(price, sc.entry + minDist)
      setSl(v)
    } else {
      const v = dir === 'long' ? Math.max(price, sc.entry + minDist) : Math.min(price, sc.entry - minDist)
      setTp(v)
    }
  }, [dir, sc, frame])

  const setRR = (k) => onDrag('tp', dir === 'long' ? sc.entry + k * risk : sc.entry - k * risk)
  const nudgeSl = (sign) => onDrag('sl', sl + sign * sc.atr * 0.2)

  function play(d = dir, s = sl, t = tp) {
    setPhase('play')
    const sim = d === 'none' ? null : simulate(sc, d, s, t)
    const ev = evaluate(sc, d, s, t)
    const stopAt = sim ? sim.exit : sc.candles.length - 1
    let k = VISIBLE
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      k += 1
      setShown(k)
      if (k > stopAt) {
        clearInterval(timer.current)
        setShown(sc.candles.length)
        setRes({ sim, ev })
        setPhase('done')
        progress.recordPractice(sim ? sim.r : null, ev.score === 3)
      }
    }, 110)
  }
  useEffect(() => () => clearInterval(timer.current), [])

  const skip = () => {
    clearInterval(timer.current)
    const sim = dir === 'none' ? null : simulate(sc, dir, sl, tp)
    const ev = evaluate(sc, dir, sl, tp)
    setShown(sc.candles.length); setRes({ sim, ev }); setPhase('done')
    progress.recordPractice(sim ? sim.r : null, ev.score === 3)
  }

  const next = useCallback(() => {
    clearInterval(timer.current)
    setSc(makeScenario()); setPhase('decide'); setDir(null); setSl(null); setTp(null)
    setShown(VISIBLE); setHint(false); setRes(null)
  }, [])

  // Atajos: C comprar, V vender, N no operar, Enter ejecutar / siguiente
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.metaKey || e.ctrlKey) return
      const k = e.key.toLowerCase()
      if (phase === 'decide') { if (k === 'c') choose('long'); if (k === 'v') choose('short'); if (k === 'n') choose('none') }
      if (k === 'enter') { if (phase === 'plan') play(); else if (phase === 'done') next() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }) // eslint-disable-line react-hooks/exhaustive-deps

  const outcome = useMemo(() => {
    if (!res) return null
    if (!res.sim) {
      const move = sc.candles[sc.candles.length - 1].c - sc.entry
      return { title: 'No operaste', text: `El precio ${move >= 0 ? 'subió' : 'bajó'} ${fmtDist(sc.inst, move)} en las ${sc.candles.length - VISIBLE} velas siguientes.`, cls: 'ok' }
    }
    const { r, how } = res.sim
    return {
      title: fmtR(r),
      text: how === 'tp' ? 'El precio alcanzó tu objetivo.' : how === 'sl' ? 'El precio tocó tu stop.' : 'Ni stop ni objetivo: la operación se cerró al final del escenario.',
      cls: r > 0 ? 'good' : r < 0 ? 'bad' : 'ok',
    }
  }, [res, sc])

  return (
    <div className="container page practice">
      <header className="page-head">
        <span className="eyebrow">Modo práctica</span>
        <h1>Simulador de decisiones</h1>
        <p className="lead muted">Lee el gráfico, decide si comprar, vender o no operar, coloca tu stop y tu objetivo… y mira qué pasó después. Sin dinero real: solo entrenamiento.</p>
      </header>

      <AuthGate title="Crea tu cuenta gratis para practicar" text="El simulador guarda tus decisiones, tus estadísticas y tus insignias en tu cuenta. Registrarse es gratis y tardas menos de un minuto.">
      <Stats />

      <section className="pr-board card">
        <div className="pr-head">
          <div className="pr-sym"><b>{sc.inst.name}</b><span className="mono muted small">{sc.tf} · escenario #{String(sc.seed).slice(-5)}</span></div>
          {phase === 'decide' && <button className="btn ghost sm" onClick={() => setHint((h) => !h)}>{hint ? 'Ocultar pista' : '💡 Pista'}</button>}
          {phase === 'done' && <span className="badge">{sc.name}</span>}
        </div>
        {hint && phase === 'decide' && <p className="pr-hint small">Antes de decidir, fíjate en tres cosas: ¿hay máximos y mínimos ordenados (tendencia) o el precio rebota entre dos niveles (rango)? ¿Está el precio en una zona importante? ¿Dónde pondrías el stop para que el ruido normal no te saque?</p>}

        <PracticeChart sc={sc} frame={frame} shown={shown} dir={dir} sl={sl} tp={tp} exit={res?.sim?.exit} done={phase === 'done'} onDrag={phase === 'plan' ? onDrag : null} />

        {phase === 'decide' && (
          <div className="pr-actions">
            <p className="muted small">El precio actual es la última vela. ¿Qué haces?</p>
            <div className="pr-btns">
              <button className="btn pr-buy" onClick={() => choose('long')}>▲ Comprar</button>
              <button className="btn pr-sell" onClick={() => choose('short')}>▼ Vender</button>
              <button className="btn ghost" onClick={() => choose('none')}>No operar</button>
            </div>
            <p className="muted small hide-sm">Atajos: C comprar · V vender · N no operar</p>
          </div>
        )}

        {phase === 'plan' && (
          <div className="pr-actions">
            <p className="small"><b>{dir === 'long' ? 'Compra' : 'Venta'} a {fmtPrice(sc.inst, sc.entry)}.</b> Arrastra las líneas de <span className="down">SL</span> y <span className="up">TP</span> sobre el gráfico o usa los botones.</p>
            <div className="pr-plan">
              <div className="pr-plan-item"><span className="muted small">Riesgo</span><b className="mono">{fmtDist(sc.inst, risk)}</b></div>
              <div className="pr-plan-item"><span className="muted small">Beneficio</span><b className="mono">{fmtDist(sc.inst, tp - sc.entry)}</b></div>
              <div className="pr-plan-item"><span className="muted small">Ratio</span><b className={`mono ${rr >= 2 ? 'up' : rr < 1.5 ? 'down' : ''}`}>1:{rr.toFixed(1).replace('.', ',')}</b></div>
            </div>
            <div className="pr-btns">
              <span className="segmented">
                <button className="" onClick={() => nudgeSl(dir === 'long' ? 1 : -1)}>Stop más cerca</button>
                <button className="" onClick={() => nudgeSl(dir === 'long' ? -1 : 1)}>Stop más lejos</button>
              </span>
              <span className="segmented">
                {[1, 2, 3].map((k) => <button key={k} className={Math.abs(rr - k) < 0.05 ? 'on' : ''} onClick={() => setRR(k)}>1:{k}</button>)}
              </span>
            </div>
            <div className="pr-btns">
              <button className="btn primary" onClick={() => play()}>Ejecutar y ver qué pasa →</button>
              <button className="btn ghost sm" onClick={() => { setPhase('decide'); setDir(null); setSl(null); setTp(null) }}>Cambiar decisión</button>
            </div>
          </div>
        )}

        {phase === 'play' && (
          <div className="pr-actions">
            <p className="muted small">Reproduciendo las velas siguientes…</p>
            <button className="btn ghost sm" onClick={skip}>Saltar al final</button>
          </div>
        )}

        {phase === 'done' && outcome && (
          <div className="pr-result">
            <div className={`quiz-result ${outcome.cls}`}>
              <div className="quiz-score mono">{outcome.title}</div>
              <div><p className="small">{outcome.text}</p></div>
              <button className="btn primary" onClick={next}>Siguiente escenario →</button>
            </div>
            <div className="pr-eval">
              <h3>Tu decisión <span className="muted small">({res.ev.score}/3)</span></h3>
              <ul className="pr-checks">
                {res.ev.checks.map((c, i) => <li key={i} className={c.ok === true ? 'ok' : c.ok === false ? 'ko' : 'meh'}><span aria-hidden>{c.ok === true ? '✓' : c.ok === false ? '✗' : '≈'}</span>{c.t}</li>)}
              </ul>
              <h3>Qué había en el gráfico</h3>
              <p className="small">{sc.explain}</p>
              <p className="muted small">Recuerda: una buena decisión puede salir mal y una mala puede salir bien. Lo que te hace rentable es repetir muchas veces decisiones con ventaja y riesgo controlado.</p>
            </div>
          </div>
        )}
      </section>
      </AuthGate>
      <p className="muted small">Los escenarios son simulados con fines educativos: imitan situaciones típicas de mercado, pero no son datos reales.</p>
    </div>
  )
}
