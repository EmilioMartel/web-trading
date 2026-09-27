import { Link } from '../router.jsx'
import { modules, findModule } from '../data/course.js'
import Quiz from '../components/Quiz.jsx'
import NotFound from './NotFound.jsx'

export default function QuizPage({ id }) {
  const mod = findModule(id)
  if (!mod) return <NotFound />
  const next = modules[mod.n]
  return (
    <div className="container page narrow">
      <Link to={`/curso#${mod.id}`} className="back muted small">← Volver al módulo</Link>
      <header className="page-head">
        <span className="eyebrow">Test · Módulo {mod.n}</span>
        <h1>{mod.title}</h1>
        <p className="muted">Responde las {mod.quiz.length} preguntas. Verás la explicación de cada respuesta al momento.</p>
      </header>
      <Quiz key={mod.id} module={mod} />
      <div className="lesson-nav">
        <span />
        {next ? (
          <Link to={`/curso/${next.lessons[0].slug}`} className="card nav-card right"><span className="muted small">Siguiente módulo →</span><b>{next.title}</b></Link>
        ) : (
          <Link to="/sobre-mi" className="card nav-card right"><span className="muted small">¡Curso completado! 🎉</span><b>Conóceme y sígueme</b></Link>
        )}
      </div>
    </div>
  )
}
