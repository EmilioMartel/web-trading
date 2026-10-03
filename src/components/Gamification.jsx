import { Link } from '../router.jsx'
import { useProgress, streakInfo, dueReviews, addDays, dayStr } from '../hooks/useProgress.js'
import { BADGES } from '../data/badges.js'
import { fmtDate } from '../data/certificates.js'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// Racha actual, mejor racha y calendario de las últimas 5 semanas
export function StreakCard() {
  const { days } = useProgress()
  const s = streakInfo(days)
  const set = new Set(days)
  const t = dayStr()
  // Calendario que termina en la semana actual (lunes a domingo)
  const dow = (new Date().getDay() + 6) % 7
  const start = addDays(t, -dow - 28)
  const cells = Array.from({ length: 35 }, (_, k) => addDays(start, k))
  return (
    <div className="streak-card">
      <div className="streak-main">
        <span className={`streak-flame ${s.current ? '' : 'off'}`} aria-hidden>🔥</span>
        <div>
          <b className="mono">{s.current} {s.current === 1 ? 'día' : 'días'}</b>
          <span className="muted small">Racha actual · mejor: {s.best} {s.best === 1 ? 'día' : 'días'}</span>
        </div>
      </div>
      <p className="small streak-tip">
        {s.activeToday ? '✓ Hoy ya has sumado a tu racha. ¡Vuelve mañana!'
          : s.current ? 'Completa una lección, un test o un repaso hoy para no perder tu racha.'
            : 'Completa una lección, un test o un repaso para empezar una racha.'}
      </p>
      <div className="streak-cal" aria-label="Actividad de las últimas semanas">
        {WEEKDAYS.map((d) => <span key={d} className="streak-dow">{d}</span>)}
        {cells.map((d) => (
          <span key={d} className={`streak-day ${set.has(d) ? 'on' : ''} ${d === t ? 'today' : ''} ${d > t ? 'future' : ''}`} title={`${fmtDate(d)}${set.has(d) ? ' · activo' : ''}`} />
        ))}
      </div>
    </div>
  )
}

export function ReviewCard() {
  const { review } = useProgress()
  const due = dueReviews(review).length
  const total = Object.keys(review).length
  return (
    <div className="review-card">
      <span className="review-card-ico" aria-hidden>🔁</span>
      <div className="grow">
        <b>Repaso de fallos</b>
        <span className="muted small">
          {total === 0 ? 'No tienes preguntas pendientes de repasar.' : due > 0 ? `${due} ${due === 1 ? 'pregunta' : 'preguntas'} para hoy · ${total} en total` : `Todo al día · ${total} en repaso`}
        </span>
      </div>
      <Link to="/repaso" className={`btn sm ${due > 0 ? 'primary' : 'ghost'}`}>{due > 0 ? 'Repasar' : 'Ver'}</Link>
    </div>
  )
}

export function BadgeGrid() {
  const { badges } = useProgress()
  const groups = [...new Set(BADGES.map((b) => b.group))]
  const got = BADGES.filter((b) => badges[b.id]).length
  return (
    <div className="badges">
      <p className="muted small">{got} de {BADGES.length} insignias conseguidas</p>
      {groups.map((g) => (
        <div key={g} className="badge-group">
          <span className="tool-group-name">{g}</span>
          <ul className="badge-grid">
            {BADGES.filter((b) => b.group === g).map((b) => {
              const date = badges[b.id]
              return (
                <li key={b.id} className={`badge-item ${date ? 'got' : 'locked'}`} title={date ? `Conseguida el ${fmtDate(date)}` : 'Aún no conseguida'}>
                  <span className="badge-icon" aria-hidden>{date ? b.icon : '🔒'}</span>
                  <b>{b.name}</b>
                  <span className="muted small">{b.desc}</span>
                  {date && <span className="badge-date small">{fmtDate(date)}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
