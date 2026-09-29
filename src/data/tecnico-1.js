import { p, h, ul, ol, tip, warn, ex, w, table, chart } from './blocks.js'

/* =========================================================
   RUTA DE ANÁLISIS TÉCNICO · Módulos 1 y 2
   ========================================================= */

export const t1 = {
  id: 'tecnico-bases',
  track: 'tecnico',
  title: 'Leer el gráfico',
  desc: 'Velas, tendencias, temporalidades, soportes y resistencias, líneas de tendencia y canales: el alfabeto del análisis técnico.',
  lessons: [
    {
      slug: 'que-es-el-analisis-tecnico',
      title: 'Qué es el análisis técnico (y qué no es)',
      minutes: 6,
      blocks: [
        p('El análisis técnico consiste en **leer el comportamiento del precio en el gráfico** para intentar acompañar sus movimientos. No se fija en la economía ni en las noticias: parte de la idea de que todo lo que importa ya está reflejado en el precio.'),
        h('Todo son probabilidades'),
        p('Un patrón funciona porque, en el pasado, una situación parecida terminó de forma parecida **muchas veces**. Eso no significa que vaya a pasar siempre. Por eso un buen análisis puede acabar en pérdida y un mal análisis puede salir bien por casualidad.'),
        ex('Piénsalo así', 'Si el cielo se llena de nubes negras, lo normal es que llueva. Casi siempre aciertas si coges el paraguas… pero algún día no cae ni una gota. En trading pasa lo mismo: jugamos con escenarios que se repiten, nunca con certezas.'),
        tip('Aceptar la incertidumbre te ahorra mucha frustración. Una operación perdedora no significa que el análisis estuviera mal: significa que ha tocado el porcentaje que no sale.'),
        h('Un método, no veinte'),
        p('Hay traders rentables que analizan de formas completamente distintas. El error típico del principiante es intentar aplicar **todo a la vez**: cada herramienta que añades cambia tus estadísticas, y si mezclas sin orden acabas con un gráfico lleno de líneas y ninguna decisión clara.'),
        ul(
          'Aprende los conceptos en orden (esta ruta está pensada así).',
          'Identifica cada concepto tú mismo en gráficos reales antes de pasar al siguiente.',
          'Cuando tengas una forma de operar, mídela con datos antes de cambiarla.'
        ),
        h('Tu perfil de trader'),
        table(['Perfil', 'Temporalidades de análisis', 'Duración de la operación'], [
          ['Swing trader', 'Mensual → semanal → **diario**', 'Días o semanas; pocas operaciones al mes'],
          ['Day trader', 'Semanal/diario → **H1 o M15**', 'Se abre y se cierra en el día'],
          ['Scalper', 'H4 → **M5 o M1**', 'Minutos u horas; mucha atención a la pantalla'],
        ]),
        warn('Cuanto más baja es la temporalidad, más ruido y más manipulaciones. Si estás empezando, el swing o el intradía en H1 son mucho más amables.'),
      ],
      takeaways: ['El análisis técnico lee el precio, no la economía', 'Trabajamos con probabilidades, no certezas', 'Un método ordenado vale más que muchas herramientas mezcladas'],
    },
    {
      slug: 'velas-japonesas',
      title: 'Velas japonesas: la acción del precio',
      minutes: 6,
      blocks: [
        p('Cada vela resume lo que ha hecho el precio en un periodo: en un gráfico de 4 horas, cada vela son 4 horas de batalla entre compradores y vendedores.'),
        w('candle'),
        ul(
          '**Cuerpo**: distancia entre apertura y cierre. Cuerpo grande = un bando dominó con claridad.',
          '**Mecha superior**: hasta dónde subió el precio sin poder quedarse.',
          '**Mecha inferior**: hasta dónde bajó sin poder quedarse.',
          '**Verde (alcista)**: cierra por encima de la apertura. **Roja (bajista)**: cierra por debajo.'
        ),
        p('Mira cómo cuentan una historia varias velas seguidas: velas grandes a favor del movimiento y velas pequeñas en contra indican quién manda.'),
        chart({
          title: 'Quién manda se ve en el tamaño de las velas', symbol: 'XAU/USD · H1', seed: 4,
          path: [[0, 30], [6, 55], [12, 48], [17, 70], [24, 62], [29, 84]],
          ann: [
            { t: 'txt', x: 3, y: 50, text: 'Velas grandes', c: 'up' },
            { t: 'txt', x: 9, y: 44, text: 'pequeñas', c: 'down', pos: 'b' },
            { t: 'txt', x: 20, y: 58, text: 'retroceso lento', c: 'muted', pos: 'b' },
          ],
          note: 'Subidas con velas grandes y retrocesos con velas pequeñas: los compradores tienen el control.',
        }),
        tip('Una mecha larga en una zona importante es una pista de **rechazo**: el precio fue, lo expulsaron y cerró lejos.'),
      ],
      takeaways: ['Cada vela = apertura, cierre, máximo y mínimo', 'Cuerpo = convicción; mecha = rechazo', 'El tamaño de las velas indica quién domina'],
    },
    {
      slug: 'tendencias',
      title: 'Tendencias: impulsos y retrocesos',
      minutes: 7,
      blocks: [
        p('El mercado es un **juego de suma cero**: por cada comprador hay un vendedor. Cuando el precio sube, ambos aceptan precios cada vez más altos… hasta que los compradores dejan de aceptarlos y el precio retrocede buscando un nivel donde vuelvan a comprar.'),
        p('Por eso el precio casi nunca sube en línea recta: avanza en **impulsos** y **retrocesos**, como una escalera.'),
        chart({
          title: 'Tendencia alcista paso a paso', symbol: 'EUR/USD · H4', seed: 2,
          path: [[0, 20], [8, 42], [13, 33], [22, 58], [27, 48], [36, 75], [41, 64], [50, 90]],
          ann: [
            { t: 'pt', x: 8, y: 42, text: 'Máximo', step: 0 },
            { t: 'pt', x: 13, y: 33, text: 'Mínimo', pos: 'b', step: 1 },
            { t: 'pt', x: 22, y: 58, text: 'HH', step: 2 },
            { t: 'pt', x: 27, y: 48, text: 'HL', pos: 'b', step: 3 },
            { t: 'pt', x: 36, y: 75, text: 'HH', step: 3 },
            { t: 'pt', x: 41, y: 64, text: 'HL', pos: 'b', step: 3 },
            { t: 'pt', x: 50, y: 90, text: 'HH', step: 3 },
          ],
          steps: [
            { to: 8, text: 'Impulso: los compradores empujan el precio hasta un máximo.' },
            { to: 13, text: 'Retroceso: algunos recogen beneficios y el precio baja hasta que vuelven a entrar compradores.' },
            { to: 22, text: 'Nuevo impulso que supera el máximo anterior: tenemos un máximo más alto (HH, Higher High).' },
            { to: 50, text: 'La escalera se repite: máximos y mínimos cada vez más altos (HH y HL). Eso es una tendencia alcista.' },
          ],
        }),
        h('Los tres estados del mercado'),
        ul(
          '**Alcista**: máximos y mínimos crecientes. Buscamos compras.',
          '**Bajista**: máximos y mínimos decrecientes. Buscamos ventas.',
          '**Rango (consolidación)**: el precio rebota entre dos niveles sin crear nuevos máximos ni mínimos. Hay indecisión.'
        ),
        chart({
          title: 'Rango: indecisión entre dos zonas', symbol: 'GBP/USD · H1', seed: 5,
          path: [[0, 50], [6, 70], [12, 40], [18, 69], [24, 41], [30, 70], [36, 42], [42, 68]],
          ann: [
            { t: 'zone', x1: 0, y1: 67, y2: 72, c: 'down', label: 'Techo del rango' },
            { t: 'zone', x1: 0, y1: 38, y2: 43, c: 'up', label: 'Suelo del rango', lb: true },
          ],
          note: 'En un rango no hay tendencia: o se opera en los extremos o se espera a que el precio salga con fuerza.',
        }),
        tip('Identificar la tendencia es el primer paso de cualquier análisis. Operar a favor de ella suma probabilidades.'),
      ],
      takeaways: ['El precio avanza en impulsos y retrocesos', 'Alcista = HH + HL; bajista = LH + LL', 'En rango no hay dirección: prudencia'],
    },
    {
      slug: 'temporalidades-y-su-impacto',
      title: 'Temporalidades y su impacto',
      minutes: 6,
      blocks: [
        p('Cada temporalidad es una lupa distinta sobre el mismo precio. Tres ideas clave:'),
        ol(
          '**Duración**: un movimiento de 100 velas tarda 100 horas en H1 y 100 minutos en M1. Opera en la temporalidad que encaja con tu tiempo.',
          '**Detalle**: al bajar de temporalidad ves lo que hay dentro de cada vela. Una sola vela diaria puede contener varias tendencias en M5.',
          '**Mismo significado**: un cambio de estructura se lee igual en diario que en M1… pero en temporalidades bajas hay más ruido y más trampas.'
        ),
        chart({
          title: 'Una sola vela diaria vista en M5', symbol: 'EUR/USD · M5', seed: 8, vol: 1.4,
          path: [[0, 40], [6, 34], [10, 30], [20, 60], [25, 52], [35, 80], [41, 72]],
          ann: [
            { t: 'zone', x1: 0, x2: 41, y1: 40, y2: 72, c: 'up', o: 0.07, label: 'Cuerpo de la vela diaria' },
            { t: 'h', y: 80, label: 'Máximo', c: 'muted' },
            { t: 'h', y: 30, label: 'Mínimo', c: 'muted' },
          ],
          note: 'En diario verías una vela verde con mecha inferior. En M5 ves una caída inicial, un rango y dos impulsos: mucha más información.',
        }),
        h('La jerarquía de temporalidades'),
        p('Imagina una familia: el **diario es el abuelo**, H4 el padre, M15 el hijo y M1 el nieto. Cuando hablan a la vez, manda el mayor. Si en H4 estás en una zona de compra, buscar ventas en M1 es ir contra el abuelo.'),
        tip('Regla práctica: temporalidad alta para la **dirección**, temporalidad baja para el **momento de entrada**.'),
      ],
      takeaways: ['Más baja la temporalidad, más detalle y más ruido', 'Los conceptos son iguales en todas', 'Manda la temporalidad mayor'],
    },
    {
      slug: 'soportes-y-resistencias-a-fondo',
      title: 'Soportes y resistencias a fondo',
      minutes: 8,
      blocks: [
        p('Son zonas donde el precio frena e incluso cambia de dirección, porque en el pasado se acumularon muchas órdenes. Funcionan como las plantas de un edificio: el suelo y el techo limitan el movimiento… y si subes de planta, **el antiguo techo pasa a ser tu suelo**.'),
        chart({
          title: 'Resistencia, ruptura y cambio de polaridad', symbol: 'XAU/USD · H4', seed: 11,
          path: [[0, 30], [8, 62], [12, 50], [18, 63], [23, 48], [29, 62], [33, 52], [40, 80], [45, 64.5], [52, 90]],
          mods: { 37: { o: 60, c: 71, h: 72, l: 59.5 } },
          ann: [
            { t: 'zone', x1: 0, x2: 39, y1: 59, y2: 64, c: 'down', label: 'Resistencia', step: 0 },
            { t: 'txt', x: 33, y: 76, text: 'Cierre con fuerza', c: 'up', step: 1 },
            { t: 'zone', x1: 40, y1: 59, y2: 64, c: 'up', label: 'Ahora soporte', lb: true, step: 2 },
          ],
          steps: [
            { to: 33, text: 'El precio choca tres veces con la misma zona: hay muchos vendedores esperando ahí. Es una resistencia.' },
            { to: 40, text: 'Por fin la rompe con una vela de cuerpo grande que cierra claramente por encima. Fíjate en el cierre, no en la mecha.' },
            { to: 45, text: 'El precio vuelve a la zona rota… y ahora rebota hacia arriba: la antigua resistencia actúa como soporte.' },
            { to: 52, text: 'La tendencia continúa. Este cambio de polaridad es una de las ideas más útiles del análisis técnico.' },
          ],
        }),
        h('Cómo marcarlos bien'),
        ol(
          'Empieza por temporalidades altas (semanal, diario). Sus zonas pesan más que las de M5.',
          'Márcalos sobre los **cuerpos de las velas** (los cierres), no sobre mechas sueltas.',
          'Usa **zonas**, no líneas finas: el precio rara vez respeta un número exacto.',
          'Truco para aprender: cambia el gráfico a "línea" en TradingView. Se ven mucho más claros.',
          'Menos es más: 3-5 zonas relevantes por gráfico.'
        ),
        h('Estrategia sencilla: rangos cada vez más finos'),
        p('Marca el soporte y la resistencia más cercanos en D1, luego en H4, H1, M15 y M5, **cada temporalidad con un color**. Los rangos se van estrechando. Cuando el precio rompe con fuerza un nivel de la temporalidad baja, el siguiente nivel marcado es su objetivo probable.'),
        tip('Los números redondos (1,1000 en EUR/USD, 2.000 $ en oro) también actúan como barreras psicológicas.'),
      ],
      takeaways: ['Zonas, no líneas; cuerpos, no mechas', 'Resistencia rota con fuerza → suele ser soporte', 'Las zonas de temporalidad alta pesan más'],
    },
    {
      slug: 'lineas-de-tendencia',
      title: 'Líneas de tendencia: el tercer toque',
      minutes: 6,
      blocks: [
        p('Una línea de tendencia es un soporte o resistencia **inclinado**: acompaña al precio como una cinta mecánica. En tendencia alcista va por debajo del precio uniendo mínimos; en bajista, por encima uniendo máximos.'),
        chart({
          title: 'Dos toques para trazar, el tercero para operar', symbol: 'BTC/USD · H4', seed: 7,
          path: [[0, 20], [7, 38], [11, 28], [19, 52], [24, 40], [32, 66], [37, 52], [45, 80]],
          ann: [
            { t: 'pt', x: 11, y: 28, text: '1', pos: 'b', step: 0 },
            { t: 'pt', x: 24, y: 40, text: '2', pos: 'b', step: 0 },
            { t: 'line', x1: 11, y1: 28, x2: 24, y2: 40, ext: true, c: 'accent', step: 1 },
            { t: 'pt', x: 37, y: 52, text: '3', pos: 'b', c: 'up', step: 2 },
          ],
          steps: [
            { to: 24, text: 'El precio deja dos mínimos crecientes claros (1 y 2).' },
            { to: 32, text: 'Unimos los dos mínimos y proyectamos la línea hacia la derecha.' },
            { to: 37, text: 'Tercer toque: el precio vuelve a la línea. Es la zona donde buscamos compras (con confirmación).' },
            { to: 45, text: 'Rebote y continuación. Si la línea se rompiera con fuerza, sería una señal de posible cambio de dirección.' },
          ],
        }),
        ul(
          'Cuantos más toques respeta, más relevante es.',
          'Las líneas muy inclinadas suelen romperse antes.',
          'Si coincide con líneas de otras temporalidades, la zona gana probabilidad (confluencia).'
        ),
        warn('Las líneas de tendencia son algo subjetivas: dos traders pueden trazarlas distinto. Úsalas como apoyo de la estructura, no como única razón para entrar.'),
      ],
      takeaways: ['2 toques para trazar, 3.º para operar', 'Alcista por debajo, bajista por encima', 'Suman más en confluencia'],
    },
    {
      slug: 'canales',
      title: 'Canales: navegar entre dos paredes',
      minutes: 7,
      blocks: [
        p('Un canal es una línea de tendencia con su **paralela**: el precio rebota de una pared a otra manteniendo la dirección, como el agua dentro de un canal. Te ayuda a prever dónde puede estar el próximo máximo o mínimo.'),
        p('Su uso más potente es tras un **cambio de tendencia**, para encontrar el mejor punto de entrada en el retroceso:'),
        chart({
          title: 'Canal tras un cambio de tendencia: el segundo toque', symbol: 'EUR/USD · H1', seed: 9,
          path: [[0, 40], [8, 70], [12, 60], [18, 82], [26, 55], [31, 68], [38, 45], [43, 58], [50, 36]],
          ann: [
            { t: 'h', y: 60, x1: 12, x2: 30, c: 'muted', label: 'Último mínimo', lx: 17, lb: true, step: 0 },
            { t: 'line', x1: 26, y1: 55, x2: 38, y2: 45, ext: true, c: 'accent', step: 1 },
            { t: 'line', x1: 31, y1: 68, x2: 43, y2: 58, ext: true, c: 'accent', dash: true, step: 1 },
            { t: 'trade', x: 43, x2: 50, entry: 57.5, sl: 62, tp: 38, step: 2 },
          ],
          steps: [
            { to: 26, text: 'La tendencia alcista pierde su último mínimo: el precio hace un mínimo más bajo. Posible cambio a bajista.' },
            { to: 38, text: 'Con dos mínimos trazamos la base del canal y arrastramos la paralela hasta el último máximo.' },
            { to: 43, text: 'Segundo toque de la pared superior: es la zona con más probabilidad para buscar la venta.' },
            { to: 50, text: 'El objetivo lógico es la pared contraria del canal.' },
          ],
        }),
        tip('En TradingView usa la herramienta "Canal paralelo" y quítale el relleno de fondo: el gráfico queda mucho más limpio.'),
      ],
      takeaways: ['Canal = línea de tendencia + paralela', 'Muy útil tras un cambio de tendencia', 'El segundo toque de la pared es la zona clave'],
    },
  ],
  quiz: [
    { q: 'En análisis técnico, un patrón que "funciona" significa…', options: ['Que acierta siempre', 'Que históricamente se repite con más probabilidad', 'Que lo usan los bancos', 'Que no necesita stop loss'], answer: 1, explain: 'Trabajamos con probabilidades basadas en repeticiones del pasado, nunca con certezas.' },
    { q: 'Un precio que rebota una y otra vez entre dos niveles sin nuevos máximos ni mínimos está…', options: ['En tendencia alcista', 'En tendencia bajista', 'En rango', 'Cerrado'], answer: 2, explain: 'Es una consolidación o rango: hay indecisión.' },
    { q: '¿Dónde se marcan mejor los soportes y resistencias?', options: ['En las mechas más extremas', 'Sobre los cuerpos de las velas, como zonas', 'Solo en M1', 'En números aleatorios'], answer: 1, explain: 'Los cierres (cuerpos) son más fiables, y siempre como zona.' },
    { q: 'Con una línea de tendencia, ¿cuándo buscamos la entrada?', options: ['En el primer toque', 'En el segundo', 'En el tercer toque', 'Nunca'], answer: 2, explain: 'Dos toques para trazarla, el tercero para operar.' },
    { q: 'Tras un cambio de tendencia a bajista, el mejor punto de venta según el canal suele ser…', options: ['La base del canal', 'El segundo toque de la pared superior', 'Cualquier vela roja', 'El máximo histórico'], answer: 1, explain: 'La pared superior del canal marca el retroceso óptimo para vender.' },
  ],
}

