import { useSyncExternalStore } from 'react'

const KEY = 'emfx-progress-v1'
const listeners = new Set()

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { done: [], quiz: {} } }
  catch { return { done: [], quiz: {} } }
}
let state = load()

function save(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  listeners.forEach((l) => l())
}

export const progress = {
  toggle(id) {
    const done = state.done.includes(id) ? state.done.filter((x) => x !== id) : [...state.done, id]
    save({ ...state, done })
  },
  complete(id) {
    if (!state.done.includes(id)) save({ ...state, done: [...state.done, id] })
  },
  setQuiz(moduleId, score, total) {
    const prev = state.quiz[moduleId]
    // Se guarda el mejor resultado; si el test cambió de tamaño, cuenta el nuevo
    // y la fecha en que se superó por primera vez (para el certificado)
    const today = new Date().toISOString().slice(0, 10)
    const keepPrev = prev && prev.total === total && prev.score >= score
    const best = keepPrev ? prev : { score, total, date: prev && prev.total === total && prev.date ? prev.date : today }
    if (!best.date) best.date = today
    save({ ...state, quiz: { ...state.quiz, [moduleId]: best } })
  },
  reset() { save({ done: [], quiz: {} }) },
  // Solo para pruebas: marca lecciones y tests como completados
  fill(lessonSlugs, moduleIds, total = 20) {
    const date = new Date().toISOString().slice(0, 10)
    const quiz = { ...state.quiz }
    moduleIds.forEach((id) => { quiz[id] = { score: total, total, date } })
    save({ done: [...new Set([...state.done, ...lessonSlugs])], quiz })
  },
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state
  )
}
