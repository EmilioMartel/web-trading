/*
  Origen de la visita: se guarda la PRIMERA vez que alguien entra en la web (de dónde venía y por qué página
  entró). Al crear la cuenta se copia a su perfil, así el panel /admin sabe qué canal trae registros.
  Para medir Instagram con precisión, usa enlaces con ?utm_source=instagram (p. ej. en la bio).
*/
const KEY = 'emfx-source'

export function captureSource() {
  try {
    if (localStorage.getItem(KEY)) return
    const q = new URLSearchParams(window.location.search)
    let ref = ''
    try { const r = new URL(document.referrer); if (r.host !== window.location.host) ref = r.host } catch { /* sin referencia */ }
    const src = {
      ref,
      utm: (q.get('utm_source') || '').slice(0, 40),
      medium: (q.get('utm_medium') || '').slice(0, 40),
      campaign: (q.get('utm_campaign') || '').slice(0, 60),
      landing: window.location.pathname.slice(0, 120),
      at: new Date().toISOString().slice(0, 10),
    }
    localStorage.setItem(KEY, JSON.stringify(src))
  } catch { /* almacenamiento no disponible */ }
}

export const getSource = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || null } catch { return null }
}

// Canal legible a partir del origen guardado
export function channel(src) {
  if (!src) return 'Sin datos'
  const s = `${src.utm || ''} ${src.ref || ''}`.toLowerCase()
  if (/instagram|ig\b/.test(s)) return 'Instagram'
  if (/google/.test(s)) return 'Google'
  if (/bing|duckduckgo|yahoo|ecosia/.test(s)) return 'Otros buscadores'
  if (/facebook|fb\.|messenger/.test(s)) return 'Facebook'
  if (/whatsapp|wa\.me/.test(s)) return 'WhatsApp'
  if (/t\.co|twitter|x\.com/.test(s)) return 'X'
  if (/telegram|t\.me/.test(s)) return 'Telegram'
  if (/tiktok/.test(s)) return 'TikTok'
  if (/youtube/.test(s)) return 'YouTube'
  if (!s.trim()) return 'Directo'
  return src.utm || src.ref
}
