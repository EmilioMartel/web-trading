// Foto de perfil o, si no hay, las iniciales sobre un color fijo según el nombre
const COLORS = ['#22c55e', '#f5b301', '#a78bfa', '#38bdf8', '#f97316', '#ec4899', '#14b8a6']

export const initials = (name = '') =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'

export default function Avatar({ name = '', photo, size = 40, className = '' }) {
  const color = COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size, fontSize: size * 0.4, '--av': color }} aria-hidden>
      {photo ? <img src={photo} alt="" /> : initials(name)}
    </span>
  )
}
