import { SITE } from './config.js'

/*
  Imágenes generadas en el navegador (canvas):
  - Tarjeta vertical para historias de Instagram (1080×1920)
  - Certificado de finalización (A4 horizontal, 1754×1240)
*/

const FONT = 'Inter, "Segoe UI", system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`800 60px Inter`),
      document.fonts.load(`500 30px Inter`),
      document.fonts.load(`700 30px "JetBrains Mono"`),
    ])
  } catch { /* si no cargan, se usan las del sistema */ }
}

const toBlob = (canvas) => new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'))

// Divide un texto en líneas que quepan en un ancho máximo
function wrap(ctx, text, maxW) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w } else line = test
  }
  if (line) lines.push(line)
  return lines
}

// Pequeño logo de velas
function drawLogo(ctx, x, y, s, up = '#22c55e', down = '#ef4444') {
  const u = s / 32
  const r = (rx, ry, rw, rh, c) => { ctx.fillStyle = c; ctx.fillRect(x + rx * u, y + ry * u, rw * u, rh * u) }
  r(7, 12, 4, 10, down); r(8.5, 8, 1, 18, down)
  r(14, 9, 4, 12, up); r(15.5, 5, 1, 19, up)
  r(21, 6, 4, 9, up); r(22.5, 3, 1, 15, up)
}

// Velas decorativas de fondo
function drawCandles(ctx, x0, y0, w, h, n, alpha, seed = 7) {
  let s = seed
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  let p = h * 0.75
  const step = w / n
  ctx.globalAlpha = alpha
  for (let i = 0; i < n; i++) {
    const o = p
    const c = Math.max(h * 0.1, Math.min(h * 0.9, o - (rnd() - 0.38) * h * 0.12))
    const hi = Math.min(o, c) - rnd() * h * 0.04
    const lo = Math.max(o, c) + rnd() * h * 0.04
    const col = c < o ? '#22c55e' : '#ef4444'
    ctx.fillStyle = col
    ctx.fillRect(x0 + i * step + step * 0.47, y0 + hi, step * 0.06, lo - hi)
    ctx.fillRect(x0 + i * step + step * 0.2, y0 + Math.min(o, c), step * 0.6, Math.max(3, Math.abs(c - o)))
    p = c
  }
  ctx.globalAlpha = 1
}

