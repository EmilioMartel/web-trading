import { p, h, ul, ol, tip, warn, ex, w, table, chart } from './blocks.js'

/* =========================================================
   RUTA DE ANÁLISIS TÉCNICO · Módulo 5
   ========================================================= */

export const t5 = {
  id: 'tecnico-confluencias',
  track: 'tecnico',
  title: 'Confluencias, trampas y ejecución',
  desc: 'Cómo juntar herramientas, evitar fake outs y barridas de stops, analizar desde cero y gestionar entrada, stop y objetivo.',
  lessons: [
    {
      slug: 'confluencias-en-zonas-de-reaccion',
      title: 'Confluencias en zonas de reacción',
      minutes: 6,
      blocks: [
        p('¿Qué zona tiene más probabilidad: una simple resistencia, o una resistencia que coincide con el techo de un canal y un nivel de Fibonacci? Obviamente la segunda. Eso es una **confluencia**: varias herramientas independientes señalando el mismo sitio.'),
        chart({
          title: 'Tres razones en la misma zona', symbol: 'XAU/USD · H4', seed: 24,
          path: [[0, 26], [8, 50], [13, 38], [22, 70], [30, 53], [40, 84]],
          ann: [
            { t: 'h', y: 50, x1: 8, label: 'Antigua resistencia', c: 'muted', step: 0 },
            { t: 'line', x1: 0, y1: 26, x2: 13, y2: 38, ext: true, c: 'accent', step: 1 },
            { t: 'fib', x1: 13, y1: 38, x2: 22, y2: 70, levels: [0.5, 0.618], x3: 33, step: 2 },
            { t: 'zone', x1: 27, x2: 34, y1: 49.5, y2: 55, c: 'up', label: 'Confluencia', lb: true, step: 3 },
          ],
          steps: [
            { to: 22, text: 'Una resistencia rota ahora puede actuar como soporte.' },
            { to: 22, text: 'Además, la línea de tendencia alcista pasa por la misma zona.' },
            { to: 22, text: 'Y el retroceso del último impulso llega al 0.5–0.618 justo ahí.' },
            { to: 40, text: 'Tres herramientas en la misma zona: el precio reacciona con fuerza. Con confirmación de velas, es una compra de alta probabilidad.' },
          ],
        }),
        tip('Organiza el gráfico con **un color por temporalidad** y borra lo que no aporte. Un gráfico limpio se lee mejor.'),
      ],
      takeaways: ['Confluencia = varias herramientas en la misma zona', 'Más confluencias = más probabilidad', 'Un color por temporalidad'],
    },
    {
      slug: 'fake-out',
      title: 'Fake out: la ruptura falsa',
      minutes: 6,
      blocks: [
        p('El mercado a menudo "enseña" una dirección para que muchos traders entren… y luego va al lado contrario. La trampa más común es el **fake out**: una vela cierra fuera del nivel y la siguiente vuelve a cerrar dentro.'),
        chart({
          title: 'Cierra fuera… y vuelve dentro', symbol: 'EUR/USD · H1', seed: 25,
          path: [[0, 60], [6, 40], [12, 58], [18, 41], [24, 57], [29, 44], [31, 38], [32, 47], [40, 72]],
          mods: { 31: { o: 43.5, h: 44, l: 37, c: 38.2 }, 32: { o: 38.2, h: 47.5, l: 37.8, c: 46.8 } },
          ann: [
            { t: 'h', y: 40, x1: 6, label: 'Soporte', c: 'muted', step: 0 },
            { t: 'txt', x: 31, y: 37, text: 'Cierra fuera', c: 'down', pos: 'b', step: 1 },
            { t: 'txt', x: 36, y: 52, text: 'Vuelve dentro', c: 'up', step: 2 },
          ],
          steps: [
            { to: 29, text: 'El precio respeta un soporte en 40.' },
            { to: 31, text: 'Una vela bajista cierra por debajo del soporte. Muchos venden aquí pensando que se ha roto.' },
            { to: 32, text: 'La siguiente vela recupera todo y cierra dentro: es un fake out. Los vendedores quedan atrapados.' },
            { to: 40, text: 'Sus stops alimentan la subida. Si la segunda vela hubiera seguido bajando, la ruptura sí habría sido real.' },
          ],
        }),
        ul(
          'Todo lo que ocurre entre el último máximo y el último mínimo de la estructura mayor es **ruido**.',
          'Si la vela rompe con mucho volumen y la siguiente confirma, la ruptura es más fiable.',
          'Funciona igual en soportes, resistencias, líneas de tendencia y canales.'
        ),
      ],
      takeaways: ['Fake out = cierre fuera y siguiente vela dentro', 'La segunda vela confirma o desmiente', 'Dentro de la estructura mayor, todo es ruido'],
    },
    {
      slug: 'caza-de-stops',
      title: 'Caza de stops y órdenes límite',
      minutes: 6,
      blocks: [
        p('En zonas con muchas confluencias se acumulan órdenes de compradores y vendedores. Es habitual que el precio **barra primero los stops de un lado, luego los del otro** y solo después haga el movimiento real. Esto se ve sobre todo en M1, M5 y M15.'),
        chart({
          title: 'Barre arriba, barre abajo y se va', symbol: 'GBP/USD · M5', seed: 26,
          path: [[0, 40], [5, 55], [9, 46], [13, 54], [17, 47], [21, 54.5], [22, 60], [23, 52], [26, 53], [27, 42], [28, 50], [37, 74]],
          mods: { 22: { c: 53.5, o: 54 }, 27: { o: 52, c: 49 } },
          ann: [
            { t: 'zone', x1: 1, x2: 26, y1: 46, y2: 55, c: 'violet', o: 0.08, label: 'Acumulación' },
            { t: 'txt', x: 22, y: 60, text: 'Stops de vendedores', c: 'down' },
            { t: 'txt', x: 27, y: 42, text: 'Stops de compradores', c: 'up', pos: 'b' },
          ],
          note: 'Quien vendió en el techo y quien compró en el suelo con el stop ajustado quedan fuera antes del movimiento.',
        }),
        h('Cómo protegerte'),
        ol(
          'Opera a favor de la tendencia de la temporalidad mayor.',
          'Evita abrir en M1 por sistema: un simple latigazo de spread puede tocar tu stop.',
          'Si usas órdenes límite, sé más conservador con el stop: detrás de otro máximo/mínimo, no justo encima del nivel obvio.',
          'Piensa como el otro bando: dibuja lo que está viendo el vendedor si tú quieres comprar.'
        ),
        warn('La paciencia es la mejor defensa: a veces el precio barre incluso la siguiente resistencia antes de ir en tu dirección.'),
      ],
      takeaways: ['Las zonas obvias acumulan stops', 'El precio suele barrerlos antes de moverse', 'Stop detrás de estructura, no en el nivel obvio'],
    },
    {
      slug: 'comprador-y-vendedor',
      title: 'Las dos perspectivas: comprador y vendedor',
      minutes: 6,
      blocks: [
        p('Si preguntaras a mil traders qué ven en un gráfico, la mitad diría compra y la otra mitad venta. Por eso conviene **analizar dos veces**: una buscando compras y otra buscando ventas, y ver cuál tiene más argumentos.'),
        p('El punto más interesante es donde **el take profit de un bando coincide con la entrada del otro**:'),
        chart({
          title: 'El TP del vendedor es la entrada del comprador', symbol: 'XAU/USD · H1', seed: 27,
          path: [[0, 26], [2, 20], [16, 80], [22, 51], [26, 62], [31, 43], [44, 92]],
          ann: [
            { t: 'fib', x1: 2, y1: 20, x2: 16, y2: 80, levels: [0.618, 0.786], x3: 38, step: 0 },
            { t: 'fib', x1: 16, y1: 80, x2: 22, y2: 51, levels: [0, -0.27], x3: 28, step: 1 },
            { t: 'zone', x1: 28, x2: 34, y1: 41, y2: 45, c: 'up', label: 'Encuentro', lb: true, step: 2 },
          ],
          steps: [
            { to: 16, text: 'El comprador traza Fibonacci del impulso alcista: su zona de entrada está en el 0.618–0.786 (≈ 43–33).' },
            { to: 26, text: 'El vendedor ve una pequeña estructura bajista y traza su propio Fibonacci: su TP (-0.27) está en ≈ 43.' },
            { to: 44, text: 'En 43 el vendedor cierra (compra para salir) y el comprador entra: la presión compradora se suma y el precio sale disparado.' },
          ],
        }),
        tip('Si tienes dos monitores, deja uno con el análisis comprador y otro con el vendedor.'),
      ],
      takeaways: ['Analiza siempre los dos lados', 'TP de unos + entrada de otros = zona potente', 'Opera el lado con más argumentos'],
    },
    {
      slug: 'analisis-desde-cero',
      title: 'Análisis completo desde cero',
      minutes: 8,
      blocks: [
        p('Este es el proceso para analizar cualquier activo, seas scalper, day trader o swing trader. Siempre **de mayor a menor temporalidad**:'),
        table(['Temporalidad', 'Qué marcas', 'Color sugerido'], [
          ['Mensual / Semanal', 'Tendencia general, grandes S/R, canal principal, Fibonacci del último gran impulso', 'Azul'],
          ['Diario', 'Estructura actual, último máximo/mínimo, zonas de retroceso', 'Rojo'],
          ['H4', 'Estructura interna, canal y Fibonacci del último impulso', 'Amarillo'],
          ['H1 / M15', 'Rango actual, cierres de vela en las zonas, patrones de confirmación', 'Verde'],
        ]),
        ol(
          '**Dirección**: ¿quién tiene el control en la temporalidad mayor? Mira la fuerza de impulsos y retrocesos.',
          '**Zonas**: marca solo los puntos de interés cercanos al precio. Lo que está lejos puede tardar meses: bórralo.',
          '**Escenarios**: escribe al margen qué esperas (ej.: "si cierra por encima de X, busco compras hasta Y").',
          '**Confirmación**: baja de temporalidad solo cuando el precio llegue a la zona.',
          '**Dos perspectivas**: repite el análisis desde el lado contrario.'
        ),
        ex('En la práctica', 'Si analizas el EUR/USD, mira también el índice del dólar (DXY): si el dólar pierde un soporte importante con fuerza, el euro tiene más probabilidades de subir.'),
        tip('Marca, decide y **borra**. Un gráfico con 40 líneas no te deja ver el precio.'),
      ],
      takeaways: ['Siempre de mayor a menor temporalidad', 'Solo las zonas cercanas al precio', 'Escribe tus escenarios antes de que ocurran'],
    },
    {
      slug: 'entrada-stop-y-objetivo',
      title: 'Entrada, stop loss y take profit',
      minutes: 7,
      blocks: [
        p('Un error muy común: pensar que porque el precio ha cambiado de estructura va a superar el máximo anterior. **No tiene por qué.** Puede reaccionar en la zona de retroceso y darse la vuelta. No necesitas capturar todo el movimiento.'),
        chart({
          title: 'Entrada en el retroceso tras el cambio', symbol: 'EUR/USD · H1', seed: 28,
          path: [[0, 80], [6, 60], [10, 68], [16, 45], [20, 53], [26, 30], [33, 62], [40, 38], [50, 71]],
          ann: [
            { t: 'fib', x1: 26, y1: 30, x2: 33, y2: 62, levels: [0, 0.618, 0.786, 1, -0.27], x3: 36 },
            { t: 'trade', x: 40, x2: 50, entry: 38.5, sl: 28.5, tp: 70.6 },
          ],
          note: 'Stop por debajo del mínimo que originó el cambio, con margen para una mecha. Objetivo en la extensión -0.27.',
        }),
        h('Reglas prácticas'),
        ul(
          '**Stop loss**: donde tu idea queda invalidada (detrás de la estructura), con margen para latigazos. Nunca "a X pips porque sí".',
          '**Take profit**: en una zona lógica (extensión, resistencia de temporalidad mayor, extremo del canal).',
          '**Ratio**: viene dado por tu estrategia. Si una operación no ofrece el ratio habitual de tu sistema, no la fuerces.',
          'Si el precio sigue después de tu TP, no te tortures: cumpliste el plan.'
        ),
        h('La operación dentro de la operación'),
        p('En temporalidades altas un trade puede tardar días. Una forma de aprovecharlo:'),
        table(['', 'Riesgo', 'Ratio', 'Resultado si todo sale'], [
          ['Operación principal (H4)', '1,5%', '1:3', '+4,5%'],
          ['Operación en temporalidad baja al llegar a la zona', '0,5%', '1:3', '+1,5%'],
          ['**Total**', '2%', '', '**+6%** (y si la segunda sale y la principal falla, quedas en 0%)'],
        ]),
        warn('Esta técnica suma riesgo total. Asegúrate de que el riesgo combinado respeta tus límites (lo verás en el módulo de gestión del riesgo).'),
        tip('Apunta **todas** tus operaciones (reales y de backtest), separadas por tipo: scalps, intradía y swing. Con datos sabrás cuál te da más ventaja.'),
      ],
      takeaways: ['No hace falta capturar todo el movimiento', 'SL detrás de estructura con margen', 'Registra todo para saber qué te funciona'],
    },
  ],
  quiz: [
    { q: 'Una vela cierra por debajo del soporte y la siguiente vuelve a cerrar dentro. Es…', options: ['Una ruptura válida', 'Un fake out', 'Un doble techo', 'Una divergencia'], answer: 1, explain: 'La segunda vela desmiente la ruptura.' },
    { q: 'Para protegerte de las cazas de stops conviene…', options: ['Poner el stop justo encima del nivel obvio', 'Colocar el stop detrás de la estructura y operar a favor de la tendencia mayor', 'No usar stop', 'Operar solo en M1'], answer: 1, explain: 'Los niveles obvios acumulan stops.' },
    { q: 'La zona más potente entre comprador y vendedor es…', options: ['Donde el TP de uno coincide con la entrada del otro', 'Donde nadie mira', 'El precio de apertura', 'Cualquier número redondo'], answer: 0, explain: 'Ahí se suman las órdenes de ambos.' },
    { q: 'El análisis desde cero se hace…', options: ['De M1 a mensual', 'De la temporalidad mayor a la menor', 'Solo en diario', 'En cualquier orden'], answer: 1, explain: 'La mayor da el contexto; la menor, la entrada.' },
    { q: '¿Dónde va el stop loss?', options: ['A 10 pips siempre', 'Donde la idea queda invalidada, con margen', 'Donde no lo toque nunca', 'No hace falta'], answer: 1, explain: 'La estrategia define el stop, no un número fijo de pips.' },
  ],
}
