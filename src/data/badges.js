import { lessons, modules } from './course.js'
import { CERTS, certStatus, passed } from './certificates.js'
import { streakInfo } from '../hooks/useProgress.js'

/*
  Insignias: se calculan a partir del progreso. Cuando una se cumple por primera vez,
  se guarda la fecha en progress.badges y se muestra un aviso.
*/
const half = Math.ceil(lessons.length / 2)
const certOk = (id) => (c) => c.certs.has(id)

export const BADGES = [
  { id: 'first-lesson', icon: '📖', name: 'Primeros pasos', desc: 'Completa tu primera lección', group: 'Lecciones', test: (c) => c.lessons >= 1 },
  { id: 'lessons-10', icon: '📚', name: 'Buen ritmo', desc: 'Completa 10 lecciones', group: 'Lecciones', test: (c) => c.lessons >= 10 },
  { id: 'lessons-half', icon: '🧭', name: 'Mitad del camino', desc: `Completa ${half} lecciones`, group: 'Lecciones', test: (c) => c.lessons >= half },
  { id: 'lessons-all', icon: '🎓', name: 'Lo he leído todo', desc: `Completa las ${lessons.length} lecciones`, group: 'Lecciones', test: (c) => c.lessons >= lessons.length },

  { id: 'first-test', icon: '✅', name: 'Primer aprobado', desc: 'Supera tu primer test', group: 'Tests', test: (c) => c.tests >= 1 },
  { id: 'perfect', icon: '💯', name: 'Nota perfecta', desc: 'Acierta las 20 preguntas de un test', group: 'Tests', test: (c) => c.perfect >= 1 },
  { id: 'perfect-5', icon: '⭐', name: 'Francotirador', desc: 'Consigue 5 tests perfectos', group: 'Tests', test: (c) => c.perfect >= 5 },

  { id: 'streak-3', icon: '🔥', name: 'En marcha', desc: 'Aprende 3 días seguidos', group: 'Racha', test: (c) => c.bestStreak >= 3 },
  { id: 'streak-7', icon: '🔥', name: 'Una semana', desc: 'Aprende 7 días seguidos', group: 'Racha', test: (c) => c.bestStreak >= 7 },
  { id: 'streak-30', icon: '⚡', name: 'Disciplina de trader', desc: 'Aprende 30 días seguidos', group: 'Racha', test: (c) => c.bestStreak >= 30 },

  { id: 'review-1', icon: '🔁', name: 'Aprender del error', desc: 'Acierta tu primera pregunta en el repaso', group: 'Repaso', test: (c) => c.reviewOk >= 1 },
  { id: 'review-50', icon: '🧠', name: 'Memoria de elefante', desc: 'Acierta 50 preguntas en el repaso', group: 'Repaso', test: (c) => c.reviewOk >= 50 },
  { id: 'mastered-10', icon: '🎯', name: 'Fallos superados', desc: 'Domina 10 preguntas que habías fallado', group: 'Repaso', test: (c) => c.mastered >= 10 },

  { id: 'practice-1', icon: '🕹️', name: 'Primera operación', desc: 'Completa tu primer escenario en el modo práctica', group: 'Práctica', test: (c) => c.practiceD >= 1 },
  { id: 'practice-25', icon: '📊', name: 'Horas de pantalla', desc: 'Completa 25 escenarios de práctica', group: 'Práctica', test: (c) => c.practiceD >= 25 },
  { id: 'practice-pro', icon: '🧠', name: 'Decisiones de calidad', desc: 'Toma 10 decisiones perfectas en el modo práctica', group: 'Práctica', test: (c) => c.practiceGood >= 10 },
  { id: 'practice-plus', icon: '💹', name: 'Balance positivo', desc: 'Termina con más R ganadas que perdidas tras 20 operaciones simuladas', group: 'Práctica', test: (c) => c.practiceN >= 20 && c.practiceR > 0 },

  { id: 'cert-base', icon: '🧱', name: 'Cimientos sólidos', desc: 'Completa la formación base', group: 'Certificados', test: certOk('base') },
  { id: 'cert-tecnico', icon: '📈', name: 'Analista técnico', desc: 'Completa la ruta de Análisis técnico', group: 'Certificados', test: certOk('tecnico') },
  { id: 'cert-institucional', icon: '🏦', name: 'Mirada institucional', desc: 'Completa la ruta de Análisis institucional', group: 'Certificados', test: certOk('institucional') },
  { id: 'cert-complementos', icon: '🧩', name: 'Trader completo', desc: 'Completa los Complementos del trader', group: 'Certificados', test: certOk('complementos') },
  { id: 'cert-completo', icon: '🏆', name: 'Programa completado', desc: 'Consigue el diploma final', group: 'Certificados', test: certOk('completo') },
]

const lessonSlugs = new Set(lessons.map((l) => l.slug))

export function badgeContext(p) {
  const results = modules.map((m) => p.quiz[m.id]).filter(Boolean)
  return {
    lessons: p.done.filter((s) => lessonSlugs.has(s)).length,
    tests: results.filter(passed).length,
    perfect: results.filter((q) => q.total > 0 && q.score === q.total).length,
    bestStreak: streakInfo(p.days).best,
    reviewOk: p.stats.reviewOk || 0,
    mastered: p.stats.mastered || 0,
    practiceD: p.practice?.d || 0,
    practiceGood: p.practice?.good || 0,
    practiceN: p.practice?.n || 0,
    practiceR: p.practice?.r || 0,
    certs: new Set(CERTS.filter((c) => certStatus(c, p.quiz).complete).map((c) => c.id)),
  }
}

// Insignias que se cumplen ahora mismo
export const earnedBadges = (p) => {
  const c = badgeContext(p)
  return BADGES.filter((b) => b.test(c)).map((b) => b.id)
}
