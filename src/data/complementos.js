/* =========================================================
   COMPLEMENTOS · Indicadores, fundamental, psicología y sistema
   ========================================================= */
import { p, h, ul, ol, tip, warn, ex, f, w, table } from './blocks.js'

export const indicadores = {
  id: 'indicadores',
  track: 'complementos',
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

export const fundamental = {
  id: 'analisis-fundamental',
  track: 'complementos',
  title: 'Análisis fundamental',
  desc: 'Qué mueve realmente a las divisas, el oro y los índices: bancos centrales, datos macro y correlaciones.',
  lessons: [
    {
      slug: 'que-mueve-las-divisas',
      title: 'Qué mueve las divisas',
      minutes: 7,
      blocks: [
        p('A largo plazo, el valor de una moneda depende de la **salud económica** de su país y, sobre todo, de los **tipos de interés** que fija su banco central.'),
        h('Los bancos centrales'),
        table(['Banco central', 'Moneda'], [
          ['Reserva Federal (Fed)', 'USD'], ['Banco Central Europeo (BCE)', 'EUR'], ['Banco de Inglaterra (BoE)', 'GBP'], ['Banco de Japón (BoJ)', 'JPY'],
        ]),
        p('Regla general: **tipos de interés más altos (o expectativas de subidas)** atraen capital y **fortalecen la moneda**. Recortes (o expectativas de recortes) la debilitan.'),
        h('Los datos que más importan'),
        ul(
          '**Inflación (IPC / CPI)**: guía las decisiones de tipos.',
          '**Empleo**: en EE. UU., el informe de empleo no agrícola (**NFP**), normalmente el primer viernes de cada mes.',
          '**PIB**: crecimiento de la economía.',
          '**PMI**: encuestas de actividad; anticipan cómo va la economía.'
        ),
        tip('Lo que mueve el precio no es el dato en sí, sino **la diferencia entre el dato y lo que esperaba el mercado** (el consenso).'),
      ],
      takeaways: ['Los tipos de interés son el gran motor de las divisas', 'Inflación y empleo guían a los bancos centrales', 'El mercado reacciona a la sorpresa, no al dato'],
    },
    {
      slug: 'calendario-economico',
      title: 'El calendario económico y operar noticias',
      minutes: 6,
      blocks: [
        p('El calendario económico (por ejemplo en Forex Factory, Investing.com o TradingView) muestra cuándo se publican los datos y su **impacto esperado** (bajo, medio, alto).'),
        h('Rutina recomendada'),
        ol(
          'El domingo o el lunes, revisa las noticias de **alto impacto** de la semana para tus activos.',
          'Cada mañana, comprueba si hay noticias importantes en las próximas horas.',
          'Evita abrir operaciones nuevas **15–30 minutos antes y después** de noticias de alto impacto.'
        ),
        warn('En noticias fuertes (NFP, IPC de EE. UU., decisiones de la Fed) el spread se dispara y el precio puede saltar tu stop con **deslizamiento (slippage)**. Operar la noticia no es para principiantes.'),
        tip('Si ya estás dentro con beneficio antes de una noticia fuerte, plantéate mover el stop a break-even o cerrar parcialmente.'),
      ],
      takeaways: ['Revisa el calendario cada semana y cada día', 'Evita entrar justo antes de noticias de alto impacto', 'Spread y slippage aumentan en las noticias'],
    },
    {
      slug: 'correlaciones-oro-dolar-indices',
      title: 'Oro, dólar e índices: correlaciones',
      minutes: 7,
      blocks: [
        p('Los mercados están conectados. Entender cómo se relacionan te ayuda a evitar errores y a encontrar confluencias.'),
        h('El índice dólar (DXY)'),
        p('Mide la fuerza del dólar frente a una cesta de divisas (el euro pesa mucho). Normalmente:'),
        ul(
          'DXY sube → **EUR/USD y GBP/USD suelen bajar**.',
          'DXY sube → **el oro suele sufrir** (se paga en dólares).',
          'Tipos de interés reales (descontando inflación) al alza → presión bajista para el oro.'
        ),
        h('Risk-on vs risk-off'),
        table(['Clima de mercado', 'Suele beneficiar a', 'Suele perjudicar a'], [
          ['Risk-on (optimismo)', 'Índices (NAS100, US500), AUD, NZD', 'JPY, CHF'],
          ['Risk-off (miedo)', 'Oro, JPY, CHF, a veces USD', 'Índices, AUD, NZD'],
        ]),
        warn('Si compras EUR/USD, GBP/USD y vendes USD/CHF a la vez, en realidad tienes **tres veces la misma apuesta** (contra el dólar). Tu riesgo real no es 1%, es casi 3%.'),
        tip('Las correlaciones cambian con el tiempo. Úsalas como contexto, no como regla fija.'),
      ],
      takeaways: ['DXY fuerte suele pesar sobre EUR/USD y el oro', 'Risk-on favorece índices; risk-off favorece refugios', 'Cuidado con duplicar riesgo en pares correlacionados'],
    },
  ],
  quiz: [
    { q: 'Si el mercado empieza a esperar subidas de tipos de la Fed, el USD tiende a…', options: ['Debilitarse', 'Fortalecerse', 'No cambiar', 'Desaparecer'], answer: 1, explain: 'Tipos más altos atraen capital y fortalecen la moneda.' },
    { q: 'El precio reacciona sobre todo a…', options: ['El dato publicado sin más', 'La diferencia entre el dato y lo esperado', 'La hora del día', 'El color del calendario'], answer: 1, explain: 'La sorpresa respecto al consenso es lo que mueve el precio.' },
    { q: '¿Qué conviene hacer justo antes de un NFP si eres principiante?', options: ['Entrar con el doble de tamaño', 'Evitar abrir operaciones nuevas', 'Quitar el stop', 'Operar en exóticos'], answer: 1, explain: 'Spread alto y slippage: mejor esperar.' },
    { q: 'Si el DXY sube con fuerza, el oro normalmente…', options: ['Sube', 'Tiende a bajar', 'No se ve afectado nunca', 'Cierra'], answer: 1, explain: 'El oro cotiza en dólares y suele tener correlación inversa con el DXY.' },
    { q: 'En un entorno de miedo (risk-off), ¿cuál suele beneficiarse?', options: ['NAS100', 'AUD', 'El oro', 'Todos los índices'], answer: 2, explain: 'El oro es un activo refugio clásico.' },
  ],
}

export const psicologia = {
  id: 'psicologia',
  track: 'complementos',
  title: 'Psicología del trader',
  desc: 'La estrategia es el 20%. El otro 80% es gestionar tus emociones y tener la disciplina de seguir tu plan.',
  lessons: [
    {
      slug: 'emociones-en-el-trading',
      title: 'Miedo, avaricia y FOMO',
      minutes: 6,
      blocks: [
        p('El mercado es un espejo: amplifica tus emociones. Estos son los enemigos más comunes:'),
        table(['Emoción', 'Cómo se manifiesta', 'Antídoto'], [
          ['Miedo', 'Cerrar ganadoras demasiado pronto, no entrar en setups válidos', 'Arriesgar una cantidad que te deje dormir'],
          ['Avaricia', 'No recoger beneficios, aumentar tamaño tras ganar', 'TP y reglas de gestión definidos antes de entrar'],
          ['FOMO', 'Entrar tarde en un movimiento "que se escapa"', 'Si no está en tu plan, no existe. Habrá otra oportunidad'],
          ['Venganza', 'Operar para "recuperar" tras una pérdida', 'Límite diario de pérdidas y cerrar la plataforma'],
        ]),
        tip('Si notas el corazón acelerado mirando una operación, casi siempre significa que **estás arriesgando demasiado**.'),
        warn('El "revenge trading" (operar por venganza) es la causa número uno de los días catastróficos. Una mala operación no hace daño; diez seguidas intentando recuperarla, sí.'),
      ],
      takeaways: ['Identifica qué emoción te domina', 'Tamaño de posición pequeño = mente tranquila', 'Tras una pérdida fuerte, para'],
    },
    {
      slug: 'disciplina-y-rutina',
      title: 'Disciplina y rutina',
      minutes: 5,
      blocks: [
        p('La consistencia viene de hacer **lo mismo, bien, muchas veces**. Una rutina elimina decisiones impulsivas.'),
        h('Ejemplo de rutina diaria'),
        ol(
          '**Antes de la sesión (15 min)**: calendario económico, marcar zonas en D1/H4, escribir escenarios.',
          '**Durante la sesión**: solo actuar si aparece un setup de tu plan. Si no aparece, no se opera.',
          '**Después (10 min)**: registrar operaciones en el diario, captura del gráfico, cómo te sentiste.'
        ),
        tip('No operar también es una posición. Los mejores días a veces son aquellos en los que **no abres nada** porque el mercado no te dio tu setup.'),
        p('Cuida también lo básico: dormir, alimentarte y no operar cansado o enfadado. Tu cerebro es tu herramienta principal.'),
      ],
      takeaways: ['La rutina reduce decisiones impulsivas', 'Sin setup, no hay operación', 'El descanso también es parte del trading'],
    },
    {
      slug: 'diario-de-trading',
      title: 'El diario de trading',
      minutes: 5,
      blocks: [
        p('El diario es la herramienta que convierte la experiencia en **aprendizaje**. Sin datos, solo tienes sensaciones.'),
        h('Qué apuntar en cada operación'),
        ul(
          'Fecha, activo, dirección (compra/venta) y temporalidad.',
          'Setup utilizado y motivos de entrada (captura del gráfico).',
          'Entrada, stop, take profit, tamaño y riesgo en %.',
          'Resultado en R (por ejemplo +2R, −1R).',
          'Estado emocional y si respetaste el plan (sí/no).'
        ),
        tip('Revisa el diario **cada semana**. Busca patrones: ¿pierdes más los viernes? ¿Tu setup A funciona mejor que el B? ¿Rompes reglas tras ganar?'),
      ],
      takeaways: ['Registra todas las operaciones, también las malas', 'Mide en R para comparar', 'Revisión semanal obligatoria'],
    },
  ],
  quiz: [
    { q: 'Acabas de perder 2 operaciones y sientes que "tienes que recuperar". Lo correcto es…', options: ['Duplicar el tamaño', 'Parar y respetar el límite diario', 'Operar otro activo al azar', 'Quitar el stop'], answer: 1, explain: 'Es la trampa del revenge trading. Para.' },
    { q: 'Entrar tarde en un movimiento porque "se escapa" es…', options: ['Disciplina', 'FOMO', 'Gestión del riesgo', 'Análisis fundamental'], answer: 1, explain: 'Fear Of Missing Out: miedo a perderse el movimiento.' },
    { q: 'Si no aparece tu setup en todo el día…', options: ['Buscas algo parecido', 'No operas', 'Entras en cualquier par', 'Bajas de temporalidad hasta encontrar algo'], answer: 1, explain: 'No operar también es una decisión profesional.' },
    { q: '¿Para qué sirve principalmente el diario de trading?', options: ['Para presumir', 'Para convertir la experiencia en datos y mejorar', 'Para el broker', 'No sirve'], answer: 1, explain: 'Sin registro no puedes medir ni corregir.' },
    { q: 'Te late el corazón muy rápido mirando una operación abierta. Probablemente…', options: ['Es buena señal', 'Estás arriesgando demasiado', 'El mercado va a girar', 'Tienes que añadir más'], answer: 1, explain: 'La ansiedad suele indicar un tamaño de posición excesivo.' },
  ],
}

export const sistemaProfesional = {
  id: 'sistema-profesional',
  track: 'complementos',
  title: 'Tu sistema profesional',
  desc: 'Plan de trading, backtesting, estadísticas y cómo dar el paso de la demo a la cuenta real con cabeza.',
  lessons: [
    {
      slug: 'plan-de-trading',
      title: 'El plan de trading',
      minutes: 7,
      blocks: [
        p('Un plan de trading es un **documento escrito** que define exactamente cómo operas. Si no está escrito, no es un plan: es una intención.'),
        h('Qué debe incluir'),
        ol(
          '**Activos** que operas (ej.: EUR/USD, XAU/USD, NAS100).',
          '**Horario**: qué sesiones y cuántas horas.',
          '**Temporalidades**: contexto, zona y gatillo.',
          '**Setups**: condiciones exactas de entrada (tu checklist).',
          '**Gestión**: dónde va el stop, objetivos, parciales, break-even.',
          '**Riesgo**: % por operación, límite diario, semanal y mensual.',
          '**Reglas personales**: no operar cansado, tras 2 pérdidas paro, etc.',
          '**Revisión**: cuándo y cómo analizas tu diario.'
        ),
        tip('Imprime una hoja resumen y tenla delante mientras operas. Antes de cada entrada: ¿cumple el plan? Sí → adelante. No → no hay operación.'),
      ],
      takeaways: ['Si no está escrito, no es un plan', 'Define activos, horario, setups, gestión y riesgo', 'Consulta el plan antes de cada entrada'],
    },
    {
      slug: 'backtesting-y-estadisticas',
      title: 'Backtesting y estadísticas',
      minutes: 8,
      blocks: [
        p('El **backtesting** consiste en aplicar tu estrategia sobre datos históricos para ver cómo habría funcionado. Puedes hacerlo manualmente con el modo "Replay" de TradingView.'),
        h('Cómo hacerlo bien'),
        ol(
          'Define reglas **objetivas** antes de empezar (si dudas, no cuenta).',
          'Registra **al menos 100 operaciones** (idealmente más) en distintos meses y condiciones.',
          'Anota cada operación en una hoja: fecha, setup, resultado en R.',
          'No modifiques las reglas a mitad del test para "salvar" resultados.'
        ),
        h('Métricas clave'),
        table(['Métrica', 'Qué te dice'], [
          ['Tasa de acierto', '% de operaciones ganadoras'],
          ['R medio ganado', 'Cuánto ganas de media cuando aciertas'],
          ['Expectativa (R)', 'Beneficio medio por operación, la métrica reina'],
          ['Máximo drawdown', 'Peor caída desde un máximo: ¿lo soportarías?'],
          ['Racha perdedora máx.', 'Prepárate mentalmente para ella (y más)'],
        ]),
        p('Juega con el simulador para ver cómo se comporta un sistema con distintas estadísticas:'),
        w('montecarlo'),
        warn('Incluso un sistema con expectativa positiva tendrá **rachas perdedoras largas**. El simulador te lo muestra: esa es la razón de arriesgar poco.'),
      ],
      takeaways: ['Mínimo 100 operaciones de muestra', 'La expectativa en R es la métrica principal', 'Espera rachas perdedoras incluso con un buen sistema'],
    },
    {
      slug: 'de-demo-a-real',
      title: 'De demo a real (y cuentas de fondeo)',
      minutes: 7,
      blocks: [
        p('Pasar a real cambia todo: ahora el dinero duele. Hazlo de forma **progresiva**.'),
        h('Criterios antes de pasar a real'),
        ul(
          'Plan escrito y respetado en demo durante **2-3 meses** mínimo.',
          'Expectativa positiva en backtest **y** en demo.',
          'Has vivido al menos una racha perdedora sin saltarte reglas.'
        ),
        h('Cómo empezar en real'),
        ol(
          'Deposita solo dinero que **puedas permitirte perder por completo**.',
          'Empieza con riesgo reducido (0,25–0,5%) las primeras semanas.',
          'Compara resultados real vs demo: si empeoran mucho, el problema suele ser psicológico.'
        ),
        h('Cuentas de fondeo (prop firms)'),
        p('Empresas que te dejan operar su capital si superas una evaluación, a cambio de una cuota. Pueden ser una opción interesante, pero:'),
        ul(
          'Tienen reglas estrictas (pérdida diaria máxima, drawdown máximo).',
          'La mayoría de aspirantes no supera la evaluación: la cuota es un coste real.',
          'Investiga la reputación de la empresa y sus condiciones de pago antes de pagar.'
        ),
        warn('Nunca uses dinero prestado, de tus ahorros de emergencia o que necesites para vivir. Ninguna operación lo merece.'),
      ],
      takeaways: ['Demo consistente antes de real', 'Empieza en real con riesgo reducido', 'Prop firms: útiles, pero con reglas y costes'],
    },
    {
      slug: 'mejora-continua',
      title: 'Mejora continua',
      minutes: 5,
      blocks: [
        p('Has llegado al final del curso. Ahora empieza lo importante: **la práctica deliberada**.'),
        h('Tu ciclo de mejora'),
        ol(
          '**Opera** según tu plan.',
          '**Registra** todo en el diario.',
          '**Revisa** cada semana y cada mes.',
          '**Ajusta** una sola variable a la vez y vuelve a medir.'
        ),
        tip('Céntrate en el **proceso**, no en el resultado de una operación. Si seguiste el plan, fue una buena operación aunque perdieras. Si ganaste saltándotelo, fue una mala operación.'),
        p('Gracias por llegar hasta aquí. Sígueme en Instagram para análisis, ejemplos reales y contenido nuevo. ¡Nos vemos en los gráficos!'),
      ],
      takeaways: ['Operar → registrar → revisar → ajustar', 'Juzga el proceso, no una operación aislada', 'La constancia vence al talento'],
    },
  ],
  quiz: [
    { q: 'Un plan de trading debe estar…', options: ['En tu cabeza', 'Escrito y consultable', 'Solo en Instagram', 'Cambiando cada día'], answer: 1, explain: 'Si no está escrito, no es un plan.' },
    { q: '¿Cuántas operaciones mínimas son razonables para un backtest?', options: ['5', '20', '100 o más', '1'], answer: 2, explain: 'Con menos, los resultados son demasiado aleatorios.' },
    { q: '¿Cuál es la métrica principal para evaluar un sistema?', options: ['La tasa de acierto sola', 'La expectativa en R', 'El número de operaciones al día', 'El mayor beneficio'], answer: 1, explain: 'La expectativa combina acierto y ratio.' },
    { q: 'Al pasar a real, lo recomendable es…', options: ['Duplicar el riesgo para compensar', 'Empezar con un riesgo reducido', 'Usar un préstamo', 'Operar sin stop'], answer: 1, explain: 'Transición progresiva para adaptarte a la presión emocional.' },
    { q: 'Seguiste tu plan al pie de la letra y perdiste. Fue…', options: ['Una mala operación', 'Una buena operación con resultado negativo', 'Culpa del broker', 'Una señal para dejarlo'], answer: 1, explain: 'Se juzga el proceso. Las pérdidas forman parte de cualquier sistema.' },
  ],
}
