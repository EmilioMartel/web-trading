import { p, h, ul, ol, tip, warn, ex, w, table, chart } from './blocks.js'

/* =========================================================
   RUTA DE ANÁLISIS INSTITUCIONAL
   ========================================================= */

export const i1 = {
  id: 'institucional-estructura',
  track: 'institucional',
  title: 'Estructura institucional',
  desc: 'Qué es el enfoque institucional, cómo se lee la estructura (sin herramientas) y la diferencia entre estructura externa e interna.',
  lessons: [
    {
      slug: 'que-es-el-analisis-institucional',
      title: 'Qué es el análisis institucional',
      minutes: 6,
      blocks: [
        p('El análisis institucional intenta leer el gráfico **desde el punto de vista de quien mueve grandes volúmenes**: bancos, fondos y proveedores de liquidez. No pueden comprar todo de golpe (moverían el precio en su contra), así que construyen sus posiciones de forma escalonada y **dejan huellas** en el gráfico.'),
        p('Es un **modelo de interpretación**, no una verdad demostrada sobre lo que hace cada banco. Su valor está en que da una forma muy concreta y objetiva de leer el precio.'),
        h('Técnico vs institucional'),
        table(['', 'Análisis técnico', 'Análisis institucional'], [
          ['Herramientas', 'S/R, líneas, canales, Fibonacci, patrones', 'Solo velas y estructura'],
          ['Busca', 'Confluencias entre herramientas', 'Liquidez, manipulaciones y zonas de oferta/demanda'],
          ['Gráfico', 'Más "pintado"', 'Muy limpio'],
        ]),
        warn('Son dos formas distintas de mirar el mismo gráfico y a veces se contradicen (donde uno ve una compra, el otro ve una trampa). **No las mezcles**: elige una y domínala. Puedes empezar esta ruta desde cero sin haber hecho la técnica.'),
        h('La hoja de ruta'),
        ol(
          '**Estructura de mercado** → la dirección más probable.',
          '**Puntos de interés (POI)** → dónde es probable que reaccione el precio.',
          '**Liquidez** → hacia dónde es probable que vaya.'
        ),
        tip('Estos tres pasos se repiten en cada temporalidad, siempre en ese orden.'),
      ],
      takeaways: ['Lee las huellas de los grandes participantes', 'Es un modelo, no una certeza', 'Estructura → POI → liquidez'],
    },
    {
      slug: 'estructura-institucional',
      title: 'Leer la estructura: mínimos y máximos confirmados',
      minutes: 7,
      blocks: [
        p('La regla clave del enfoque institucional: **un mínimo solo se confirma cuando el precio supera el máximo anterior** (y al revés en tendencia bajista). Hasta entonces, ese retroceso podría convertirse en un cambio de estructura.'),
        chart({
          title: 'Cuándo se confirma un mínimo', symbol: 'EUR/USD · H4', seed: 41,
          path: [[0, 30], [8, 55], [13, 45], [19, 63], [24, 51], [31, 72], [36, 60], [42, 82]],
          ann: [
            { t: 'pt', x: 8, y: 55, text: 'Máximo', step: 0 },
            { t: 'pt', x: 13, y: 45, text: '¿Mínimo?', pos: 'b', c: 'muted', step: 1, until: 1 },
            { t: 'h', y: 55, x1: 8, x2: 20, c: 'muted', step: 1 },
            { t: 'pt', x: 13, y: 45, text: 'Mínimo confirmado', pos: 'b', c: 'up', step: 2 },
            { t: 'pt', x: 24, y: 51, text: 'Mínimo confirmado', pos: 'b', c: 'up', step: 3 },
            { t: 'pt', x: 36, y: 60, text: '¿Mínimo?', pos: 'b', c: 'muted', step: 3 },
          ],
          steps: [
            { to: 8, text: 'El precio hace un máximo.' },
            { to: 14, text: 'Retrocede. ¿Es 45 el nuevo mínimo? Todavía no lo sabemos: el precio podría seguir cayendo.' },
            { to: 19, text: 'El precio supera el máximo anterior: ahora sí, 45 queda confirmado como mínimo de la estructura.' },
            { to: 42, text: 'Se repite. El último retroceso no está confirmado hasta que el precio haga un nuevo máximo.' },
          ],
        }),
        h('Errores más comunes'),
        ul(
          'No leer el gráfico **de izquierda a derecha**: siempre de dónde viene el precio y hacia dónde va.',
          'No ser estricto: la estructura se mira de forma totalmente objetiva, **con las mechas incluidas**.',
          'Dar por bueno un cambio de estructura **escaso** o en una zona sin sentido.'
        ),
        chart({
          title: 'Cambio de estructura escaso (no fiable)', symbol: 'GBP/USD · H1', seed: 42,
          path: [[0, 85], [7, 62], [11, 72], [18, 50], [22, 60], [29, 38], [34, 61], [38, 52], [46, 28]],
          mods: { 34: { c: 60.4, o: 58 } },
          ann: [
            { t: 'h', y: 60, x1: 22, x2: 36, c: 'muted', label: 'Último máximo', lb: true },
            { t: 'txt', x: 34, y: 61, text: 'Rompe por muy poco', c: 'accent' },
          ],
          note: 'Supera el máximo por un pelo y sin fuerza: más que un cambio de tendencia, parece una manipulación. El precio sigue bajando.',
        }),
        chart({
          title: 'Cambio de estructura válido', symbol: 'GBP/USD · H1', seed: 42,
          path: [[0, 85], [7, 62], [11, 72], [18, 50], [22, 60], [29, 38], [34, 72], [38, 63], [46, 86]],
          ann: [
            { t: 'h', y: 60, x1: 22, x2: 40, c: 'muted', label: 'Último máximo' },
            { t: 'txt', x: 25, y: 74, text: 'Rompe con fuerza y se mantiene', c: 'up' },
          ],
          note: 'Velas grandes, rompe con claridad y el precio se desarrolla por encima del nivel: cambio de estructura fiable.',
        }),
      ],
      takeaways: ['Un mínimo se confirma al romper el máximo anterior', 'Mechas incluidas y de izquierda a derecha', 'Cambios escasos = posible manipulación'],
    },
    {
      slug: 'estructura-externa-e-interna',
      title: 'Estructura externa e interna',
      minutes: 8,
      blocks: [
        p('Los impulsos y retrocesos no son líneas rectas: **dentro** de cada uno hay otra estructura. La **externa** (temporalidad alta) marca el rango en el que estamos; la **interna** nos dice cuándo es probable que un retroceso haya terminado.'),
        chart({
          title: 'Retroceso con estructura interna bajista', symbol: 'XAU/USD · H1', seed: 43,
          path: [[0, 30], [8, 55], [11, 48], [14, 70], [18, 58], [21, 64], [25, 50], [27, 55], [29, 44], [33, 60], [36, 54], [46, 86]],
          ann: [
            { t: 'pt', x: 14, y: 70, text: 'Máximo externo', step: 0 },
            { t: 'zone', x1: 15, x2: 29, y1: 43, y2: 66, c: 'violet', o: 0.07, label: 'Estructura interna', lb: true, step: 1 },
            { t: 'h', y: 55, x1: 27, x2: 34, c: 'muted', step: 2 },
            { t: 'txt', x: 31, y: 61, text: 'CHoCH interno', c: 'up', step: 2 },
            { t: 'trade', x: 36, x2: 46, entry: 54.5, sl: 43, tp: 84, step: 3 },
          ],
          steps: [
            { to: 14, text: 'Estructura externa alcista: el precio hace un nuevo máximo.' },
            { to: 29, text: 'El retroceso forma su propia tendencia bajista interna (máximos y mínimos más bajos). ¿Dónde acabará? No lo sabemos de antemano.' },
            { to: 33, text: 'El precio rompe el último máximo interno: cambio de estructura interno. Probablemente el retroceso ha terminado.' },
            { to: 46, text: 'Compra en el retroceso interno, a favor de la estructura externa, con el stop bajo el mínimo del retroceso.' },
          ],
        }),
        ul(
          'La **externa siempre manda** sobre la interna.',
          'A veces verás la interna en la misma temporalidad; otras tendrás que bajar de temporalidad.',
          'Si en la temporalidad baja nunca aparece el cambio interno y el precio rompe el mínimo externo, **quédate fuera**.'
        ),
        tip('La estructura interna te permite adaptarte al precio en vez de esperar un nivel exacto: no sabes si reaccionará en la primera zona o en la siguiente, pero el cambio interno te lo dirá.'),
      ],
      takeaways: ['Externa = rango; interna = timing', 'CHoCH interno = fin probable del retroceso', 'La externa manda'],
    },
    {
      slug: 'analisis-institucional-top-down',
      title: 'De mensual a M1: la estructura en su conjunto',
      minutes: 7,
      blocks: [
        p('El proceso es siempre el mismo, bajando temporalidad a temporalidad y preguntándote en cada una: **¿qué información tengo y qué necesito buscar abajo?**'),
        table(['Temporalidad', 'Pregunta', 'Ejemplo'], [
          ['Mensual', '¿Cuál es la estructura externa?', 'Alcista, en retroceso'],
          ['Semanal', '¿Cómo es la estructura interna del retroceso?', 'Bajista interna: el retroceso sigue'],
          ['Diario', '¿Hay cambio de estructura que termine el retroceso?', 'Rompe un mínimo: ¿con fuerza o es manipulación?'],
          ['H4 / H1', '¿Entre qué máximo y mínimo está el precio?', 'Estructura bajista con nuevos puntos de referencia'],
          ['M15 → M1', '¿Hay confirmación para entrar?', 'Cambio de estructura a favor de la temporalidad mayor'],
        ]),
        p('Si una temporalidad no se ve clara, **baja una más**. Lo que tienes que tener siempre claro es entre qué rango está el precio y hacia qué máximo o mínimo se dirige.'),
        warn('El objetivo de una entrada en M1 no tiene por qué ser el máximo de la temporalidad mensual. Ajusta el objetivo a la liquidez más cercana y lógica.'),
        tip('Si solo entendieras la estructura, ya podrías operar. Es la base de todo lo que viene: practícala en gráficos reales antes de seguir.'),
      ],
      takeaways: ['Misma pregunta en cada temporalidad', 'Si no está claro, baja una más', 'Objetivos realistas según la temporalidad'],
    },
  ],
  quiz: [
    { q: '¿Cuándo se confirma un nuevo mínimo en tendencia alcista?', options: ['Cuando la vela es roja', 'Cuando el precio supera el máximo anterior', 'A las 24 horas', 'Cuando toca un Fibonacci'], answer: 1, explain: 'Hasta entonces, el retroceso podría convertirse en cambio de estructura.' },
    { q: 'El análisis institucional se centra en…', options: ['Indicadores', 'Estructura, puntos de interés y liquidez', 'Noticias', 'Canales y Fibonacci'], answer: 1, explain: 'Esa es su hoja de ruta.' },
    { q: 'Un cambio de estructura que rompe por muy poco y sin fuerza…', options: ['Es la mejor señal', 'Puede ser una manipulación: poco fiable', 'Siempre continúa', 'No existe'], answer: 1, explain: 'Los cambios escasos suelen ser trampas.' },
    { q: 'La estructura interna sirve para…', options: ['Sustituir a la externa', 'Saber cuándo es probable que termine un retroceso', 'Marcar Fibonacci', 'Nada'], answer: 1, explain: 'El CHoCH interno indica el fin probable del retroceso.' },
    { q: '¿Conviene mezclar análisis técnico e institucional?', options: ['Sí, siempre', 'No: son enfoques distintos que pueden contradecirse', 'Solo los viernes', 'Solo en M1'], answer: 1, explain: 'Elige uno y domínalo.' },
  ],
}

