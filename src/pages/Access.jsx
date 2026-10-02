import { useEffect, useState } from 'react'
import { Link, useRouter } from '../router.jsx'
import { useAuth, signIn, signUp, resetPassword, authError } from '../auth.jsx'
import { cleanName, cleanEmail, nameError, emailError, passwordRules, passwordOk, cleanPassword } from '../lib/validation.js'

const readParams = () => {
  const q = new URLSearchParams(window.location.search)
  const back = q.get('volver')
  return { mode: q.get('modo') === 'registro' ? 'registro' : 'entrar', back: back && back.startsWith('/') ? back : '/perfil' }
}

function PasswordInput({ value, onChange, onBlur, autoComplete, placeholder = '••••••••', id, invalid, valid, describedBy }) {
  const [show, setShow] = useState(false)
  return (
    <span className="pw-field">
      <input id={id} className={`text-input ${invalid ? 'is-invalid' : valid ? 'is-valid' : ''}`} type={show ? 'text' : 'password'} value={value}
        onChange={(e) => onChange(cleanPassword(e.target.value))} onKeyDown={(e) => { if (e.key === ' ') e.preventDefault() }} onBlur={onBlur} autoComplete={autoComplete} placeholder={placeholder}
        autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-invalid={invalid || undefined} aria-describedby={describedBy} />
      <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        {show ? 'Ocultar' : 'Ver'}
      </button>
    </span>
  )
}

// Lista de requisitos que se van marcando en verde mientras se escribe la contraseña
function PasswordRules({ value, id }) {
  return (
    <ul id={id} className="pw-rules" aria-live="polite">
      {passwordRules(value).map((r) => (
        <li key={r.id} className={r.ok ? 'ok' : ''}><span aria-hidden>{r.ok ? '✓' : '○'}</span>{r.label}</li>
      ))}
    </ul>
  )
}
export { PasswordInput, PasswordRules }

const FieldError = ({ msg, id }) => (msg ? <span id={id} className="field-error" role="alert">{msg}</span> : null)

