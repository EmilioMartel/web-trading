import { modules, lessons, tracks } from '../data/course.js'
import { CERTS, certStatus, passed } from '../data/certificates.js'
import { BADGES } from '../data/badges.js'
import { streakInfo, addDays, dayStr } from '../hooks/useProgress.js'
import { channel } from '../lib/source.js'

/*
  Cálculos del panel privado a partir de los perfiles de Firestore (users/{uid}).
  Todo se calcula en el navegador del administrador.
*/

const toDay = (ts) => {
  if (!ts) return null
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return isNaN(d) ? null : dayStr(d)
}

const lessonSet = new Set(lessons.map((l) => l.slug))

// Resumen por usuario (lo que se ve en la tabla)
export function summarizeUser(u) {
  const p = u.progress || {}
  const done = (p.done || []).filter((s) => lessonSet.has(s))
  const quiz = p.quiz || {}
  const days = p.days || []
  const tests = modules.filter((m) => quiz[m.id])
  const testsOk = modules.filter((m) => passed(quiz[m.id]))
  const certs = CERTS.filter((c) => certStatus(c, quiz).complete)
  const st = streakInfo(days)
  const lastActivity = [...days].sort().pop() || u.lastSeen || toDay(u.updatedAt) || toDay(u.createdAt)
  const pr = p.practice || {}
  return {
    uid: u.uid,
    name: u.name || '(sin nombre)',
    email: u.email || '',
    created: toDay(u.createdAt),
    lastActivity,
    lastSeen: u.lastSeen || null,
    verified: u.verified === true ? true : u.verified === false ? false : null,
    channel: channel(u.source && Object.keys(u.source).length ? u.source : null),
    source: u.source || null,
    lessons: done.length,
    doneSet: new Set(done),
    tests: tests.length,
    testsOk: testsOk.length,
    avgScore: tests.length ? tests.reduce((a, m) => a + quiz[m.id].score / quiz[m.id].total, 0) / tests.length : null,
    certs: certs.map((c) => c.id),
    streak: st.current,
    bestStreak: st.best,
    activeDays: days.length,
    days,
    review: Object.keys(p.review || {}).length,
    reviewOk: p.stats?.reviewOk || 0,
    mastered: p.stats?.mastered || 0,
    badges: Object.keys(p.badges || {}),
    practice: { d: pr.d || 0, n: pr.n || 0, wins: pr.wins || 0, r: pr.r || 0, good: pr.good || 0 },
    quiz,
    rawReview: p.review || {},
  }
}

const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)

