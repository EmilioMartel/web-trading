import { useSyncExternalStore } from 'react'

/*
  Progreso del alumno:
  - done:   lecciones vistas
  - quiz:   mejor resultado de cada test { score, total, date }
  - review: preguntas falladas pendientes de repaso (sistema de cajas: cada acierto la aleja en el tiempo)
            { 'modulo:indice': { m, i, h, box, due, miss, seen } }
  - days:   días con actividad (para la racha)
  - stats:  contadores { reviewOk, reviewFail, mastered }
  - badges: insignias conseguidas { id: fecha }
  Sin sesión se guarda solo en este navegador; con sesión, además en Firestore (ver auth.jsx).
*/
const KEY = 'emfx-progress-v1'
const EMPTY = { done: [], quiz: {}, review: {}, days: [], stats: {}, badges: {} }
const listeners = new Set()

// Días (en la hora local del alumno) entre repasos según la caja en la que está la pregunta.
// Tras acertar en la última caja, la pregunta se da por dominada y sale del repaso.
export const REVIEW_INTERVALS = [1, 3, 7, 14]

const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {})
function normalize(p) {
  return {
    done: Array.isArray(p?.done) ? p.done : [],
    quiz: obj(p?.quiz),
    review: obj(p?.review),
    days: Array.isArray(p?.days) ? p.days : [],
    stats: obj(p?.stats),
    badges: obj(p?.badges),
  }
}
function load() {
  try { return normalize(JSON.parse(localStorage.getItem(KEY))) }
  catch { return EMPTY }
}
let state = load()
let sink = null // función que sube el progreso a la nube (cuando hay sesión)

function emit(next, { upload = true } = {}) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  listeners.forEach((l) => l())
  if (upload && sink) sink(state)
}

