import { useSyncExternalStore } from 'react'

/*
  Progreso del curso: lecciones vistas (done) y mejor resultado de cada test (quiz).
  - Sin sesión: se guarda solo en este navegador.
  - Con sesión: además se sincroniza con el perfil del usuario en Firestore (ver auth.jsx).
*/
const KEY = 'emfx-progress-v1'
const EMPTY = { done: [], quiz: {} }
const listeners = new Set()

function load() {
  try { return normalize(JSON.parse(localStorage.getItem(KEY))) }
  catch { return EMPTY }
}
function normalize(p) {
  return { done: Array.isArray(p?.done) ? p.done : [], quiz: p?.quiz && typeof p.quiz === 'object' ? p.quiz : {} }
}
let state = load()
let sink = null // función que sube el progreso a la nube (cuando hay sesión)

function emit(next, { upload = true } = {}) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  listeners.forEach((l) => l())
  if (upload && sink) sink(state)
}

// Une dos progresos sin perder nada: todas las lecciones y el mejor resultado de cada test
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
  return { done: [...new Set([...a.done, ...b.done])], quiz }
}

// Comparación sin depender del orden de las claves (Firestore no lo conserva)
const canon = (p) => {
  const n = normalize(p)
  return JSON.stringify({ done: [...n.done].sort(), quiz: Object.keys(n.quiz).sort().map((k) => [k, n.quiz[k].score, n.quiz[k].total, n.quiz[k].date || '']) })
}
const same = (a, b) => canon(a) === canon(b)

export const progress = {
  get: () => state,
  toggle(id) {
    const done = state.done.includes(id) ? state.done.filter((x) => x !== id) : [...state.done, id]
    emit({ ...state, done })
  },
  complete(id) {
    if (!state.done.includes(id)) emit({ ...state, done: [...state.done, id] })
  },
  setQuiz(moduleId, score, total) {
    const prev = state.quiz[moduleId]
    // Se guarda el mejor resultado; si el test cambió de tamaño, cuenta el nuevo
    // y la fecha en que se superó por primera vez (para el certificado)
    const today = new Date().toISOString().slice(0, 10)
    const keepPrev = prev && prev.total === total && prev.score >= score
    const best = keepPrev ? prev : { score, total, date: prev && prev.total === total && prev.date ? prev.date : today }
    if (!best.date) best.date = today
    emit({ ...state, quiz: { ...state.quiz, [moduleId]: best } })
  },
  reset() { emit(EMPTY) },
  // Solo para pruebas: marca lecciones y tests como completados
  fill(lessonSlugs, moduleIds, total = 20) {
    const date = new Date().toISOString().slice(0, 10)
    const quiz = { ...state.quiz }
    moduleIds.forEach((id) => { quiz[id] = { score: total, total, date } })
    emit({ done: [...new Set([...state.done, ...lessonSlugs])], quiz })
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
