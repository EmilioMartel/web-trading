import { Link, useRouter } from '../router.jsx'
import { lessons, findLesson, findModule, findTrack, trackTone } from '../data/course.js'
import { useProgress, progress } from '../hooks/useProgress.js'
import LessonContent from '../components/LessonContent.jsx'
import NotFound from './NotFound.jsx'
import ShareBar from '../components/ShareBar.jsx'
import { absUrl } from '../share.js'
import { SITE } from '../config.js'

export default function Lesson({ slug }) {
  const lesson = findLesson(slug)
  const { done } = useProgress()
  const { navigate } = useRouter()

  if (!lesson) return <NotFound />
  const mod = findModule(lesson.moduleId)
  const idx = lessons.findIndex((l) => l.slug === slug)
  const prev = lessons[idx - 1]
  const next = lessons[idx + 1]
  const isDone = done.includes(slug)
  const lastOfModule = lesson.n === mod.lessons.length
  const nextHref = lastOfModule ? `/curso/test/${mod.id}` : next ? `/curso/${next.slug}` : '/curso'

  const completeAndNext = () => {
    progress.complete(slug)
    navigate(nextHref)
  }

  return (
    <div className="container lesson-layout">
      <aside className="lesson-side">
        <Link to="/curso" className="back muted small">← Temario</Link>
        <div className="side-module">
          <span className="module-n mono">Módulo {mod.n} · {findTrack(mod.track)?.name}</span>
          <b>{mod.title}</b>
        </div>
        <ol className="side-list">
          {mod.lessons.map((l) => (
            <li key={l.slug} className={`${l.slug === slug ? 'current' : ''} ${done.includes(l.slug) ? 'done' : ''}`}>
              <Link to={`/curso/${l.slug}`}><span className="check" aria-hidden>{done.includes(l.slug) ? '✓' : ''}</span>{l.title}</Link>
            </li>
          ))}
          <li><Link to={`/curso/test/${mod.id}`}><span className="check" aria-hidden>?</span>Test del módulo</Link></li>
        </ol>
      </aside>

      <article className="lesson">
        <header className="lesson-head">
          <span className="eyebrow">Módulo {mod.n} · Lección {lesson.n} de {mod.lessons.length} · {lesson.minutes} min</span>
          <h1>{lesson.title}</h1>
        </header>
        <div className="prose">
          <LessonContent blocks={lesson.blocks} />
        </div>

        <section className="takeaways card">
          <h3>Lo esencial</h3>
          <ul>{lesson.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <div className="lesson-actions">
          <button className={`btn ${isDone ? 'ghost' : 'outline'}`} onClick={() => progress.toggle(slug)}>
            {isDone ? '✓ Completada' : 'Marcar como completada'}
          </button>
          <button className="btn primary" onClick={completeAndNext}>
            {lastOfModule ? 'Completar y hacer el test →' : next ? 'Completar y siguiente →' : 'Terminar curso →'}
          </button>
        </div>

        <ShareBar
          title="¿Te ha servido esta lección? Compártela"
          text={`Estoy aprendiendo trading gratis con ${SITE.instagramHandle}: «${lesson.title}»`}
          url={absUrl(`/curso/${lesson.slug}`)}
          story={{ kicker: 'Estoy aprendiendo', title: lesson.title, sub: `Módulo ${mod.n} · ${mod.title}`, items: lesson.takeaways, badge: 'learning', tone: trackTone(mod.track) }}
          filename={`leccion-${lesson.slug}.png`}
        />

        <nav className="lesson-nav">
          {prev ? <Link to={`/curso/${prev.slug}`} className="card nav-card"><span className="muted small">← Anterior</span><b>{prev.title}</b></Link> : <span />}
          {next && <Link to={`/curso/${next.slug}`} className="card nav-card right"><span className="muted small">Siguiente →</span><b>{next.title}</b></Link>}
        </nav>
      </article>
    </div>
  )
}
