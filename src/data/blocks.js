// Pequeños helpers para escribir el contenido de las lecciones de forma legible.
// Usa **texto** para negrita dentro de cualquier bloque.
export const p = (x) => ({ t: 'p', x })
export const h = (x) => ({ t: 'h', x })
export const ul = (...items) => ({ t: 'ul', items })
export const ol = (...items) => ({ t: 'ol', items })
export const tip = (x) => ({ t: 'tip', x })
export const warn = (x) => ({ t: 'warn', x })
export const ex = (title, x) => ({ t: 'ex', title, x })
export const f = (x) => ({ t: 'f', x }) // fórmula
export const w = (name) => ({ t: 'w', name }) // widget interactivo
export const table = (head, rows) => ({ t: 'table', head, rows })
