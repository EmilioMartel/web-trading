import { m1, m2 } from './m1-m2.js'
import { m3, m4 } from './m3-m4.js'
import { m5, m6 } from './m5-m6.js'
import { m7, m8 } from './m7-m8.js'

export const modules = [m1, m2, m3, m4, m5, m6, m7, m8].map((m, i) => ({ ...m, n: i + 1 }))

// Lista plana de lecciones con referencia a su módulo (para navegación anterior/siguiente)
export const lessons = modules.flatMap((m) =>
  m.lessons.map((l, i) => ({ ...l, moduleId: m.id, moduleN: m.n, moduleTitle: m.title, n: i + 1 }))
)

export const findLesson = (slug) => lessons.find((l) => l.slug === slug)
export const findModule = (id) => modules.find((m) => m.id === id)

export const levels = [
  { name: 'Principiante', desc: 'De cero absoluto a entender un gráfico', color: 'green' },
  { name: 'Intermedio', desc: 'Riesgo, herramientas, fundamentales y mente', color: 'gold' },
  { name: 'Avanzado', desc: 'Estructura, liquidez y tu propio sistema', color: 'violet' },
]

export const totalMinutes = lessons.reduce((a, l) => a + l.minutes, 0)
