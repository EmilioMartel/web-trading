import { useEffect } from 'react'
import { Link } from '../router.jsx'
import { modules, lessons, tracks, PASS_RATE } from '../data/course.js'
import { useProgress, progress, dueReviews } from '../hooks/useProgress.js'
import { earnedBanners } from '../data/certificates.js'

export default function Course() {
  const { done: rawDone, quiz, review } = useProgress()
  const due = dueReviews(review).length
  const done = rawDone.filter((d) => lessons.some((l) => l.slug === d))
  const pct = Math.round((done.length / lessons.length) * 100)
  const next = lessons.find((l) => !done.includes(l.slug))

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' }), 50)
    }
  }, [])

  return (
    <div className="container page">
      <header className="page-head">
        <span className="eyebrow">Temario completo</span>
        <h1>Curso de trading gratuito</h1>
        <p className="lead muted">Sigue el orden recomendado. Marca cada lección como completada y haz el test de cada módulo para comprobar lo que has aprendido.</p>
        <div className="progress-card card">
          <div className="ring" style={{ '--p': pct }}><span className="mono">{pct}%</span></div>
          <div className="grow">
            <b>Tu progreso</b>
            <p className="muted small">{done.length} de {lessons.length} lecciones · {Object.keys(quiz).filter((k) => modules.some((m) => m.id === k)).length} de {modules.length} tests realizados</p>
            <div className="row gap">
              {next && <Link to={`/curso/${next.slug}`} className="btn primary sm">{done.length ? 'Continuar' : 'Empezar'} →</Link>}
              <Link to="/practica" className="btn ghost sm">🕹️ Practicar</Link>
              <Link to="/certificado" className="btn ghost sm">🎓 Certificados</Link>
              {done.length > 0 && <button className="btn ghost sm" onClick={() => { if (window.confirm('¿Seguro que quieres borrar tu progreso?')) progress.reset() }}>Reiniciar progreso</button>}
            </div>
          </div>
        </div>
        {due > 0 && (
          <Link to="/repaso" className="cert-banner card review-banner">
            <span aria-hidden>🔁</span>
            <span><b>Tienes {due} {due === 1 ? 'pregunta' : 'preguntas'} para repasar hoy</b><br /><span className="muted small">Son preguntas que fallaste en los tests. Repasarlas te lleva un par de minutos →</span></span>
          </Link>
        )}
        {earnedBanners(quiz).map((c) => (
          <Link key={c.id} to="/certificado" className="cert-banner card">
            <span aria-hidden>🎓</span>
            <span><b>{c.done}</b><br /><span className="muted small">Tu certificado está listo: descárgalo o compártelo →</span></span>
          </Link>
        ))}
      </header>

      {tracks.map((lv) => (
        <section key={lv.id} className="level-block">
          <h2 className={`level-title tone-${lv.color}`}><span className="pill">{lv.name}</span> {lv.desc}</h2>
          {lv.id === 'tecnico' && <p className="track-note muted small">Ruta A. Elige una ruta y domínala antes de pasar a la otra: técnica e institucional leen el gráfico de forma distinta y pueden contradecirse.</p>}
          {lv.id === 'institucional' && <p className="track-note muted small">Ruta B. Puedes empezarla directamente después de la base, sin haber hecho la ruta técnica.</p>}
          <div className="modules">
            {modules.filter((m) => m.track === lv.id).map((m) => {
              const mDone = m.lessons.filter((l) => done.includes(l.slug)).length
              const q = quiz[m.id]
              return (
                <article key={m.id} id={m.id} className="module card">
                  <div className="module-head">
                    <span className="module-n mono">Módulo {m.n}</span>
                    <span className="muted small mono">{mDone}/{m.lessons.length}</span>
                  </div>
                  <h3>{m.title}</h3>
                  <p className="muted small">{m.desc}</p>
                  <div className="bar thin"><div style={{ width: `${(mDone / m.lessons.length) * 100}%` }} /></div>
                  <ol className="lesson-list">
                    {m.lessons.map((l) => {
                      const isDone = done.includes(l.slug)
                      return (
                        <li key={l.slug} className={isDone ? 'done' : ''}>
                          <Link to={`/curso/${l.slug}`}>
                            <span className="check" aria-hidden>{isDone ? '✓' : ''}</span>
                            <span className="grow">{l.title}</span>
                            <span className="muted small mono">{l.minutes}′</span>
                          </Link>
                        </li>
                      )
                    })}
                    <li className={`quiz-link ${q && q.score / q.total >= PASS_RATE ? 'done' : ''}`}>
                      <Link to={`/curso/test/${m.id}`}>
                        <span className="check" aria-hidden>{q && q.score / q.total >= PASS_RATE ? '★' : '?'}</span>
                        <span className="grow">Test del módulo</span>
                        <span className={`small mono ${q && q.score / q.total >= PASS_RATE ? 'passed' : 'muted'}`}>{q ? `${q.score}/${q.total}${q.score / q.total >= PASS_RATE ? ' ✓' : ''}` : `${m.quiz.length} preguntas`}</span>
                      </Link>
                    </li>
                  </ol>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
