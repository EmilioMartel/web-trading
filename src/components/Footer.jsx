import { Link } from '../router.jsx'
import { SITE } from '../config.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo static"><span>Emilio<b>Martel</b><em>Fx</em></span></div>
            <p className="muted small">Formación gratuita de trading en español, desde cero. Forex, índices y oro.</p>
          </div>
          <div className="footer-links">
            <Link to="/curso">Curso</Link>
            <Link to="/herramientas">Herramientas</Link>
            <Link to="/sobre-mi">Sobre mí</Link>
            <a href={SITE.instagram} target="_blank" rel="noreferrer">Instagram {SITE.instagramHandle}</a>
          </div>
        </div>
        <p className="disclaimer">
          <b>Aviso de riesgo:</b> los CFDs son instrumentos complejos y conllevan un alto riesgo de perder dinero rápidamente debido al apalancamiento. La mayoría de las cuentas de inversores minoristas pierden dinero al operar con CFDs. Debes considerar si comprendes cómo funcionan y si puedes permitirte asumir un alto riesgo de perder tu dinero.
          Todo el contenido de esta web es exclusivamente educativo y no constituye asesoramiento financiero ni recomendación de inversión. Rentabilidades pasadas no garantizan resultados futuros.
        </p>
        <p className="muted small">© {new Date().getFullYear()} {SITE.author} · {SITE.brand}</p>
      </div>
    </footer>
  )
}