/* ---- Fechas en hora local (la racha cuenta días del alumno, no UTC) ---- */
export const dayStr = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`
}
export const addDays = (str, n) => {
  const [y, m, d] = str.split('-').map(Number)
  return dayStr(new Date(y, m - 1, d + n))
}
const today = () => dayStr()

// Huella corta del enunciado: si una pregunta cambia de texto, su repaso antiguo se descarta
export const qHash = (text) => {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return h.toString(36)
}

// Añade hoy a los días con actividad (se guardan como mucho los últimos 400)
const withToday = (days) => (days.includes(today()) ? days : [...days, today()].sort().slice(-400))

// Une dos progresos sin perder nada
export function mergeProgress(a, b) {
  a = normalize(a); b = normalize(b)
  const quiz = { ...a.quiz }
  for (const [id, q] of Object.entries(b.quiz)) {
    const p = quiz[id]
    if (!p) { quiz[id] = q; continue }
    if (q.total !== p.total) { quiz[id] = q.total > p.total ? q : p; continue }
    const date = [p.date, q.date].filter(Boolean).sort()[0]
    quiz[id] = { score: Math.max(p.score, q.score), total: p.total, ...(date ? { date } : {}) }
  }
  const review = { ...a.review }
  for (const [k, r] of Object.entries(b.review)) {
    if (!review[k] || (r.seen || '') > (review[k].seen || '')) review[k] = r
  }
  const stats = { ...a.stats }
  for (const [k, v] of Object.entries(b.stats)) stats[k] = Math.max(stats[k] || 0, v || 0)
  const badges = { ...a.badges }
  for (const [k, v] of Object.entries(b.badges)) if (!badges[k] || v < badges[k]) badges[k] = v
  return {
    done: [...new Set([...a.done, ...b.done])],
    quiz,
    review,
    days: [...new Set([...a.days, ...b.days])].sort().slice(-400),
    stats,
    badges,
  }
}

// Comparación sin depender del orden de las claves (Firestore no lo conserva)
const stable = (v) => (v && typeof v === 'object'
  ? Array.isArray(v) ? `[${v.map(stable).join(',')}]` : `{${Object.keys(v).sort().map((k) => `${k}:${stable(v[k])}`).join(',')}}`
  : JSON.stringify(v ?? null))
const canon = (p) => { const n = normalize(p); return stable({ ...n, done: [...n.done].sort(), days: [...n.days].sort() }) }
const same = (a, b) => canon(a) === canon(b)

export const progress = {
  get: () => state,
  toggle(id) {
    const done = state.done.includes(id) ? state.done.filter((x) => x !== id) : [...state.done, id]
    emit({ ...state, done, days: withToday(state.days) })
  },
  complete(id) {
    if (!state.done.includes(id)) emit({ ...state, done: [...state.done, id], days: withToday(state.days) })
  },
  /*
    Resultado de un test:
    - Guarda el mejor resultado (y la fecha en que se superó por primera vez, para el certificado).
    - Las preguntas falladas entran (o vuelven a la casilla de salida) en el repaso.
    - Las acertadas que estaban en el repaso avanzan una caja.
    results: [{ i: índice de la pregunta, h: huella, ok: true/false }]
  */
  setQuiz(moduleId, score, total, results = []) {
    const prev = state.quiz[moduleId]
    const t = today()
    const keepPrev = prev && prev.total === total && prev.score >= score
    const best = keepPrev ? prev : { score, total, date: prev && prev.total === total && prev.date ? prev.date : new Date().toISOString().slice(0, 10) }
    if (!best.date) best.date = new Date().toISOString().slice(0, 10)
    const review = { ...state.review }
    const stats = { ...state.stats }
    for (const r of results) {
      const k = `${moduleId}:${r.i}`
      const cur = review[k]
      if (!r.ok) review[k] = { m: moduleId, i: r.i, h: r.h, box: 0, due: addDays(t, 1), miss: (cur?.miss || 0) + 1, seen: t }
      else if (cur) {
        const box = cur.box + 1
        if (box >= REVIEW_INTERVALS.length) { delete review[k]; stats.mastered = (stats.mastered || 0) + 1 }
        else review[k] = { ...cur, box, due: addDays(t, REVIEW_INTERVALS[box]), seen: t }
      }
    }
    emit({ ...state, quiz: { ...state.quiz, [moduleId]: best }, review, stats, days: withToday(state.days) })
  },
  // Respuesta en una sesión de repaso
  answerReview(key, ok) {
    const cur = state.review[key]
    if (!cur) return
    const t = today()
    const review = { ...state.review }
    const stats = { ...state.stats, [ok ? 'reviewOk' : 'reviewFail']: (state.stats[ok ? 'reviewOk' : 'reviewFail'] || 0) + 1 }
    if (!ok) review[key] = { ...cur, box: 0, due: addDays(t, 1), miss: (cur.miss || 0) + 1, seen: t }
    else {
      const box = cur.box + 1
      if (box >= REVIEW_INTERVALS.length) { delete review[key]; stats.mastered = (stats.mastered || 0) + 1 }
      else review[key] = { ...cur, box, due: addDays(t, REVIEW_INTERVALS[box]), seen: t }
    }
    emit({ ...state, review, stats, days: withToday(state.days) })
  },
  // Quita del repaso preguntas que ya no existen o han cambiado
  dropReview(keys) {
    if (!keys.length) return
    const review = { ...state.review }
    keys.forEach((k) => delete review[k])
    emit({ ...state, review })
  },
  awardBadges(ids) {
    if (!ids.length) return
    const badges = { ...state.badges }
    ids.forEach((id) => { if (!badges[id]) badges[id] = today() })
    emit({ ...state, badges })
  },
  reset() { emit(EMPTY) },

  /* ---- Solo para pruebas (panel 🧪 en local) ---- */
  fill(lessonSlugs, moduleIds, total = 20) {
    const date = new Date().toISOString().slice(0, 10)
    const quiz = { ...state.quiz }
    moduleIds.forEach((id) => { quiz[id] = { score: total, total, date } })
    emit({ ...state, done: [...new Set([...state.done, ...lessonSlugs])], quiz, days: withToday(state.days) })
  },
  fakeStreak(n) {
    const days = Array.from({ length: n }, (_, k) => addDays(today(), -k))
    emit({ ...state, days: [...new Set([...state.days, ...days])].sort() })
  },
  fakeReview(items) {
    const review = { ...state.review }
    const t = today()
    items.forEach(({ m, i, h }) => { review[`${m}:${i}`] = { m, i, h, box: 0, due: t, miss: 1, seen: addDays(t, -1) } })
    emit({ ...state, review })
  },

  /* ---- Sincronización con la cuenta ---- */
  // Al iniciar sesión: une lo hecho en este navegador con lo guardado en la cuenta.
  // Devuelve true si la cuenta tenía menos que lo local (hay que subir el resultado).
  attach(cloud, upload) {
    const merged = mergeProgress(cloud, state)
    sink = upload
    emit(merged, { upload: false })
    return !same(merged, cloud)
  },
  // Cambios que llegan de otro dispositivo
  fromCloud(cloud) {
    if (!same(cloud, state)) emit(normalize(cloud), { upload: false })
  },
  // Al cerrar sesión, el progreso de la cuenta no se queda en el navegador
  detach() {
    if (!sink) return // no había sesión: se conserva lo hecho en este navegador
    sink = null
    emit(EMPTY, { upload: false })
  },
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state
  )
}

/* ---- Racha ---- */
export function streakInfo(days) {
  const set = new Set(days)
  const t = today()
  // La racha sigue viva si hoy o ayer hubo actividad
  let end = set.has(t) ? t : set.has(addDays(t, -1)) ? addDays(t, -1) : null
  let current = 0
  if (end) { let d = end; while (set.has(d)) { current++; d = addDays(d, -1) } }
  let best = 0, run = 0, prev = null
  for (const d of [...set].sort()) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d }
  return { current, best, activeToday: set.has(t) }
}

// Preguntas de repaso pendientes para hoy
export const dueReviews = (review) => Object.entries(review).filter(([, r]) => r.due <= today())
