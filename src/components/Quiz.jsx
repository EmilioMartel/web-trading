import { useState } from 'react'
import { progress } from '../hooks/useProgress.js'

export default function Quiz({ module }) {
  const qs = module.quiz
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const score = qs.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0)
  const all = Object.keys(answers).length === qs.length

  const finish = () => { setDone(true); progress.setQuiz(module.id, score, qs.length); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const retry = () => { setAnswers({}); setDone(false) }

  return (
    <div className="quiz">
      {done && (
        <div className={`quiz-result ${score / qs.length >= 0.8 ? 'good' : score / qs.length >= 0.6 ? 'ok' : 'bad'}`}>
          <div className="quiz-score mono">{score}/{qs.length}</div>
          <div>
            <b>{score === qs.length ? '¡Perfecto! Dominas este módulo.' : score / qs.length >= 0.6 ? '¡Bien! Repasa las que fallaste.' : 'Repasa las lecciones y vuelve a intentarlo.'}</b>
            <p className="muted small">Se guarda tu mejor puntuación en este navegador.</p>
          </div>
          <button className="btn ghost" onClick={retry}>Reintentar</button>
        </div>
      )}
      {qs.map((q, i) => {
        const picked = answers[i]
        const answered = picked !== undefined
        return (
          <fieldset key={i} className="quiz-q">
            <legend><span className="quiz-n mono">{i + 1}</span>{q.q}</legend>
            <div className="quiz-opts">
              {q.options.map((o, j) => {
                let cls = ''
                if (answered && j === q.answer) cls = 'correct'
                else if (answered && j === picked) cls = 'wrong'
                return (
                  <button key={j} className={`quiz-opt ${cls}`} disabled={answered}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}>
                    <span className="quiz-letter mono">{'ABCD'[j]}</span>{o}
                  </button>
                )
              })}
            </div>
            {answered && <p className={`quiz-explain ${picked === q.answer ? 'up' : 'down'}`}>{picked === q.answer ? '✓ Correcto. ' : '✗ No exactamente. '}{q.explain}</p>}
          </fieldset>
        )
      })}
      {!done && <button className="btn primary" disabled={!all} onClick={finish}>{all ? 'Ver resultado' : `Responde todas (${Object.keys(answers).length}/${qs.length})`}</button>}
    </div>
  )
}
