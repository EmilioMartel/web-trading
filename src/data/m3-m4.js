import { p, h, ul, ol, tip, warn, ex, f, w, table } from './blocks.js'

export const m3 = {
  id: 'gestion-del-riesgo',
  level: 'Intermedio',
  title: 'Gestión del riesgo',
  desc: 'El módulo más importante del curso. Aquí se decide si sobrevives en el mercado el tiempo suficiente para ser rentable.',
  lessons: [
    {
      slug: 'regla-del-1-por-ciento',
      title: 'La regla del 1%',
      minutes: 5,
      blocks: [
        p('Los traders profesionales no se obsesionan con cuánto pueden ganar, sino con **cuánto pueden perder**. La regla más sencilla y potente: **no arriesgues más del 1% de tu cuenta en una sola operación** (0,5%–2% según tu experiencia y sistema).'),
        ex('Ejemplo', 'Cuenta de 5.000 €. Riesgo del 1% = 50 € por operación. Aunque pierdas 10 operaciones seguidas (pasa, incluso con buenos sistemas), tu cuenta seguiría en torno a 4.520 €.'),
        p('Compara con alguien que arriesga el 10%: tras 10 pérdidas seguidas le quedarían unos 1.740 €. Ha perdido el 65% de la cuenta.'),
        tip('Arriesgar poco no es de cobardes: es lo que te permite **sobrevivir a las rachas malas** y seguir operando cuando llegan las buenas.'),
        h('Límites diarios y semanales'),
        ul(
          'Pérdida máxima diaria: por ejemplo, 2-3% o 2 operaciones perdedoras → cierras la plataforma.',
          'Pérdida máxima semanal: por ejemplo, 5% → paras y revisas tu diario.'
        ),
      ],
      takeaways: ['Arriesga 0,5–2% por operación (1% es un buen punto de partida)', 'Sobrevivir a las rachas es la prioridad', 'Fija límites de pérdida diaria y semanal'],
    },
    {
      slug: 'stop-loss-y-take-profit',
      title: 'Dónde colocar el stop loss y el take profit',
      minutes: 6,
      blocks: [
        p('El stop loss no se coloca "a 20 pips porque sí". Se coloca en el **punto donde tu idea deja de ser válida**.'),
        ul(
          'En una compra: **por debajo** del mínimo relevante o de la zona de soporte, con un pequeño margen.',
          'En una venta: **por encima** del máximo relevante o de la zona de resistencia.',
          'Añade un margen para el spread y el "ruido" (por ejemplo, una fracción del ATR).'
        ),
        warn('Nunca muevas el stop loss **en contra** para "darle más espacio". Si el precio llega a tu stop, tu análisis estaba mal o el mercado ha cambiado. Acepta la pérdida pequeña.'),
        h('Take profit'),
        ul(
          'En la **siguiente zona de soporte/resistencia** relevante.',
          'En un múltiplo fijo del riesgo (por ejemplo 2R: el doble de lo que arriesgas).',
          'Cierres parciales: cerrar parte en 1R–2R y dejar correr el resto con stop en break-even.'
        ),
        tip('Primero decide dónde va el stop según el gráfico. **Después** calcula el tamaño de posición para que esa distancia equivalga a tu 1%. Nunca al revés.'),
      ],
      takeaways: ['El stop va donde tu idea queda invalidada', 'Jamás alejes el stop', 'TP en zonas lógicas o múltiplos de R'],
    },
    {
      slug: 'ratio-riesgo-beneficio',
      title: 'Ratio riesgo/beneficio y expectativa',
      minutes: 8,
      blocks: [
        p('El **ratio riesgo/beneficio (R:R)** compara lo que arriesgas con lo que puedes ganar. Si arriesgas 50 € para ganar 100 €, tu ratio es **1:2**.'),
        w('rr'),
        h('No necesitas acertar mucho'),
        p('Con un buen ratio puedes ser rentable **acertando menos de la mitad de las veces**. La tasa de acierto mínima para no perder dinero es:'),
        f('Acierto mínimo = 1 / (1 + R)'),
        table(['Ratio', 'Acierto mínimo para break-even'], [
          ['1:1', '50%'], ['1:1,5', '40%'], ['1:2', '33,3%'], ['1:3', '25%'],
        ]),
        h('La expectativa matemática'),
        f('Expectativa (en R) = (% acierto × R medio ganado) − (% fallo × 1)'),
        ex('Ejemplo', 'Aciertas el 45% con ratio 1:2 → 0,45 × 2 − 0,55 × 1 = **+0,35R por operación**. Si arriesgas 50 €, ganas de media 17,50 € por operación a largo plazo.'),
        warn('Un ratio enorme (1:10) no es mejor por sí mismo: normalmente baja muchísimo la tasa de acierto. Lo que importa es la **combinación** de ambas.'),
      ],
      takeaways: ['R:R = beneficio potencial / riesgo', 'Con 1:2 basta acertar más del 33%', 'Mide tu sistema por su expectativa, no por su % de acierto'],
    },
    {
      slug: 'tamano-de-posicion',
      title: 'Cómo calcular el tamaño de posición',
      minutes: 8,
      blocks: [
        p('Esta es la fórmula que une todo lo anterior. Sabes cuánto quieres arriesgar (1%) y dónde va tu stop (distancia en pips). Solo falta saber **cuántos lotes** abrir.'),
        f('Lotes = Riesgo en dinero / (Distancia del stop en pips × Valor del pip por lote)'),
        ex('Ejemplo EUR/USD', 'Cuenta 10.000 $, riesgo 1% = 100 $. Stop a 25 pips. Valor del pip por lote estándar = 10 $. Lotes = 100 / (25 × 10) = **0,40 lotes**.'),
        ex('Ejemplo oro', 'Cuenta 10.000 $, riesgo 100 $. Stop a 50 pips (5 $ de precio). En oro 1 lote = 10 $ por pip. Lotes = 100 / (50 × 10) = **0,20 lotes**.'),
        p('Pruébalo con la calculadora:'),
        w('lotcalc'),
        tip('Fíjate en que el mismo 1% de riesgo da tamaños muy distintos según la distancia del stop. **Stop amplio = menos lotes; stop ajustado = más lotes.** El riesgo en euros es siempre el mismo.'),
      ],
      takeaways: ['Primero el stop, después el tamaño', 'Lotes = riesgo / (pips × valor pip)', 'El riesgo en dinero se mantiene constante'],
    },
    {
      slug: 'drawdown',
      title: 'Drawdown: la matemática de las pérdidas',
      minutes: 5,
      blocks: [
        p('El **drawdown** es la caída de tu cuenta desde su máximo. Y aquí aparece una asimetría cruel: **recuperar cuesta más que perder**.'),
        w('drawdown'),
        p('Si pierdes el 50%, necesitas ganar un **100%** solo para volver a donde estabas. Por eso el objetivo número uno es **evitar drawdowns profundos**.'),
        f('Ganancia necesaria = pérdida / (1 − pérdida)'),
        tip('Con un riesgo del 1% por operación, un drawdown del 10% requiere unas 10 pérdidas seguidas. Con un riesgo del 5%, bastan 2.'),
      ],
      takeaways: ['Recuperar una pérdida siempre exige un % mayor', '-50% necesita +100%', 'Riesgo bajo = drawdowns controlados'],
    },
  ],
  quiz: [
    { q: 'Con una cuenta de 8.000 € y un riesgo del 1%, ¿cuánto puedes perder como máximo en una operación?', options: ['8 €', '80 €', '800 €', '1 €'], answer: 1, explain: '1% de 8.000 € = 80 €.' },
    { q: 'Con un ratio 1:2, ¿cuál es la tasa de acierto mínima para no perder dinero?', options: ['50%', '66%', '33,3%', '20%'], answer: 2, explain: '1 / (1 + 2) = 33,3%.' },
    { q: 'Cuenta 10.000 $, riesgo 100 $, stop de 20 pips en EUR/USD (10 $/pip por lote). ¿Tamaño?', options: ['0,05 lotes', '0,50 lotes', '5 lotes', '2 lotes'], answer: 1, explain: '100 / (20 × 10) = 0,5 lotes.' },
    { q: 'El precio se acerca a tu stop loss. ¿Qué haces?', options: ['Lo alejo para darle espacio', 'Lo dejo donde está: mi idea queda invalidada ahí', 'Abro otra operación para promediar', 'Quito el stop'], answer: 1, explain: 'Mover el stop en contra convierte pérdidas pequeñas en grandes.' },
    { q: 'Si tu cuenta cae un 50%, ¿qué rentabilidad necesitas para recuperarla?', options: ['50%', '75%', '100%', '150%'], answer: 2, explain: '0,5 / (1 − 0,5) = 100%.' },
  ],
}

