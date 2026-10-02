import { useState } from 'react'
import { modules } from '../data/course.js'
import { progress } from '../hooks/useProgress.js'

// Panel de pruebas: SOLO aparece con `npm run dev` (nunca en la web publicada)
export const DEV = !!import.meta.env?.DEV

export default function DevPanel() {
  const [open, setOpen] = useState(false)
  if (!DEV) return null
  const fillTracks = (tracks) => {
    const mods = modules.filter((m) => tracks.includes(m.track))
    progress.fill(mods.flatMap((m) => m.lessons.map((l) => l.slug)), mods.map((m) => m.id), Math.max(...mods.map((m) => m.quiz.length)))
  }
  return (
    <div className={`dev-panel ${open ? 'open' : ''}`}>
      <button className="dev-toggle" onClick={() => setOpen((o) => !o)} title="Modo prueba (solo en local)">🧪</button>
      {open && (
        <div className="dev-body">
          <b>Modo prueba</b>
          <span className="muted small">Solo visible en local (npm run dev)</span>
          <button className="btn primary sm" onClick={() => fillTracks(['base', 'tecnico', 'institucional', 'complementos'])}>Completar todo el curso</button>
          <button className="btn ghost sm" onClick={() => fillTracks(['base', 'tecnico'])}>Completar base + ruta técnica</button>
          <button className="btn ghost sm" onClick={() => fillTracks(['base', 'institucional'])}>Completar base + ruta institucional</button>
          <button className="btn ghost sm" onClick={() => progress.reset()}>Borrar progreso</button>
        </div>
      )}
    </div>
  )
}
