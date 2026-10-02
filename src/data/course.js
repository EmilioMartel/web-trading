import { fundamentos } from './fundamentos.js'
import { indicadores, fundamental, psicologia, sistemaProfesional } from './complementos.js'
import { riesgo } from './riesgo.js'
import { i1, i2, i3, i4 } from './institucional.js'
import { t1, t2 } from './tecnico-1.js'
import { t3, t4 } from './tecnico-2.js'
import { t5 } from './tecnico-3.js'
import { extra1 } from './quiz-extra-1.js'
import { extra2 } from './quiz-extra-2.js'
import { extra3 } from './quiz-extra-3.js'
import { extra4 } from './quiz-extra-4.js'

const extraQuiz = { ...extra1, ...extra2, ...extra3, ...extra4 }
export const PASS_RATE = 0.8 // % mínimo para dar un módulo por dominado

export const tracks = [
  { id: 'base', name: 'Base', desc: 'Lo que todo trader necesita antes de elegir método', color: 'green', hex: '#22c55e' },
  { id: 'tecnico', name: 'Análisis técnico', desc: 'Estructura, zonas, patrones, Fibonacci y confluencias', color: 'gold', hex: '#f5b301' },
  { id: 'institucional', name: 'Análisis institucional', desc: 'Estructura interna, order blocks, imbalances y liquidez', color: 'violet', hex: '#a78bfa' },
  { id: 'complementos', name: 'Complementos', desc: 'Indicadores, fundamentales, psicología y tu sistema', color: 'blue', hex: '#38bdf8' },
]

const all = [
  fundamentos,
  riesgo,
  t1, t2, t3, t4, t5,
  i1, i2, i3, i4,
  indicadores, fundamental, psicologia, sistemaProfesional,
]
const order = tracks.map((t) => t.id)
export const modules = all
  .map((m, i) => ({ ...m, _i: i }))
  .sort((a, b) => order.indexOf(a.track) - order.indexOf(b.track) || a._i - b._i)
  .map((m, i) => ({ ...m, n: i + 1, quiz: [...m.quiz, ...(extraQuiz[m.id] || [])] }))

export const lessons = modules.flatMap((m) =>
  m.lessons.map((l, i) => ({ ...l, moduleId: m.id, moduleN: m.n, moduleTitle: m.title, track: m.track, n: i + 1 }))
)
export const findLesson = (slug) => lessons.find((l) => l.slug === slug)
export const findModule = (id) => modules.find((m) => m.id === id)
export const findTrack = (id) => tracks.find((t) => t.id === id)
export const trackTone = (id) => findTrack(id)?.hex || '#22c55e'
export const totalMinutes = lessons.reduce((a, l) => a + l.minutes, 0)