export const i2 = {
  id: 'institucional-poi',
  track: 'institucional',
  title: 'Puntos de interés (POI)',
  desc: 'Order blocks y sus variantes, zonas de oferta y demanda, imbalances (FVG), descuento/premium y los POI de mayor probabilidad.',
  lessons: [
    {
      slug: 'order-blocks',
      title: 'Order blocks: qué son y cuándo son válidos',
      minutes: 8,
      blocks: [
        p('Un **order block (OB)** es la zona donde, según este modelo, se ejecutaron órdenes grandes antes de un movimiento fuerte. En el gráfico es **la última vela contraria antes de un impulso** que rompe estructura.'),
        ul(
          'En estructura alcista: la última vela **bajista** antes del impulso → zona de **demanda**.',
          'En estructura bajista: la última vela **alcista** antes del impulso → zona de **oferta**.'
        ),
        h('Dos requisitos para que sea válido'),
        ol('El impulso **rompe estructura** (supera el máximo o mínimo anterior).', 'Las velas siguientes salen **con fuerza**.'),
        chart({
          title: 'Order block alcista válido', symbol: 'EUR/USD · H1', seed: 44,
          path: [[0, 30], [8, 52], [14, 39], [20, 66], [26, 44], [34, 80]],
          mods: { 14: { o: 43.5, h: 44, l: 39, c: 40 } },
          ann: [
            { t: 'h', y: 52, x1: 8, x2: 20, c: 'muted', label: 'Máximo previo', step: 0 },
            { t: 'zone', x1: 14, y1: 39, y2: 44, c: 'up', label: 'Order block', lb: true, step: 1 },
            { t: 'trade', x: 26, x2: 34, entry: 44, sl: 38.2, tp: 79, step: 2 },
          ],
          steps: [
            { to: 13, text: 'Estructura alcista. El precio retrocede.' },
            { to: 20, text: 'Última vela bajista antes de un impulso fuerte que rompe el máximo previo: ese es el order block.' },
            { to: 34, text: 'En el retroceso, el precio vuelve al OB y reacciona: compra con el stop debajo del OB.' },
          ],
        }),
        chart({
          title: 'Order block NO válido', symbol: 'EUR/USD · H1', seed: 45,
          path: [[0, 82], [8, 55], [14, 69], [19, 58], [25, 76], [32, 84]],
          mods: { 13: { o: 64, c: 68, h: 68.5, l: 63.5 } },
          ann: [
            { t: 'h', y: 55, x1: 8, x2: 22, c: 'muted', label: 'Mínimo previo', lb: true },
            { t: 'zone', x1: 13, x2: 26, y1: 63.5, y2: 69, c: 'down', label: '¿OB?' },
            { t: 'txt', x: 19, y: 58, text: 'No rompe el mínimo', c: 'accent', pos: 'b' },
          ],
          note: 'Hay impulso bajista, pero no hace un nuevo mínimo. Quien vendiera en esa zona acabaría en pérdida.',
        }),
      ],
      takeaways: ['OB = última vela contraria antes del impulso', 'Debe romper estructura y salir con fuerza', 'Sin ruptura, no es OB'],
    },
    {
      slug: 'zona-de-demanda-vs-order-block',
      title: 'Zona de oferta/demanda vs order block',
      minutes: 6,
      blocks: [
        p('El precio no siempre llega al order block. A menudo reacciona antes, en la **pequeña acumulación** previa al impulso: la **zona de demanda** (u oferta) completa.'),
        chart({
          title: 'Zona de demanda y order block', symbol: 'XAU/USD · H1', seed: 46,
          path: [[0, 50], [5, 40.5], [7, 45], [9, 41], [11, 45], [12, 40], [18, 70], [24, 45.5], [32, 82]],
          mods: { 12: { o: 44, h: 44.5, l: 40, c: 40.8 } },
          ann: [
            { t: 'zone', x1: 5, y1: 40, y2: 46, c: 'violet', o: 0.1, label: 'Zona de demanda' },
            { t: 'zone', x1: 12, y1: 40, y2: 44.5, c: 'up', o: 0.2, label: 'OB', lb: true, lx: 14 },
          ],
          note: 'El precio reacciona en la parte alta de la zona de demanda, sin llegar al order block.',
        }),
        table(['Entrada en…', 'Ventaja', 'Inconveniente'], [
          ['Zona de demanda/oferta', 'Más operaciones (el precio llega más a menudo)', 'Stop más amplio → menos ratio'],
          ['Order block', 'Ratio mucho mayor', 'Menos operaciones; a veces no llega'],
        ]),
        tip('Puedes esperar un cambio de estructura en temporalidad baja dentro de la zona (más seguro) o colocar una orden límite en el OB (más ratio, menos confirmación).'),
      ],
      takeaways: ['La zona completa incluye la acumulación previa', 'Más frecuencia vs más ratio', 'Confirmación o orden límite: elige y mide'],
    },
    {
      slug: 'tipos-de-order-blocks',
      title: 'Tipos: clásico, de quiebre y killer block',
      minutes: 7,
      blocks: [
        table(['Tipo', 'Qué es'], [
          ['**Clásico**', 'El que ya conoces: última vela contraria antes de un impulso que rompe estructura'],
          ['**De quiebre (breaker)**', 'Un OB clásico que el precio atraviesa con fuerza y que después se usa **del lado contrario**'],
          ['**Killer block**', 'Un OB que se forma justo **después de tomar liquidez** (por encima y por debajo). Suele dar reacciones muy rápidas'],
        ]),
        h('El order block de quiebre'),
        p('Interpretación: algunos grandes participantes vendieron en ese OB, pero otros más fuertes compraron. Los primeros necesitan salir cerca de su precio de entrada (en break even)… y muchos entran ahora en compra. La zona cambia de bando.'),
        chart({
          title: 'Un OB bajista se convierte en breaker', symbol: 'EUR/USD · H4', seed: 47,
          path: [[0, 70], [6, 50], [10, 59], [15, 38], [20, 48], [23, 44], [30, 72], [36, 57], [44, 86]],
          mods: { 9: { o: 55, c: 58.5, h: 59, l: 54.5 } },
          ann: [
            { t: 'zone', x1: 9, x2: 27, y1: 54.5, y2: 59, c: 'down', label: 'OB bajista', step: 0 },
            { t: 'zone', x1: 28, y1: 54.5, y2: 59, c: 'up', label: 'OB de quiebre', lb: true, step: 1 },
            { t: 'trade', x: 36, x2: 44, entry: 58, sl: 53, tp: 85, step: 2 },
          ],
          steps: [
            { to: 23, text: 'Estructura bajista: el OB (última vela alcista antes de la caída) es válido porque rompe el mínimo.' },
            { to: 30, text: 'El precio vuelve y atraviesa el OB con fuerza, rompiendo estructura al alza. El OB queda "roto".' },
            { to: 44, text: 'En el retroceso, esa misma zona actúa ahora como soporte: es el OB de quiebre. Compra con confirmación.' },
          ],
        }),
        tip('Cuando dudes entre un OB clásico y uno de quiebre, baja de temporalidad y espera un cambio de estructura en cualquiera de los dos.'),
      ],
      takeaways: ['Breaker = OB atravesado que cambia de bando', 'Killer block = OB tras tomar liquidez', 'Baja de temporalidad para decidir'],
    },
    {
      slug: 'imbalances-fvg',
      title: 'Imbalances (FVG): huecos de valor',
      minutes: 7,
      blocks: [
        p('Un **imbalance** o **FVG (Fair Value Gap)** es un desequilibrio: una vela tan fuerte que las mechas de la vela anterior y la siguiente **no llegan a cubrir su cuerpo**. Hubo muchos más compradores que vendedores (o al revés) y el precio "se saltó" una zona.'),
        chart({
          title: 'Un FVG alcista y su mitigación', symbol: 'NAS100 · M15',
          candles: [[40, 42, 38, 41], [41, 43, 39.5, 42.5], [42.5, 52, 42, 51], [51, 56, 49, 55], [55, 57, 53, 56], [56, 57, 52, 53], [53, 54, 48, 49], [49, 50, 45.5, 47], [47, 52, 46.5, 51.5], [51.5, 58, 51, 57.5], [57.5, 62, 57, 61]],
          ann: [
            { t: 'zone', x1: 1, y1: 43, y2: 49, c: 'accent', label: 'FVG' },
            { t: 'h', y: 46, x1: 1, c: 'muted', label: '50%', lb: true },
            { t: 'txt', x: 1, y: 43, text: 'Máx. vela 1', c: 'muted', pos: 'b' },
            { t: 'txt', x: 3, y: 56, text: 'Mín. vela 3', c: 'muted' },
          ],
          note: 'El hueco entre el máximo de la vela 1 y el mínimo de la vela 3 es el FVG. El precio vuelve, lo rellena más de la mitad y continúa.',
        }),
        ul(
          'El mercado tiende a volver al equilibrio, así que el precio suele volver a **rellenar** los FVG.',
          'Se considera mitigado cuando el precio rellena **al menos el 50%**.',
          'Solo interesan los FVG que están **dentro de una zona de interés** y a favor de la estructura: el gráfico está lleno de huecos sin importancia.'
        ),
      ],
      takeaways: ['FVG = cuerpo no cubierto por las mechas vecinas', 'Mitigado al rellenar ~50%', 'Solo los FVG en zonas con sentido'],
    },
    {
      slug: 'descuento-y-premium',
      title: 'Descuento y premium: la regla del 50%',
      minutes: 5,
      blocks: [
        p('Para que una estructura sea **sana y equilibrada**, los retrocesos deberían llegar **al menos al 50%** del impulso. Por encima del 50% el precio está "caro" (**premium**); por debajo, "barato" (**descuento**).'),
        chart({
          title: 'Comprar en descuento', symbol: 'EUR/USD · H4', seed: 48,
          path: [[0, 36], [2, 30], [14, 80], [23, 47], [36, 96]],
          ann: [
            { t: 'zone', x1: 2, x2: 30, y1: 55, y2: 80, c: 'down', o: 0.08, label: 'Premium (caro)' },
            { t: 'zone', x1: 2, x2: 30, y1: 30, y2: 55, c: 'up', o: 0.08, label: 'Descuento (barato)', lb: true },
            { t: 'h', y: 55, x1: 2, x2: 30, c: 'muted', label: '50%' },
          ],
          note: 'En tendencia alcista buscamos compras en descuento (debajo del 50%). En bajista, ventas en premium.',
        }),
        warn('Si el último retroceso no llegó al 50% y tomas la siguiente zona de demanda, es frecuente que el precio te barra para hacer un retroceso más profundo antes de continuar.'),
        tip('Usa la herramienta de Fibonacci solo para medir ese 50%. No necesitas más niveles en este enfoque.'),
      ],
      takeaways: ['Retroceso sano ≥ 50%', 'Compras en descuento, ventas en premium', 'Retrocesos cortos = riesgo de barrida'],
    },
    {
      slug: 'poi-de-mayor-probabilidad',
      title: 'POI de mayor probabilidad: BPR y breaker + FVG',
      minutes: 6,
      blocks: [
        p('Cuando hay varios POI seguidos, ¿cuál elegir? Dos combinaciones destacan:'),
        h('BPR (Balanced Price Range)'),
        p('Un FVG bajista y un FVG alcista que **se solapan**: el precio pasó por la misma zona en ambas direcciones con desequilibrio. El solape es una zona de reacción muy probable.'),
        chart({
          title: 'BPR: dos FVG que se solapan', symbol: 'GBP/USD · M15',
          candles: [[70, 71, 66, 67], [67, 68, 64.5, 65], [65, 65.5, 55, 56], [56, 58, 53, 54], [54, 55, 50, 51], [51, 52, 48, 50], [50, 53, 49, 52.5], [52.5, 54, 51.5, 53.5], [53.5, 66, 53, 65], [65, 68, 62, 67], [67, 70, 65.5, 69], [69, 69.5, 64, 64.5], [64.5, 65, 60, 60.5], [60.5, 66, 59.5, 65.5], [65.5, 72, 65, 71.5], [71.5, 76, 71, 75.5]],
          ann: [
            { t: 'zone', x1: 1, x2: 8, y1: 58, y2: 64.5, c: 'down', o: 0.14, label: 'FVG bajista', lx: 4 },
            { t: 'zone', x1: 7, y1: 54, y2: 62, c: 'up', o: 0.1, label: 'FVG alcista', lb: true, lx: 11 },
            { t: 'zone', x1: 9, y1: 58, y2: 62, c: 'accent', o: 0.22, label: 'BPR', lx: 14 },
          ],
          note: 'El precio vuelve exactamente a la zona común de los dos desequilibrios y sale disparado.',
        }),
        h('Order block de quiebre + FVG'),
        p('Cuando un breaker coincide con un FVG, las probabilidades de reacción son muy altas. Es de las zonas favoritas para entrar tras un cambio de estructura.'),
        tip('Prioridad práctica: BPR y breaker + FVG > OB clásico > FVG aislado. Pero siempre dentro de una estructura que tenga sentido.'),
      ],
      takeaways: ['BPR = solape de FVG opuestos', 'Breaker + FVG = POI de alta probabilidad', 'Prioriza las combinaciones'],
    },
  ],
  quiz: [
    { q: 'Un order block alcista es…', options: ['La primera vela verde del día', 'La última vela bajista antes de un impulso que rompe estructura', 'Cualquier soporte', 'Un FVG'], answer: 1, explain: 'Última vela contraria antes del impulso.' },
    { q: 'Un OB sin ruptura de estructura…', options: ['Es el mejor', 'No es válido', 'Se convierte en BPR', 'Es un breaker'], answer: 1, explain: 'Requisitos: romper estructura y velas con fuerza.' },
    { q: 'Un OB de quiebre (breaker) es…', options: ['Un OB que el precio atraviesa con fuerza y luego actúa del lado contrario', 'Un OB muy pequeño', 'Un gap de fin de semana', 'Una vela doji'], answer: 0, explain: 'Cambia de bando tras ser atravesado.' },
    { q: '¿Cuándo se considera mitigado un FVG?', options: ['Al tocarlo con una mecha mínima', 'Al rellenarlo al menos un 50%', 'Nunca', 'Solo al 100%'], answer: 1, explain: 'Con el 50% basta.' },
    { q: 'En tendencia alcista, buscamos compras en…', options: ['Premium', 'Descuento (por debajo del 50%)', 'El máximo', 'Cualquier sitio'], answer: 1, explain: 'Comprar barato dentro de la estructura.' },
  ],
}

