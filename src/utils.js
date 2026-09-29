export const fmt = (n, d = 2) =>
  Number.isFinite(n) ? n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—'

export const money = (n, cur = 'USD', d = 2) =>
  Number.isFinite(n) ? `${n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d })} ${cur === 'EUR' ? '€' : '$'}` : '—'

export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Genera velas OHLC con una deriva suave (para gráficos de demo)
export function genCandles(n, seed = 7, start = 100, drift = 0.05, vol = 1.2) {
  const r = rng(seed)
  const out = []
  let price = start
  for (let i = 0; i < n; i++) {
    const wave = Math.sin(i / 9) * 0.35
    const o = price
    const c = o + (r() - 0.5) * vol * 2 + drift + wave * 0.4
    const h = Math.max(o, c) + r() * vol * 0.8
    const l = Math.min(o, c) - r() * vol * 0.8
    out.push({ o, h, l, c })
    price = c
  }
  return out
}