export const t2 = {
  id: 'tecnico-estructura',
  track: 'tecnico',
  title: 'Estructura de mercado',
  desc: 'Cambios de estructura válidos y falsos, estructuras dentro de estructuras, fuerza del precio y simetría.',
  lessons: [
    {
      slug: 'estructura-y-cambio-de-tendencia',
      title: 'Estructura y cambio de tendencia',
      minutes: 6,
      blocks: [
        p('La estructura son los **puntos clave** de una tendencia: sus máximos y mínimos. Funciona igual en divisas, oro, índices, acciones o cripto.'),
        w('structure'),
        p('Un **cambio de tendencia** ocurre cuando el precio rompe el último mínimo relevante (en tendencia alcista) o el último máximo relevante (en bajista).'),
        tip('¿Cuál es el "último mínimo"? El punto más bajo que dejó el retroceso **antes** de que el precio hiciera el último máximo más alto.'),
      ],
      takeaways: ['Estructura = máximos y mínimos relevantes', 'Romper el último mínimo/máximo cambia la tendencia', 'Se lee igual en todos los mercados'],
    },
    {
      slug: 'cambio-de-estructura-valido',
      title: 'Cambio de estructura válido vs falso',
      minutes: 7,
      blocks: [
        p('Aquí está la regla que más dinero ahorra: **para que haya cambio de estructura, el cuerpo de la vela tiene que cerrar más allá del nivel**. Una mecha que lo atraviesa no basta.'),
        chart({
          title: 'Válido: cierre de cuerpo por debajo del último mínimo', symbol: 'EUR/USD · H4', seed: 3,
          path: [[0, 30], [8, 55], [13, 44], [21, 70], [26, 58], [33, 78], [41, 50], [46, 61], [54, 40]],
          mods: { 38: { o: 63, c: 54, h: 63.5, l: 53.5 } },
          ann: [
            { t: 'h', y: 58, x1: 26, label: 'Último mínimo', c: 'muted', step: 0 },
            { t: 'txt', x: 38, y: 53.5, text: 'Cierra por debajo', c: 'down', pos: 'b', step: 1 },
            { t: 'arrow', x: 46, y: 63, dir: 'down', c: 'down', step: 2 },
          ],
          steps: [
            { to: 33, text: 'Tendencia alcista. El último mínimo relevante está en la línea gris.' },
            { to: 38, text: 'Una vela bajista de cuerpo grande cierra por debajo del último mínimo: cambio de estructura válido.' },
            { to: 46, text: 'Esperamos el retroceso para buscar ventas: el escenario alcista queda invalidado.' },
            { to: 54, text: 'El precio continúa a la baja.' },
          ],
        }),
        chart({
          title: 'Falso: solo la mecha atraviesa el nivel', symbol: 'EUR/USD · H4', seed: 3,
          path: [[0, 30], [8, 55], [13, 44], [21, 70], [26, 58], [33, 78], [38, 55.5], [47, 92]],
          mods: { 38: { o: 61, c: 60.2, l: 55.5, h: 62 } },
          ann: [
            { t: 'h', y: 58, x1: 26, label: 'Último mínimo', c: 'muted', step: 0 },
            { t: 'txt', x: 38, y: 55.5, text: 'Solo mecha', c: 'accent', pos: 'b', step: 1 },
            { t: 'pt', x: 47, y: 92, text: 'Nuevo HH', c: 'up', step: 2 },
          ],
          steps: [
            { to: 33, text: 'Misma situación de partida: tendencia alcista.' },
            { to: 38, text: 'El precio perfora el mínimo con la mecha, pero la vela cierra por encima. No hay cambio de estructura.' },
            { to: 47, text: 'Quien vendió antes del cierre acabó en stop: el precio hizo un nuevo máximo más alto. Espera siempre al cierre.' },
          ],
        }),
        warn('Mientras la vela no ha cerrado, no ha pasado nada. Decidir antes del cierre es una de las causas más habituales de stop loss.'),
      ],
      takeaways: ['Cambio de estructura = cierre de cuerpo más allá del nivel', 'Una mecha sola no confirma nada', 'Espera siempre al cierre de la vela'],
    },
    {
      slug: 'estructuras-dentro-de-estructuras',
      title: 'Estructuras dentro de estructuras',
      minutes: 8,
      blocks: [
        p('Dentro de cada tendencia de temporalidad alta hay tendencias más pequeñas: Mensual > Semanal > Diario > H4 > H1. Esto se usa para **encontrar el punto óptimo de entrada**: la temporalidad alta da la dirección y la baja confirma que el retroceso ha terminado.'),
        chart({
          title: '1) Temporalidad alta: cambio a alcista y retroceso', symbol: 'EUR/USD · D1', seed: 12,
          path: [[0, 85], [7, 62], [11, 72], [18, 48], [22, 58], [29, 30], [35, 55], [38, 64], [44, 46], [48, 53]],
          ann: [
            { t: 'h', y: 58, x1: 22, x2: 40, label: 'Último máximo', c: 'muted', lx: 30 },
            { t: 'txt', x: 36, y: 64, text: 'Cambio de estructura', c: 'up' },
            { t: 'zone', x1: 40, y1: 44, y2: 52, c: 'accent', label: 'Retroceso', lb: true },
          ],
          note: 'En diario, el precio rompe el último máximo de la tendencia bajista. Ahora buscamos compras en el retroceso… pero ¿dónde termina?',
        }),
        chart({
          title: '2) Temporalidad baja: el retroceso termina', symbol: 'EUR/USD · H1', seed: 13,
          path: [[0, 82], [6, 64], [10, 72], [17, 52], [21, 61], [28, 40], [33, 58], [37, 64], [41, 54], [50, 92]],
          ann: [
            { t: 'pt', x: 10, y: 72, text: 'LH', step: 0 },
            { t: 'pt', x: 21, y: 61, text: 'LH', step: 0 },
            { t: 'h', y: 61, x1: 21, x2: 38, c: 'muted', step: 1 },
            { t: 'txt', x: 34, y: 62, text: 'Rompe el último LH', c: 'up', step: 1 },
            { t: 'trade', x: 41, x2: 50, entry: 56, sl: 38.5, tp: 92, step: 2 },
          ],
          steps: [
            { to: 28, text: 'Dentro del retroceso diario, en H1 hay una pequeña tendencia bajista: máximos más bajos (LH).' },
            { to: 37, text: 'El precio rompe el último máximo más bajo en H1: la estructura interna cambia a alcista. El retroceso diario probablemente ha terminado.' },
            { to: 41, text: 'Entramos en el retroceso de H1, con el stop debajo del mínimo y el objetivo a favor de la tendencia diaria.' },
            { to: 50, text: 'Temporalidad alta y baja alineadas: más probabilidad y mejor ratio que entrando a ciegas en diario.' },
          ],
        }),
        tip('Puedes repetir el proceso bajando otra temporalidad más (M15, M5) para afinar la entrada, siempre respetando la dirección de la temporalidad mayor.'),
      ],
      takeaways: ['Temporalidad alta = dirección; baja = confirmación', 'Un cambio de estructura en la baja marca el fin del retroceso', 'Entrada más precisa = mejor ratio'],
    },
    {
      slug: 'fuerza-y-velocidad-del-precio',
      title: 'Fuerza y velocidad del precio',
      minutes: 6,
      blocks: [
        p('La fuerza de un movimiento es la **distancia recorrida en relación al tiempo**. Cuanto más recorre el precio en menos velas, más fuerza tiene ese bando.'),
        p('Hay un dicho clásico: **"lo que sube en escalera, baja en ascensor"** (y viceversa).'),
        chart({
          title: 'Impulsos rápidos, retrocesos lentos… hasta que cambia', symbol: 'NAS100 · H1', seed: 21,
          path: [[0, 20], [5, 45], [17, 35], [21, 60], [33, 50], [37, 72], [46, 66], [52, 74], [56, 70], [60, 76], [64, 50], [70, 44]],
          ann: [
            { t: 'txt', x: 2, y: 45, text: '5 velas', c: 'up', step: 0 },
            { t: 'txt', x: 11, y: 34, text: '12 velas', c: 'muted', pos: 'b', step: 0 },
            { t: 'txt', x: 54, y: 78, text: 'Pierde fuerza', c: 'accent', step: 1 },
            { t: 'txt', x: 63, y: 48, text: 'Caída rápida', c: 'down', pos: 'b', step: 2 },
          ],
          steps: [
            { to: 37, text: 'Los impulsos alcistas duran pocas velas y los retrocesos muchas: dominan los compradores. Vender aquí suele acabar en stop.' },
            { to: 60, text: 'Los nuevos máximos cuestan cada vez más: velas pequeñas y avances cortos. El impulso se agota.' },
            { to: 70, text: 'Caída rápida con velas grandes que rompe la estructura: ahora la fuerza está en los vendedores.' },
          ],
        }),
        tip('Mide impulsos y retrocesos con la herramienta "Rango de fecha y precio" de TradingView: verás de un vistazo quién tiene el control.'),
      ],
      takeaways: ['Fuerza = distancia / tiempo', 'Impulso rápido + retroceso lento = tendencia sana', 'Avances que cuestan = posible agotamiento'],
    },
    {
      slug: 'simetria',
      title: 'Simetría: el mercado se repite',
      minutes: 5,
      blocks: [
        p('Como el gráfico refleja el comportamiento de personas, es habitual que los movimientos tengan **tamaños y duraciones parecidos**. La simetría no es una señal por sí sola, pero es una confluencia más para proyectar objetivos.'),
        chart({
          title: 'Impulsos y retrocesos de medida similar', symbol: 'XAU/USD · H4', seed: 6,
          path: [[0, 20], [8, 50], [14, 38], [22, 68], [28, 56], [36, 86]],
          ann: [
            { t: 'zone', x1: 0, x2: 8, y1: 20, y2: 50, c: 'up', o: 0.1, label: '+30 en 8 velas', step: 0 },
            { t: 'zone', x1: 8, x2: 14, y1: 38, y2: 50, c: 'down', o: 0.12, label: '−12', lb: true, step: 0 },
            { t: 'zone', x1: 14, x2: 22, y1: 38, y2: 68, c: 'up', o: 0.1, label: '+30 en 8 velas', step: 1 },
            { t: 'zone', x1: 22, x2: 28, y1: 56, y2: 68, c: 'down', o: 0.12, label: '−12', lb: true, step: 1 },
            { t: 'zone', x1: 28, x2: 36, y1: 56, y2: 86, c: 'up', o: 0.08, dash: true, label: 'Proyección', step: 2 },
          ],
          steps: [
            { to: 14, text: 'Medimos el primer impulso (+30) y su retroceso (−12).' },
            { to: 28, text: 'El segundo impulso y retroceso tienen casi la misma medida y duración.' },
            { to: 36, text: 'Proyectamos un tercer impulso similar: nos da un objetivo razonable para el take profit.' },
          ],
        }),
      ],
      takeaways: ['Los movimientos tienden a parecerse', 'Úsala para proyectar objetivos', 'Es una confluencia, no una señal'],
    },
  ],
  quiz: [
    { q: 'Para que un cambio de estructura sea válido…', options: ['Basta con que la mecha cruce el nivel', 'El cuerpo de la vela debe cerrar más allá del nivel', 'Tienen que pasar 24 horas', 'Hay que ver un doji'], answer: 1, explain: 'Solo el cierre del cuerpo confirma la ruptura.' },
    { q: 'En tendencia alcista, el "último mínimo" relevante es…', options: ['El mínimo histórico', 'El mínimo que dejó el retroceso antes del último máximo más alto', 'Cualquier vela roja', 'El precio de apertura del día'], answer: 1, explain: 'Es el punto que, si se rompe, cambia la estructura.' },
    { q: 'Temporalidad alta alcista y en H1 el retroceso cambia a alcista. Esto sugiere…', options: ['Vender', 'Que el retroceso probablemente terminó: buscar compras', 'Que no hay que operar nunca', 'Que el broker falla'], answer: 1, explain: 'Temporalidades alineadas = más probabilidad.' },
    { q: 'Impulsos alcistas rápidos y retrocesos lentos indican…', options: ['Dominio vendedor', 'Dominio comprador', 'Rango', 'Nada'], answer: 1, explain: 'Lo que sube en escalera baja en ascensor… y al revés.' },
    { q: 'La simetría sirve sobre todo para…', options: ['Entrar sin confirmación', 'Proyectar objetivos como confluencia', 'Eliminar el stop', 'Elegir broker'], answer: 1, explain: 'Es una confluencia más para estimar hasta dónde puede llegar el precio.' },
  ],
}
