import { p, h, ul, ol, tip, warn, ex, f, w, table } from './blocks.js'

export const m5 = {
  id: 'analisis-fundamental',
  level: 'Intermedio',
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

export const m6 = {
  id: 'psicologia',
  level: 'Intermedio',
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
