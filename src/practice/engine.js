import { rng } from '../utils.js'
import { buildCandles } from '../candles.js'

/*
  Generador de escenarios para el modo práctica.
  Cada escenario tiene un contexto (tendencia, rango o mercado sin estructura), una parte visible
  (las velas hasta el momento de decidir) y una parte oculta (lo que pasó después).
  El desenlace es aleatorio pero con ventaja estadística a favor del contexto, como en el mercado real:
  una buena decisión puede perder y una mala puede ganar.
*/

export const VISIBLE = 50
export const FUTURE = 35
const TOTAL = VISIBLE + FUTURE

export const INSTRUMENTS = [
  { id: 'EURUSD', name: 'EUR/USD', base: 1.0825, unit: 0.00045, dec: 5, pip: 0.0001, pipName: 'pips' },
  { id: 'XAUUSD', name: 'XAU/USD', base: 2318, unit: 0.9, dec: 2, pip: 0.1, pipName: 'pips' },
  { id: 'NAS100', name: 'NAS100', base: 18150, unit: 7, dec: 1, pip: 1, pipName: 'puntos' },
  { id: 'GBPUSD', name: 'GBP/USD', base: 1.2640, unit: 0.0005, dec: 5, pip: 0.0001, pipName: 'pips' },
]
const TIMEFRAMES = ['M15', 'H1', 'H4']

const between = (r, a, b) => a + r() * (b - a)
const int = (r, a, b) => Math.round(between(r, a, b))

// ---- Recorridos (puntos de giro) de cada tipo de escenario, en unidades 0-100 ----
function trendUp(r) {
  const pts = [[0, between(r, 18, 26)]]
  let x = 0, y = pts[0][1], lastHigh = y, prevHigh = y, hl = y
  // Impulsos y retrocesos hasta la zona de decisión
  while (x < 30) {
    const up = between(r, 9, 14), upLen = int(r, 6, 9)
    x += upLen; y += up; pts.push([x, y]); prevHigh = lastHigh; lastHigh = y
    const dn = up * between(r, 0.38, 0.6), dnLen = int(r, 3, 5)
    x += dnLen; y -= dn; pts.push([x, y]); hl = y
  }
  // Último impulso y retroceso hasta el máximo anterior (ahora soporte), justo en la vela 49
  const up = between(r, 11, 15)
  x = Math.min(x + int(r, 6, 8), VISIBLE - 7); y += up; pts.push([x, y]); prevHigh = lastHigh; lastHigh = y
  const level = Math.max(prevHigh, hl + 2)
  pts.push([VISIBLE - 2, level + between(r, -0.6, 0.6)])
  pts.push([VISIBLE - 1, level + between(r, 0.8, 1.8)])
  return { pts, y: level, impulse: up, level, last: lastHigh }
}

function range(r) {
  const S = between(r, 32, 38), R = S + between(r, 14, 20)
  const pts = [[0, S + between(r, 2, 6)]]
  let x = 0, top = r() < 0.5
  while (x < VISIBLE - 10) {
    x += int(r, 5, 8)
    pts.push([x, (top ? R : S) + between(r, -1.2, 0.6) * (top ? 1 : -1)])
    top = !top
  }
  // Final: llega al techo en la vela 49
  pts.push([VISIBLE - 2, R + between(r, -0.4, 0.5)])
  pts.push([VISIBLE - 1, R - between(r, 0.8, 1.6)])
  return { pts, S, R }
}

function chop(r) {
  const pts = [[0, 50]]
  let x = 0, y = 50
  while (x < VISIBLE - 4) {
    x += int(r, 2, 6)
    y = Math.max(25, Math.min(75, y + between(r, -11, 11)))
    pts.push([x, y])
  }
  pts.push([VISIBLE - 1, 50 + between(r, -6, 6)])
  return { pts }
}

const mirror = (pts) => pts.map(([x, y]) => [x, 100 - y])

