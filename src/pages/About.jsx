import { Link } from '../router.jsx'
import { ABOUT, SITE } from '../config.js'

export default function About() {
  return (
    <div className="container page">
      <section className="about-hero">
        <div className="avatar">
          {ABOUT.photo ? <img src={ABOUT.photo} alt={SITE.author} /> : <span className="mono">EM</span>}
        </div>
        <div>
          <span className="eyebrow">Sobre mí</span>
          <h1>Hola, soy {SITE.author.split(' ')[0]}</h1>
          <p className="lead muted">{ABOUT.headline}</p>
          <div className="row gap">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn ig">Instagram {SITE.instagramHandle}</a>
            <a href={`mailto:${SITE.email}`} className="btn ghost">Escríbeme</a>
          </div>
        </div>
      </section>

      <section className="prose about-intro">
        {ABOUT.intro.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section className="section-tight">
        <h2>Mi camino</h2>
        <ol className="timeline">
          {ABOUT.timeline.map((t, i) => (
            <li key={i}>
              <span className="mono t-year">{t.year}</span>
              <div><b>{t.title}</b><p className="muted">{t.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section-tight">
        <h2>Un día en mi vida</h2>
        <div className="day-grid">
          {ABOUT.day.map(([icon, t, d]) => (
            <div key={t} className="card day">
              <span className="tile-icon" aria-hidden>{icon}</span>
              <b>{t}</b>
              <p className="muted small">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <h2>En qué creo</h2>
        <div className="values">
          {ABOUT.values.map(([t, d]) => (
            <div key={t} className="value"><b>{t}</b><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <div className="ig-cta card">
        <div>
          <h2>¿Empezamos?</h2>
          <p className="muted">El curso es gratuito y puedes hacerlo a tu ritmo.</p>
        </div>
        <Link to="/curso" className="btn primary lg">Ir al curso →</Link>
      </div>
    </div>
  )
}