export function computeStats(rawUsers) {
  const users = rawUsers.map(summarizeUser)
  const N = users.length
  const today = dayStr()
  const lastNDays = (n) => Array.from({ length: n }, (_, k) => addDays(today, -(n - 1 - k)))
  const activeWithin = (n) => users.filter((u) => u.lastActivity && u.lastActivity >= addDays(today, -(n - 1))).length

  // Registros y actividad por día (últimos 30 días)
  const days30 = lastNDays(30)
  const signups = days30.map((d) => ({ d, v: users.filter((u) => u.created === d).length }))
  const active = days30.map((d) => ({ d, v: users.filter((u) => u.days.includes(d)).length }))

  // Embudo
  const funnel = [
    { label: 'Cuentas creadas', v: N },
    { label: 'Han visto 1 lección o más', v: users.filter((u) => u.lessons > 0).length },
    { label: 'Han hecho algún test', v: users.filter((u) => u.tests > 0).length },
    { label: 'Han aprobado algún test', v: users.filter((u) => u.testsOk > 0).length },
    { label: 'Tienen algún certificado', v: users.filter((u) => u.certs.length > 0).length },
    { label: 'Diploma final', v: users.filter((u) => u.certs.includes('completo')).length },
  ]

  // Canales de origen
  const chMap = {}
  users.forEach((u) => { chMap[u.channel] = (chMap[u.channel] || 0) + 1 })
  const channels = Object.entries(chMap).map(([label, v]) => ({ label, v })).sort((a, b) => b.v - a.v)

  // Módulos, en el orden del curso
  const mods = modules.map((m) => {
    const slugs = m.lessons.map((l) => l.slug)
    const started = users.filter((u) => slugs.some((s) => u.doneSet.has(s))).length
    const finished = users.filter((u) => slugs.every((s) => u.doneSet.has(s))).length
    const took = users.filter((u) => u.quiz[m.id])
    const ok = took.filter((u) => passed(u.quiz[m.id])).length
    const avg = took.length ? took.reduce((a, u) => a + u.quiz[m.id].score / u.quiz[m.id].total, 0) / took.length : null
    const track = tracks.find((t) => t.id === m.track)
    return { id: m.id, n: m.n, title: m.title, track: track?.name, hex: track?.hex, lessons: slugs.length, started, finished, took: took.length, ok, avg }
  })

  // Lecciones más y menos vistas
  const lessonViews = lessons.map((l) => ({ slug: l.slug, title: l.title, module: l.moduleTitle, v: users.filter((u) => u.doneSet.has(l.slug)).length }))

  // Preguntas más falladas (las que están en el repaso de los alumnos)
  const qMap = {}
  users.forEach((u) => Object.values(u.rawReview).forEach((r) => {
    const k = `${r.m}:${r.i}`
    qMap[k] = qMap[k] || { m: r.m, i: r.i, users: 0, misses: 0 }
    qMap[k].users += 1
    qMap[k].misses += r.miss || 1
  }))
  const hardQuestions = Object.values(qMap).map((x) => {
    const mod = modules.find((m) => m.id === x.m)
    const q = mod?.quiz[x.i]
    return q ? { ...x, module: mod.title, q: q.q, answer: q.options[q.answer] } : null
  }).filter(Boolean).sort((a, b) => b.users - a.users || b.misses - a.misses).slice(0, 15)

  // Certificados e insignias
  const certs = CERTS.map((c) => ({ id: c.id, label: c.name, v: users.filter((u) => u.certs.includes(c.id)).length }))
  const badges = BADGES.map((b) => ({ id: b.id, label: `${b.icon} ${b.name}`, v: users.filter((u) => u.badges.includes(b.id)).length })).sort((a, b) => b.v - a.v)

  // Racha
  const streakBuckets = [
    { label: 'Sin racha', test: (s) => s === 0 },
    { label: '1–2 días', test: (s) => s >= 1 && s <= 2 },
    { label: '3–6 días', test: (s) => s >= 3 && s <= 6 },
    { label: '7–29 días', test: (s) => s >= 7 && s <= 29 },
    { label: '30+ días', test: (s) => s >= 30 },
  ].map((b) => ({ label: b.label, v: users.filter((u) => b.test(u.streak)).length }))

  // Práctica
  const practicers = users.filter((u) => u.practice.d > 0)
  const P = practicers.reduce((a, u) => ({ d: a.d + u.practice.d, n: a.n + u.practice.n, wins: a.wins + u.practice.wins, r: a.r + u.practice.r, good: a.good + u.practice.good }), { d: 0, n: 0, wins: 0, r: 0, good: 0 })

  // Repaso
  const reviewUsers = users.filter((u) => u.review > 0 || u.reviewOk > 0)

  return {
    users, N,
    kpi: {
      total: N,
      new7: users.filter((u) => u.created && u.created >= addDays(today, -6)).length,
      new30: users.filter((u) => u.created && u.created >= addDays(today, -29)).length,
      active1: activeWithin(1),
      active7: activeWithin(7),
      active30: activeWithin(30),
      verified: users.filter((u) => u.verified === true).length,
      verifiedKnown: users.filter((u) => u.verified !== null).length,
      lessonsTotal: users.reduce((a, u) => a + u.lessons, 0),
      testsOkTotal: users.reduce((a, u) => a + u.testsOk, 0),
      certsTotal: users.reduce((a, u) => a + u.certs.length, 0),
      avgLessons: N ? users.reduce((a, u) => a + u.lessons, 0) / N : 0,
    },
    signups, active, funnel, channels, mods, lessonViews, hardQuestions, certs, badges, streakBuckets,
    practice: { users: practicers.length, ...P, winRate: pct(P.wins, P.n), quality: pct(P.good, P.d), avgR: P.n ? P.r / P.n : 0 },
    review: { users: reviewUsers.length, pending: users.reduce((a, u) => a + u.review, 0), ok: users.reduce((a, u) => a + u.reviewOk, 0), mastered: users.reduce((a, u) => a + u.mastered, 0) },
  }
}

// CSV para abrir en Excel o Google Sheets
export function usersCsv(users) {
  const cols = [
    ['Nombre', (u) => u.name], ['Correo', (u) => u.email], ['Alta', (u) => u.created || ''], ['Última actividad', (u) => u.lastActivity || ''],
    ['Verificado', (u) => (u.verified === null ? '' : u.verified ? 'sí' : 'no')], ['Origen', (u) => u.channel],
    ['UTM campaña', (u) => u.source?.campaign || ''], ['Página de entrada', (u) => u.source?.landing || ''],
    ['Lecciones', (u) => u.lessons], ['Tests hechos', (u) => u.tests], ['Tests aprobados', (u) => u.testsOk],
    ['Nota media %', (u) => (u.avgScore == null ? '' : Math.round(u.avgScore * 100))], ['Certificados', (u) => u.certs.join(' ')],
    ['Racha', (u) => u.streak], ['Mejor racha', (u) => u.bestStreak], ['Días activos', (u) => u.activeDays],
    ['En repaso', (u) => u.review], ['Dominadas', (u) => u.mastered], ['Escenarios práctica', (u) => u.practice.d],
    ['Operaciones práctica', (u) => u.practice.n], ['Resultado práctica R', (u) => String(u.practice.r).replace('.', ',')], ['Insignias', (u) => u.badges.length],
  ]
  const esc = (v) => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
  const rows = [cols.map((c) => c[0]).join(';'), ...users.map((u) => cols.map(([, f]) => esc(f(u))).join(';'))]
  return '﻿' + rows.join('\r\n')
}
