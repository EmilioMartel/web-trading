import { useEffect, useState } from 'react'
import { Link } from '../router.jsx'
import { useProgress, progress } from '../hooks/useProgress.js'
import { useAuth } from '../auth.jsx'
import { BADGES, earnedBadges } from '../data/badges.js'

// Vigila el progreso: cuando se cumple una insignia nueva, la guarda y muestra un aviso
export default function Achievements() {
  const p = useProgress()
  const { loading } = useAuth()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (loading) return
    const fresh = earnedBadges(p).filter((id) => !p.badges[id])
    if (!fresh.length) return
    progress.awardBadges(fresh)
    setToast({ key: Date.now(), list: BADGES.filter((b) => fresh.includes(b.id)) })
  }, [p, loading])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 7000)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast) return null
  const one = toast.list.length === 1 ? toast.list[0] : null
  return (
    <div className="badge-toast card" role="status" key={toast.key}>
      <div className="badge-toast-icons" aria-hidden>{toast.list.slice(0, 3).map((b) => <span key={b.id} className="badge-icon">{b.icon}</span>)}{toast.list.length > 3 && <span className="badge-icon badge-more">+{toast.list.length - 3}</span>}</div>
      <div className="grow">
        <span className="eyebrow">{one ? '¡Insignia desbloqueada!' : `¡${toast.list.length} insignias desbloqueadas!`}</span>
        <b>{one ? one.name : `${toast.list[0].name} y ${toast.list.length - 1} más`}</b>
        <span className="muted small">{one ? one.desc : 'Míralas todas en tu perfil'}</span>
      </div>
      <div className="badge-toast-actions">
        <Link to="/perfil#insignias" className="btn ghost sm" onClick={() => setToast(null)}>Ver</Link>
        <button className="icon-close" aria-label="Cerrar" onClick={() => setToast(null)}>✕</button>
      </div>
    </div>
  )
}
