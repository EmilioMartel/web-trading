import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link } from '../router.jsx'
import AuthGate from '../components/AuthGate.jsx'
import { useAuth, adminLoadUsers, authError } from '../auth.jsx'
import { SITE } from '../config.js'
import { computeStats, usersCsv } from '../admin/stats.js'
import { fmtDate } from '../data/certificates.js'
import { downloadBlob } from '../share.js'

/*
  Panel privado (solo para la cuenta de SITE.adminEmail, con el correo verificado).
  Lee todos los perfiles de Firestore y calcula las estadísticas en el navegador.
*/

const fmtN = (n, d = 0) => (n == null ? '—' : n.toLocaleString('es-ES', { maximumFractionDigits: d, minimumFractionDigits: d }))
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—')
const shortDate = (d) => { const [, m, dd] = d.split('-'); return `${+dd}/${+m}` }

function Kpi({ value, label, sub }) {
  return (
    <div className="stat card adm-kpi">
      <b className="mono">{value}</b>
      <span>{label}</span>
      {sub && <span className="adm-sub">{sub}</span>}
    </div>
  )
}

// Columnas por día (una sola serie): el título de la tarjeta dice qué se mide
function DayBars({ data, title, unit }) {
  const [hover, setHover] = useState(null)
  const max = Math.max(1, ...data.map((x) => x.v))
  const W = 600, H = 150, pb = 20, pt = 8
  const bw = W / data.length
  const total = data.reduce((a, x) => a + x.v, 0)
  return (
    <figure className="card adm-chart">
      <figcaption><b>{title}</b><span className="muted small">{fmtN(total)} en 30 días</span></figcaption>
      <div className="adm-chart-box">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title} onMouseLeave={() => setHover(null)}>
          {[0.5, 1].map((g) => <line key={g} x1="0" x2={W} y1={pt + (1 - g) * (H - pt - pb)} y2={pt + (1 - g) * (H - pt - pb)} stroke="var(--line)" />)}
          <line x1="0" x2={W} y1={H - pb} y2={H - pb} stroke="var(--line)" />
          {data.map((x, i) => {
            const h = (x.v / max) * (H - pt - pb)
            return (
              <g key={x.d} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={0}>
                <rect x={i * bw} y={pt} width={bw} height={H - pt - pb} fill="transparent" />
                {x.v > 0 && <rect x={i * bw + 2} y={H - pb - h} width={bw - 4} height={h} rx="3" fill="var(--accent)" opacity={hover === null || hover === i ? 1 : 0.45} />}
                {(i % 5 === 4 || i === data.length - 1) && <text x={i * bw + bw / 2} y={H - 5} textAnchor="middle" className="adm-axis">{shortDate(x.d)}</text>}
              </g>
            )
          })}
          <text x="2" y={pt + 10} className="adm-axis">{max}</text>
        </svg>
        {hover !== null && (
          <div className="adm-tip" style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}>
            <b>{fmtN(data[hover].v)} {data[hover].v === 1 ? unit[0] : unit[1]}</b><span>{fmtDate(data[hover].d)}</span>
          </div>
        )}
      </div>
    </figure>
  )
}