/* ---------- Tarjeta para historias ---------- */
// badge: 'passed' (medalla con check) · 'cert' (medalla con estrella) · 'learning' (icono de gráfico)
// items: lista corta de puntos con check (lecciones, ideas clave…)
export async function storyCard({ kicker, title, sub, items = [], badge = 'learning', tone = '#22c55e', footer }) {
  await fontsReady()
  const W = 1080, H = 1920, CX = W / 2
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')

  // Fondo: degradado, rejilla y brillos
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#070b10'); g.addColorStop(0.55, '#0d141d'); g.addColorStop(1, '#0a1017')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 2
  for (let x = 0; x <= W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let y = 0; y <= H; y += 90) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
  const glow = (x, y, r, c) => { const gr = ctx.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H) }
  glow(CX, 560, 620, hexA(tone, 0.28))
  glow(W * 0.9, H * 0.92, 700, 'rgba(245,179,1,0.10)')
  drawCandles(ctx, -20, H - 560, W + 40, 420, 30, 0.28, 5)

  // Marca
  ctx.textBaseline = 'middle'
  ctx.font = `800 50px ${FONT}`
  const bw = 70 + 18 + ctx.measureText('EmilioMartelFx').width
  const bx = CX - bw / 2
  ctx.fillStyle = '#131c27'; roundRect(ctx, bx - 6, 96, 82, 82, 18); ctx.fill()
  drawLogo(ctx, bx, 102, 70)
  ctx.fillStyle = '#e8edf3'; ctx.fillText('EmilioMartel', bx + 88, 138)
  ctx.fillStyle = '#f5b301'; ctx.fillText('Fx', bx + 88 + ctx.measureText('EmilioMartel').width, 138)

  // Insignia
  const MY = 470, R = 175
  if (badge === 'learning') {
    ctx.fillStyle = '#131c27'; roundRect(ctx, CX - 170, MY - 150, 340, 300, 48); ctx.fill()
    ctx.strokeStyle = hexA(tone, 0.8); ctx.lineWidth = 6; roundRect(ctx, CX - 170, MY - 150, 340, 300, 48); ctx.stroke()
    const bars = [[-110, 70, 60, '#ef4444'], [-45, 35, 90, '#22c55e'], [20, -5, 100, '#22c55e'], [85, -45, 90, '#22c55e']]
    bars.forEach(([dx, dy, h, c]) => { ctx.fillStyle = c; ctx.fillRect(CX + dx, MY + dy - h / 2, 34, h); ctx.fillRect(CX + dx + 14, MY + dy - h / 2 - 22, 6, h + 44) })
  } else {
    // cintas
    ctx.fillStyle = badge === 'cert' ? '#b8860b' : '#15803d'
    ctx.beginPath(); ctx.moveTo(CX - 120, MY + 110); ctx.lineTo(CX - 60, MY + 300); ctx.lineTo(CX - 20, MY + 250); ctx.lineTo(CX + 20, MY + 310); ctx.lineTo(CX - 10, MY + 120); ctx.fill()
    ctx.beginPath(); ctx.moveTo(CX + 120, MY + 110); ctx.lineTo(CX + 60, MY + 300); ctx.lineTo(CX + 20, MY + 250); ctx.lineTo(CX - 20, MY + 310); ctx.lineTo(CX + 10, MY + 120); ctx.fill()
    // medalla
    const ring = ctx.createLinearGradient(CX - R, MY - R, CX + R, MY + R)
    ring.addColorStop(0, '#fde68a'); ring.addColorStop(0.5, '#f5b301'); ring.addColorStop(1, '#b45309')
    ctx.fillStyle = ring; ctx.beginPath(); ctx.arc(CX, MY, R, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#0d141d'; ctx.beginPath(); ctx.arc(CX, MY, R - 26, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = hexA('#f5b301', 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, MY, R - 42, 0, Math.PI * 2); ctx.stroke()
    if (badge === 'cert') {
      ctx.fillStyle = '#f5b301'; star(ctx, CX, MY, 82, 36, 5); ctx.fill()
    } else {
      ctx.strokeStyle = tone; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.beginPath(); ctx.moveTo(CX - 68, MY + 4); ctx.lineTo(CX - 18, MY + 56); ctx.lineTo(CX + 74, MY - 52); ctx.stroke()
      ctx.lineCap = 'butt'
    }
  }

  // Textos centrados
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
  let y = 870
  ctx.font = `800 36px ${MONO}`; ctx.fillStyle = tone
  ctx.fillText(kicker.toUpperCase(), CX, y)
  y += 100
  let ts = 86
  ctx.font = `800 ${ts}px ${FONT}`
  let lines = wrap(ctx, title, W - 160)
  while (lines.length > 3 && ts > 60) { ts -= 6; ctx.font = `800 ${ts}px ${FONT}`; lines = wrap(ctx, title, W - 160) }
  ctx.fillStyle = '#ffffff'
  for (const l of lines) { ctx.fillText(l, CX, y); y += ts * 1.12 }
  if (sub) {
    y += 14
    ctx.fillStyle = '#c3ccd8'; ctx.font = `500 40px ${FONT}`
    for (const l of wrap(ctx, sub, W - 200)) { ctx.fillText(l, CX, y); y += 54 }
  }

  // Lista con checks
  y += 34
  const maxRows = Math.max(0, Math.floor((H - 290 - y - 50) / 70))
  let list = items.slice(0, Math.min(5, maxRows))
  if (items.length > list.length && list.length > 1) list = [...list.slice(0, -1), `y ${items.length - list.length + 1} más`]
  if (list.length) {
    ctx.font = `600 36px ${FONT}`
    const rows = list.map((t) => { let s = t; while (ctx.measureText(s).width > W - 330 && s.length > 4) s = s.slice(0, -2); return s === t ? t : s.trimEnd() + '…' })
    const boxH = rows.length * 70 + 50
    ctx.fillStyle = 'rgba(19,28,39,0.88)'; roundRect(ctx, 90, y, W - 180, boxH, 32); ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 2; roundRect(ctx, 90, y, W - 180, boxH, 32); ctx.stroke()
    ctx.textAlign = 'left'
    rows.forEach((t, i) => {
      const ry = y + 60 + i * 70
      ctx.fillStyle = hexA(tone, 0.18); roundRect(ctx, 130, ry - 30, 46, 46, 12); ctx.fill()
      ctx.strokeStyle = tone; ctx.lineWidth = 6; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(142, ry - 7); ctx.lineTo(151, ry + 3); ctx.lineTo(166, ry - 17); ctx.stroke(); ctx.lineCap = 'butt'
      ctx.fillStyle = '#e8edf3'; ctx.fillText(t, 200, ry + 6)
    })
    ctx.textAlign = 'center'
  }

  // Pie
  const foot = footer || `Curso gratis · ${SITE.instagramHandle}`
  const pg = ctx.createLinearGradient(90, 0, W - 90, 0)
  pg.addColorStop(0, '#f5b301'); pg.addColorStop(1, '#fbbf24')
  ctx.fillStyle = pg; roundRect(ctx, 90, H - 250, W - 180, 140, 70); ctx.fill()
  let fs = 50
  ctx.font = `800 ${fs}px ${FONT}`
  while (ctx.measureText(foot).width > W - 280 && fs > 30) { fs -= 2; ctx.font = `800 ${fs}px ${FONT}` }
  ctx.fillStyle = '#111'; ctx.textBaseline = 'middle'
  ctx.fillText(foot, CX, H - 180)
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
  return toBlob(cv)
}

