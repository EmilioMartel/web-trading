import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { allPaths, indexablePaths, routeMeta, headTags, SITE_URL } from './src/seo.js'

/*
  Al compilar genera:
  - Un HTML por página (curso/que-es-el-trading.html…) con su título, descripción, imagen y datos para Google.
    Vercel los sirve con URLs limpias (cleanUrls en vercel.json).
  - 404.html para las direcciones que no existen (Vercel responde con código 404).
  - sitemap.xml con todas las páginas públicas.
*/
export function seoPages() {
  let outDir = 'dist'
  const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
  return {
    name: 'emfx-seo-pages',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir) },
    closeBundle() {
      const base = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      if (!SEO_BLOCK.test(base)) throw new Error('index.html: faltan las marcas <!-- seo:start --> / <!-- seo:end -->')
      const page = (p) => base.replace(SEO_BLOCK, headTags(routeMeta(p)))
      for (const p of allPaths()) {
        const file = p === '/' ? 'index.html' : `${p.slice(1)}.html`
        fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true })
        fs.writeFileSync(path.join(outDir, file), page(p))
      }
      fs.writeFileSync(path.join(outDir, '404.html'), page('/404'))
      const today = new Date().toISOString().slice(0, 10)
      const urls = indexablePaths().map((p) => {
        const prio = p === '/' ? '1.0' : p === '/curso' ? '0.9' : p.startsWith('/curso/') ? '0.7' : '0.5'
        return `  <url><loc>${SITE_URL}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><priority>${prio}</priority></url>`
      })
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
      console.log(`\n✓ SEO: ${allPaths().length} páginas, 404.html y sitemap.xml (${urls.length} URLs)`)
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPages()],
  build: {
    rollupOptions: {
      output: {
        // Librerías en archivos propios: cambian poco, así el navegador las reutiliza entre versiones de la web
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'firebase'
          if (id.includes('/react') || id.includes('/scheduler/')) return 'react'
        },
      },
    },
  },
})
