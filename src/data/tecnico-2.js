import { p, h, ul, ol, tip, warn, ex, w, table, chart } from './blocks.js'

/* =========================================================
   RUTA DE ANÁLISIS TÉCNICO · Módulos 3 y 4
   ========================================================= */

// Velas de aproximación a una zona (se reutilizan en varios ejemplos)
const approach = [[70, 71, 66, 67], [67, 68, 63, 64], [64, 65, 60, 61], [61, 62, 57, 58], [58, 59, 55, 56]]

export const t3 = {
  id: 'tecnico-velas-patrones',
  track: 'tecnico',
  title: 'Velas y patrones',
  desc: 'Cómo leer las velas en las zonas clave, los patrones de vela que importan y los patrones chartistas clásicos.',
  lessons: [
    {
      slug: 'interpretar-velas-en-zonas',
      title: 'Interpretar las velas en una zona',
      minutes: 7,
      blocks: [
        p('Un grupo de velas cuenta mucho más que una sola. No hace falta memorizar decenas de nombres: lo importante es **entender qué hacen compradores y vendedores** cuando el precio llega a una zona que te interesa.'),
        p('Imagina que tienes una zona de compra con varias confluencias. Mira qué diferencia hay entre estos dos escenarios:'),
        chart({
          title: 'Caso A: el precio atraviesa la zona', symbol: 'M15',
          candles: [...approach, [56, 57, 49, 50], [50, 51, 44, 45]],
          ann: [
            { t: 'zone', x1: 0, y1: 50, y2: 54, c: 'accent', label: 'Zona de compra' },
            { t: 'txt', x: 6, y: 44, text: 'Cierra por debajo', c: 'down', pos: 'b' },
          ],
          note: 'La vela cierra con fuerza por debajo de la zona. Si hubieras comprado al tocarla, estarías en pérdida. No hay compra.',
        }),
        chart({
          title: 'Caso B: rechazo y cierre por encima', symbol: 'M15',
          candles: [...approach, [56, 57, 48, 55], [55, 62, 54.5, 61], [61, 66, 60, 65]],
          ann: [
            { t: 'zone', x1: 0, y1: 50, y2: 54, c: 'accent', label: 'Zona de compra' },
            { t: 'txt', x: 5, y: 48, text: 'Mecha larga', c: 'up', pos: 'b' },
          ],
          note: 'El precio entra en la zona, deja una mecha larga y cierra por encima: los compradores defienden. Esto sí es una confirmación.',
        }),
        tip('Una mecha que atraviesa una zona importante y vuelve suele indicar una **barrida de stops**: el precio fue a por las órdenes de los que estaban al otro lado, pero no tuvo fuerza para quedarse.'),
        warn('Esperar al cierre de la vela es la costumbre más rentable que puedes adquirir.'),
      ],
      takeaways: ['Lee la reacción del precio en la zona, no solo el toque', 'Mecha larga + cierre a favor = confirmación', 'Espera siempre al cierre'],
    },
    {
      slug: 'patrones-de-velas',
      title: 'Patrones de velas que importan',
      minutes: 7,
      blocks: [
        p('Estos son los tres patrones de giro más útiles. Los mostramos en versión alcista (en una zona de compra); en versión bajista funcionan exactamente al revés.'),
        h('1. Pinzas (tweezer bottom / top)'),
        p('Una vela bajista y otra alcista con **mínimos casi idénticos** y cuerpos parecidos: el precio probó el mismo nivel dos veces y fue rechazado.'),
        chart({
          title: 'Pinzas en suelo', symbol: 'H1',
          candles: [[70, 71, 65, 66], [66, 67, 61, 62], [62, 63, 56, 57], [57, 58, 52, 53], [53, 54, 47.5, 48.5], [48.5, 53.4, 47.6, 53], [53, 58, 52, 57.5], [57.5, 62, 57, 61]],
          ann: [{ t: 'zone', x1: 0, y1: 46, y2: 50, c: 'accent', label: 'Zona' }, { t: 'txt', x: 4.5, y: 47.5, text: 'Mismos mínimos', c: 'up', pos: 'b' }],
        }),
        h('2. Estrella de la mañana (y del atardecer)'),
        p('Tres velas: una bajista grande, una pequeña de **indecisión** y una alcista que recupera al menos lo que perdió la primera.'),
        chart({
          title: 'Estrella de la mañana', symbol: 'H1',
          candles: [[72, 73, 67, 68], [68, 69, 62, 63], [63, 64, 51, 52], [52, 53, 48, 51], [51, 64, 50.5, 63.5], [63.5, 67, 63, 66]],
          ann: [{ t: 'zone', x1: 0, y1: 47, y2: 52, c: 'accent', label: 'Zona' }, { t: 'txt', x: 3, y: 48, text: 'Indecisión', c: 'muted', pos: 'b' }],
        }),
        h('3. Envolvente'),
        p('Una vela cuyo cuerpo **se come por completo** el cuerpo de la anterior, en sentido contrario. También cuenta si varias velas alcistas seguidas envuelven a una bajista grande.'),
        chart({
          title: 'Envolvente alcista', symbol: 'H1',
          candles: [[68, 69, 63, 64], [64, 65, 59, 60], [60, 61, 54, 55], [55, 56, 51, 52], [52, 60, 51.5, 59.5], [59.5, 64, 59, 63]],
          ann: [{ t: 'zone', x1: 0, y1: 50, y2: 54, c: 'accent', label: 'Zona' }, { t: 'txt', x: 4, y: 60, text: 'Envuelve', c: 'up' }],
        }),
        warn('Un patrón en mitad de la nada no significa nada. **Primero la zona, luego la vela.** Y si ves patrones bajistas donde esperabas comprar, no compres.'),
      ],
      takeaways: ['Pinzas, estrella y envolvente: los tres esenciales', 'Solo valen en zonas con confluencias', 'Funcionan igual al alza y a la baja'],
    },
    {
      slug: 'confirmacion-en-varias-temporalidades',
      title: 'Confirmación en varias temporalidades',
      minutes: 6,
      blocks: [
        p('Cuando el precio llega a tu zona, bajar de temporalidad te permite ver **quién gana la batalla** vela a vela. Avanza el ejemplo y observa la paciencia que requiere:'),
        chart({
          title: 'Esperando la confirmación en M1', symbol: 'XAU/USD · M1',
          candles: [[64, 65, 61, 62], [62, 63, 58, 59], [59, 60, 55, 56], [56, 57, 52.5, 53], [53, 54, 49, 50], [50, 51, 46, 47], [47, 48.5, 45, 48], [48, 49, 44.5, 45.5], [45.5, 47, 44, 46.5], [46.5, 50, 46, 49.5], [49.5, 52, 48, 51], [51, 53, 48.5, 49], [49, 50, 47.5, 48.5], [48.5, 53, 48, 52.5], [52.5, 57, 52, 56.5], [56.5, 60, 56, 59.5]],
          ann: [{ t: 'zone', x1: 0, y1: 50, y2: 54, c: 'accent', label: 'Zona de compra' }],
          steps: [
            { to: 4, text: 'El precio llega a la zona con fuerza bajista. Todavía no hay nada que hacer.' },
            { to: 8, text: 'Las velas siguen cerrando por debajo de la zona: los compradores no han aparecido. Nos quedamos fuera.' },
            { to: 12, text: 'Entran compradores, pero no consiguen cerrar por encima de la zona. Seguimos esperando.' },
            { to: 15, text: 'Tres velas alcistas envuelven a la última bajista y cierran por encima de la zona: esa es la confirmación (y en M5 se ve una envolvente).' },
          ],
        }),
        tip('Cuantas más temporalidades confirmen lo mismo en el mismo punto, más probabilidad tiene la operación.'),
      ],
      takeaways: ['Baja de temporalidad para ver la batalla', 'Sin cierre a favor, no hay entrada', 'Varias confirmaciones en el mismo punto suman'],
    },
    {
      slug: 'hombro-cabeza-hombro',
      title: 'Hombro-cabeza-hombro (HCH)',
      minutes: 6,
      blocks: [
        p('Es un patrón de **agotamiento** al final de una tendencia: un máximo (hombro), otro más alto (cabeza) y un tercero más bajo (hombro). La línea que une los mínimos intermedios es la **línea clavicular**.'),
        chart({
          title: 'HCH al final de una tendencia alcista', symbol: 'BTC/USD · D1', seed: 14,
          path: [[0, 20], [8, 50], [13, 40], [20, 62], [26, 48], [34, 78], [41, 50], [48, 64], [54, 46], [58, 51], [66, 34]],
          ann: [
            { t: 'txt', x: 20, y: 62, text: 'Hombro', c: 'accent', step: 0 },
            { t: 'txt', x: 34, y: 78, text: 'Cabeza', c: 'accent', step: 0 },
            { t: 'txt', x: 48, y: 64, text: 'Hombro', c: 'accent', step: 1 },
            { t: 'line', x1: 26, y1: 48, x2: 41, y2: 50, ext: true, c: 'muted', dash: true, step: 1 },
            { t: 'txt', x: 33, y: 49, text: 'Línea clavicular', c: 'muted', pos: 'b', step: 1 },
            { t: 'trade', x: 58, x2: 66, entry: 51, sl: 57, tp: 35, step: 3 },
          ],
          steps: [
            { to: 41, text: 'La tendencia alcista hace un hombro y una cabeza más alta, pero el retroceso posterior es profundo.' },
            { to: 48, text: 'El siguiente máximo no supera la cabeza: tenemos el segundo hombro. Los compradores se agotan.' },
            { to: 54, text: 'El precio rompe la línea clavicular y el último mínimo: ahora sí hay cambio de estructura.' },
            { to: 66, text: 'Se busca la venta en el retroceso a la línea rota, con el stop por encima del hombro derecho.' },
          ],
        }),
        tip('El HCH **invertido** es la versión alcista al final de una tendencia bajista. A veces aparece al terminar un retroceso y anuncia la continuación.'),
        warn('Hasta que no se pierde el último mínimo, el HCH no está confirmado.'),
      ],
      takeaways: ['Hombro + cabeza + hombro más bajo = agotamiento', 'Se confirma al romper la clavicular / último mínimo', 'Entrada en el retroceso'],
    },
    {
      slug: 'cunas',
      title: 'Cuñas: el precio se comprime',
      minutes: 5,
      blocks: [
        p('Una **cuña ascendente** aparece cuando el precio sigue subiendo pero cada vez con menos fuerza: las dos líneas convergen. Indica debilidad y suele terminar en giro. La **cuña descendente** es su versión alcista.'),
        chart({
          title: 'Cuña ascendente y ruptura', symbol: 'BTC/USD · H4', seed: 15,
          path: [[0, 20], [8, 55], [13, 42], [20, 64], [25, 53], [31, 70], [35, 62], [40, 74], [43, 68], [46, 76], [50, 58], [53, 64], [60, 44]],
          ann: [
            { t: 'line', x1: 20, y1: 64, x2: 46, y2: 77, c: 'accent', step: 0 },
            { t: 'line', x1: 13, y1: 42, x2: 43, y2: 69, c: 'accent', step: 0 },
            { t: 'txt', x: 44, y: 56, text: 'Rompe el último mínimo', c: 'down', pos: 'b', step: 1 },
            { t: 'trade', x: 53, x2: 60, entry: 63.5, sl: 70, tp: 44, step: 2 },
          ],
          steps: [
            { to: 46, text: 'Máximos cada vez más altos, pero los avances son más cortos: el precio se comprime entre dos líneas que convergen.' },
            { to: 50, text: 'El precio rompe la cuña y el último mínimo: cambio de estructura.' },
            { to: 60, text: 'Venta en el retroceso con el stop por encima de la estructura.' },
          ],
        }),
      ],
      takeaways: ['Cuña = compresión y pérdida de fuerza', 'Ascendente → giro bajista; descendente → giro alcista', 'Espera la ruptura de estructura'],
    },
    {
      slug: 'doble-techo-suelo-y-banderas',
      title: 'Doble techo, doble suelo y banderas',
      minutes: 6,
      blocks: [
        h('Doble techo (M) y doble suelo (W)'),
        p('Dos intentos fallidos de superar el mismo nivel. Cuando se pierde el mínimo intermedio, el patrón se confirma.'),
        chart({
          title: 'Doble techo', symbol: 'XAU/USD · H4', seed: 16,
          path: [[0, 20], [10, 60], [16, 46], [24, 70], [30, 55], [37, 70.5], [43, 50], [47, 57], [55, 35]],
          ann: [
            { t: 'zone', x1: 22, x2: 39, y1: 68.5, y2: 72, c: 'down', label: 'Dos techos' },
            { t: 'h', y: 55, x1: 30, x2: 45, label: 'Mínimo intermedio', c: 'muted', lb: true },
            { t: 'trade', x: 47, x2: 55, entry: 56.5, sl: 63, tp: 36 },
          ],
          note: 'Dos toques, pérdida del mínimo intermedio, pequeño retroceso y caída con fuerza.',
        }),
        h('Bandera (rango de seis toques)'),
        p('Tras un impulso, el precio consolida tocando tres veces arriba y tres abajo. Si en el **séptimo** intento pierde fuerza y rompe el último mínimo, suele salir con fuerza en sentido contrario.'),
        chart({
          title: 'Consolidación que se rompe a la baja', symbol: 'EUR/USD · H1', seed: 17,
          path: [[0, 20], [10, 60], [14, 50], [18, 61], [22, 50.5], [26, 60.5], [30, 51], [33, 57], [40, 38]],
          ann: [
            { t: 'zone', x1: 10, x2: 33, y1: 49.5, y2: 61.5, c: 'violet', o: 0.1, label: 'Seis toques' },
            { t: 'txt', x: 33, y: 57, text: '7.º sin fuerza', c: 'accent' },
          ],
        }),
        tip('Aleja el gráfico antes de fiarte de un patrón: un doble techo en la parte **baja** de un rango de temporalidad alta tiene muchas menos probabilidades de funcionar.'),
      ],
      takeaways: ['M y W: dos intentos fallidos', 'Se confirman al perder el nivel intermedio', 'Contexto de temporalidad alta primero'],
    },
  ],
  quiz: [
    { q: 'El precio llega a tu zona de compra y la vela cierra con fuerza por debajo. ¿Qué haces?', options: ['Compro igualmente', 'No compro: espero a ver una reacción a favor', 'Vendo el doble', 'Quito el stop'], answer: 1, explain: 'Sin cierre a favor no hay confirmación.' },
    { q: 'Una vela pequeña de indecisión entre una bajista grande y una alcista grande forma…', options: ['Una envolvente', 'Una estrella de la mañana', 'Unas pinzas', 'Un HCH'], answer: 1, explain: 'Tres velas: bajista, indecisión y alcista.' },
    { q: 'Un HCH se confirma cuando…', options: ['Se forma la cabeza', 'Se rompe la línea clavicular / último mínimo', 'Aparece un doji', 'Sube el RSI'], answer: 1, explain: 'Sin ruptura de estructura el patrón no está completo.' },
    { q: 'Una cuña ascendente suele indicar…', options: ['Fuerza compradora creciente', 'Pérdida de fuerza y posible giro bajista', 'Que el mercado está cerrado', 'Un gap'], answer: 1, explain: 'Los avances cada vez más cortos muestran agotamiento.' },
    { q: '¿Por qué conviene alejar el gráfico antes de operar un doble techo?', options: ['Para ver el contexto de temporalidad alta', 'Porque se ve más bonito', 'Para cambiar de activo', 'No conviene'], answer: 0, explain: 'Si estás en la parte baja de un rango mayor, el patrón pierde probabilidad.' },
  ],
}

