import { Link } from '../router.jsx'
import { modules, findModule, PASS_RATE } from '../data/course.js'
import Quiz from '../components/Quiz.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { earnedBanners } from '../data/certificates.js'
import NotFound from './NotFound.jsx'
import AuthGate from '../components/AuthGate.jsx'

export default function QuizPage({ id }) {
  const mod = findModule(id)
  const { quiz } = useProgress()
  if (!mod) return <NotFound />
  const sameTrack = modules.filter((m) => m.track === mod.track)
  const idx = sameTrack.findIndex((m) => m.id === mod.id)
  const next = sameTrack[idx + 1] || (mod.track === 'base' ? modules.find((m) => m.track === 'tecnico') : mod.track !== 'complementos' ? modules.find((m) => m.track === 'complementos') : null)
  return (
    <div className="container page narrow">
      <Link to={`/curso#${mod.id}`} className="back muted small">← Volver al módulo</Link>
      <header className="page-head">
        <span className="eyebrow">Test · Módulo {mod.n}</span>
        <h1>{mod.title}</h1>
        <p className="muted">{mod.quiz.length} preguntas, una a una, con la explicación de cada respuesta al momento. Para dar el módulo por dominado necesitas al menos {Math.ceil(mod.quiz.length * PASS_RATE)} aciertos ({Math.round(PASS_RATE * 100)}%). El orden de preguntas y respuestas cambia en cada intento.</p>
      </header>
      {earnedBanners(quiz, (c) => c.tracks.includes(mod.track)).map((c) => (
        <Link key={c.id} to="/certificado" className="cert-banner card">
          <span aria-hidden>🎓</span>
          <span><b>{c.done}</b><br /><span className="muted small">Genera tu certificado con tu nombre →</span></span>
        </Link>
      ))}
      <AuthGate title="Crea tu cuenta gratis para hacer el test">
        <Quiz key={mod.id} module={mod} />
      </AuthGate>
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
