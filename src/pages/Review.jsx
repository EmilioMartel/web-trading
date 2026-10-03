import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from '../router.jsx'
import AuthGate from '../components/AuthGate.jsx'
import { useProgress, progress, dueReviews, qHash, REVIEW_INTERVALS, addDays, dayStr } from '../hooks/useProgress.js'
import { findModule, trackTone } from '../data/course.js'
import { fmtDate } from '../data/certificates.js'

const SESSION_MAX = 20

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

// Convierte las entradas del repaso en preguntas listas para mostrar (y descarta las que ya no existen)
function buildSession(entries) {
  const bad = []
  const items = []
  for (const [key, r] of entries) {
    const mod = findModule(r.m)
    const q = mod?.quiz[r.i]
    if (!q || (r.h && r.h !== qHash(q.q))) { bad.push(key); continue }
    items.push({ key, r, mod, q, opts: shuffle(q.options.map((_, k) => k)) })
  }
  progress.dropReview(bad)
  return shuffle(items).slice(0, SESSION_MAX)
}

const Boxes = ({ box }) => (
  <span className="review-boxes" title={`Nivel ${box + 1} de ${REVIEW_INTERVALS.length}`} aria-label={`Nivel ${box + 1} de ${REVIEW_INTERVALS.length}`}>
    {REVIEW_INTERVALS.map((_, k) => <span key={k} className={k <= box ? 'on' : ''} />)}
  </span>
)

