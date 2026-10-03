import { rng } from './utils.js'

// Genera velas OHLC que pasan por los puntos de giro (swings) indicados
export function buildCandles({ path, candles, mods = {}, seed = 1, vol = 1.5 }) {
  if (candles) return candles.map(([o, h, l, c]) => ({ o, h, l, c }))
  const r = rng(seed * 7919 + 13)
  const n = path[path.length - 1][0] + 1
  const at = (i) => {
    for (let k = 1; k < path.length; k++) {
      const [x0, y0] = path[k - 1], [x1, y1] = path[k]
      if (i <= x1) return y0 + ((y1 - y0) * (i - x0)) / (x1 - x0 || 1)
    }
    return path[path.length - 1][1]
  }
  const swing = {}
  path.forEach(([x, y], k) => {
    if (k === 0 || k === path.length - 1) return
    const a = path[k - 1][1], b = path[k + 1][1]
    if (y >= a && y >= b) swing[x] = { type: 'H', y }
    else if (y <= a && y <= b) swing[x] = { type: 'L', y }
  })
  const out = []
  let prev = at(0) + (path[1] && path[1][1] > path[0][1] ? -vol * 0.5 : vol * 0.5)
  for (let i = 0; i < n; i++) {
    const s = swing[i]
    const o = prev
    let c, h, l
    if (s && s.type === 'H') {
      c = s.y - vol * (0.25 + r() * 0.5); h = s.y
      l = Math.min(o, c) - r() * vol * 0.5
    } else if (s && s.type === 'L') {
      c = s.y + vol * (0.25 + r() * 0.5); l = s.y
      h = Math.max(o, c) + r() * vol * 0.5
    } else {
      c = at(i) + (r() - 0.5) * 2 * vol
      h = Math.max(o, c) + r() * vol * 0.6
      l = Math.min(o, c) - r() * vol * 0.6
    }
    let cd = { o, h, l, c }
    if (mods[i]) cd = { ...cd, ...mods[i] }
    cd.h = Math.max(cd.h, cd.o, cd.c)
    cd.l = Math.min(cd.l, cd.o, cd.c)
    out.push(cd)
    prev = cd.c
  }
  // Los vecinos de un swing no deben superar su extremo
  Object.entries(swing).forEach(([x, s]) => {
    const i = +x
    ;[i - 1, i + 1].forEach((j) => {
      const cd = out[j]
      if (!cd || mods[j]) return
      if (s.type === 'H' && cd.h > s.y) { cd.h = s.y - vol * 0.1; cd.o = Math.min(cd.o, cd.h); cd.c = Math.min(cd.c, cd.h) }
      if (s.type === 'L' && cd.l < s.y) { cd.l = s.y + vol * 0.1; cd.o = Math.max(cd.o, cd.l); cd.c = Math.max(cd.c, cd.l) }
    })
  })
  return out
}