export const m4 = {
  id: 'indicadores',
  level: 'Intermedio',
  title: 'Indicadores y herramientas',
  desc: 'Medias móviles, RSI, Fibonacci, ATR y líneas de tendencia: herramientas de apoyo, no bolas de cristal.',
  lessons: [
    {
      slug: 'medias-moviles',
      title: 'Medias móviles',
      minutes: 7,
      blocks: [
        p('Una media móvil calcula el **precio medio de las últimas N velas** y lo dibuja como una línea. Suaviza el ruido y muestra la dirección de fondo.'),
        ul(
          '**SMA (simple)**: todas las velas pesan igual.',
          '**EMA (exponencial)**: da más peso a las velas recientes; reacciona antes.'
        ),
        w('ma'),
        h('Usos prácticos'),
        ul(
          '**Filtro de tendencia**: precio por encima de la EMA 200 en diario → busco solo compras.',
          '**Soporte/resistencia dinámico**: en tendencias sanas, el precio suele retroceder a la EMA 20 o 50.',
          '**Cruces**: EMA rápida cruza la lenta. Llegan tarde, úsalos como confirmación, no como señal única.'
        ),
        warn('En mercados laterales las medias móviles dan muchas señales falsas. Funcionan en tendencia.'),
      ],
      takeaways: ['Media más corta = más sensible; más larga = más lenta', 'EMA 200 = filtro clásico de tendencia', 'En rango, las medias engañan'],
    },
    {
      slug: 'rsi-y-divergencias',
      title: 'RSI y divergencias',
      minutes: 7,
      blocks: [
        p('El **RSI (Índice de Fuerza Relativa)** es un oscilador que va de 0 a 100 y mide la fuerza de los movimientos recientes (por defecto, 14 periodos).'),
        ul(
          'Por encima de **70**: zona de sobrecompra.',
          'Por debajo de **30**: zona de sobreventa.',
          'Nivel **50**: frontera entre dominio comprador y vendedor.'
        ),
        warn('"Sobrecomprado" **no significa** "va a caer". En tendencias fuertes el RSI puede estar por encima de 70 durante semanas. Vender solo por eso es de los errores más comunes.'),
        h('Divergencias'),
        p('La señal más útil del RSI aparece cuando **el precio y el indicador no están de acuerdo**:'),
        ul(
          '**Divergencia bajista**: el precio marca un máximo más alto, pero el RSI marca un máximo más bajo → el impulso se debilita.',
          '**Divergencia alcista**: el precio marca un mínimo más bajo, pero el RSI marca un mínimo más alto.'
        ),
        tip('Una divergencia en una zona importante de resistencia/soporte es una confluencia interesante. Sola, no es suficiente para entrar.'),
      ],
      takeaways: ['RSI mide la fuerza del movimiento', 'Sobrecompra ≠ señal de venta', 'Las divergencias avisan de pérdida de impulso'],
    },
    {
      slug: 'fibonacci',
      title: 'Retrocesos de Fibonacci',
      minutes: 7,
      blocks: [
        p('Tras un impulso, el precio suele **retroceder** antes de continuar. Los niveles de Fibonacci ayudan a estimar **hasta dónde** podría llegar ese retroceso.'),
        w('fib'),
        ul(
          'Niveles más usados: **38,2%, 50% y 61,8%**. La zona 61,8%–78,6% es muy popular (a veces llamada "golden pocket" o zona de descuento).',
          'En una tendencia alcista se traza **del mínimo al máximo** del impulso; en bajista, del máximo al mínimo.'
        ),
        tip('Fibonacci funciona mejor cuando un nivel **coincide** con otra cosa: un soporte previo, una EMA, un número redondo. Eso es una **confluencia**.'),
      ],
      takeaways: ['Se traza sobre un impulso claro', '38,2 / 50 / 61,8% son los niveles clave', 'Úsalo como confluencia, no como señal aislada'],
    },
    {
      slug: 'atr-y-volatilidad',
      title: 'ATR y volatilidad',
      minutes: 5,
      blocks: [
        p('El **ATR (Average True Range)** mide cuánto se mueve un activo de media por vela. No indica dirección, solo **volatilidad**.'),
        ex('Ejemplo', 'Si el ATR diario del EUR/USD es de 70 pips, un stop de 10 pips en el diario es ridículamente pequeño: el ruido normal te lo saltará. Si el ATR del oro es de 30 $, poner un objetivo de 100 $ en el día es poco realista.'),
        h('Usos'),
        ul(
          '**Colocar stops**: más allá del nivel técnico + 0,5–1 ATR de margen.',
          '**Objetivos realistas**: ¿cuánto puede recorrer el precio hoy?',
          '**Detectar cambios de régimen**: ATR creciente = mercado más agitado → quizá reducir tamaño.'
        ),
      ],
      takeaways: ['ATR = volatilidad media, no dirección', 'Útil para stops y objetivos realistas', 'Más volatilidad → considera reducir tamaño'],
    },
    {
      slug: 'lineas-de-tendencia-y-canales',
      title: 'Líneas de tendencia y canales',
      minutes: 5,
      blocks: [
        p('Una **línea de tendencia** une mínimos crecientes (tendencia alcista) o máximos decrecientes (bajista). Un **canal** añade una paralela en el otro extremo.'),
        ol(
          'Necesitas al menos **2 puntos** para trazarla y un **3.º** para validarla.',
          'Traza sobre los cuerpos o las mechas, pero sé coherente.',
          'Cuanto más inclinada, menos sostenible suele ser.'
        ),
        warn('Las líneas de tendencia son subjetivas: dos traders pueden trazarlas distinto. La estructura (HH/HL) es más objetiva; úsala como referencia principal.'),
      ],
      takeaways: ['2 puntos para trazar, 3 para validar', 'Las líneas muy inclinadas se rompen antes', 'La estructura manda sobre las líneas'],
    },
  ],
  quiz: [
    { q: 'El precio está por encima de la EMA 200 en el diario. Un uso típico es…', options: ['Buscar solo ventas', 'Buscar preferentemente compras', 'No operar', 'Cerrar todo'], answer: 1, explain: 'La EMA 200 actúa como filtro de tendencia: por encima, se favorecen compras.' },
    { q: 'RSI en 78 durante una tendencia alcista fuerte significa…', options: ['Hay que vender ya', 'El impulso es fuerte; no es por sí solo una señal de venta', 'El mercado va a cerrar', 'El broker falla'], answer: 1, explain: 'Sobrecompra no implica giro; en tendencia puede mantenerse mucho tiempo.' },
    { q: 'Precio hace un máximo más alto, RSI un máximo más bajo. Es…', options: ['Divergencia alcista', 'Divergencia bajista', 'Cruce dorado', 'Nada'], answer: 1, explain: 'El impulso no acompaña al nuevo máximo: divergencia bajista.' },
    { q: 'En una tendencia alcista, Fibonacci se traza…', options: ['Del máximo al mínimo', 'Del mínimo al máximo del impulso', 'Entre dos velas cualesquiera', 'Solo en M1'], answer: 1, explain: 'Del inicio (mínimo) al final (máximo) del impulso alcista.' },
    { q: '¿Qué mide el ATR?', options: ['La dirección de la tendencia', 'La volatilidad media', 'El volumen', 'El sentimiento de Instagram'], answer: 1, explain: 'El ATR mide el rango medio de las velas: volatilidad.' },
  ],
}