function hexA(hex, a) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function star(ctx, cx, cy, ro, ri, n) {
  ctx.beginPath()
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = (Math.PI / n) * i - Math.PI / 2
    ctx[i ? 'lineTo' : 'moveTo'](cx + r * Math.cos(a), cy + r * Math.sin(a))
  }
  ctx.closePath()
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

/* ---------- Certificado ---------- */
// Sello dorado con cintas
function drawSeal(ctx, cx, cy, r, top, bottom, topSize = 0.42) {
  // cintas
  const tail = (dir) => {
    ctx.beginPath()
    ctx.moveTo(cx + dir * r * 0.25, cy + r * 0.5)
    ctx.lineTo(cx + dir * r * 0.75, cy + r * 0.35)
    ctx.lineTo(cx + dir * r * 0.95, cy + r * 1.6)
    ctx.lineTo(cx + dir * r * 0.68, cy + r * 1.38)
    ctx.lineTo(cx + dir * r * 0.45, cy + r * 1.62)
    ctx.closePath()
    ctx.fillStyle = dir < 0 ? '#a87708' : '#8f6406'; ctx.fill()
  }
  tail(-1); tail(1)
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  g.addColorStop(0, '#f7d774'); g.addColorStop(0.5, '#d9a514'); g.addColorStop(1, '#a87708')
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4
  star(ctx, cx, cy, r, r * 0.9, 36); ctx.fillStyle = g; ctx.fill(); ctx.restore()
  const g2 = ctx.createLinearGradient(cx, cy - r, cx, cy + r)
  g2.addColorStop(0, '#fbe08a'); g2.addColorStop(1, '#c48f10')
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2); ctx.stroke()
  ctx.setLineDash([3, 5]); ctx.strokeStyle = 'rgba(80,55,0,0.45)'
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.76, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([])
  ctx.textAlign = 'center'; ctx.fillStyle = '#3d2b00'
  ctx.font = `800 ${Math.round(r * topSize)}px ${FONT}`; ctx.fillText(top, cx, cy + r * 0.1)
  ctx.font = `700 ${Math.round(r * 0.15)}px ${MONO}`; ctx.fillText(bottom, cx, cy + r * 0.4)
}