function Session({ items, onExit }) {
  const [pos, setPos] = useState(0)
  const [picked, setPicked] = useState(null)
  const [results, setResults] = useState([])
  const it = items[pos]
  const finished = pos >= items.length

  const choose = useCallback((orig) => {
    if (picked !== null || !it) return
    setPicked(orig)
    const ok = orig === it.q.answer
    progress.answerReview(it.key, ok)
    setResults((r) => [...r, { ...it, ok }])
  }, [picked, it])

  const next = useCallback(() => { setPos((p) => p + 1); setPicked(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  useEffect(() => {
    if (finished) return
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      const k = e.key.toLowerCase()
      const n = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k)
      if (n >= 0 && n < it.opts.length && picked === null) choose(it.opts[n])
      if (k === 'enter' && picked !== null) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finished, it, picked, choose, next])

  if (finished) {
    const ok = results.filter((r) => r.ok).length
    const mastered = results.filter((r) => r.ok && r.r.box + 1 >= REVIEW_INTERVALS.length).length
    return (
      <div className="quiz">
        <div className={`quiz-result ${ok === results.length ? 'good' : ok >= results.length / 2 ? 'ok' : 'bad'}`}>
          <div className="quiz-score mono">{ok}/{results.length}</div>
          <div>
            <b>{ok === results.length ? '¡Repaso perfecto!' : 'Repaso terminado'}</b>
            <p className="muted small">
              Las acertadas vuelven más adelante; las falladas, mañana.
              {mastered > 0 && ` ${mastered === 1 ? 'Una pregunta ya está dominada' : `${mastered} preguntas ya están dominadas`} y sale del repaso. 🎯`}
            </p>
          </div>
          <button className="btn primary" onClick={onExit}>Volver al repaso</button>
        </div>
        {results.some((r) => !r.ok) && (
          <section className="quiz-review">
            <h3>Para mañana ({results.filter((r) => !r.ok).length})</h3>
            {results.filter((r) => !r.ok).map((r) => (
              <div key={r.key} className="review-item">
                <b>{r.q.q}</b>
                <p className="small"><span className="up">Correcta:</span> {r.q.options[r.q.answer]}</p>
                <p className="small muted">{r.q.explain}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    )
  }

  const answered = picked !== null
  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="mono small">Pregunta {pos + 1} de {items.length}</span>
        <span className="review-meta small"><span className="dot" style={{ background: trackTone(it.mod.track) }} />{it.mod.title} · <Boxes box={it.r.box} /></span>
      </div>
      <div className="bar thin quiz-bar"><div style={{ width: `${((pos + (answered ? 1 : 0)) / items.length) * 100}%` }} /></div>
      <fieldset className="quiz-q" key={it.key}>
        <legend><span className="quiz-n mono">{pos + 1}</span>{it.q.q}</legend>
        <div className="quiz-opts">
          {it.opts.map((orig, j) => {
            let cls = ''
            if (answered && orig === it.q.answer) cls = 'correct'
            else if (answered && orig === picked) cls = 'wrong'
            return (
              <button key={orig} className={`quiz-opt ${cls}`} disabled={answered} onClick={() => choose(orig)}>
                <span className="quiz-letter mono">{'ABCD'[j]}</span>{it.q.options[orig]}
              </button>
            )
          })}
        </div>
        {answered && (
          <p className={`quiz-explain ${picked === it.q.answer ? 'up' : 'down'}`}>
            {picked === it.q.answer
              ? `✓ Correcto. ${it.r.box + 1 >= REVIEW_INTERVALS.length ? '¡Pregunta dominada! ' : `Volverá dentro de ${REVIEW_INTERVALS[it.r.box + 1]} días. `}`
              : '✗ No exactamente. Volverá mañana. '}
            {it.q.explain}
          </p>
        )}
      </fieldset>
      <div className="quiz-nav">
        <button className="btn ghost sm" onClick={onExit}>Salir</button>
        <button className="btn primary" disabled={!answered} onClick={next}>{pos < items.length - 1 ? 'Siguiente →' : 'Ver resultado'}</button>
      </div>
    </div>
  )
}

function Overview({ onStart }) {
  const { review, stats } = useProgress()
  const all = Object.entries(review)
  const due = dueReviews(review)
  const t = dayStr()
  const nextDue = all.map(([, r]) => r.due).filter((d) => d > t).sort()[0]
  const byModule = useMemo(() => {
    const m = {}
    for (const [, r] of all) m[r.m] = (m[r.m] || 0) + 1
    return Object.entries(m).map(([id, n]) => ({ mod: findModule(id), n })).filter((x) => x.mod).sort((a, b) => b.n - a.n)
  }, [all])

  if (!all.length) {
    return (
      <div className="gate card">
        <div className="gate-ico" aria-hidden>🎯</div>
        <h2>No tienes fallos pendientes</h2>
        <p className="muted">Cada vez que falles una pregunta en un test, aparecerá aquí para repasarla mañana y en los días siguientes, hasta que la domines.</p>
        <Link to="/curso" className="btn primary">Ir a los tests</Link>
        {(stats.mastered || 0) > 0 && <p className="muted small">Ya has dominado {stats.mastered} preguntas que habías fallado. 💪</p>}
      </div>
    )
  }

  return (
    <div className="review-overview">
      <div className="review-hero card">
        <div className="review-big">
          <b className="mono">{due.length}</b>
          <span>{due.length === 1 ? 'pregunta para hoy' : 'preguntas para hoy'}</span>
        </div>
        <div className="review-hero-text">
          {due.length > 0
            ? <p>Repasa ahora las preguntas que fallaste. Cada acierto las espacia más ({REVIEW_INTERVALS.join(', ')} días) hasta que las domines.</p>
            : <p>¡Todo al día! La próxima pregunta vuelve el <b>{fmtDate(nextDue)}</b>{nextDue === addDays(t, 1) ? ' (mañana)' : ''}.</p>}
          <div className="row gap">
            {due.length > 0 && <button className="btn primary" onClick={() => onStart(due)}>Empezar repaso ({Math.min(due.length, SESSION_MAX)})</button>}
            {due.length === 0 && <button className="btn ghost" onClick={() => onStart(all)}>Adelantar repaso ({Math.min(all.length, SESSION_MAX)})</button>}
          </div>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat card"><b className="mono">{all.length}</b><span>En repaso</span></div>
        <div className="stat card"><b className="mono">{stats.reviewOk || 0}</b><span>Aciertos repasando</span></div>
        <div className="stat card"><b className="mono">{stats.mastered || 0}</b><span>Dominadas</span></div>
      </div>
      <section className="card profile-block">
        <h2>Por módulo</h2>
        <ul className="review-mods">
          {byModule.map(({ mod, n }) => (
            <li key={mod.id}>
              <span className="dot" style={{ background: trackTone(mod.track) }} />
              <span className="grow">{mod.title}</span>
              <span className="mono small muted">{n} {n === 1 ? 'pregunta' : 'preguntas'}</span>
              <Link to={`/curso#${mod.id}`} className="small">Repasar lecciones →</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function Review() {
  const [items, setItems] = useState(null)
  return (
    <div className="container page narrow">
      <header className="page-head">
        <span className="eyebrow">Repaso de fallos</span>
        <h1>Aprende de tus errores</h1>
        <p className="lead muted">Las preguntas que fallas en los tests vuelven a aparecer en los días siguientes. Así se fijan de verdad en la memoria.</p>
      </header>
      <AuthGate title="Crea tu cuenta para repasar tus fallos" text="El repaso usa los resultados de tus tests, que se guardan en tu cuenta. Registrarse es gratis.">
        {items
          ? <Session items={items} onExit={() => setItems(null)} />
          : <Overview onStart={(entries) => { const s = buildSession(entries); setItems(s.length ? s : null) }} />}
      </AuthGate>
    </div>
  )
}
