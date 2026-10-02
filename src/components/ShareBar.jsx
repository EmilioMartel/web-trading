import { useState } from 'react'
import { shareTargets, shareOrDownloadImage, isMobile } from '../share.js'
import { storyCard } from '../cards.js'
import { SITE } from '../config.js'

/*
  Barra para compartir.
  - text / url: lo que se comparte
  - story: datos para generar una imagen de historia de Instagram (opcional)
*/
export default function ShareBar({ title = 'Compártelo', text, url, story, filename = 'emiliomartelfx.png' }) {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const mobile = isMobile()
  const canNative = mobile && typeof navigator !== 'undefined' && !!navigator.share

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500) }

  const native = async () => {
    try { await navigator.share({ title: SITE.brand, text, url }) } catch { /* cancelado */ }
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${text} ${url}`); flash('Enlace copiado ✓') }
    catch { flash('No se pudo copiar: selecciona y copia la dirección del navegador') }
  }
  const storyImg = async () => {
    setBusy(true)
    try {
      const blob = await storyCard(story)
      const r = await shareOrDownloadImage(blob, filename, `${text} ${SITE.instagramHandle}`)
      if (r === 'downloaded') flash(`Imagen descargada ✓ Súbela a tu historia de Instagram y menciona ${SITE.instagramHandle}`)
    } finally { setBusy(false) }
  }

  return (
    <section className="share card">
      <div className="share-head">
        <b>{title}</b>
        <span className="muted small">Ayuda a que más gente aprenda gratis</span>
      </div>
      <div className="share-btns">
        {canNative && <button className="btn primary sm" onClick={native}>Compartir…</button>}
        {story && <button className="btn ig sm" onClick={storyImg} disabled={busy}>{busy ? 'Generando…' : mobile ? 'Imagen para historia' : '⬇ Descargar imagen'}</button>}
        {shareTargets(text, url).map((t) => (
          <a key={t.id} className={`btn ghost sm share-${t.id}`} href={t.href} target="_blank" rel="noreferrer">{t.label}</a>
        ))}
        <button className="btn ghost sm" onClick={copy}>Copiar enlace</button>
      </div>
      {msg && <p className="share-msg small" role="status">{msg}</p>}
    </section>
  )
}