// Adornos en las esquinas del marco interior
function corners(ctx, x, y, w, h, color, s = 34) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2
  for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
    ctx.beginPath(); ctx.moveTo(cx + dx * s * 2, cy + dy * 10); ctx.lineTo(cx + dx * 10, cy + dy * 10); ctx.lineTo(cx + dx * 10, cy + dy * s * 2); ctx.stroke()
    ctx.beginPath(); const mx = cx + dx * 22, my = cy + dy * 22
    ctx.moveTo(mx, my - 6); ctx.lineTo(mx + 6, my); ctx.lineTo(mx, my + 6); ctx.lineTo(mx - 6, my); ctx.closePath(); ctx.fill()
  }
}

function spaced(ctx, px) { try { ctx.letterSpacing = `${px}px` } catch { /* navegadores antiguos */ } }

function brandLine(ctx, W, y, main, accent) {
  ctx.font = `800 40px ${FONT}`
  const brand = 'EmilioMartel'
  const bw = ctx.measureText(brand + 'Fx').width
  ctx.textAlign = 'left'
  ctx.fillStyle = main; ctx.fillText(brand, W / 2 - bw / 2, y)
  ctx.fillStyle = accent; ctx.fillText('Fx', W / 2 - bw / 2 + ctx.measureText(brand).width, y)
  ctx.textAlign = 'center'
}

function fitName(ctx, name, maxW, start = 96) {
  let size = start
  ctx.font = `800 ${size}px ${FONT}`
  while (ctx.measureText(name).width > maxW && size > 50) { size -= 4; ctx.font = `800 ${size}px ${FONT}` }
}

function signatureBlock(ctx, W, baseY, date, ink, soft, line) {
  ctx.textAlign = 'center'
  ctx.fillStyle = ink; ctx.font = `italic 600 46px Georgia, "Times New Roman", serif`
  ctx.fillText('Emilio Martel', 420, baseY - 18)
  ctx.strokeStyle = line; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(250, baseY); ctx.lineTo(590, baseY); ctx.stroke()
  ctx.fillStyle = soft; ctx.font = `500 24px ${FONT}`
  ctx.fillText(`Emilio Martel · ${SITE.instagramHandle}`, 420, baseY + 38)
  ctx.fillStyle = ink; ctx.font = `700 36px ${FONT}`
  ctx.fillText(date, W - 420, baseY - 18)
  ctx.beginPath(); ctx.moveTo(W - 590, baseY); ctx.lineTo(W - 250, baseY); ctx.stroke()
  ctx.fillStyle = soft; ctx.font = `500 24px ${FONT}`
  ctx.fillText('Fecha de finalización', W - 420, baseY + 38)
}

const DISCLAIMER = 'Certificado de finalización con fines formativos. No constituye titulación oficial ni asesoramiento financiero.'

/*
  cert: { code, body, premium } · modules: módulos superados · groups: bloques (solo diploma)
*/
export async function certificateCanvas({ name, cert, modules, groups = [], date, id }) {
  await fontsReady()
  return cert.premium ? diplomaCanvas({ name, cert, modules, groups, date, id }) : routeCanvas({ name, cert, modules, date, id })
}

