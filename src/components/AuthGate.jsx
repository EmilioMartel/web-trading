import { Link, useRouter } from '../router.jsx'
import { useAuth } from '../auth.jsx'

// Muestra el contenido solo con sesión iniciada; si no, invita a registrarse
export default function AuthGate({ children, title = 'Crea tu cuenta gratis para continuar', text }) {
  const { ready, loading, user } = useAuth()
  const { path } = useRouter()
  const back = encodeURIComponent(path + window.location.hash)

  if (!ready) {
    return (
      <div className="gate card">
        <div className="gate-ico" aria-hidden>⚙️</div>
        <h2>Cuentas no configuradas</h2>
        <p className="muted">Falta pegar la configuración de Firebase en <code>src/firebase-config.js</code>. Mientras tanto, los tests y certificados no están disponibles.</p>
      </div>
    )
  }
  if (loading) return <div className="gate-loading" role="status"><span className="spinner" /> Cargando tu cuenta…</div>
  if (user) return children

  return (
    <div className="gate card">
      <div className="gate-ico" aria-hidden>🔒</div>
      <h2>{title}</h2>
      <p className="muted">{text || 'Las lecciones son libres, pero los tests y los certificados están reservados a usuarios registrados. Es gratis y tardas menos de un minuto.'}</p>
      <ul className="gate-list">
        <li>✓ Tu progreso guardado y sincronizado en todos tus dispositivos</li>
        <li>✓ Tests de evaluación de cada módulo</li>
        <li>✓ Certificados con tu nombre al completar cada bloque</li>
      </ul>
      <div className="row gap gate-btns">
        <Link to={`/acceso?modo=registro&volver=${back}`} className="btn primary">Crear cuenta gratis</Link>
        <Link to={`/acceso?volver=${back}`} className="btn ghost">Ya tengo cuenta</Link>
      </div>
    </div>
  )
}
