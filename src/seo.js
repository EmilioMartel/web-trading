/*
  SEO: título, descripción, URL canónica, imagen para compartir y datos estructurados de cada página.
  Se usa en dos sitios:
  - En el navegador (App.jsx), al cambiar de página.
  - Al compilar (vite.config.js), para generar un HTML por página con sus etiquetas ya puestas.
    Así Google, WhatsApp, Instagram o X ven el título y la imagen correctos aunque no ejecuten JavaScript.
*/
import { lessons, modules, tracks } from './data/course.js'
import { SITE } from './config.js'

export const SITE_URL = SITE.url
const BRAND = SITE.brand
const OG_IMAGE = `${SITE_URL}/og.png`

const clip = (s, n = 158) => {
  const t = String(s).replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  return t.slice(0, t.lastIndexOf(' ', n - 1)).replace(/[,;:.\s]+$/, '') + '…'
}

const HOME_DESC = `Curso gratuito de trading desde cero: Forex, índices y oro. ${modules.length} módulos y ${lessons.length} lecciones con gráficos interactivos, tests, certificados y herramientas para traders.`

const STATIC = {
  '/': { title: `${BRAND} · Aprende trading desde cero`, desc: HOME_DESC },
  '/curso': {
    title: `Curso de trading gratuito desde cero · ${BRAND}`,
    desc: `Temario completo: ${tracks.map((t) => t.name).join(', ')}. ${modules.length} módulos y ${lessons.length} lecciones con ejemplos en gráficos, tests de evaluación y certificados.`,
  },
  '/herramientas': {
    title: `Herramientas para traders: calculadora de lotaje y más · ${BRAND}`,
    desc: 'Calculadora de tamaño de posición, riesgo/beneficio, simulador de curva de capital, sesiones de mercado, Fibonacci, drawdown e interés compuesto. Gratis.',
  },
  '/sobre-mi': { title: `Sobre mí · ${BRAND}`, desc: `Conoce a ${SITE.author}, trader y creador de ${BRAND}: su historia, su forma de operar y por qué comparte este curso gratis.` },
  '/privacidad': { title: `Política de privacidad · ${BRAND}`, desc: `Qué datos personales trata ${BRAND}, para qué, durante cuánto tiempo y cómo ejercer tus derechos.` },
  '/aviso-legal': { title: `Aviso legal · ${BRAND}`, desc: `Información legal sobre el titular de ${BRAND} y las condiciones de uso de la web.` },
  // Páginas privadas o de cuenta: no se indexan
  '/certificado': { title: `Certificados · ${BRAND}`, desc: HOME_DESC, noindex: true },
  '/acceso': { title: `Entrar o crear cuenta · ${BRAND}`, desc: HOME_DESC, noindex: true },
  '/perfil': { title: `Mi perfil · ${BRAND}`, desc: HOME_DESC, noindex: true },
}

// Datos de una ruta. Las rutas desconocidas se tratan como 404.
export function routeMeta(rawPath) {
  const path = rawPath.replace(/\/+$/, '') || '/'
  let m
  if (STATIC[path]) return { path, ...STATIC[path], type: path === '/' ? 'website' : 'article' }
  if ((m = path.match(/^\/curso\/test\/([\w-]+)$/))) {
    const mod = modules.find((x) => x.id === m[1])
    if (mod) return { path, title: `Test: ${mod.title} · ${BRAND}`, desc: clip(`Comprueba lo aprendido en el módulo «${mod.title}» con ${mod.quiz.length} preguntas.`), noindex: true, type: 'article' }
  }
  if ((m = path.match(/^\/curso\/([\w-]+)$/))) {
    const l = lessons.find((x) => x.slug === m[1])
    if (l) {
      const mod = modules.find((x) => x.id === l.moduleId)
      return {
        path,
        title: `${l.title} · Curso de trading · ${BRAND}`,
        desc: clip(`Módulo «${l.moduleTitle}» del curso gratuito de trading. ${l.takeaways?.length ? l.takeaways.join('. ') + '.' : mod.desc}`),
        type: 'article',
        lesson: l,
      }
    }
  }
  return { path, title: `Página no encontrada · ${BRAND}`, desc: HOME_DESC, noindex: true, notFound: true, type: 'website' }
}

