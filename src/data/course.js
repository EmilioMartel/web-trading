import { m1 } from './m1-m2.js'
import { m4 } from './m3-m4.js'
import { riesgo } from './riesgo.js'
import { i1, i2, i3, i4 } from './institucional.js'
import { m5, m6 } from './m5-m6.js'
import { m8 } from './m7-m8.js'
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
  { id: 'base', name: 'Base', desc: 'Lo que todo trader necesita antes de elegir método', color: 'green' },
  { id: 'tecnico', name: 'Análisis técnico', desc: 'Estructura, zonas, patrones, Fibonacci y confluencias', color: 'gold' },
  { id: 'institucional', name: 'Análisis institucional', desc: 'Estructura interna, order blocks, imbalances y liquidez', color: 'violet' },
  { id: 'complementos', name: 'Complementos', desc: 'Indicadores, fundamentales, psicología y tu sistema', color: 'blue' },
]

const all = [
  { ...m1, track: 'base' },
  riesgo,
  t1, t2, t3, t4, t5,
  i1, i2, i3, i4,
  { ...m4, track: 'complementos' }, { ...m5, track: 'complementos' }, { ...m6, track: 'complementos' }, { ...m8, track: 'complementos' },
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
export const totalMinutes = lessons.reduce((a, l) => a + l.minutes, 0)
// compatibilidad
export const levels = tracks
