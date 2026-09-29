import { useCallback, useEffect, useMemo, useState } from 'react'
import { progress } from '../hooks/useProgress.js'
import { PASS_RATE } from '../data/course.js'

// Baraja un array (Fisher–Yates) sin modificar el original
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Cada intento: preguntas en orden aleatorio y opciones barajadas
function buildAttempt(quiz) {
  return shuffle(quiz.map((_, i) => i)).map((qi) => ({ qi, opts: shuffle([0, 1, 2, 3].slice(0, quiz[qi].options.length)) }))
}

export default function Quiz({ module }) {
  const qs = module.quiz
  const total = qs.length
  const need = Math.ceil(total * PASS_RATE)
  const [attempt, setAttempt] = useState(() => buildAttempt(qs))
  const [pos, setPos] = useState(0)
  const [answers, setAnswers] = useState({}) // qi -> índice original elegido
  const [finished, setFinished] = useState(false)

  const cur = attempt[pos]
  const question = qs[cur.qi]
  const picked = answers[cur.qi]
  const answered = picked !== undefined
  const score = useMemo(() => qs.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0), [answers, qs])
  const answeredCount = Object.keys(answers).length

  const choose = useCallback((orig) => {
    if (answers[cur.qi] !== undefined) return
    setAnswers((a) => ({ ...a, [cur.qi]: orig }))
  }, [answers, cur.qi])

  const next = useCallback(() => {
    if (pos < total - 1) setPos((p) => p + 1)
    else {
      const finalScore = qs.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0)
      progress.setQuiz(module.id, finalScore, total)
      setFinished(true)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pos, total, qs, answers, module.id])

  const retry = () => {
    setAttempt(buildAttempt(qs)); setPos(0); setAnswers({}); setFinished(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Atajos de teclado: 1-4 / A-D para responder, Enter para continuar
  useEffect(() => {
    if (finished) return
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const k = e.key.toLowerCase()
      const n = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k)
      if (n >= 0 && n < cur.opts.length && !answered) choose(cur.opts[n])
      if (k === 'enter' && answered) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finished, cur, answered, choose, next])

  if (finished) {
    const pct = Math.round((score / total) * 100)
    const passed = score >= need
    const wrong = qs.map((q, i) => ({ q, i })).filter(({ q, i }) => answers[i] !== q.answer)
    return (
      <div className="quiz">
        <div className={`quiz-result ${passed ? 'good' : pct >= 60 ? 'ok' : 'bad'}`}>
          <div className="quiz-score mono">{score}/{total}</div>
          <div>
            <b>{passed ? (score === total ? '¡Perfecto! Módulo dominado.' : '¡Aprobado! Dominas este módulo.') : `Te faltan ${need - score} acierto(s) para superarlo.`}</b>
            <p className="muted small">{pct}% de aciertos · Para dar el módulo por dominado necesitas {need} de {total} ({Math.round(PASS_RATE * 100)}%). Se guarda tu mejor resultado.</p>
          </div>
          <button className="btn ghost" onClick={retry}>Repetir test</button>
        </div>

        {wrong.length > 0 && (
          <section className="quiz-review">
            <h3>Repasa tus fallos ({wrong.length})</h3>
            {wrong.map(({ q, i }) => (
              <div key={i} className="review-item">
                <b>{q.q}</b>
                <p className="small"><span className="down">Tu respuesta:</span> {answers[i] !== undefined ? q.options[answers[i]] : '—'}</p>
                <p className="small"><span className="up">Correcta:</span> {q.options[q.answer]}</p>
                <p className="small muted">{q.explain}</p>
              </div>
            ))}
            <p className="muted small">Consejo: vuelve a las lecciones del módulo antes de repetir. Las preguntas y las opciones cambian de orden en cada intento.</p>
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <span className="mono small">Pregunta {pos + 1} de {total}</span>
        <span className="mono small muted">Aciertos: {score}/{answeredCount}</span>
      </div>
      <div className="bar thin quiz-bar"><div style={{ width: `${((pos + (answered ? 1 : 0)) / total) * 100}%` }} /></div>

      <fieldset className="quiz-q" key={cur.qi}>
        <legend><span className="quiz-n mono">{pos + 1}</span>{question.q}</legend>
        <div className="quiz-opts">
          {cur.opts.map((orig, j) => {
            let cls = ''
            if (answered && orig === question.answer) cls = 'correct'
            else if (answered && orig === picked) cls = 'wrong'
            return (
              <button key={orig} className={`quiz-opt ${cls}`} disabled={answered} onClick={() => choose(orig)}>
                <span className="quiz-letter mono">{'ABCD'[j]}</span>{question.options[orig]}
              </button>
            )
          })}
        </div>
        {answered && (
          <p className={`quiz-explain ${picked === question.answer ? 'up' : 'down'}`}>
            {picked === question.answer ? '✓ Correcto. ' : '✗ No exactamente. '}{question.explain}
          </p>
        )}
      </fieldset>

      <div className="quiz-nav">
        <span className="muted small hide-sm">Atajos: 1–4 para responder · Enter para continuar</span>
        <button className="btn primary" disabled={!answered} onClick={next}>
          {pos < total - 1 ? 'Siguiente pregunta →' : 'Ver resultado'}
        </button>
      </div>
    </div>
  )
}