export const i3 = {
  id: 'institucional-liquidez',
  track: 'institucional',
  title: 'Liquidez',
  desc: 'Qué es la liquidez, dónde se acumula, cómo la persigue el precio, los stop hunts y el patrón AMD.',
  lessons: [
    {
      slug: 'que-es-la-liquidez',
      title: 'Qué es la liquidez',
      minutes: 6,
      blocks: [
        p('Para que tú ganes al vender algo más caro, alguien tiene que comprártelo a ese precio. Si compras una manzana a 1 € y la vendes a 1,50 €, tu beneficio sale del comprador que paga 1,50 €. En los mercados pasa lo mismo: **por cada ganador hay alguien al otro lado**.'),
        p('Los grandes participantes necesitan muchísima contrapartida. ¿Dónde la encuentran? En las zonas donde se acumulan **stop loss y órdenes pendientes**. Eso es la **liquidez**: la gasolina que mueve el precio.'),
        chart({
          title: 'Máximos iguales = liquidez', symbol: 'XAU/USD · H1', seed: 51,
          path: [[0, 40], [6, 62], [10, 52], [16, 62.2], [20, 50], [26, 62], [29, 54], [31, 67], [33, 57], [42, 34]],
          mods: { 31: { c: 60, o: 58 } },
          ann: [
            { t: 'zone', x1: 6, x2: 30, y1: 61.5, y2: 63, c: 'down', o: 0.25, label: 'Stops por encima', step: 0 },
            { t: 'txt', x: 31, y: 67, text: 'Toma de liquidez', c: 'accent', step: 1 },
          ],
          steps: [
            { to: 28, text: 'Tres máximos casi iguales. Quien vende aquí pone su stop justo encima; quien compra en ruptura, también pone órdenes ahí.' },
            { to: 32, text: 'El precio sube a por esos stops y órdenes (toma de liquidez)…' },
            { to: 42, text: '…y con esa contrapartida, los grandes venden. El precio cae con fuerza.' },
          ],
        }),
        tip('Pregunta clave antes de operar: **¿dónde están los stops de los demás?** Tu objetivo es no ser el take profit de otro.'),
      ],
      takeaways: ['Liquidez = acumulación de stops y órdenes', 'Es la gasolina del precio', 'No seas el TP de otro'],
    },
    {
      slug: 'donde-esta-la-liquidez',
      title: 'Dónde se acumula la liquidez',
      minutes: 7,
      blocks: [
        h('En la estructura'),
        ul(
          'Por encima de **máximos iguales** y por debajo de **mínimos iguales** (lo que el técnico llama doble techo/suelo).',
          'Debajo de **mínimos crecientes** y sobre **máximos decrecientes**.',
          'Alrededor de **líneas de tendencia** muy obvias.',
          'Sobre y bajo los extremos de un **rango** (más toques = más liquidez).',
          'Sobre **máximos antiguos**: el primero es el objetivo más cercano; con fuerza puede llevarse varios.'
        ),
        h('En el tiempo'),
        ul(
          'Máximo y mínimo de cada **sesión** (Asia, Londres, Nueva York).',
          'Máximo y mínimo del **día anterior**.',
          'Máximo y mínimo de la **semana** y del **mes** anteriores.'
        ),
        chart({
          title: 'Londres barre el mínimo de Asia', symbol: 'EUR/USD · M15', seed: 52,
          path: [[0, 50], [3, 54.5], [6, 48], [9, 55], [12, 48.5], [15, 54], [17, 50], [19, 45], [21, 52], [26, 57], [34, 68]],
          ann: [
            { t: 'zone', x1: 0, x2: 16, y1: 47.8, y2: 55.3, c: 'violet', o: 0.08, label: 'Rango de Asia' },
            { t: 'h', y: 48, x1: 0, x2: 24, c: 'up', label: 'Mínimo de Asia', lb: true },
            { t: 'h', y: 55, x1: 0, x2: 34, c: 'down', label: 'Máximo de Asia' },
            { t: 'txt', x: 19, y: 45, text: 'Barrida en Londres', c: 'accent', pos: 'b' },
          ],
          note: 'En la apertura de Londres, el precio toma los stops bajo el mínimo de Asia y después va a por la liquidez sobre el máximo.',
        }),
        tip('El precio se mueve **de zonas con poca liquidez a zonas con mucha**. Si por debajo ya no queda liquidez y por encima hay máximos iguales, ya sabes hacia dónde es más probable que vaya.'),
      ],
      takeaways: ['Iguales, tendencias, rangos y máximos antiguos', 'Sesiones, día, semana y mes anteriores', 'De poca liquidez a mucha'],
    },
    {
      slug: 'stop-hunt',
      title: 'Stop hunt: el falso cambio de estructura',
      minutes: 7,
      blocks: [
        p('Un **stop hunt** barre los stops de un mínimo (o máximo) y después el precio **continúa en su tendencia**. A primera vista parece un cambio de estructura… pero no lo es.'),
        chart({
          title: 'Barre el mínimo y reacciona en un FVG', symbol: 'XAU/USD · H1', seed: 53,
          path: [[0, 30], [8, 55], [13, 44], [21, 72], [26, 52], [33, 78], [38, 55], [40, 48.5], [48, 90]],
          ann: [
            { t: 'zone', x1: 16, y1: 46, y2: 50.5, c: 'accent', label: 'POI sin mitigar (FVG)', lb: true, step: 0 },
            { t: 'h', y: 52, x1: 26, x2: 42, c: 'muted', label: 'Último mínimo', step: 0 },
            { t: 'txt', x: 40, y: 48.5, text: 'Stop hunt', c: 'down', pos: 'b', step: 1 },
          ],
          steps: [
            { to: 33, text: 'Estructura alcista. Debajo del último mínimo hay un FVG que todavía no se ha mitigado.' },
            { to: 40, text: 'El precio rompe el último mínimo… pero justo debajo está el FVG. Es probable que solo esté tomando liquidez.' },
            { to: 48, text: 'Reacciona en el FVG y continúa al alza: el "cambio de estructura" era un stop hunt.' },
          ],
        }),
        h('Cómo distinguirlo'),
        ul(
          '¿Hay un **POI sin mitigar** (OB o FVG) justo detrás del nivel roto? Probable manipulación.',
          '¿Tiene sentido un cambio de estructura **en esa zona**?',
          '¿Cómo se rompe? Un movimiento **lento**, sin POI claros, deja liquidez detrás que el precio probablemente irá a buscar.'
        ),
        tip('Tras una toma de liquidez, es muy común una reversión en la temporalidad menor: ahí suele haber buenas oportunidades.'),
      ],
      takeaways: ['Stop hunt = barrida + continuación', 'POI sin mitigar detrás = sospecha', 'Evalúa la zona y la forma de la ruptura'],
    },
    {
      slug: 'amd',
      title: 'AMD: acumulación, manipulación y distribución',
      minutes: 6,
      blocks: [
        p('Un patrón muy recurrente en este enfoque, en tres fases:'),
        ol(
          '**Acumulación**: el precio consolida y crea liquidez a ambos lados.',
          '**Manipulación**: toma la liquidez de un lado (normalmente mitigando un POI).',
          '**Distribución**: se mueve con fuerza hacia el lado contrario.'
        ),
        chart({
          title: 'AMD en una tendencia alcista', symbol: 'EUR/USD · M5', seed: 54,
          path: [[0, 30], [8, 62], [10, 58], [13, 63], [16, 57], [19, 63.5], [22, 57.5], [25, 63], [27, 52], [29, 56], [38, 86]],
          ann: [
            { t: 'zone', x1: 8, x2: 25, y1: 56.5, y2: 64, c: 'violet', o: 0.1, label: 'Acumulación', step: 0 },
            { t: 'zone', x1: 26, x2: 28, y1: 51, y2: 57, c: 'down', o: 0.2, label: 'Manipulación', lb: true, step: 1 },
            { t: 'zone', x1: 29, x2: 38, y1: 56, y2: 86, c: 'blue', o: 0.06, label: 'Distribución', lx: 33, step: 2 },
          ],
          steps: [
            { to: 25, text: 'Acumulación: el precio va de lado y deja stops por encima y por debajo.' },
            { to: 28, text: 'Manipulación: barre los mínimos (y los stops de los compradores impacientes).' },
            { to: 38, text: 'Distribución: el movimiento real hacia la liquidez del lado contrario.' },
          ],
        }),
        h('Tres formas de aprovecharlo'),
        ol(
          'En la **manipulación**, si el precio está en un POI: buscar cambio de estructura con objetivo en la liquidez contraria.',
          'Tras la **distribución**: esperar el retroceso a un POI creado en la expansión.',
          'Si la manipulación es por arriba: buscar la reversión hacia el POI de abajo.'
        ),
      ],
      takeaways: ['Acumula → manipula → distribuye', 'La manipulación ocurre en un POI', 'Objetivo: liquidez del lado contrario'],
    },
  ],
  quiz: [
    { q: 'En este enfoque, la liquidez es…', options: ['El dinero de tu cuenta', 'La acumulación de stops y órdenes pendientes', 'El volumen de un indicador', 'El spread'], answer: 1, explain: 'Es la contrapartida que necesitan los grandes.' },
    { q: '¿Dónde NO suele haber liquidez relevante?', options: ['Sobre máximos iguales', 'Bajo el mínimo de Asia', 'En mitad de un impulso sin niveles', 'Sobre el máximo del día anterior'], answer: 2, explain: 'La liquidez se concentra en niveles obvios.' },
    { q: 'El precio rompe el último mínimo y justo debajo hay un FVG sin mitigar. Probablemente…', options: ['Cambio de estructura seguro', 'Un stop hunt', 'Un BPR', 'Nada'], answer: 1, explain: 'POI sin mitigar detrás del nivel = sospecha de manipulación.' },
    { q: 'AMD significa…', options: ['Análisis, Media, Divergencia', 'Acumulación, Manipulación, Distribución', 'Alcista, Mixto, Descendente', 'Apertura, Mitad, Día'], answer: 1, explain: 'Las tres fases del patrón.' },
    { q: 'El precio tiende a moverse…', options: ['De zonas de mucha liquidez a poca', 'De zonas de poca liquidez a mucha', 'Al azar', 'Solo con noticias'], answer: 1, explain: 'Va a buscar donde está el dinero.' },
  ],
}

