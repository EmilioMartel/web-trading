import { createContext, useContext, useEffect, useState } from 'react'
import { firebaseReady, loadFirebase } from './lib/firebase.js'
import { progress, useProgress } from './hooks/useProgress.js'
import { CERTS, certStatus } from './data/certificates.js'

/*
  Cuentas de usuario con Firebase (el SDK se carga aparte, ver lib/fb.js):
  - Authentication (correo y contraseña)
  - Firestore: users/{uid}
      { name, email, createdAt, updatedAt,
        progress: { done: [...], quiz: { [modulo]: { score, total, date } } },
        certificates: { [id]: { name, code, date } } }
  - Firestore: avatars/{uid}  { photo, updatedAt }  (WebP 160×160, ~6-12 KB)
  El perfil se lee al entrar y al volver a la pestaña (para recoger cambios de otros dispositivos).
*/

const AuthCtx = createContext({ ready: false, loading: false, user: null, profile: null, photo: null, verified: false })
export const useAuth = () => useContext(AuthCtx)

let FB = null          // SDK de Firebase ya cargado
let ui = null          // setters del proveedor (para que las acciones actualicen la pantalla)
let pendingName = ''   // nombre elegido al registrarse (el perfil se crea antes de que Firebase lo tenga)
let pending = false    // hay progreso pendiente de subir
let timer = null

const fb = async () => (FB ||= await loadFirebase())
const origin = () => window.location.origin
const userRef = (uid) => FB.doc(FB.db, 'users', uid)
const avatarRef = (uid) => FB.doc(FB.db, 'avatars', uid)
// Usuario de Firebase con sesión (aunque la pantalla aún no se haya actualizado)
export const currentUser = () => FB?.auth.currentUser || null

function uploadProgress(uid) {
  return (p) => {
    clearTimeout(timer); pending = true
    timer = setTimeout(() => {
      FB.updateDoc(userRef(uid), { progress: p, updatedAt: FB.serverTimestamp() })
        .catch((e) => console.error('No se pudo guardar el progreso', e))
        .finally(() => { pending = false })
    }, 600)
  }
}

export function AuthProvider({ children }) {
  const [st, setSt] = useState({ ready: firebaseReady, loading: firebaseReady, user: null, profile: null, verified: false, error: '' })
  const [photo, setPhoto] = useState(null)
  const { quiz } = useProgress()

  useEffect(() => {
    if (!firebaseReady) return
    let stop = () => {}
    let alive = true
    ui = {
      setProfile: (fn) => setSt((s) => ({ ...s, profile: s.profile ? fn(s.profile) : s.profile })),
      setPhoto,
      setVerified: (v) => setSt((s) => ({ ...s, verified: v })),
    }

    fb().then(({ auth, onAuthStateChanged }) => {
      if (!alive) return
      stop = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          clearTimeout(timer)
          progress.detach()
          setPhoto(null)
          setSt({ ready: true, loading: false, user: null, profile: null, verified: false, error: '' })
          return
        }
        setSt((s) => ({ ...s, ready: true, loading: false, user, verified: user.emailVerified }))
        const ref = userRef(user.uid)
        try {
          let snap = await FB.getDoc(ref)
          if (!snap.exists()) {
            await FB.setDoc(ref, {
              name: pendingName || user.displayName || '',
              email: user.email,
              createdAt: FB.serverTimestamp(),
              updatedAt: FB.serverTimestamp(),
              progress: progress.get(),
              certificates: {},
            })
            snap = await FB.getDoc(ref)
          }
          const data = snap.data()
          if (progress.attach(data.progress, uploadProgress(user.uid))) uploadProgress(user.uid)(progress.get())
          // Fotos antiguas guardadas dentro del perfil: se pasan a avatars/{uid}
          if (data.photo !== undefined) {
            if (data.photo) await FB.setDoc(avatarRef(user.uid), { photo: data.photo, updatedAt: FB.serverTimestamp() })
            await FB.updateDoc(ref, { photo: FB.deleteField() })
            setPhoto(data.photo || null)
            delete data.photo
          } else {
            const av = await FB.getDoc(avatarRef(user.uid))
            setPhoto(av.exists() ? av.data().photo || null : null)
          }
          setSt({ ready: true, loading: false, user, profile: data, verified: user.emailVerified, error: '' })
        } catch (e) {
          console.error('No se pudo cargar el perfil', e)
          setSt((s) => ({ ...s, profile: s.profile || { name: user.displayName || '', email: user.email, certificates: {} }, error: authError(e) }))
        }
        pendingName = ''
      })
    }).catch((e) => {
      console.error('No se pudo cargar Firebase', e)
      setSt({ ready: true, loading: false, user: null, profile: null, verified: false, error: authError(e) })
    })

    // Al volver a la pestaña, recoge cambios hechos desde otro dispositivo
    const onVisible = async () => {
      const u = currentUser()
      if (document.visibilityState !== 'visible' || !u || pending) return
      try {
        const snap = await FB.getDoc(userRef(u.uid))
        if (!snap.exists() || pending) return
        const data = snap.data()
        if (data.progress) progress.fromCloud(data.progress)
        setSt((s) => (s.user ? { ...s, profile: data } : s))
      } catch { /* sin conexión: se reintentará la próxima vez */ }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => { alive = false; stop(); document.removeEventListener('visibilitychange', onVisible) }
  }, [])

  // Guarda en el perfil los certificados conseguidos (con la fecha en que se completaron)
  useEffect(() => {
    if (!st.user || !st.profile) return
    const have = st.profile.certificates || {}
    const add = {}
    for (const c of CERTS) {
      const s = certStatus(c, quiz)
      if (s.complete && !have[c.id]) add[c.id] = { name: c.name, code: c.code, date: s.lastDate }
    }
    if (!Object.keys(add).length) return
    ui.setProfile((p) => ({ ...p, certificates: { ...(p.certificates || {}), ...add } }))
    const changes = Object.fromEntries(Object.entries(add).map(([id, v]) => [`certificates.${id}`, v]))
    FB.updateDoc(userRef(st.user.uid), changes).catch(console.error)
  }, [quiz, st.user, st.profile])

  const value = { ...st, photo, setVerified: (v) => ui?.setVerified(v) }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

