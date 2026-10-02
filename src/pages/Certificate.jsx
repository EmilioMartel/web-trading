import { useEffect, useState } from 'react'
import { Link } from '../router.jsx'
import { useProgress } from '../hooks/useProgress.js'
import { CERTS, certStatus, certId, fmtDate, trackGroups } from '../data/certificates.js'
import { certificateCanvas, canvasToBlob, storyCard } from '../cards.js'
import { downloadBlob, shareOrDownloadImage, absUrl, isMobile } from '../share.js'
import ShareBar from '../components/ShareBar.jsx'
import { canvasToPdf } from '../pdf.js'
import { SITE } from '../config.js'
import { DEV } from '../components/DevPanel.jsx'
import { progress } from '../hooks/useProgress.js'

const NAME_KEY = 'emfx-cert-name'
const loadName = () => { try { return localStorage.getItem(NAME_KEY) || '' } catch { return '' } }

function CertCard({ cert, quiz, name }) {
  const st = certStatus(cert, quiz)
  const groups = trackGroups(quiz)
  const [img, setImg] = useState(null) // { url, blob }
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const pct = Math.round((st.okCount / st.total) * 100)
  const validName = name.trim().length >= 3

  const shownName = validName ? name.trim() : 'Tu nombre'
  // Vista previa automática en cuanto la ruta está completa (se regenera al escribir el nombre)
  useEffect(() => {
    if (!st.complete) return
    let alive = true
    setBusy(true)
    const t = setTimeout(async () => {
      const date = st.lastDate
      const cv = await certificateCanvas({ name: shownName, cert, modules: st.mods, groups, date: fmtDate(date), id: certId(cert, shownName, date) })
      const blob = await canvasToBlob(cv)
      if (alive) { setImg({ url: cv.toDataURL('image/png'), blob, cv }); setBusy(false) }
    }, 350)
    return () => { alive = false; clearTimeout(t) }
  }, [shownName, st.complete, st.lastDate]) // eslint-disable-line react-hooks/exhaustive-deps

  const fileBase = `certificado-${cert.id}-${name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
  const downloadPdf = async () => {
    const pdf = await canvasToPdf(img.cv, `Certificado ${cert.name} - ${name.trim()}`)
    downloadBlob(pdf, `${fileBase}.pdf`)
  }

  const story = async () => {
    const mods = st.mods.map((m) => m.title)
    const items = cert.premium ? groups.map((g) => g.name)
      : mods.length > 5 ? [...mods.slice(0, 4), `y ${mods.length - 4} módulos más`] : mods
    const blob = await storyCard({ kicker: cert.premium ? 'Programa completado' : `${cert.label} completada`.replace('Complementos completada', 'Complementos completados'), title: cert.premium ? 'Diploma final' : `Certificado de ${cert.name}`, sub: cert.premium ? `${name.trim()} · ${st.total} módulos superados con éxito` : `${name.trim()} · todas las pruebas superadas con éxito`, items, badge: 'cert', tone: cert.tone, footer: `Formación en trading · ${SITE.instagramHandle}` })
    const r = await shareOrDownloadImage(blob, `${fileBase}-historia.png`, shareText)
    if (r === 'downloaded') { setMsg(`Imagen descargada ✓ Súbela a tu historia y menciona ${SITE.instagramHandle}`); setTimeout(() => setMsg(''), 4000) }
  }

  const shareText = cert.premium
    ? `He completado el programa completo de trading de ${SITE.instagramHandle}, superando con éxito las pruebas de evaluación de sus ${st.total} módulos`
    : `He completado ${cert.id === 'base' ? 'la formación base de trading' : cert.id === 'complementos' ? 'los Complementos del trader' : `la ruta de ${cert.name}`} de ${SITE.instagramHandle}, superando con éxito todas las pruebas de evaluación`

  return (
    <article className={`cert card ${st.complete ? 'ready' : ''} ${cert.premium ? 'premium' : ''}`} style={{ '--tone': cert.tone }}>
      <div className="cert-head">
        <div>
          <span className="eyebrow cert-eyebrow">{cert.premium ? '🏆 ' : ''}{cert.label}</span>
          <h2>{cert.name}</h2>
          <p className="muted small">{cert.premium ? 'El diploma final: supera con al menos un 80% el test de cada uno de los módulos del curso.'
            : cert.id === 'base' || cert.id === 'complementos' ? 'Supera con al menos un 80% el test de cada módulo de este bloque.'
            : 'Supera con al menos un 80% los tests de la base y de todos los módulos de la ruta.'}</p>
        </div>
        <div className="ring" style={{ '--p': pct }}><span className="mono">{st.okCount}/{st.total}</span></div>
      </div>

      {cert.premium ? (
        <ul className="cert-reqs">
          {groups.map((g) => (
            <li key={g.id} className={g.okCount === g.count ? 'ok' : ''}>
              <span className="check" aria-hidden>{g.okCount === g.count ? '✓' : ''}</span>
              <span className="grow"><span className="dot" style={{ background: g.hex }} />{g.name}</span>
              <span className={`mono small ${g.okCount === g.count ? 'up' : 'muted'}`}>{g.okCount}/{g.count} módulos</span>
            </li>
          ))}
        </ul>
      ) : (
      <ul className="cert-reqs">
        {st.rows.map(({ m, q, ok }) => (
          <li key={m.id} className={ok ? 'ok' : ''}>
            <span className="check" aria-hidden>{ok ? '✓' : ''}</span>
            <span className="grow">{m.title}</span>
            {ok ? <span className="mono small up">{q.score}/{q.total}</span>
              : <Link to={`/curso/test/${m.id}`} className="small">{q ? `${q.score}/${q.total} · repetir` : 'Hacer test'} →</Link>}
          </li>
        ))}
      </ul>
      )}

      {!st.complete && <p className="muted small">Te faltan {st.total - st.okCount} test(s). Cuando los superes, aquí podrás generar tu certificado.</p>}
      {!st.complete && DEV && (
        <button className="btn outline sm dev-unlock" onClick={() => progress.fill(st.mods.flatMap((m) => m.lessons.map((l) => l.slug)), st.mods.map((m) => m.id), 20)}>
          🧪 Modo prueba: desbloquear este certificado
        </button>
      )}

      {st.complete && (
        <div className="cert-actions">
          <p className="up small"><b>¡Completado el {fmtDate(st.lastDate)}!</b></p>
          {!validName && <p className="note warn-note">Escribe tu nombre arriba (mínimo 3 letras) para personalizar y descargar tu certificado.</p>}
          {img && (
            <>
              <img className={`cert-preview ${busy ? 'busy' : ''}`} src={img.url} alt={`Certificado de ${cert.name}`} />
              <div className="share-btns">
                <button className="btn primary sm" disabled={!validName} onClick={() => downloadBlob(img.blob, `${fileBase}.png`)}>⬇ Descargar certificado (PNG)</button>
                <button className="btn ghost sm" disabled={!validName} onClick={downloadPdf}>⬇ Descargar PDF</button>
                <button className="btn ig sm" disabled={!validName} onClick={story}>{isMobile() ? 'Imagen para historia' : '⬇ Imagen para historia'}</button>
              </div>
              {msg && <p className="share-msg small">{msg}</p>}
              <ShareBar
                title="Compártelo"
                text={shareText}
                url={absUrl('/')}
              />
            </>
          )}
        </div>
      )}
    </article>
  )
}

export default function Certificate() {
  const { quiz } = useProgress()
  const [name, setName] = useState(loadName)
  useEffect(() => { try { localStorage.setItem(NAME_KEY, name) } catch {} }, [name])

  // El diploma va al final hasta que se consigue; entonces pasa a ser lo primero
  const master = CERTS.find((c) => c.premium)
  const rest = CERTS.filter((c) => !c.premium)
  const ordered = certStatus(master, quiz).complete ? [master, ...rest] : [...rest, master]

  return (
    <div className="container page narrow">
      <header className="page-head">
        <span className="eyebrow">Certificados</span>
        <h1>Tu certificado de finalización</h1>
        <p className="lead muted">Cada bloque superado tiene su certificado con tu nombre, y al terminarlo todo consigues el diploma final del programa completo. Descárgalos, imprímelos o compártelos.</p>
        <label className="field cert-name">
          <span className="field-label">Nombre que aparecerá en el certificado</span>
          <input className="text-input" value={name} maxLength={60} placeholder="Tu nombre y apellidos" onChange={(e) => setName(e.target.value)} />
        </label>
      </header>
      <div className="certs">
        {ordered.map((c) => <CertCard key={c.id} cert={c} quiz={quiz} name={name} />)}
      </div>
      <p className="muted small">Tu progreso se guarda en este navegador. Formación gratuita con fines educativos: el certificado no constituye una titulación oficial.</p>
    </div>
  )
}
