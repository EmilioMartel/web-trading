import { useEffect, useState } from 'react'

const SESSIONS = [
  { name: 'Sídney', tz: 'Australia/Sydney', open: 7, close: 16, color: '#38bdf8' },
  { name: 'Tokio', tz: 'Asia/Tokyo', open: 9, close: 18, color: '#a78bfa' },
  { name: 'Londres', tz: 'Europe/London', open: 8, close: 17, color: '#f59e0b' },
  { name: 'Nueva York', tz: 'America/New_York', open: 8, close: 17, color: '#22c55e' },
]

// Minutos de diferencia entre la hora local de una zona horaria y UTC en este instante
function tzOffsetMin(tz, date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })
      .formatToParts(date).map((p) => [p.type, p.value])
  )
  const asUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute)
  return Math.round((asUTC - date.getTime()) / 60000 / 15) * 15
}

function localInfo(tz, date) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', weekday: 'short', hour: 'numeric', minute: 'numeric' })
  const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]))
  return { day: p.weekday, h: (+p.hour % 24) + +p.minute / 60 }
}

const mod = (x, m) => ((x % m) + m) % m
const hh = (h) => `${String(Math.floor(mod(h, 24))).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`

export default function SessionsWidget() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const userOff = tzOffsetMin(userTz, now)
  const userH = now.getHours() + now.getMinutes() / 60

  // Forex cerrado: de viernes 17:00 a domingo 17:00 hora de Nueva York
  const ny = localInfo('America/New_York', now)
  const weekend = (ny.day === 'Fri' && ny.h >= 17) || ny.day === 'Sat' || (ny.day === 'Sun' && ny.h < 17)

  const rows = SESSIONS.map((s) => {
    const off = tzOffsetMin(s.tz, now)
    const start = mod(s.open - off / 60 + userOff / 60, 24)
    const end = mod(s.close - off / 60 + userOff / 60, 24)
    const li = localInfo(s.tz, now)
    const isWeekday = !['Sat', 'Sun'].includes(li.day)
    const open = !weekend && isWeekday && li.h >= s.open && li.h < s.close
    return { ...s, start, end, open }
  })

  const seg = (a, b) => (a < b ? [[a, b]] : [[a, 24], [0, b]])

  return (
    <div className="widget">
      <div className="widget-head">
        <span className="widget-tag">En directo</span>
        <h4>Sesiones de mercado en tu hora local</h4>
      </div>
      <p className="muted small">Zona horaria detectada: <b>{userTz}</b> · Ahora: <b className="mono">{hh(userH)}</b>{weekend && <span className="badge down" style={{ marginLeft: 8 }}>Forex cerrado (fin de semana)</span>}</p>
      <div className="sessions">
        <div className="sessions-scale">
          {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => <span key={h} style={{ left: `${(h / 24) * 100}%` }}>{h}</span>)}
        </div>
        {rows.map((r) => (
          <div className="session-row" key={r.name}>
            <div className="session-name">
              <span className={`dot ${r.open ? 'live' : ''}`} style={{ '--c': r.color }} />
              {r.name}
              <span className="muted small mono">{hh(r.start)}–{hh(r.end)}</span>
            </div>
            <div className="session-track">
              {seg(r.start, r.end).map(([a, b], i) => (
                <div key={i} className="session-bar" style={{ left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100}%`, background: r.color, opacity: r.open ? 1 : 0.45 }} />
              ))}
              <div className="now-line" style={{ left: `${(userH / 24) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="muted small">Horarios orientativos de cada centro financiero (se ajustan solos al horario de verano). La línea vertical marca la hora actual.</p>
    </div>
  )
}