export const TYPES = {
  'trend-up': { bias: 'long', p: 0.58, name: 'Tendencia alcista', explain: 'Tendencia alcista: máximos y mínimos cada vez más altos. El precio retrocedió hasta la zona del máximo anterior, que ahora actúa como soporte. Lo profesional era buscar compras con el stop por debajo del mínimo del retroceso y un objetivo de al menos el doble del riesgo.' },
  'trend-down': { bias: 'short', p: 0.58, name: 'Tendencia bajista', explain: 'Tendencia bajista: máximos y mínimos cada vez más bajos. El precio subió hasta la zona del mínimo anterior, que ahora actúa como resistencia. Lo profesional era buscar ventas con el stop por encima del máximo del retroceso.' },
  'range-top': { bias: 'short', p: 0.52, name: 'Rango: techo', explain: 'Mercado en rango: el precio llegó al techo, donde ya había girado varias veces. Lo profesional era vender con el stop por encima del techo y el objetivo hacia el suelo del rango (o no operar si no lo veías claro).' },
  'range-bottom': { bias: 'long', p: 0.52, name: 'Rango: suelo', explain: 'Mercado en rango: el precio llegó al suelo, donde ya había rebotado varias veces. Lo profesional era comprar con el stop por debajo del suelo y el objetivo hacia el techo del rango.' },
  chop: { bias: null, p: 0.5, name: 'Sin estructura', explain: 'Mercado sin estructura: movimientos irregulares, sin máximos y mínimos ordenados ni zonas respetadas. Lo profesional era no operar: sin contexto claro no hay ventaja.' },
}
const TYPE_WEIGHTS = [['trend-up', 3], ['trend-down', 3], ['range-top', 2], ['range-bottom', 2], ['chop', 2]]

function pickType(r) {
  const total = TYPE_WEIGHTS.reduce((a, [, w]) => a + w, 0)
  let x = r() * total
  for (const [t, w] of TYPE_WEIGHTS) { if ((x -= w) < 0) return t }
  return 'chop'
}

// Lo que pasa después (parte oculta)
function future(r, type, info, win) {
  const x0 = VISIBLE - 1
  const pts = []
  if (type === 'trend-up' || type === 'trend-down') {
    const { level, impulse, last } = info
    if (win) {
      pts.push([x0 + int(r, 5, 7), level + impulse * 0.75], [x0 + int(r, 9, 12), level + impulse * 0.5], [x0 + int(r, 18, 22), Math.max(last, level + impulse) + impulse * 0.5], [x0 + 27, level + impulse * 0.9], [TOTAL - 1, level + impulse * 1.6])
    } else {
      pts.push([x0 + int(r, 3, 5), level + impulse * 0.25], [x0 + int(r, 10, 13), level - impulse * 0.8], [x0 + int(r, 16, 19), level - impulse * 0.45], [TOTAL - 1, level - impulse * 1.3])
    }
  } else if (type === 'range-top' || type === 'range-bottom') {
    const { S, R } = info
    if (win) pts.push([x0 + int(r, 9, 12), S + 2], [x0 + int(r, 15, 18), S + (R - S) * 0.4], [x0 + int(r, 23, 26), S - 1], [TOTAL - 1, S + (R - S) * 0.3])
    else pts.push([x0 + int(r, 3, 5), R - 4], [x0 + int(r, 10, 13), R + (R - S) * 0.6], [x0 + int(r, 16, 19), R + (R - S) * 0.35], [TOTAL - 1, R + (R - S) * 1.1])
  } else {
    let x = x0, y = info.lastY
    while (x < TOTAL - 4) { x += int(r, 2, 6); y = Math.max(15, Math.min(85, y + between(r, -12, 12))); pts.push([x, y]) }
    pts.push([TOTAL - 1, y + between(r, -5, 5)])
  }
  return pts
}

export function makeScenario(seed = Math.floor(Math.random() * 1e9)) {
  const r = rng(seed)
  const type = pickType(r)
  const meta = TYPES[type]
  const inst = INSTRUMENTS[Math.floor(r() * INSTRUMENTS.length)]
  const tf = TIMEFRAMES[Math.floor(r() * TIMEFRAMES.length)]
  const win = r() < meta.p

  let base, info
  if (type === 'trend-up' || type === 'trend-down') { base = trendUp(r); info = base }
  else if (type === 'range-top' || type === 'range-bottom') { base = range(r); info = base }
  else { base = chop(r); info = { lastY: base.pts[base.pts.length - 1][1] } }

  let path = [...base.pts, ...future(r, type, info, win)]
  // Bajista y suelo de rango: misma forma, reflejada
  const flip = type === 'trend-down' || type === 'range-bottom'
  if (flip) path = mirror(path)

  const units = buildCandles({ path, seed: seed % 100000, vol: 1.15 })
  const toPrice = (v) => inst.base + (v - 50) * inst.unit
  const candles = units.map((c) => ({ o: toPrice(c.o), h: toPrice(c.h), l: toPrice(c.l), c: toPrice(c.c) }))

  const vis = candles.slice(0, VISIBLE)
  const atr = vis.slice(-20).reduce((a, c) => a + (c.h - c.l), 0) / 20
  const last6 = vis.slice(-6)
  const swingLow = Math.min(...last6.map((c) => c.l))
  const swingHigh = Math.max(...last6.map((c) => c.h))
  let keyLevel = null
  if (type.startsWith('trend')) keyLevel = toPrice(flip ? 100 - info.level : info.level)
  if (type === 'range-top') keyLevel = toPrice(info.R)
  if (type === 'range-bottom') keyLevel = toPrice(100 - info.R)
  const rangeOther = type === 'range-top' ? toPrice(info.S) : type === 'range-bottom' ? toPrice(100 - info.S) : null

  return {
    seed, type, ...meta, inst, tf, candles, atr, entry: vis[VISIBLE - 1].c,
    swingLow, swingHigh, keyLevel, rangeOther,
  }
}

