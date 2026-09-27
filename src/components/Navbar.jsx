import { useEffect, useState } from 'react'
import { Link, useRouter } from '../router.jsx'
import { useTheme } from '../hooks/useTheme.js'
import { SITE } from '../config.js'

const LINKS = [
  ['/curso', 'Curso'],
  ['/herramientas', 'Herramientas'],
  ['/sobre-mi', 'Sobre mí'],
]

export default function Navbar() {
  const [theme, toggle] = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { path } = useRouter()

  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''} ${open ? 'open' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo" aria-label="Inicio">
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden>
            <rect width="32" height="32" rx="8" fill="var(--logo-bg)" />
            <rect x="7" y="12" width="4" height="10" rx="1" fill="var(--down)" /><rect x="8.5" y="8" width="1" height="18" fill="var(--down)" />
            <rect x="14" y="9" width="4" height="12" rx="1" fill="var(--up)" /><rect x="15.5" y="5" width="1" height="19" fill="var(--up)" />
            <rect x="21" y="6" width="4" height="9" rx="1" fill="var(--up)" /><rect x="22.5" y="3" width="1" height="15" fill="var(--up)" />
          </svg>
          <span>Emilio<b>Martel</b><em>Fx</em></span>
        </Link>
        <nav className="nav-links" aria-label="Principal">
          {LINKS.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="nav-ig">Instagram ↗</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={toggle} aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'} title="Cambiar tema">
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            )}
          </button>
          <Link to="/curso" className="btn primary sm hide-sm">Empezar gratis</Link>
          <button className="icon-btn burger" onClick={() => setOpen((o) => !o)} aria-label="Menú" aria-expanded={open}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
