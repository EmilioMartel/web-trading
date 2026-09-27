import { Link } from '../router.jsx'

export default function NotFound() {
  return (
    <div className="container page narrow center">
      <h1 className="mono big404">404</h1>
      <p className="lead muted">Este precio no existe en el gráfico. La página que buscas no está aquí.</p>
      <Link to="/" className="btn primary">Volver al inicio</Link>
    </div>
  )
}