function routeCanvas({ name, cert, modules, date, id }) {
  const W = 1754, H = 1240
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')

  ctx.fillStyle = '#fbfaf6'; ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, 0, 50, W / 2, 0, 900)
  glow.addColorStop(0, 'rgba(217,165,20,0.10)'); glow.addColorStop(1, 'rgba(217,165,20,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)
  drawCandles(ctx, 70, H - 250, W - 140, 150, 60, 0.05, 11)
  ctx.strokeStyle = '#d9a514'; ctx.lineWidth = 10; ctx.strokeRect(40, 40, W - 80, H - 80)
  ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.strokeRect(66, 66, W - 132, H - 132)
  corners(ctx, 66, 66, W - 132, H - 132, '#c9971a')

  ctx.fillStyle = '#0f172a'; roundRect(ctx, W / 2 - 46, 108, 92, 92, 20); ctx.fill()
  drawLogo(ctx, W / 2 - 40, 114, 80)
  brandLine(ctx, W, 258, '#0f172a', '#b8860b')

  ctx.fillStyle = '#9a6a00'; ctx.font = `700 30px ${MONO}`; spaced(ctx, 4)
  ctx.fillText('CERTIFICADO DE FINALIZACIÓN', W / 2, 338); spaced(ctx, 0)
  ctx.fillStyle = '#5a6677'; ctx.font = `500 32px ${FONT}`
  ctx.fillText('Se certifica que', W / 2, 420)

  fitName(ctx, name, W - 360)
  ctx.fillStyle = '#0f172a'; ctx.fillText(name, W / 2, 530)
  const lg = ctx.createLinearGradient(W / 2 - 420, 0, W / 2 + 420, 0)
  lg.addColorStop(0, 'rgba(217,165,20,0)'); lg.addColorStop(0.5, '#d9a514'); lg.addColorStop(1, 'rgba(217,165,20,0)')
  ctx.strokeStyle = lg; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(W / 2 - 420, 566); ctx.lineTo(W / 2 + 420, 566); ctx.stroke()

  ctx.fillStyle = '#334155'; ctx.font = `500 34px ${FONT}`
  let y = 640
  for (const l of wrap(ctx, cert.body, 1180)) { ctx.fillText(l, W / 2, y); y += 50 }

  ctx.fillStyle = '#5a6677'; ctx.font = `500 24px ${FONT}`
  y += 22
  for (const l of wrap(ctx, modules.map((m) => m.title).join('  ·  '), 1300)) { ctx.fillText(l, W / 2, y); y += 36 }

  const baseY = 1010
  drawSeal(ctx, W / 2, 912, 62, cert.code, 'EMFX')
  signatureBlock(ctx, W, baseY, date, '#0f172a', '#5a6677', '#0f172a')
  ctx.textAlign = 'center'
  ctx.fillStyle = '#5a6677'; ctx.font = `600 22px ${MONO}`
  ctx.fillText(`ID: ${id}`, W / 2, baseY + 66)
  ctx.font = `500 19px ${FONT}`; ctx.fillStyle = '#8391a3'
  ctx.fillText(DISCLAIMER, W / 2, H - 92)
  ctx.textAlign = 'left'
  return cv
}

