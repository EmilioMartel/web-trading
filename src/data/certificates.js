import { modules, tracks, PASS_RATE } from './course.js'

const ok = 'superando con éxito todas las pruebas de evaluación.'

// Certificados disponibles. El diploma del curso completo exige superar todos los módulos.
export const CERTS = [
  { id: 'base', label: 'Base', name: 'Fundamentos del trading', code: 'FT', tracks: ['base'], tone: '#22c55e',
    body: `ha completado la formación base de trading, ${ok}`, done: '¡Has completado la formación base!' },
  { id: 'tecnico', label: 'Ruta A', name: 'Análisis técnico', code: 'AT', tracks: ['base', 'tecnico'], tone: '#f5b301',
    body: `ha completado la ruta de Análisis técnico, ${ok}`, done: '¡Has completado la ruta de Análisis técnico!' },
  { id: 'institucional', label: 'Ruta B', name: 'Análisis institucional', code: 'AI', tracks: ['base', 'institucional'], tone: '#a78bfa',
    body: `ha completado la ruta de Análisis institucional, ${ok}`, done: '¡Has completado la ruta de Análisis institucional!' },
  { id: 'complementos', label: 'Complementos', name: 'Complementos del trader', code: 'CT', tracks: ['complementos'], tone: '#38bdf8',
    body: `ha completado el bloque de Complementos del trader, ${ok}`, done: '¡Has completado los Complementos del trader!' },
  { id: 'completo', label: 'Diploma final', name: 'Programa completo de trading', code: 'PC', tracks: tracks.map((t) => t.id), tone: '#e0b43a', premium: true,
    body: 'por haber completado el programa íntegro de formación en trading, superando con éxito las pruebas de evaluación de sus {n} módulos.',
    done: '¡Has completado el programa completo de trading!' },
]

// Bloques del curso con su progreso (para el diploma)
export const trackGroups = (quiz) => tracks.map((t) => {
  const mods = modules.filter((m) => m.track === t.id)
  return { id: t.id, name: t.name, hex: t.hex, count: mods.length, okCount: mods.filter((m) => passed(quiz[m.id])).length }
})

// Si el diploma está completo, basta con mostrar ese aviso; si no, los certificados conseguidos
export const earnedBanners = (quiz, filter = () => true) => {
  const done = CERTS.filter((c) => filter(c) && certStatus(c, quiz).complete)
  return done.some((c) => c.premium) ? done.filter((c) => c.premium) : done
}

export const passed = (q) => !!q && q.total > 0 && q.score / q.total >= PASS_RATE

// Estado de un certificado según los resultados de los tests guardados
export function certStatus(cert, quiz) {
  const mods = modules.filter((m) => cert.tracks.includes(m.track))
  const rows = mods.map((m) => ({ m, q: quiz[m.id], ok: passed(quiz[m.id]) }))
  const okCount = rows.filter((r) => r.ok).length
  const complete = okCount === rows.length
  const dates = rows.map((r) => r.q?.date).filter(Boolean).sort()
  const lastDate = complete ? dates[dates.length - 1] || new Date().toISOString().slice(0, 10) : null
  return { mods, rows, okCount, total: rows.length, complete, lastDate }
}

// Identificador corto y estable a partir del nombre, la ruta y la fecha
export function certId(cert, name, date) {
  let h = 5381
  const s = `${cert.id}|${name.trim().toLowerCase()}|${date}`
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return `EMFX-${cert.code}-${h.toString(36).toUpperCase().padStart(7, '0').slice(-7)}`
}

export const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}