// Todas las rutas que existen (para generar un HTML por página al compilar)
export const allPaths = () => [
  ...Object.keys(STATIC),
  ...lessons.map((l) => `/curso/${l.slug}`),
  ...modules.map((m) => `/curso/test/${m.id}`),
]
// Las que deben aparecer en Google
export const indexablePaths = () => allPaths().filter((p) => !routeMeta(p).noindex)

const COURSE_LD = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: `Curso de trading desde cero · ${BRAND}`,
  description: HOME_DESC,
  url: `${SITE_URL}/curso`,
  inLanguage: 'es',
  isAccessibleForFree: true,
  educationalLevel: 'Principiante a avanzado',
  provider: { '@type': 'Person', name: SITE.author, url: `${SITE_URL}/sobre-mi`, sameAs: [SITE.instagram] },
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', category: 'Free' },
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${Math.round(lessons.reduce((a, l) => a + (l.minutes || 0), 0) / 60)}H` },
  syllabusSections: modules.map((m) => ({ '@type': 'Syllabus', name: m.title, description: m.desc })),
}

// Datos estructurados (JSON-LD) para Google
export function jsonLd(meta) {
  if (meta.path === '/' || meta.path === '/curso') return COURSE_LD
  if (meta.lesson) {
    return {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: meta.lesson.title,
      description: meta.desc,
      url: SITE_URL + meta.path,
      inLanguage: 'es',
      isAccessibleForFree: true,
      learningResourceType: 'Lección',
      timeRequired: meta.lesson.minutes ? `PT${meta.lesson.minutes}M` : undefined,
      isPartOf: { '@type': 'Course', name: COURSE_LD.name, url: COURSE_LD.url },
    }
  }
  return null
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Etiquetas <head> en texto (para los HTML generados al compilar)
export function headTags(meta) {
  const url = SITE_URL + (meta.path === '/' ? '/' : meta.path)
  const ld = jsonLd(meta)
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.desc)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    meta.notFound ? '' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${BRAND}" />`,
    '<meta property="og:locale" content="es_ES" />',
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.desc)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${BRAND}: aprende trading desde cero" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.desc)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ld ? `<script type="application/ld+json" id="ld-json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : '',
  ].filter(Boolean).join('\n    ')
}

// Actualiza las etiquetas en el navegador al cambiar de página
export function applyMeta(meta) {
  const head = document.head
  const set = (sel, make, attr, value) => {
    let el = head.querySelector(sel)
    if (value == null) { el?.remove(); return }
    if (!el) { el = make(); head.appendChild(el) }
    el.setAttribute(attr, value)
  }
  const metaTag = (key, keyAttr) => () => { const m = document.createElement('meta'); m.setAttribute(keyAttr, key); return m }
  const url = SITE_URL + (meta.path === '/' ? '/' : meta.path)
  document.title = meta.title
  set('meta[name="description"]', metaTag('description', 'name'), 'content', meta.desc)
  set('meta[name="robots"]', metaTag('robots', 'name'), 'content', meta.noindex ? 'noindex, follow' : null)
  set('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l }, 'href', meta.notFound ? null : url)
  for (const [k, v] of [['og:title', meta.title], ['og:description', meta.desc], ['og:url', url], ['og:type', meta.type]]) {
    set(`meta[property="${k}"]`, metaTag(k, 'property'), 'content', v)
  }
  set('meta[name="twitter:title"]', metaTag('twitter:title', 'name'), 'content', meta.title)
  set('meta[name="twitter:description"]', metaTag('twitter:description', 'name'), 'content', meta.desc)
  const ld = jsonLd(meta)
  let s = document.getElementById('ld-json')
  if (!ld) { s?.remove(); return }
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-json'; head.appendChild(s) }
  s.textContent = JSON.stringify(ld)
}
