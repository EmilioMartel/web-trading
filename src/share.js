import { SITE } from './config.js'

// URL absoluta de una ruta de la web (funciona en local y en Vercel)
export const absUrl = (path = '/') => (typeof window !== 'undefined' ? window.location.origin : '') + path

export const shareTargets = (text, url) => {
  const t = encodeURIComponent(text)
  const u = encodeURIComponent(url)
  return [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}` },
    { id: 'x', label: 'X', href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ]
}

export const handle = SITE.instagramHandle

// Descarga un Blob como archivo
export function downloadBlob(blob, filename) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 1000)
}

// ¿Móvil o tablet? En ordenador siempre descargamos en lugar de abrir el menú de compartir
export const isMobile = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
}

// En el móvil abre el menú nativo (Instagram, WhatsApp…); en el ordenador descarga la imagen
export async function shareOrDownloadImage(blob, filename, text) {
  const file = new File([blob], filename, { type: 'image/png' })
  try {
    if (isMobile() && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text })
      return 'shared'
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return 'cancelled'
  }
  downloadBlob(blob, filename)
  return 'downloaded'
}
