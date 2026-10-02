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
| Gestión del riesgo | `src/data/riesgo.js` |
| Ruta de análisis técnico | `src/data/tecnico-1.js`, `tecnico-2.js`, `tecnico-3.js` |
| Ruta de análisis institucional | `src/data/institucional.js` |
| Fundamentos | `src/data/fundamentos.js` |
| Complementos (indicadores, fundamental, psicología, sistema) | `src/data/complementos.js` |
| Preguntas extra de los tests | `src/data/quiz-extra-1.js` … `quiz-extra-4.js` |
| Orden de módulos y rutas | `src/data/course.js` |
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

Widgets disponibles: `candle`, `structure`, `sessions`, `pipvalue`, `rr`, `lotcalc`, `drawdown`, `ma`, `fib`, `montecarlo`, `compound`, `riskunit`, `matrix`, `partials`, `checklist`.

### Gráficos de ejemplo paso a paso

Con `chart({...})` dibujas un gráfico ilustrativo. Las velas se generan a partir de los puntos de giro (`path: [[vela, precio], ...]`) y puedes añadir anotaciones y pasos:

```js
chart({
  title: 'Cambio de estructura', symbol: 'EUR/USD · H4', seed: 3,
  path: [[0, 30], [8, 55], [13, 44], [21, 70]],          // swings: [índice de vela, precio]
  mods: { 13: { o: 50, c: 45 } },                         // retocar velas concretas (o, h, l, c)
  ann: [
    { t: 'zone', x1: 13, y1: 43, y2: 47, c: 'up', label: 'Order block', step: 1 },
    { t: 'h', y: 55, x1: 8, label: 'Máximo previo' },     // línea horizontal
    { t: 'line', x1: 0, y1: 30, x2: 13, y2: 44, ext: true }, // línea de tendencia
    { t: 'fib', x1: 13, y1: 44, x2: 21, y2: 70, levels: [0, 0.618, 0.786, 1, -0.27] },
    { t: 'trade', x: 21, entry: 60, sl: 54, tp: 78 },      // posición con SL/TP y ratio
    { t: 'pt', x: 8, y: 55, text: 'HH' }, { t: 'txt', x: 5, y: 40, text: 'Texto' },
  ],
  steps: [ { to: 13, text: 'Paso 1…' }, { to: 21, text: 'Paso 2…' } ], // opcional
})
```

Colores: `up`, `down`, `accent`, `violet`, `blue`, `muted`.

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
