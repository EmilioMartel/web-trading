import { useEffect, useRef, useState } from 'react'
import { Link, useRouter } from '../router.jsx'
import {
  useAuth, logOut, updateName, updatePhoto, resendVerification, reloadUser,
  changePassword, deleteAccount, authError, currentUser,
} from '../auth.jsx'
import { useProgress, progress } from '../hooks/useProgress.js'
import { tracks, modules, lessons } from '../data/course.js'
import { CERTS, certStatus, fmtDate, passed } from '../data/certificates.js'
import { fileToAvatar } from '../lib/avatar.js'
import Avatar from '../components/Avatar.jsx'
import { PasswordInput, PasswordRules } from './Access.jsx'
import { StreakCard, ReviewCard, BadgeGrid } from '../components/Gamification.jsx'
import { cleanName, nameError, passwordOk } from '../lib/validation.js'

// Al confirmar con la contraseña actual, un fallo de credenciales significa que esa contraseña no es correcta
const WRONG_PW = ['auth/invalid-credential', 'auth/wrong-password', 'auth/invalid-login-credentials']
const isWrongPw = (err) => WRONG_PW.includes(err?.code)

const Msg = ({ m }) => (m ? <p className={`note ${m.ok ? 'ok-note' : 'warn-note'}`} role="status">{m.text}</p> : null)

function PhotoCard({ profile, photo }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true); setMsg(null)
    try { await updatePhoto(await fileToAvatar(file)); setMsg({ ok: true, text: 'Foto actualizada ✓' }) }
    catch (err) { setMsg({ ok: false, text: err.code ? authError(err) : err.message }) }
    finally { setBusy(false) }
  }
  const remove = async () => {
    setBusy(true)
    try { await updatePhoto(null); setMsg(null) } catch (err) { setMsg({ ok: false, text: authError(err) }) } finally { setBusy(false) }
  }
  return (
    <div className="profile-photo">
      <button type="button" className={`avatar-edit ${busy ? 'busy' : ''}`} onClick={() => input.current.click()} aria-label="Cambiar foto de perfil">
        <Avatar name={profile.name} photo={photo} size={112} />
        <span className="avatar-edit-badge" aria-hidden>📷</span>
      </button>
      <input ref={input} type="file" accept="image/*" hidden onChange={pick} />
      <div className="row gap">
        <button type="button" className="btn ghost sm" disabled={busy} onClick={() => input.current.click()}>{busy ? 'Guardando…' : photo ? 'Cambiar foto' : 'Subir foto'}</button>
        {photo && <button type="button" className="btn ghost sm" disabled={busy} onClick={remove}>Quitar</button>}
      </div>
      <Msg m={msg} />
    </div>
  )
}

