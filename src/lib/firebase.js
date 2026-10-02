import { firebaseConfig } from '../firebase-config.js'

// Si todavía no se ha pegado la configuración, la web sigue funcionando sin cuentas
export const firebaseReady = !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PEGA_')

// Firebase se descarga aparte y en segundo plano (no retrasa la primera carga de la web)
let loading = null
export const loadFirebase = () => (loading ||= import('./fb.js').then((m) => m.init(firebaseConfig)))