export const t4 = {
  id: 'tecnico-fibonacci',
  track: 'tecnico',
  title: 'Fibonacci',
  desc: 'Cómo trazarlo bien, los niveles que importan, confluencias entre temporalidades y tres estrategias completas.',
  lessons: [
    {
      slug: 'fibonacci-como-trazarlo',
      title: 'Fibonacci: qué es y cómo trazarlo',
      minutes: 7,
      blocks: [
        p('La secuencia de Fibonacci contiene la **proporción áurea**, que el ser humano ha buscado durante siglos en arte y arquitectura. Como el gráfico refleja decisiones de personas, sus niveles actúan a menudo como zonas psicológicas de reacción.'),
        h('Los niveles que usaremos'),
        table(['Nivel', 'Para qué'], [
          ['0.5', 'Mitad del impulso: el retroceso "mínimo sano"'],
          ['**0.618 y 0.786**', 'Zona de entrada: donde el retroceso suele terminar'],
          ['**-0.27 y -0.618**', 'Extensiones: zonas de take profit'],
        ]),
        h('Cómo trazarlo'),
        p('En tendencia alcista, **del último mínimo (1) al último máximo (2)**. En bajista, del máximo al mínimo. Quita el fondo de color de la herramienta para tener el gráfico limpio.'),
        chart({
          title: 'Retroceso a la zona 0.618–0.786 y extensión', symbol: 'EUR/USD · H4', seed: 18,
          path: [[0, 26], [3, 20], [18, 80], [27, 37], [31, 50], [34, 45], [46, 96]],
          ann: [
            { t: 'pt', x: 3, y: 20, text: '1', pos: 'b', step: 0 },
            { t: 'pt', x: 18, y: 80, text: '2', step: 0 },
            { t: 'fib', x1: 3, y1: 20, x2: 18, y2: 80, levels: [0, 0.5, 0.618, 0.786, 1, -0.27, -0.618], band: true, step: 0 },
          ],
          steps: [
            { to: 18, text: 'Impulso alcista: trazamos Fibonacci del mínimo (1) al máximo (2).' },
            { to: 27, text: 'El precio retrocede hasta la franja 0.618–0.786: ahí buscamos la compra con confirmación.' },
            { to: 46, text: 'La tendencia continúa hasta la extensión -0.27, que usamos como take profit.' },
          ],
        }),
        w('fib'),
        tip('Como con todo, los niveles de temporalidades altas pesan más.'),
      ],
      takeaways: ['Traza del mínimo al máximo (alcista)', '0.618–0.786 = entrada; -0.27 / -0.618 = TP', 'Temporalidad alta = más relevancia'],
    },
    {
      slug: 'fibonacci-entre-temporalidades',
      title: 'Confluencias de Fibonacci entre temporalidades',
      minutes: 6,
      blocks: [
        p('La magia aparece cuando **el take profit de una temporalidad coincide con la zona de retroceso de otra**. Ahí se encuentran los que salen de sus compras y los que entran en venta.'),
        chart({
          title: 'Extensión de la temporalidad baja = retroceso de la alta', symbol: 'GBP/USD · D1 + H4', seed: 19,
          path: [[0, 90], [14, 20], [24, 54], [29, 40], [37, 63], [48, 30]],
          ann: [
            { t: 'fib', x1: 0, y1: 90, x2: 14, y2: 20, levels: [0, 0.5, 0.618, 0.786, 1], step: 0 },
            { t: 'fib', x1: 14, y1: 20, x2: 24, y2: 54, levels: [-0.27], x3: 44, step: 1 },
            { t: 'zone', x1: 33, x2: 42, y1: 61, y2: 65.5, c: 'down', label: 'Confluencia', step: 2 },
          ],
          steps: [
            { to: 14, text: 'Temporalidad alta bajista: medimos el impulso de caída con Fibonacci. Su 0.618 está alrededor de 63.' },
            { to: 29, text: 'En la temporalidad baja el precio sube: trazamos otro Fibonacci sobre ese impulso alcista.' },
            { to: 37, text: 'La extensión -0.27 de la temporalidad baja coincide con el 0.618 de la alta: los compradores recogen beneficios y los vendedores entran.' },
            { to: 48, text: 'Reacción bajista desde la confluencia, a favor de la temporalidad mayor.' },
          ],
        }),
      ],
      takeaways: ['Busca coincidencias entre niveles de distintas temporalidades', 'TP de unos = entrada de otros', 'Manda la temporalidad mayor'],
    },
    {
      slug: 'fibonacci-como-rango',
      title: 'Estrategia: Fibonacci como soportes y resistencias',
      minutes: 5,
      blocks: [
        p('Los niveles de Fibonacci funcionan muchas veces como soportes y resistencias: el precio rebota entre ellos como dentro de un canal. Si trazas Fibonacci en una temporalidad alta, puedes operar en una baja los rebotes entre sus niveles.'),
        chart({
          title: 'El precio rebota entre niveles', symbol: 'BTC/USD · H4', seed: 20,
          path: [[0, 26], [2, 20], [16, 80], [22, 50], [26, 34], [30, 49], [34, 34.5], [38, 50], [48, 86]],
          ann: [{ t: 'fib', x1: 2, y1: 20, x2: 16, y2: 80, levels: [0, 0.5, 0.618, 0.786, 1, -0.27] }],
          note: 'El 0.5 hace de techo y el 0.786 de suelo hasta que el precio rompe hacia arriba y busca la extensión.',
        }),
        ol(
          'Traza Fibonacci en la temporalidad alta.',
          'Baja de temporalidad y opera los rebotes entre dos niveles consecutivos.',
          'Cuando un nivel se rompe con fuerza, el siguiente es el objetivo.',
          'Repite el proceso en la temporalidad baja para estrechar el rango.'
        ),
      ],
      takeaways: ['Los niveles actúan como S/R', 'Opera de nivel a nivel', 'Rotura con fuerza → siguiente nivel'],
    },
    {
      slug: 'fibonacci-estrategia-conservadora',
      title: 'Estrategia conservadora: TP en el retroceso inverso',
      minutes: 6,
      blocks: [
        p('Una estrategia que **no necesita que el precio haga todo el movimiento**. Sirve en todas las temporalidades:'),
        ol(
          'Traza Fibonacci del impulso: de **A** (mínimo) a **B** (máximo).',
          'Cuando el precio retroceda hasta **C**, traza un segundo Fibonacci inverso de B a C.',
          'Entrada en el 0.786 del primer Fibonacci, stop debajo de A.',
          'Take profit en el 0.786 del Fibonacci inverso: cerca del máximo, sin exigir que lo supere.'
        ),
        chart({
          title: 'Entrada en 0.786 y salida antes del máximo', symbol: 'EUR/USD · H4', seed: 22,
          path: [[0, 26], [2, 20], [16, 80], [27, 31], [40, 72], [46, 60]],
          ann: [
            { t: 'pt', x: 2, y: 20, text: 'A', pos: 'b' },
            { t: 'pt', x: 16, y: 80, text: 'B' },
            { t: 'pt', x: 27, y: 31, text: 'C', pos: 'b' },
            { t: 'fib', x1: 2, y1: 20, x2: 16, y2: 80, levels: [0, 0.618, 0.786, 1], x3: 21 },
            { t: 'trade', x: 27, x2: 40, entry: 32.8, sl: 19, tp: 69.5 },
          ],
          note: 'El TP (0.786 del retroceso B→C) queda por debajo del máximo B: se asegura el beneficio sin depender de que la tendencia continúe.',
        }),
        tip('Es conservadora: menos exposición al mercado y beneficios más "fáciles". A cambio, a veces dejarás pasar el resto del movimiento.'),
      ],
      takeaways: ['Dos Fibonacci: impulso e inverso', 'Entrada 0.786, SL bajo A', 'TP antes del máximo = más probabilidad'],
    },
    {
      slug: 'fibonacci-canal-cambio-estructura',
      title: 'Estrategia completa: cambio de estructura + canal + Fibonacci',
      minutes: 8,
      blocks: [
        p('Aquí se juntan tres herramientas. Es un **modelo mecánico**: si se cumplen todas las condiciones, se entra; si falta una, no.'),
        chart({
          title: 'El setup paso a paso', symbol: 'EUR/USD · D1', seed: 23,
          path: [[0, 88], [6, 68], [10, 76], [16, 56], [20, 64], [26, 38], [32, 70], [37, 52], [43, 82], [47, 64.5], [55, 91]],
          ann: [
            { t: 'h', y: 64, x1: 20, x2: 33, c: 'muted', label: 'Último máximo', lx: 26, step: 1 },
            { t: 'line', x1: 26, y1: 38, x2: 37, y2: 52, ext: true, c: 'accent', step: 2 },
            { t: 'line', x1: 32, y1: 70, x2: 43, y2: 84, ext: true, c: 'accent', dash: true, step: 2 },
            { t: 'fib', x1: 37, y1: 52, x2: 43, y2: 82, levels: [0, 0.618, 0.786, 1, -0.27], x3: 44, step: 3 },
            { t: 'trade', x: 47, x2: 55, entry: 64.5, sl: 57, tp: 90.1, step: 4 },
          ],
          steps: [
            { to: 26, text: 'Tendencia bajista con máximos y mínimos decrecientes.' },
            { to: 32, text: 'El precio rompe con fuerza el último máximo: cambio de estructura a alcista.' },
            { to: 37, text: 'Segundo mínimo más alto: trazamos el canal desde los dos mínimos y su paralela en el máximo.' },
            { to: 43, text: 'Nuevo impulso: trazamos Fibonacci sobre él para saber dónde puede terminar el retroceso.' },
            { to: 47, text: 'Tercer toque del canal coincidiendo con el 0.618: entrada. Stop debajo del 0.786, objetivo en la extensión -0.27.' },
            { to: 55, text: 'Take profit alcanzado. Tres herramientas apuntando al mismo sitio = alta probabilidad.' },
          ],
        }),
        tip('Esta lógica es válida en todos los pares y temporalidades. Antes de usarla con dinero real, haz backtesting para conocer **tu** tasa de acierto con ella.'),
      ],
      takeaways: ['Cambio de estructura → canal → Fibonacci', 'Entrada en la coincidencia canal + nivel', 'Modelo mecánico: si falta algo, no hay entrada'],
    },
  ],
  quiz: [
    { q: 'En una tendencia alcista, Fibonacci se traza…', options: ['Del máximo al mínimo', 'Del último mínimo al último máximo', 'Entre dos velas cualquiera', 'Desde el precio actual'], answer: 1, explain: 'Del inicio al final del impulso alcista.' },
    { q: '¿Qué niveles se usan como zona de entrada?', options: ['0 y 1', '0.618 y 0.786', '-0.27 y -0.618', '0.236'], answer: 1, explain: 'Son los niveles donde el retroceso suele terminar.' },
    { q: '¿Para qué sirven -0.27 y -0.618?', options: ['Entrada', 'Stop loss', 'Take profit', 'Nada'], answer: 2, explain: 'Son extensiones para proyectar objetivos.' },
    { q: 'La mejor confluencia de Fibonacci entre temporalidades se da cuando…', options: ['Los niveles están lejos', 'El TP de una temporalidad coincide con el retroceso de otra', 'Solo usas una temporalidad', 'El precio está en rango'], answer: 1, explain: 'Ahí salen unos y entran otros.' },
    { q: 'En el setup de canal + Fibonacci, si el retroceso no toca el canal pero sí el 0.618…', options: ['Entro igual', 'No se cumplen todas las condiciones: no entro', 'Duplico el riesgo', 'Cambio de estrategia'], answer: 1, explain: 'Modelo mecánico: todas las condiciones o ninguna.' },
  ],
}