// Recorre las velas ocultas y decide si salta antes el stop o el objetivo
export function simulate(sc, dir, sl, tp) {
  const risk = Math.abs(sc.entry - sl)
  const fut = sc.candles.slice(VISIBLE)
  for (let i = 0; i < fut.length; i++) {
    const c = fut[i]
    const hitSL = dir === 'long' ? c.l <= sl : c.h >= sl
    const hitTP = dir === 'long' ? c.h >= tp : c.l <= tp
    // Si en la misma vela se tocan los dos, se asume lo peor (el stop)
    if (hitSL) return { exit: VISIBLE + i, price: sl, r: -1, how: 'sl' }
    if (hitTP) return { exit: VISIBLE + i, price: tp, r: Math.abs(tp - sc.entry) / risk, how: 'tp' }
  }
  const last = fut[fut.length - 1].c
  return { exit: sc.candles.length - 1, price: last, r: ((dir === 'long' ? 1 : -1) * (last - sc.entry)) / risk, how: 'end' }
}

// Evalúa la calidad de la decisión (independiente del resultado)
export function evaluate(sc, dir, sl, tp) {
  const checks = []
  const want = sc.bias
  if (dir === 'none') {
    if (!want) checks.push({ ok: true, t: 'Bien visto: sin estructura clara no había ventaja, así que no operar era lo correcto.' })
    else checks.push({ ok: null, t: `No operar nunca es un error grave, pero aquí había una oportunidad con ventaja: ${want === 'long' ? 'compras' : 'ventas'}.` })
    return { checks, score: !want ? 3 : 1 }
  }
  if (!want) checks.push({ ok: false, t: 'Operaste en un mercado sin estructura clara: ahí no hay ventaja, es casi lanzar una moneda.' })
  else if (dir === want) checks.push({ ok: true, t: `Dirección correcta: ${dir === 'long' ? 'compra' : 'venta'} a favor del contexto.` })
  else checks.push({ ok: false, t: `Operaste contra el contexto: lo lógico era ${want === 'long' ? 'comprar' : 'vender'}.` })

  const risk = Math.abs(sc.entry - sl)
  const beyond = dir === 'long' ? sl < sc.swingLow : sl > sc.swingHigh
  if (!beyond) checks.push({ ok: false, t: `Stop demasiado ajustado: está dentro del último ${dir === 'long' ? 'retroceso; colócalo por debajo del mínimo' : 'rebote; colócalo por encima del máximo'} para que el ruido normal no te saque.` })
  else if (risk > sc.atr * 4.5) checks.push({ ok: null, t: 'Stop protegido pero muy lejano: con un stop así tendrías que reducir mucho el lotaje.' })
  else checks.push({ ok: true, t: `Stop bien colocado: ${dir === 'long' ? 'por debajo del mínimo' : 'por encima del máximo'} de la estructura.` })

  const rr = Math.abs(tp - sc.entry) / risk
  if (rr >= 2) checks.push({ ok: true, t: `Buen ratio riesgo/beneficio (1:${rr.toFixed(1).replace('.', ',')}).` })
  else if (rr >= 1.5) checks.push({ ok: null, t: `Ratio justo (1:${rr.toFixed(1).replace('.', ',')}): con menos de 1:2 necesitas acertar mucho para ser rentable.` })
  else checks.push({ ok: false, t: `Ratio bajo (1:${rr.toFixed(1).replace('.', ',')}): arriesgas casi lo mismo que puedes ganar.` })

  return { checks, score: checks.filter((c) => c.ok).length }
}

export const fmtPrice = (inst, v) => v.toLocaleString('es-ES', { minimumFractionDigits: inst.dec, maximumFractionDigits: inst.dec })
export const fmtDist = (inst, d) => `${(Math.abs(d) / inst.pip).toLocaleString('es-ES', { maximumFractionDigits: 1 })} ${inst.pipName}`
export const fmtR = (r) => `${r >= 0 ? '+' : '−'}${Math.abs(r).toFixed(1).replace('.', ',')} R`
