# EmilioMartelFx — Web de trading

Mini curso gratuito de trading (Forex, índices y oro) de cero a avanzado, con herramientas interactivas, progreso guardado en el navegador y modo claro/oscuro.

Hecho con **React 19 + Vite**, sin más dependencias. Listo para desplegar en **Vercel**.

## Arrancar en tu ordenador

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
3. Vercel detecta Vite automáticamente (Build: `npm run build`, Output: `dist`). Pulsa **Deploy**.
4. Opcional: en *Settings → Domains* conecta tu dominio (p. ej. `emiliomartelfx.com`).

`vercel.json` ya incluye la regla para que las rutas (`/curso/...`, `/herramientas`) funcionen al recargar.

## Qué editar primero

| Qué | Dónde |
|---|---|
| Tu usuario de Instagram, email | `src/config.js` → `SITE` |
| Tu historia, rutina y valores (textos entre [corchetes]) | `src/config.js` → `ABOUT` |
| Tu foto | Guarda `emilio.jpg` en `public/` y pon `photo: '/emilio.jpg'` |
| Lecciones y tests | `src/data/m1-m2.js` … `src/data/m7-m8.js` |
| Colores | `src/styles.css` (variables al principio) |

### Añadir o editar lecciones

Cada lección es un objeto con bloques:

```js
{
  slug: 'mi-leccion',            // URL: /curso/mi-leccion
  title: 'Título',
  minutes: 5,
  blocks: [
    p('Párrafo con **negrita**'),
    h('Subtítulo'),
    ul('punto 1', 'punto 2'),
    tip('Consejo'), warn('Advertencia'), ex('Ejemplo', 'texto'),
    f('Fórmula'),
    table(['Col 1', 'Col 2'], [['a', 'b']]),
    w('lotcalc'),                // widget interactivo
  ],
  takeaways: ['Idea clave 1', 'Idea clave 2'],
}
```

Widgets disponibles: `candle`, `structure`, `choch`, `sessions`, `pipvalue`, `rr`, `lotcalc`, `drawdown`, `ma`, `fib`, `montecarlo`, `compound`.

## Estructura

```
src/
  config.js          ← tus datos
  data/              ← contenido del curso y tests
  components/        ← navbar, footer, quiz, widgets interactivos
  pages/             ← Inicio, Curso, Lección, Test, Herramientas, Sobre mí
  hooks/             ← tema y progreso (localStorage)
  styles.css
```
