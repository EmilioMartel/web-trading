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
    const best = prev && prev.score > score ? prev : { score, total }
    save({ ...state, quiz: { ...state.quiz, [moduleId]: best } })
  },
  reset() { save({ done: [], quiz: {} }) },
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => state
  )
}
