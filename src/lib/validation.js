// Validaciones de los formularios de cuenta (registro, acceso y cambio de contraseña)

// Quita espacios al principio y al final, y deja un solo espacio entre palabras
export const cleanName = (s) => s.replace(/\s+/g, ' ').trim()
// Los correos no distinguen mayúsculas y no pueden llevar espacios
export const cleanEmail = (s) => s.trim().toLowerCase()

export const isEmail = (s) => /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(cleanEmail(s))

export function nameError(s) {
  const n = cleanName(s)
  if (!n) return 'Escribe tu nombre y apellidos.'
  if (n.replace(/[^\p{L}]/gu, '').length < 3) return 'El nombre debe tener al menos 3 letras.'
  if (/[^\p{L}\s'.-]/u.test(n)) return 'El nombre solo puede llevar letras, espacios, guiones y apóstrofos.'
  return ''
}

export function emailError(s) {
  if (!cleanEmail(s)) return 'Escribe tu correo electrónico.'
  if (!isEmail(s)) return 'Ese correo no tiene un formato válido (ejemplo: nombre@gmail.com).'
  return ''
}

// Las contraseñas no admiten espacios: se eliminan al escribir o pegar
export const cleanPassword = (s) => s.replace(/\s/g, '')

// Requisitos de una contraseña segura
export const passwordRules = (pw) => [
  { id: 'len', label: 'Al menos 8 caracteres', ok: pw.length >= 8 },
  { id: 'upper', label: 'Una letra mayúscula', ok: /\p{Lu}/u.test(pw) },
  { id: 'lower', label: 'Una letra minúscula', ok: /\p{Ll}/u.test(pw) },
  { id: 'special', label: 'Un carácter especial (!@#$%&*…)', ok: /[^\p{L}\p{N}\s]/u.test(pw) },
]
export const passwordOk = (pw) => passwordRules(pw).every((r) => r.ok)