export default function Access() {
  const { navigate } = useRouter()
  const { ready, user, profile } = useAuth()
  const [{ mode: initialMode, back }] = useState(readParams)
  const [mode, setMode] = useState(initialMode) // entrar | registro | recuperar
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => { setError(''); setInfo(''); setTouched({}) }, [mode])
  useEffect(() => { document.title = (mode === 'registro' ? 'Crear cuenta' : 'Iniciar sesión') + ' · EmilioMartelFx' }, [mode])

  const isReg = mode === 'registro'
  const errs = {
    name: isReg ? nameError(name) : '',
    email: emailError(email),
    password: mode === 'recuperar' ? '' : isReg ? (passwordOk(password) ? '' : 'La contraseña no cumple todos los requisitos.') : (password ? '' : 'Escribe tu contraseña.'),
  }
  const show = (k) => (touched[k] || touched.submit) && errs[k]
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }))
  const okField = (k) => touched[k] && !errs[k]
  const formOk = !errs.name && !errs.email && !errs.password

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo('')
    // Limpia espacios sobrantes antes de enviar
    const cName = cleanName(name), cEmail = cleanEmail(email)
    setName(cName); setEmail(cEmail)
    setTouched((t) => ({ ...t, submit: true }))
    if (!formOk) return
    setBusy(true)
    try {
      if (mode === 'entrar') { await signIn(cEmail, password); navigate(back) }
      else if (isReg) { await signUp({ name: cName, email: cEmail, password }); navigate(back) }
      else { await resetPassword(cEmail); setInfo(`Si existe una cuenta con ${cEmail}, te hemos enviado un correo para crear una contraseña nueva. Revisa también la carpeta de spam.`) }
    } catch (err) {
      setError(authError(err))
    } finally {
      setBusy(false)
    }
  }

  if (!ready) {
    return (
      <div className="container page auth-page">
        <div className="auth-card card">
          <h1>Cuentas no disponibles</h1>
          <p className="muted">Falta pegar la configuración de Firebase en <code>src/firebase-config.js</code>.</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="container page auth-page">
        <div className="auth-card card">
          <span className="eyebrow">Tu cuenta</span>
          <h1>Ya has iniciado sesión</h1>
          <p className="muted">Estás dentro como <b>{profile?.name || user.email}</b>.</p>
          <div className="row gap">
            <Link to={back} className="btn primary">Continuar →</Link>
            <Link to="/perfil" className="btn ghost">Ir a mi perfil</Link>
          </div>
        </div>
      </div>
    )
  }

  const titles = {
    entrar: ['Bienvenido de nuevo', 'Entra para seguir con tu progreso, tus tests y tus certificados.'],
    registro: ['Crea tu cuenta gratis', 'Guarda tu progreso en todos tus dispositivos, haz los tests y consigue tus certificados.'],
    recuperar: ['Recupera tu contraseña', 'Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva.'],
  }

  return (
    <div className="container page auth-page">
      <div className="auth-card card">
        {mode !== 'recuperar' && (
          <div className="segmented auth-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'entrar'} className={mode === 'entrar' ? 'on' : ''} onClick={() => setMode('entrar')}>Iniciar sesión</button>
            <button type="button" role="tab" aria-selected={mode === 'registro'} className={mode === 'registro' ? 'on' : ''} onClick={() => setMode('registro')}>Crear cuenta</button>
          </div>
        )}
        <h1>{titles[mode][0]}</h1>
        <p className="muted">{titles[mode][1]}</p>

        <form className="auth-form" onSubmit={submit} noValidate>
          {isReg && (
            <label className="field">
              <span className="field-label">Nombre y apellidos</span>
              <input className={`text-input ${show('name') ? 'is-invalid' : okField('name') ? 'is-valid' : ''}`} value={name}
                onChange={(e) => setName(e.target.value)} onBlur={() => { setName(cleanName(name)); touch('name')() }}
                autoComplete="name" autoCapitalize="words" maxLength={60} placeholder="Ej.: Laura Pérez García"
                aria-invalid={!!show('name') || undefined} aria-describedby="err-name" />
              <FieldError id="err-name" msg={show('name')} />
              {!show('name') && <span className="field-hint">Así aparecerá en tus certificados.</span>}
            </label>
          )}
          <label className="field">
            <span className="field-label">Correo electrónico</span>
            <input className={`text-input ${show('email') ? 'is-invalid' : okField('email') ? 'is-valid' : ''}`} type="email" inputMode="email" value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))} onBlur={() => { setEmail(cleanEmail(email)); touch('email')() }}
              autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="tu@correo.com"
              aria-invalid={!!show('email') || undefined} aria-describedby="err-email" />
            <FieldError id="err-email" msg={show('email')} />
          </label>
          {mode !== 'recuperar' && (
            <label className="field">
              <span className="field-top">
                <span className="field-label">Contraseña</span>
                {mode === 'entrar' && <button type="button" className="link-btn" onClick={() => setMode('recuperar')}>¿La has olvidado?</button>}
              </span>
              <PasswordInput value={password} onChange={setPassword} onBlur={touch('password')} invalid={!!show('password')} valid={isReg && passwordOk(password)}
                autoComplete={isReg ? 'new-password' : 'current-password'} placeholder={isReg ? 'Crea una contraseña segura' : '••••••••'}
                describedBy={isReg ? 'pw-rules' : 'err-password'} />
              {isReg ? <PasswordRules id="pw-rules" value={password} /> : <FieldError id="err-password" msg={show('password')} />}
            </label>
          )}

          {error && <p className="note warn-note" role="alert">{error}</p>}
          {info && <p className="note ok-note" role="status">{info}</p>}

          <button className="btn primary lg auth-submit" disabled={busy}>
            {busy ? 'Un momento…' : mode === 'entrar' ? 'Entrar' : isReg ? 'Crear cuenta' : 'Enviar enlace'}
          </button>
        </form>

        {mode === 'registro' && <p className="muted small">Al registrarte te enviaremos un correo para verificar tu dirección. Solo usamos tus datos para guardar tu progreso y emitir tus certificados.</p>}
        {mode === 'recuperar' && <button type="button" className="link-btn" onClick={() => setMode('entrar')}>← Volver a iniciar sesión</button>}
      </div>
    </div>
  )
}