// Diploma del curso completo: versión oscura y dorada
function diplomaCanvas({ name, cert, modules, groups, date, id }) {
  const W = 1754, H = 1240
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const ctx = cv.getContext('2d')
  const GOLD = '#e0b43a'

  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0a1020'); bg.addColorStop(1, '#121b30')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  const glow = ctx.createRadialGradient(W / 2, 120, 40, W / 2, 120, 900)
  glow.addColorStop(0, 'rgba(224,180,58,0.16)'); glow.addColorStop(1, 'rgba(224,180,58,0)')
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(255,255,255,0.025)'; ctx.lineWidth = 1
  for (let x = 0; x < W; x += 58) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
  for (let yy = 0; yy < H; yy += 58) { ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke() }
  drawCandles(ctx, 70, H - 260, W - 140, 160, 64, 0.09, 5)

  const fg = ctx.createLinearGradient(0, 0, W, H)
  fg.addColorStop(0, '#f7d774'); fg.addColorStop(0.5, '#b8860b'); fg.addColorStop(1, '#f7d774')
  ctx.strokeStyle = fg; ctx.lineWidth = 8; ctx.strokeRect(36, 36, W - 72, H - 72)
  ctx.strokeStyle = 'rgba(224,180,58,0.55)'; ctx.lineWidth = 1.5; ctx.strokeRect(60, 60, W - 120, H - 120)
  corners(ctx, 60, 60, W - 120, H - 120, GOLD, 40)

  ctx.fillStyle = '#020617'; roundRect(ctx, W / 2 - 44, 96, 88, 88, 20); ctx.fill()
  ctx.strokeStyle = 'rgba(224,180,58,0.6)'; ctx.lineWidth = 2; roundRect(ctx, W / 2 - 44, 96, 88, 88, 20); ctx.stroke()
  drawLogo(ctx, W / 2 - 38, 102, 76)
  brandLine(ctx, W, 236, '#f8fafc', GOLD)

  ctx.fillStyle = GOLD; ctx.font = `700 34px ${MONO}`; spaced(ctx, 10)
  ctx.fillText('DIPLOMA', W / 2, 312); spaced(ctx, 5)
  ctx.fillStyle = '#cbd5e1'; ctx.font = `600 22px ${FONT}`
  ctx.fillText('PROGRAMA COMPLETO DE TRADING', W / 2, 352); spaced(ctx, 0)

  ctx.fillStyle = '#94a3b8'; ctx.font = `500 30px ${FONT}`
  ctx.fillText('Se otorga a', W / 2, 424)
  fitName(ctx, name, W - 380, 94)
  ctx.fillStyle = '#f8fafc'; ctx.fillText(name, W / 2, 524)
  const lg = ctx.createLinearGradient(W / 2 - 440, 0, W / 2 + 440, 0)
  lg.addColorStop(0, 'rgba(224,180,58,0)'); lg.addColorStop(0.5, GOLD); lg.addColorStop(1, 'rgba(224,180,58,0)')
  ctx.strokeStyle = lg; ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(W / 2 - 440, 560); ctx.lineTo(W / 2 + 440, 560); ctx.stroke()

  ctx.fillStyle = '#cbd5e1'; ctx.font = `500 32px ${FONT}`
  let y = 624
  for (const l of wrap(ctx, cert.body.replace('{n}', modules.length), 1200)) { ctx.fillText(l, W / 2, y); y += 46 }

  // Bloques superados
  const bw = 300, gap = 22, bh = 96
  const total = groups.length * bw + (groups.length - 1) * gap
  let x = (W - total) / 2
  const by = y + 18
  for (const g of groups) {
    ctx.fillStyle = 'rgba(255,255,255,0.045)'; roundRect(ctx, x, by, bw, bh, 14); ctx.fill()
    ctx.strokeStyle = hexA(g.hex, 0.55); ctx.lineWidth = 1.5; roundRect(ctx, x, by, bw, bh, 14); ctx.stroke()
    ctx.fillStyle = g.hex; roundRect(ctx, x + bw / 2 - 26, by + 12, 52, 4, 2); ctx.fill()
    let fs = 24; ctx.font = `700 ${fs}px ${FONT}`
    while (ctx.measureText(g.name).width > bw - 28 && fs > 16) { fs--; ctx.font = `700 ${fs}px ${FONT}` }
    ctx.fillStyle = '#f8fafc'; ctx.fillText(g.name, x + bw / 2, by + 52)
    ctx.fillStyle = '#94a3b8'; ctx.font = `500 18px ${FONT}`
    ctx.fillText(`✓ ${g.count} ${g.count === 1 ? 'módulo' : 'módulos'} superados`, x + bw / 2, by + 80)
    x += bw + gap
  }

  const baseY = 1016
  drawSeal(ctx, W / 2, 920, 72, '100%', 'COMPLETADO', 0.34)
  signatureBlock(ctx, W, baseY, date, '#f8fafc', '#94a3b8', 'rgba(224,180,58,0.8)')
  ctx.textAlign = 'center'
  ctx.fillStyle = '#94a3b8'; ctx.font = `600 22px ${MONO}`
  ctx.fillText(`ID: ${id}`, W / 2, baseY + 82)
  ctx.font = `500 19px ${FONT}`; ctx.fillStyle = '#64748b'
  ctx.fillText(DISCLAIMER, W / 2, H - 84)
  ctx.textAlign = 'left'
  return cv
}

export const canvasToBlob = toBlob