// Barras horizontales (embudo, canales, certificados…)
function HBars({ items, total, title, note }) {
  const max = Math.max(1, ...items.map((x) => x.v))
  return (
    <section className="card adm-block">
      <h3>{title}</h3>
      {note && <p className="muted small">{note}</p>}
      <ul className="adm-hbars">
        {items.map((x) => (
          <li key={x.label} title={`${x.label}: ${x.v}`}>
            <span className="adm-hlabel">{x.label}</span>
            <span className="adm-htrack"><span style={{ width: `${(x.v / max) * 100}%` }} /></span>
            <span className="mono adm-hval">{fmtN(x.v)}{total ? <span className="muted"> · {pct(x.v, total)}</span> : null}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Overview({ s }) {
  const k = s.kpi
  return (
    <div className="adm-grid">
      <div className="adm-kpis">
        <Kpi value={fmtN(k.total)} label="Usuarios registrados" sub={`+${k.new7} esta semana · +${k.new30} en 30 días`} />
        <Kpi value={fmtN(k.active1)} label="Activos hoy" sub={`${k.active7} en 7 días · ${k.active30} en 30 días`} />
        <Kpi value={pct(k.verified, k.verifiedKnown)} label="Correo verificado" sub={`${k.verified} de ${k.verifiedKnown} con dato`} />
        <Kpi value={fmtN(k.avgLessons, 1)} label="Lecciones por usuario" sub={`${fmtN(k.lessonsTotal)} completadas en total`} />
        <Kpi value={fmtN(k.testsOkTotal)} label="Tests aprobados" sub={`${fmtN(k.certsTotal)} certificados emitidos`} />
        <Kpi value={fmtN(s.practice.d)} label="Escenarios de práctica" sub={`${s.practice.users} usuarios practican`} />
      </div>
      <div className="adm-two">
        <DayBars data={s.signups} title="Registros por día" unit={['registro', 'registros']} />
        <DayBars data={s.active} title="Usuarios activos por día" unit={['usuario activo', 'usuarios activos']} />
      </div>
      <div className="adm-two">
        <HBars title="Embudo del alumno" items={s.funnel} total={s.N} note="De todas las cuentas, cuántas llegan a cada paso." />
        <HBars title="¿De dónde vienen los registros?" items={s.channels} total={s.N} note="Primera visita de cada usuario. Usa enlaces con ?utm_source=instagram en tu bio para medir Instagram con precisión." />
      </div>
      <div className="adm-two">
        <HBars title="Racha actual" items={s.streakBuckets} total={s.N} />
        <section className="card adm-block">
          <h3>Práctica y repaso</h3>
          <ul className="adm-facts">
            <li><span>Operaciones simuladas</span><b className="mono">{fmtN(s.practice.n)}</b></li>
            <li><span>Acierto global</span><b className="mono">{s.practice.n ? `${s.practice.winRate}%` : '—'}</b></li>
            <li><span>Resultado medio por operación</span><b className="mono">{s.practice.n ? `${s.practice.avgR >= 0 ? '+' : ''}${fmtN(s.practice.avgR, 2)} R` : '—'}</b></li>
            <li><span>Decisiones perfectas</span><b className="mono">{s.practice.d ? `${s.practice.quality}%` : '—'}</b></li>
            <li><span>Usuarios usando el repaso</span><b className="mono">{fmtN(s.review.users)}</b></li>
            <li><span>Preguntas pendientes de repaso</span><b className="mono">{fmtN(s.review.pending)}</b></li>
            <li><span>Aciertos en repaso · dominadas</span><b className="mono">{fmtN(s.review.ok)} · {fmtN(s.review.mastered)}</b></li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function Content({ s }) {
  const sortedViews = [...s.lessonViews].sort((a, b) => b.v - a.v)
  return (
    <div className="adm-grid">
      <section className="card adm-block">
        <h3>Módulos</h3>
        <p className="muted small">En orden del curso. Si "Empezado" cae mucho de un módulo al siguiente, ahí se pierde gente.</p>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Módulo</th><th>Empezado</th><th>Lecciones completas</th><th>Hicieron test</th><th>Aprobaron</th><th>Nota media</th></tr></thead>
            <tbody>
              {s.mods.map((m) => (
                <tr key={m.id}>
                  <td><span className="dot" style={{ background: m.hex, opacity: 1 }} /> {m.n}. {m.title}</td>
                  <td className="mono">{m.started} <span className="muted">{pct(m.started, s.N)}</span></td>
                  <td className="mono">{m.finished}</td>
                  <td className="mono">{m.took}</td>
                  <td className="mono">{m.ok} <span className="muted">{pct(m.ok, m.took)}</span></td>
                  <td className="mono">{m.avg == null ? '—' : `${Math.round(m.avg * 100)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="adm-two">
        <HBars title="Lecciones más vistas" items={sortedViews.slice(0, 10).map((l) => ({ label: l.title, v: l.v }))} total={s.N} />
        <HBars title="Lecciones menos vistas" items={[...sortedViews].reverse().slice(0, 10).map((l) => ({ label: l.title, v: l.v }))} total={s.N} />
      </div>
      <section className="card adm-block">
        <h3>Preguntas más falladas</h3>
        <p className="muted small">Preguntas que más alumnos tienen ahora en su repaso. Si muchos fallan la misma, quizá la lección necesita explicarlo mejor.</p>
        {s.hardQuestions.length === 0 ? <p className="muted">Aún no hay datos.</p> : (
          <ol className="adm-questions">
            {s.hardQuestions.map((q) => (
              <li key={`${q.m}:${q.i}`}>
                <b>{q.q}</b>
                <span className="small"><span className="up">Correcta:</span> {q.answer}</span>
                <span className="muted small">{q.module} · {q.users} {q.users === 1 ? 'alumno' : 'alumnos'} · {q.misses} fallos</span>
              </li>
            ))}
          </ol>
        )}
      </section>
      <div className="adm-two">
        <HBars title="Certificados" items={s.certs} total={s.N} />
        <HBars title="Insignias" items={s.badges} total={s.N} />
      </div>
    </div>
  )
}

const COLS = [
  ['name', 'Usuario'], ['created', 'Alta'], ['lastActivity', 'Última actividad'], ['channel', 'Origen'],
  ['lessons', 'Lecciones'], ['testsOk', 'Tests'], ['certs', 'Cert.'], ['streak', 'Racha'], ['practice', 'Práctica'],
]

function Users({ s }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState(['created', -1])
  const [open, setOpen] = useState(null)
  const val = (u, k) => (k === 'certs' ? u.certs.length : k === 'practice' ? u.practice.d : u[k] ?? '')
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    const f = s.users.filter((u) => !t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t))
    const [k, dir] = sort
    return f.sort((a, b) => { const x = val(a, k), y = val(b, k); return (x > y ? 1 : x < y ? -1 : 0) * dir })
  }, [s.users, q, sort]) // eslint-disable-line react-hooks/exhaustive-deps
  const exportCsv = () => downloadBlob(new Blob([usersCsv(list)], { type: 'text/csv;charset=utf-8' }), `usuarios-emfx-${new Date().toISOString().slice(0, 10)}.csv`)

  return (
    <section className="card adm-block">
      <div className="adm-users-head">
        <input className="text-input" placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} />
        <span className="muted small">{list.length} de {s.N}</span>
        <button className="btn ghost sm" onClick={exportCsv}>⬇ Exportar CSV</button>
      </div>
      <div className="adm-table-wrap">
        <table className="adm-table adm-users">
          <thead>
            <tr>{COLS.map(([k, label]) => (
              <th key={k}><button className="adm-sort" onClick={() => setSort(([sk, d]) => [k, sk === k ? -d : -1])}>{label}{sort[0] === k ? (sort[1] < 0 ? ' ↓' : ' ↑') : ''}</button></th>
            ))}</tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <Fragment key={u.uid}>
                <tr className="adm-row" onClick={() => setOpen(open === u.uid ? null : u.uid)}>
                  <td><b>{u.name}</b><br /><span className="muted small">{u.email}{u.verified === false ? ' · sin verificar' : ''}</span></td>
                  <td className="mono small">{u.created ? fmtDate(u.created) : '—'}</td>
                  <td className="mono small">{u.lastActivity ? fmtDate(u.lastActivity) : '—'}</td>
                  <td className="small">{u.channel}</td>
                  <td className="mono">{u.lessons}</td>
                  <td className="mono">{u.testsOk}/{u.tests}</td>
                  <td className="mono">{u.certs.length}</td>
                  <td className="mono">{u.streak ? `🔥 ${u.streak}` : '—'}</td>
                  <td className="mono">{u.practice.d}</td>
                </tr>
                {open === u.uid && (
                  <tr className="adm-detail">
                    <td colSpan={COLS.length}>
                      <div className="adm-detail-grid">
                        <div><b>Tests</b>{Object.keys(u.quiz).length === 0 ? <p className="muted small">Ninguno</p> : (
                          <ul>{Object.entries(u.quiz).map(([id, r]) => <li key={id} className="small">{id}: <span className="mono">{r.score}/{r.total}</span>{r.date ? ` · ${fmtDate(r.date)}` : ''}</li>)}</ul>
                        )}</div>
                        <div><b>Actividad</b><ul className="small">
                          <li>Días activos: {u.activeDays} · mejor racha: {u.bestStreak}</li>
                          <li>Repaso: {u.review} pendientes · {u.reviewOk} aciertos · {u.mastered} dominadas</li>
                          <li>Práctica: {u.practice.d} escenarios · {u.practice.n} operaciones · {u.practice.n ? `${Math.round((u.practice.wins / u.practice.n) * 100)}% acierto` : '—'} · {fmtN(u.practice.r, 1)} R</li>
                          <li>Insignias: {u.badges.length}</li>
                        </ul></div>
                        <div><b>Origen</b><ul className="small">
                          <li>Canal: {u.channel}</li>
                          {u.source?.ref && <li>Referencia: {u.source.ref}</li>}
                          {u.source?.utm && <li>UTM: {u.source.utm}{u.source.medium ? ` / ${u.source.medium}` : ''}{u.source.campaign ? ` / ${u.source.campaign}` : ''}</li>}
                          {u.source?.landing && <li>Entró por: {u.source.landing}</li>}
                          {u.source?.at && <li>Primera visita: {fmtDate(u.source.at)}</li>}
                        </ul></div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Panel() {
  const { user, verified } = useAuth()
  const [state, setState] = useState({ loading: true, error: '', users: [], at: null })
  const [tab, setTab] = useState('resumen')
  const isAdmin = user?.email?.toLowerCase() === SITE.adminEmail.toLowerCase()

  const load = () => {
    setState((s) => ({ ...s, loading: true, error: '' }))
    adminLoadUsers()
      .then((users) => setState({ loading: false, error: '', users, at: new Date() }))
      .catch((e) => setState({ loading: false, error: e?.code === 'permission-denied' ? 'Firestore ha denegado el acceso. Revisa que hayas publicado las reglas nuevas y que tu correo esté verificado.' : authError(e), users: [], at: null }))
  }
  useEffect(() => { if (isAdmin) load() }, [isAdmin]) // eslint-disable-line react-hooks/exhaustive-deps
  const stats = useMemo(() => (state.users.length ? computeStats(state.users) : null), [state.users])

  if (!isAdmin) {
    return (
      <div className="gate card">
        <div className="gate-ico" aria-hidden>🚫</div>
        <h2>Sin acceso</h2>
        <p className="muted">Esta página es privada.</p>
        <Link to="/" className="btn primary">Volver al inicio</Link>
      </div>
    )
  }
  return (
    <>
      {!verified && <p className="note warn-note">Tu correo no está verificado: verifícalo desde <Link to="/perfil">tu perfil</Link> o Firestore no te dejará leer los datos.</p>}
      <div className="adm-bar">
        <div className="segmented">
          {[['resumen', 'Resumen'], ['contenido', 'Contenido'], ['usuarios', 'Usuarios']].map(([id, label]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <span className="muted small">{state.at ? `Actualizado ${state.at.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
        <button className="btn ghost sm" onClick={load} disabled={state.loading}>{state.loading ? 'Cargando…' : '↻ Actualizar'}</button>
      </div>
      {state.error && <p className="note warn-note">{state.error}</p>}
      {state.loading && !stats && <div className="gate-loading"><span className="spinner" /> Leyendo los perfiles…</div>}
      {!state.loading && !state.error && !stats && <p className="muted">Aún no hay usuarios registrados.</p>}
      {stats && tab === 'resumen' && <Overview s={stats} />}
      {stats && tab === 'contenido' && <Content s={stats} />}
      {stats && tab === 'usuarios' && <Users s={stats} />}
    </>
  )
}

export default function Admin() {
  return (
    <div className="container page admin">
      <header className="page-head">
        <span className="eyebrow">Privado</span>
        <h1>Panel de {SITE.brand}</h1>
        <p className="muted">Datos de tus alumnos a partir de sus perfiles. Cada vez que abres o actualizas el panel se lee una vez cada perfil.</p>
      </header>
      <AuthGate title="Inicia sesión" text="Esta página es privada.">
        <Panel />
      </AuthGate>
    </div>
  )
}