function VerifyBanner({ verified, setVerified }) {
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  if (verified) return <span className="badge up">✓ Correo verificado</span>
  const resend = async () => {
    setBusy(true)
    try { await resendVerification(); setMsg({ ok: true, text: 'Correo enviado. Revisa tu bandeja de entrada (y el spam).' }) }
    catch (e) { setMsg({ ok: false, text: authError(e) }) } finally { setBusy(false) }
  }
  const check = async () => {
    setBusy(true)
    try {
      const v = await reloadUser(); setVerified(v)
      if (!v) setMsg({ ok: false, text: 'Todavía no aparece verificado. Pulsa el enlace del correo y vuelve a comprobarlo.' })
    } catch (e) { setMsg({ ok: false, text: authError(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="verify-box">
      <p><span className="badge down">Correo sin verificar</span> Te enviamos un enlace al registrarte para confirmar que el correo es tuyo.</p>
      <div className="row gap">
        <button className="btn ghost sm" disabled={busy} onClick={resend}>Reenviar correo</button>
        <button className="btn ghost sm" disabled={busy} onClick={check}>Ya lo he verificado</button>
      </div>
      <Msg m={msg} />
    </div>
  )
}

function NameForm({ profile }) {
  const [name, setName] = useState(profile.name || '')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => setName(profile.name || ''), [profile.name])
  const save = async (e) => {
    e.preventDefault()
    const clean = cleanName(name); setName(clean)
    const err = nameError(clean)
    if (err) return setMsg({ ok: false, text: err })
    setBusy(true)
    try { await updateName(clean); setMsg({ ok: true, text: 'Nombre guardado ✓ Tus certificados ya lo usan.' }) }
    catch (err) { setMsg({ ok: false, text: authError(err) }) } finally { setBusy(false) }
  }
  return (
    <form className="profile-form" onSubmit={save}>
      <label className="field">
        <span className="field-label">Nombre y apellidos · aparece en tus certificados</span>
        <span className="row gap nowrap">
          <input className="text-input grow" value={name} maxLength={60} onChange={(e) => { setName(e.target.value); setMsg(null) }} onBlur={() => setName(cleanName(name))} autoCapitalize="words" />
          <button className="btn primary sm" disabled={busy || cleanName(name) === (profile.name || '')}>Guardar</button>
        </span>
      </label>
      <Msg m={msg} />
    </form>
  )
}

function PasswordForm() {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [curErr, setCurErr] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const save = async (e) => {
    e.preventDefault()
    setMsg(null); setCurErr('')
    if (!passwordOk(next)) return setMsg({ ok: false, text: 'La nueva contraseña no cumple todos los requisitos.' })
    if (next === cur) return setMsg({ ok: false, text: 'La nueva contraseña debe ser distinta de la actual.' })
    setBusy(true)
    try { await changePassword(cur, next); setCur(''); setNext(''); setMsg({ ok: true, text: 'Contraseña cambiada ✓' }) }
    catch (err) {
      if (isWrongPw(err)) setCurErr('La contraseña actual no es correcta.')
      else setMsg({ ok: false, text: authError(err) })
    } finally { setBusy(false) }
  }
  return (
    <form className="profile-form" onSubmit={save}>
      <div className="grid-2">
        <label className="field">
          <span className="field-label">Contraseña actual</span>
          <PasswordInput value={cur} onChange={(v) => { setCur(v); setCurErr(''); setMsg(null) }} autoComplete="current-password" invalid={!!curErr} describedBy="err-cur" />
          {curErr && <span id="err-cur" className="field-error" role="alert">{curErr}</span>}
        </label>
        <label className="field">
          <span className="field-label">Nueva contraseña</span>
          <PasswordInput value={next} onChange={(v) => { setNext(v); setMsg(null) }} autoComplete="new-password" placeholder="Crea una contraseña segura" valid={passwordOk(next)} />
          {next && <PasswordRules value={next} />}
        </label>
      </div>
      <button className="btn ghost sm self-start" disabled={busy || !cur || !passwordOk(next)}>{busy ? 'Comprobando…' : 'Cambiar contraseña'}</button>
      <Msg m={msg} />
    </form>
  )
}

function DeleteAccount() {
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const { navigate } = useRouter()
  const go = async (e) => {
    e.preventDefault()
    setBusy(true)
    try { await deleteAccount(pw); navigate('/') }
    catch (err) { setMsg({ ok: false, text: isWrongPw(err) ? 'La contraseña no es correcta.' : authError(err) }); setBusy(false) }
  }
  if (!open) return <button className="btn danger-outline sm" onClick={() => setOpen(true)}>Eliminar mi cuenta</button>
  return (
    <form className="profile-form danger-box" onSubmit={go}>
      <p><b>Esta acción no se puede deshacer.</b> Se borrarán tu cuenta, tu foto, tu progreso y tus certificados.</p>
      <label className="field"><span className="field-label">Escribe tu contraseña para confirmar</span><PasswordInput value={pw} onChange={setPw} autoComplete="current-password" /></label>
      <label className="field"><span className="field-label">Escribe <b>ELIMINAR</b></span><input className="text-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label>
      <Msg m={msg} />
      <div className="row gap">
        <button className="btn danger sm" disabled={busy || !pw || confirm.trim().toUpperCase() !== 'ELIMINAR'}>{busy ? 'Eliminando…' : 'Eliminar definitivamente'}</button>
        <button type="button" className="btn ghost sm" onClick={() => { setOpen(false); setPw(''); setConfirm(''); setMsg(null) }}>Cancelar</button>
      </div>
    </form>
  )
}

export default function Profile() {
  const { ready, loading, user, profile, photo, verified, setVerified, error } = useAuth()
  const { done, quiz } = useProgress()
  const { navigate } = useRouter()

  useEffect(() => { if (ready && !loading && !user && !currentUser()) navigate('/acceso?volver=/perfil') }, [ready, loading, user, navigate])
  // Si se llega con #insignias (desde el aviso o la racha), baja hasta esa sección al cargar
  const loaded = !!(user && profile)
  useEffect(() => {
    if (!loaded || !window.location.hash) return
    setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [loaded])

  if (!ready) return <div className="container page narrow"><p className="muted">Las cuentas no están configuradas todavía.</p></div>
  if (!user || !profile) return <div className="container page narrow"><div className="gate-loading" role="status"><span className="spinner" /> Cargando tu perfil…</div></div>

  const doneSet = new Set(done)
  const lessonsDone = lessons.filter((l) => doneSet.has(l.slug)).length
  const testsOk = modules.filter((m) => passed(quiz[m.id])).length
  const certs = CERTS.map((c) => ({ c, s: certStatus(c, quiz) }))
  const earned = certs.filter(({ s }) => s.complete).length
  const since = profile.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : null

  return (
    <div className="container page narrow profile">
      {error && <p className="note warn-note">No se ha podido sincronizar tu perfil: {error}</p>}
      <section className="profile-head card">
        <PhotoCard profile={profile} photo={photo} />
        <div className="profile-id">
          <span className="eyebrow">Mi perfil</span>
          <h1>{profile.name || 'Sin nombre'}</h1>
          <p className="muted">{user.email}{since ? ` · Alumno desde ${since}` : ''}</p>
          <VerifyBanner verified={verified} setVerified={setVerified} />
        </div>
      </section>

      <section className="profile-stats">
        <div className="stat card"><b className="mono">{lessonsDone}<small>/{lessons.length}</small></b><span>Lecciones vistas</span></div>
        <div className="stat card"><b className="mono">{testsOk}<small>/{modules.length}</small></b><span>Tests superados</span></div>
        <div className="stat card"><b className="mono">{earned}<small>/{CERTS.length}</small></b><span>Certificados</span></div>
      </section>

      <section className="card profile-block" id="insignias">
        <h2>Racha e insignias</h2>
        <div className="gami-top">
          <StreakCard />
          <ReviewCard />
        </div>
        <BadgeGrid />
      </section>

      <section className="card profile-block">
        <div className="block-head">
          <h2>Tu progreso</h2>
          <Link to="/curso" className="btn ghost sm">Ir al curso →</Link>
        </div>
        <div className="track-progress">
          {tracks.map((t) => {
            const mods = modules.filter((m) => m.track === t.id)
            const ok = mods.filter((m) => passed(quiz[m.id])).length
            const ls = mods.flatMap((m) => m.lessons)
            const seen = ls.filter((l) => doneSet.has(l.slug)).length
            return (
              <div key={t.id} className="tp-row" style={{ '--tone': t.hex }}>
                <div className="tp-top"><b><span className="dot" style={{ background: t.hex }} />{t.name}</b><span className="mono small muted">{ok}/{mods.length} tests · {seen}/{ls.length} lecciones</span></div>
                <div className="bar"><div style={{ width: `${(ok / mods.length) * 100}%`, background: t.hex }} /></div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="card profile-block">
        <div className="block-head">
          <h2>Tus certificados</h2>
          <Link to="/certificado" className="btn ghost sm">Ver todos →</Link>
        </div>
        <ul className="cert-list">
          {certs.map(({ c, s }) => (
            <li key={c.id} className={`${s.complete ? 'ok' : ''} ${c.premium ? 'premium' : ''}`} style={{ '--tone': c.tone }}>
              <span className="cert-medal" aria-hidden>{s.complete ? (c.premium ? '🏆' : '🎓') : '🔒'}</span>
              <span className="grow">
                <b>{c.name}</b>
                <span className="muted small">{s.complete ? `Conseguido el ${fmtDate(profile.certificates?.[c.id]?.date || s.lastDate)}` : `${c.label} · ${s.okCount}/${s.total} tests superados`}</span>
              </span>
              {s.complete
                ? <Link to={`/certificado#cert-${c.id}`} className="btn primary sm">Descargar</Link>
                : <span className="mini-bar"><span style={{ width: `${(s.okCount / s.total) * 100}%` }} /></span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="card profile-block">
        <h2>Datos de la cuenta</h2>
        <NameForm profile={profile} />
        <h3>Cambiar contraseña</h3>
        <PasswordForm />
      </section>

      <section className="card profile-block">
        <h2>Sesión</h2>
        <div className="row gap">
          <button className="btn ghost" onClick={() => logOut().then(() => navigate('/'))}>Cerrar sesión</button>
          {done.length + Object.keys(quiz).length > 0 && (
            <button className="btn ghost" onClick={() => { if (window.confirm('¿Seguro que quieres borrar todo tu progreso? Perderás también los certificados conseguidos.')) progress.reset() }}>Reiniciar progreso</button>
          )}
        </div>
        <h3 className="danger-title">Zona peligrosa</h3>
        <DeleteAccount />
      </section>
    </div>
  )
}