/* ---------- Acciones de la cuenta ---------- */

export async function signUp({ name, email, password }) {
  const F = await fb()
  pendingName = name.trim()
  const cred = await F.createUserWithEmailAndPassword(F.auth, email.trim(), password)
  await F.updateProfile(cred.user, { displayName: pendingName || null })
  try { await F.sendEmailVerification(cred.user, { url: `${origin()}/perfil` }) } catch { /* se puede reenviar desde el perfil */ }
  return cred.user
}

export async function signIn(email, password) {
  const F = await fb()
  return F.signInWithEmailAndPassword(F.auth, email.trim(), password)
}
export async function logOut() { const F = await fb(); return F.signOut(F.auth) }
export async function resetPassword(email) {
  const F = await fb()
  return F.sendPasswordResetEmail(F.auth, email.trim(), { url: `${origin()}/acceso` })
}
export async function resendVerification() {
  const F = await fb()
  return F.sendEmailVerification(F.auth.currentUser, { url: `${origin()}/perfil` })
}

// Comprueba si el usuario ya ha pulsado el enlace del correo de verificación
export async function reloadUser() {
  const F = await fb()
  await F.auth.currentUser.reload()
  return F.auth.currentUser.emailVerified
}

export async function updateName(name) {
  const F = await fb()
  const clean = name.trim().slice(0, 60)
  await F.updateDoc(userRef(F.auth.currentUser.uid), { name: clean, updatedAt: F.serverTimestamp() })
  await F.updateProfile(F.auth.currentUser, { displayName: clean })
  ui?.setProfile((p) => ({ ...p, name: clean }))
}

export async function updatePhoto(photo) {
  const F = await fb()
  const ref = avatarRef(F.auth.currentUser.uid)
  if (photo) await F.setDoc(ref, { photo, updatedAt: F.serverTimestamp() })
  else await F.deleteDoc(ref)
  ui?.setPhoto(photo || null)
}

async function reauth(password) {
  const F = await fb()
  const u = F.auth.currentUser
  await F.reauthenticateWithCredential(u, F.EmailAuthProvider.credential(u.email, password))
  return u
}

export async function changePassword(current, next) {
  const u = await reauth(current)
  await FB.updatePassword(u, next)
}

export async function deleteAccount(password) {
  const u = await reauth(password)
  clearTimeout(timer)
  await FB.deleteDoc(avatarRef(u.uid))
  await FB.deleteDoc(userRef(u.uid))
  await FB.deleteUser(u)
}

/* ---------- Mensajes de error en español ---------- */
const ERRORS = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Prueba a iniciar sesión.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/weak-password': 'La contraseña es demasiado débil: usa al menos 8 caracteres.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'La contraseña no es correcta.',
  'auth/user-not-found': 'No hay ninguna cuenta con ese correo.',
  'auth/user-disabled': 'Esta cuenta está desactivada.',
  'auth/too-many-requests': 'Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet e inténtalo de nuevo.',
  'auth/requires-recent-login': 'Por seguridad, cierra sesión, vuelve a entrar e inténtalo de nuevo.',
  'auth/operation-not-allowed': 'El acceso con correo y contraseña no está activado en Firebase.',
  'permission-denied': 'No tienes permiso para esta acción (revisa las reglas de Firestore).',
  'unavailable': 'No hay conexión con el servidor. Inténtalo de nuevo en un momento.',
}
export const authError = (e) => ERRORS[e?.code] || 'Algo ha fallado. Inténtalo de nuevo.'