export const i4 = {
  id: 'institucional-modelos',
  track: 'institucional',
  title: 'Modelos de entrada y errores',
  desc: 'Los escenarios que debes evitar y cuatro modelos de entrada paso a paso, con stop y objetivo.',
  lessons: [
    {
      slug: 'escenarios-de-riesgo-institucional',
      title: 'Escenarios de riesgo: qué NO hacer',
      minutes: 7,
      blocks: [
        ol(
          '**Entrar antes de que se tome una liquidez importante.** Si el precio se acerca a un máximo diario o a varios máximos iguales, espera a que los tome antes de buscar la reversión.',
          '**Seguir la estructura interna al final de un impulso.** Si el precio acaba de tomar el mínimo externo, puede empezar un retroceso profundo: no te conviertas en la liquidez de otros.',
          '**Entrar después de que se haya tomado tu objetivo.** Si el precio ya alcanzó la liquidez que era tu TP antes del retroceso, ya no hay operación.',
          '**Seguir una estructura cuyo último retroceso no llegó al 50%.** Lo probable es un retroceso más profundo antes de continuar.'
        ),
        chart({
          title: 'Liquidez en contra sin tomar', symbol: 'EUR/USD · M15', seed: 55,
          path: [[0, 70], [6, 50], [10, 58], [14, 50.3], [18, 62], [22, 56], [26, 64], [30, 44], [38, 70]],
          ann: [
            { t: 'zone', x1: 6, x2: 30, y1: 49.5, y2: 51, c: 'down', o: 0.3, label: 'Mínimos iguales sin tomar', lb: true },
            { t: 'trade', x: 22, x2: 30, entry: 56.5, sl: 49, tp: 70 },
          ],
          note: 'La compra parece bonita, pero debajo hay mínimos iguales con liquidez. El precio va a por ellos primero (y a por tu stop) antes de subir.',
        }),
        warn('Regla de oro: **no busques una operación teniendo liquidez importante en tu contra** entre tu entrada y tu stop.'),
      ],
      takeaways: ['Espera a que se tome la liquidez', 'Respeta la estructura externa', 'Sin liquidez en contra y con retrocesos ≥ 50%'],
    },
    {
      slug: 'modelo-de-entrada-1',
      title: 'Modelo 1: toma de liquidez de sesión y reversión',
      minutes: 7,
      blocks: [
        p('Muy usado en intradía. Pasos:'),
        ol('El precio llega a un **POI** de temporalidad mayor.', 'Barre **liquidez** (a menudo el máximo o mínimo de Asia).', 'En M1, **cambio de estructura con fuerza** que deja un FVG.', 'Entrada en el POI creado en la expansión (FVG o breaker).', 'TP en la **liquidez cercana**.'),
        table(['Sesión', 'Franja más activa (hora peninsular española, orientativa)'], [['Asia', '2:00 – 6:00'], ['Londres', '8:00 – 11:00'], ['Nueva York', '13:00 – 15:00 (y la apertura de Wall Street a las 15:30)']]),
        chart({
          title: 'Barre el máximo de Asia y revierte', symbol: 'GBP/USD · M1', seed: 56,
          path: [[0, 45], [4, 52], [7, 46], [10, 52.5], [13, 47], [16, 51], [18, 58], [21, 43], [24, 49], [32, 28]],
          mods: { 19: { o: 55, c: 50, h: 55.5, l: 49.5 }, 20: { o: 50, c: 45, h: 50.5, l: 44.5 } },
          ann: [
            { t: 'zone', x1: 0, x2: 16, y1: 45.5, y2: 53, c: 'violet', o: 0.08, label: 'Rango de Asia', step: 0 },
            { t: 'txt', x: 18, y: 58, text: 'Barre el máximo', c: 'accent', step: 1 },
            { t: 'h', y: 46, x1: 7, x2: 22, c: 'muted', label: 'CHoCH', lb: true, step: 2 },
            { t: 'zone', x1: 19, y1: 47.5, y2: 50, c: 'down', o: 0.2, label: 'FVG', lx: 22, step: 2 },
            { t: 'trade', x: 24, x2: 32, entry: 48.5, sl: 58.5, tp: 29, step: 3 },
          ],
          steps: [
            { to: 16, text: 'El precio forma el rango de Asia justo debajo de un POI bajista de temporalidad mayor.' },
            { to: 18, text: 'En la apertura de Londres barre el máximo de Asia: toma la liquidez de los vendedores impacientes y de los compradores en ruptura.' },
            { to: 21, text: 'Cambio de estructura con fuerza en M1, dejando un FVG: momentum vendedor.' },
            { to: 32, text: 'Entrada en el FVG, stop por encima del máximo de la barrida y objetivo en la liquidez inferior.' },
          ],
        }),
        tip('En este modelo no se toman parciales: se va moviendo el stop por encima de los nuevos máximos a medida que la estructura baja.'),
      ],
      takeaways: ['POI → barrida → CHoCH con FVG → entrada', 'Muy útil en aperturas de sesión', 'Stop tras la barrida, TP en liquidez cercana'],
    },
    {
      slug: 'modelo-de-entrada-2',
      title: 'Modelo 2: continuación en un POI de temporalidad mayor',
      minutes: 6,
      blocks: [
        ol('POI claro de continuación de tendencia.', 'El precio llega al POI.', 'Barre stops de la estructura interna.', 'Cambio de estructura con momentum.', 'Entrada en el POI creado por el CHoCH.', 'TP en la liquidez cercana (o el extremo de la estructura externa).'),
        chart({
          title: 'Continuación bajista desde un POI', symbol: 'XAU/USD · M15', seed: 57,
          path: [[0, 80], [8, 50], [14, 64], [20, 40], [26, 58], [28, 55], [30, 62], [32, 50], [34, 56], [44, 34]],
          ann: [
            { t: 'zone', x1: 13, y1: 57, y2: 63.5, c: 'down', o: 0.14, label: 'POI (OB bajista)', step: 0 },
            { t: 'txt', x: 30, y: 62, text: 'Barre', c: 'accent', step: 1 },
            { t: 'h', y: 55, x1: 28, x2: 34, c: 'muted', step: 1 },
            { t: 'trade', x: 34, x2: 44, entry: 56, sl: 63.5, tp: 36, step: 2 },
          ],
          steps: [
            { to: 20, text: 'Tendencia bajista que deja un POI claro (order block).' },
            { to: 32, text: 'El precio retrocede al POI, barre un máximo interno y hace un cambio de estructura con fuerza.' },
            { to: 44, text: 'Entrada en el retroceso, stop sobre la barrida y objetivo bajo el mínimo de la estructura externa.' },
          ],
        }),
      ],
      takeaways: ['A favor de la estructura mayor', 'POI + barrida + CHoCH', 'Mueve el stop con la nueva estructura'],
    },
    {
      slug: 'modelo-de-entrada-3',
      title: 'Modelo 3: continuación hacia una liquidez clara',
      minutes: 6,
      blocks: [
        p('Si el precio viene de **tomar liquidez o mitigar un POI** y tiene una liquidez clara por delante, la probabilidad de que vaya a buscarla es alta.'),
        ol('Toma liquidez o mitiga un POI.', 'Empieza un flujo de órdenes (order flow) en dirección a la liquidez.', 'Entrada en continuación: tras un stop hunt interno o con doble confirmación.', 'TP en la liquidez objetivo.'),
        chart({
          title: 'Stop hunt interno y camino a los máximos iguales', symbol: 'EUR/USD · M5', seed: 58,
          path: [[0, 30], [8, 70], [12, 60], [16, 70.3], [22, 50], [24, 53], [26, 47.5], [30, 60], [33, 55], [42, 72]],
          ann: [
            { t: 'zone', x1: 8, y1: 69.5, y2: 71, c: 'down', o: 0.3, label: 'Liquidez objetivo' },
            { t: 'txt', x: 26, y: 47.5, text: 'Stop hunt', c: 'accent', pos: 'b' },
            { t: 'trade', x: 33, x2: 42, entry: 55.5, sl: 47, tp: 70 },
          ],
          note: 'Máximos iguales arriba (objetivo claro). El retroceso barre un mínimo interno, el precio gira y se entra a favor, con TP en esa liquidez.',
        }),
      ],
      takeaways: ['Liquidez clara = objetivo claro', 'Stop hunt interno como gatillo', 'TP en la liquidez'],
    },
    {
      slug: 'modelo-de-entrada-4',
      title: 'Modelo 4: continuación visitando un FVG',
      minutes: 6,
      blocks: [
        ol('Tendencia clara con un impulso fuerte que deja un FVG.', 'Estructura interna clara.', 'El precio visita el FVG y cambia de estructura con fuerza.', 'Objetivo: la liquidez del extremo de la estructura (máximo = liquidez compradora / BSL; mínimo = liquidez vendedora / SSL).'),
        chart({
          title: 'Rellena el FVG, cambia y continúa', symbol: 'NAS100 · M15', seed: 59,
          path: [[0, 30], [3, 27], [10, 62], [16, 50], [18, 54], [20, 45.5], [23, 57], [25, 52], [34, 72]],
          ann: [
            { t: 'zone', x1: 5, y1: 41, y2: 49, c: 'accent', o: 0.14, label: 'FVG', lb: true, lx: 14 },
            { t: 'h', y: 54, x1: 18, x2: 25, c: 'muted' },
            { t: 'trade', x: 25, x2: 34, entry: 52.5, sl: 45, tp: 71 },
          ],
          note: 'El retroceso rellena más de la mitad del FVG, cambia la estructura interna con fuerza y se entra en el retroceso.',
        }),
        tip('Si el primer objetivo da poco ratio, puedes apuntar al segundo punto de liquidez… pero entonces cambia tu gestión: en cuanto el precio tome la primera liquidez, stop a **break even**.'),
      ],
      takeaways: ['Impulso con FVG → visita → CHoCH', 'Objetivo: BSL o SSL', 'Break even al tomar la primera liquidez si alargas el TP'],
    },
  ],
  quiz: [
    { q: 'El precio se acerca a varios máximos iguales y ves un cambio de estructura bajista antes de tocarlos. Lo más prudente es…', options: ['Vender ya', 'Esperar a que tome esa liquidez y luego buscar la reversión', 'Comprar', 'Quitar el stop'], answer: 1, explain: 'Primero la liquidez, luego la reversión.' },
    { q: 'El modelo 1 se basa en…', options: ['Noticias', 'POI + barrida de liquidez de sesión + CHoCH con FVG', 'Cruces de medias', 'RSI'], answer: 1, explain: 'Muy usado en aperturas de sesión.' },
    { q: 'BSL y SSL son…', options: ['Tipos de broker', 'Liquidez compradora (máximos) y vendedora (mínimos)', 'Indicadores', 'Sesiones'], answer: 1, explain: 'Buy-side y sell-side liquidity.' },
    { q: 'Si alargas el objetivo al segundo punto de liquidez…', options: ['Quitas el stop', 'Pones break even al tomar la primera liquidez', 'Doblas el lotaje', 'No cambia nada'], answer: 1, explain: 'Proteges la operación al cambiar la gestión.' },
    { q: '¿Qué indica una liquidez importante entre tu entrada y tu stop?', options: ['Más probabilidad de éxito', 'Que el precio podría ir a buscarla y tocar tu stop', 'Nada', 'Que debes aumentar el riesgo'], answer: 1, explain: 'No operes con liquidez en tu contra.' },
  ],
}
