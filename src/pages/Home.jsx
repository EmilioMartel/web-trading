import { Link } from '../router.jsx'
import HeroChart from '../components/HeroChart.jsx'
import { modules, lessons, levels, totalMinutes } from '../data/course.js'
import { useProgress } from '../hooks/useProgress.js'
import { SITE } from '../config.js'

export default function Home() {
  const { done } = useProgress()
  const next = lessons.find((l) => !done.includes(l.slug))
  const pct = Math.round((done.length / lessons.length) * 100)

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="dot live" style={{ '--c': 'var(--up)' }} /> Curso 100% gratuito</span>
            <h1>Aprende trading <span className="grad">desde cero</span>, paso a paso.</h1>
            <p className="lead">Forex, índices y oro explicados sin humo: de lo más básico a lo más avanzado, con herramientas interactivas para que entiendas cada concepto practicando.</p>
            <div className="hero-cta">
              {done.length > 0 && next ? (
                <Link to={`/curso/${next.slug}`} className="btn primary lg">Continuar: {next.title} →</Link>
              ) : (
                <Link to={`/curso/${lessons[0].slug}`} className="btn primary lg">Empezar la primera lección →</Link>
              )}
              <Link to="/curso" className="btn ghost lg">Ver temario</Link>
            </div>
            {done.length > 0 && (
              <div className="hero-progress">
                <div className="bar"><div style={{ width: `${pct}%` }} /></div>
                <span className="muted small">{done.length} de {lessons.length} lecciones completadas</span>
              </div>
            )}
          </div>
          <div className="hero-visual card">
            <div className="hero-visual-head">
              <span className="mono">XAU/USD · H1</span>
              <span className="badge up">demo</span>
            </div>
            <HeroChart />
          </div>
        </div>
        <div className="container stats">
          <div><b className="mono">{modules.length}</b><span>módulos</span></div>
          <div><b className="mono">{lessons.length}</b><span>lecciones</span></div>
          <div><b className="mono">{Math.round(totalMinutes / 60 * 10) / 10} h</b><span>de contenido</span></div>
          <div><b className="mono">0 €</b><span>para siempre</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">La ruta</span>
            <h2>Tres niveles. Un único camino.</h2>
            <p className="muted">Cada módulo se apoya en el anterior. No necesitas ningún conocimiento previo.</p>
          </div>
          <div className="levels">
            {levels.map((lv, i) => {
              const mods = modules.filter((m) => m.level === lv.name)
              return (
                <div key={lv.name} className={`level card tone-${lv.color}`}>
                  <span className="level-n mono">0{i + 1}</span>
                  <h3>{lv.name}</h3>
                  <p className="muted">{lv.desc}</p>
                  <ul>
                    {mods.map((m) => <li key={m.id}><Link to={`/curso#${m.id}`}>{m.title}</Link></li>)}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <span className="eyebrow">Aprende haciendo</span>
            <h2>Herramientas interactivas</h2>
            <p className="muted">Mueve los controles y mira qué pasa. Es la forma más rápida de interiorizar conceptos como el tamaño de posición, el ratio riesgo/beneficio o por qué arriesgar poco es la clave.</p>
            <ul className="checks">
              <li>Calculadora de lotaje para Forex, oro e índices</li>
              <li>Simulador de curva de capital (Monte Carlo)</li>
              <li>Reloj de sesiones en tu hora local</li>
              <li>Interés compuesto y drawdown</li>
            </ul>
            <Link to="/herramientas" className="btn primary">Abrir herramientas →</Link>
          </div>
          <div className="tool-tiles">
            {[
              ['⚖️', 'Tamaño de posición', 'Cuántos lotes abrir para arriesgar exactamente tu 1%'],
              ['🎲', 'Simulador', '40 futuros posibles de tu sistema'],
              ['🕒', 'Sesiones', 'Qué mercado está abierto ahora'],
              ['📈', 'Compuesto', 'El poder (y los límites) de reinvertir'],
            ].map(([i, t, d]) => (
              <Link key={t} to="/herramientas" className="tile card">
                <span className="tile-icon" aria-hidden>{i}</span>
                <b>{t}</b>
                <span className="muted small">{d}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ig-cta card">
            <div>
              <span className="eyebrow">Sígueme</span>
              <h2>Análisis, ejemplos reales y vida de trader</h2>
              <p className="muted">En Instagram comparto análisis de Forex, índices y oro, errores comunes, mi día a día y avisos cuando publico nuevas lecciones.</p>
            </div>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn ig lg">Seguir en Instagram {SITE.instagramHandle}</a>
          </div>
        </div>
      </section>
    </>
  )
}
