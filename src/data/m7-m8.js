import { p, h, ul, ol, tip, warn, ex, f, w, table } from './blocks.js'

export const m7 = {
  id: 'estrategia-avanzada',
  level: 'Avanzado',
  title: 'Estrategia avanzada: estructura y liquidez',
  desc: 'Cambios de estructura, liquidez, zonas de oferta y demanda y análisis multi-temporalidad para construir setups de calidad.',
  lessons: [
    {
      slug: 'bos-y-choch',
      title: 'Estructura avanzada: BOS y CHoCH',
      minutes: 8,
      blocks: [
        p('Vamos un paso más allá de HH/HL. Dos conceptos muy usados para leer la estructura con precisión:'),
        ul(
          '**BOS (Break of Structure)**: el precio rompe el último máximo en tendencia alcista (o el último mínimo en bajista). **Confirma continuación**.',
          '**CHoCH (Change of Character)**: el precio rompe el último mínimo relevante en tendencia alcista (o el último máximo en bajista). **Primera señal de posible cambio de tendencia**.'
        ),
        w('choch'),
        h('Rupturas válidas'),
        ul(
          'Prefiere rupturas **con cierre de vela** más allá del nivel, no solo con la mecha.',
          'Un impulso fuerte (velas grandes) en la ruptura aporta más convicción que una ruptura lenta.'
        ),
        tip('Un CHoCH en una temporalidad baja **dentro de una zona clave** de la temporalidad alta es uno de los disparadores de entrada más usados en el trading basado en estructura.'),
      ],
      takeaways: ['BOS = continuación', 'CHoCH = posible cambio de carácter', 'Confirma con cierre de vela'],
    },
    {
      slug: 'liquidez',
      title: 'Liquidez: dónde están los stops',
      minutes: 8,
      blocks: [
        p('Para que alguien compre mucho, alguien tiene que vender mucho. Las grandes órdenes necesitan **liquidez**, y la liquidez suele estar donde se acumulan **stop loss y órdenes pendientes**.'),
        h('Zonas típicas de liquidez'),
        ul(
          'Por encima de **máximos iguales** (doble techo) y por debajo de **mínimos iguales** (doble suelo).',
          'Máximos y mínimos del **día anterior**, de la **semana** y de la **sesión asiática**.',
          'Por encima/debajo de líneas de tendencia muy obvias.'
        ),
        h('La barrida de liquidez (sweep)'),
        p('El precio supera un máximo evidente, activa los stops de los vendedores y las órdenes de compra por ruptura… y **se da la vuelta** con fuerza. Muchos traders llaman a esto "falsa ruptura" o "stop hunt".'),
        ex('Ejemplo', 'El EUR/USD marca dos veces un máximo en 1,0900 durante la sesión asiática. En la apertura de Londres sube a 1,0912, se detiene en seco, cierra de nuevo por debajo de 1,0900 y cae 60 pips. La liquidez por encima de 1,0900 fue "barrida".'),
        tip('Pregúntate siempre: **¿dónde tendría la mayoría de traders su stop?** Evita poner el tuyo justo ahí y, sobre todo, no entres en rupturas obvias sin confirmación.'),
      ],
      takeaways: ['La liquidez se acumula en máximos/mínimos obvios', 'Una barrida seguida de giro es una señal potente', 'No coloques el stop donde lo pone todo el mundo'],
    },
    {
      slug: 'oferta-demanda-order-blocks',
      title: 'Zonas de oferta y demanda (order blocks)',
      minutes: 8,
      blocks: [
        p('Una **zona de demanda** es el área desde la que el precio salió disparado al alza. Una **zona de oferta**, desde la que cayó con fuerza. La idea: ahí quedaron órdenes sin ejecutar, y cuando el precio vuelve, pueden reaccionar de nuevo.'),
        p('Un **order block** es una versión más concreta: la **última vela contraria** antes de un impulso fuerte que rompe estructura.'),
        h('Cómo identificar una zona de calidad'),
        ol(
          'Salida **fuerte e impulsiva** (velas grandes, pocas mechas).',
          'El impulso **rompe estructura** (BOS).',
          'La zona está **sin tocar** (fresca). Cada visita la debilita.',
          'Está alineada con la dirección de la temporalidad alta.'
        ),
        warn('No todas las velas antes de un movimiento son un order block válido. Si marcas 15 zonas en un gráfico, ninguna significa nada. Sé selectivo.'),
      ],
      takeaways: ['Demanda = origen de un impulso alcista; oferta = de uno bajista', 'Impulso fuerte + BOS + zona fresca', 'Calidad sobre cantidad'],
    },
    {
      slug: 'analisis-multitemporalidad',
      title: 'Análisis multi-temporalidad (top-down)',
      minutes: 7,
      blocks: [
        p('El análisis top-down consiste en ir **de lo grande a lo pequeño**: primero el contexto, luego la zona y por último el gatillo de entrada.'),
        table(['Paso', 'Temporalidad (ejemplo swing)', 'Pregunta'], [
          ['1. Dirección', 'Diario (D1)', '¿Tendencia alcista, bajista o rango?'],
          ['2. Zona', 'H4', '¿Dónde está la zona de interés (demanda/oferta, soporte, Fibo)?'],
          ['3. Gatillo', 'H1 / M15', '¿Hay CHoCH, envolvente o barrida de liquidez en la zona?'],
        ]),
        tip('Proporción útil: cada temporalidad inferior es de 4 a 6 veces más pequeña que la anterior (D1 → H4 → H1 → M15).'),
        warn('Si las temporalidades se contradicen (D1 alcista pero H4 en fuerte caída), espera. El precio acabará alineándolas o te mostrará que el contexto ha cambiado.'),
      ],
      takeaways: ['Contexto → zona → gatillo', 'Temporalidad alta manda', 'Si hay contradicción, espera'],
    },
    {
      slug: 'confluencias-y-setup',
      title: 'Confluencias: construir un setup de alta probabilidad',
      minutes: 8,
      blocks: [
        p('Una **confluencia** es cuando varias razones independientes apuntan al mismo lugar. Cuantas más, más sólido el setup (hasta cierto punto).'),
        h('Checklist de ejemplo para una compra'),
        ol(
          'Tendencia alcista en D1 (HH/HL, precio sobre EMA 200).',
          'Retroceso a zona de demanda de H4 sin tocar.',
          'La zona coincide con el 61,8% de Fibonacci del último impulso.',
          'Barrida de un mínimo evidente dentro de la zona.',
          'CHoCH alcista en M15 como gatillo.',
          'Sin noticias de alto impacto en las próximas 2 horas.',
          'Ratio mínimo 1:2 hasta la siguiente resistencia.'
        ),
        ex('Cómo usarlo', 'Si se cumplen 6-7 puntos: setup A (riesgo normal, 1%). Con 4-5 puntos: setup B (riesgo reducido, 0,5%). Menos de 4: no se opera.'),
        tip('Escribe **tu** checklist. La mejor estrategia es la que entiendes, puedes repetir y has probado con datos.'),
      ],
      takeaways: ['Varias razones independientes > una sola señal', 'Usa un checklist por escrito', 'Clasifica setups y ajusta el riesgo'],
    },
  ],
  quiz: [
    { q: 'En tendencia alcista, el precio rompe el último máximo con cierre de vela. Es…', options: ['CHoCH', 'BOS', 'Divergencia', 'Doji'], answer: 1, explain: 'Romper el máximo a favor de la tendencia confirma continuación: BOS.' },
    { q: 'En tendencia alcista, el precio rompe el último mínimo relevante. Es…', options: ['BOS alcista', 'CHoCH (posible cambio)', 'Soporte', 'Nada importante'], answer: 1, explain: 'Romper el último HL cambia el carácter del mercado.' },
    { q: '¿Dónde suele acumularse la liquidez?', options: ['En mitad del rango', 'Por encima de máximos iguales y por debajo de mínimos iguales', 'Solo en los índices', 'En la EMA 20'], answer: 1, explain: 'Ahí se agrupan stops y órdenes de ruptura.' },
    { q: 'Una zona de demanda de calidad se caracteriza por…', options: ['Haber sido tocada muchas veces', 'Una salida impulsiva que rompe estructura y seguir sin tocar', 'Estar en M1', 'Tener muchos dojis'], answer: 1, explain: 'Impulso fuerte + BOS + zona fresca.' },
    { q: 'En el análisis top-down, el gatillo de entrada se busca en…', options: ['La temporalidad más alta', 'Una temporalidad baja, dentro de la zona marcada en la alta', 'Cualquier sitio', 'El calendario económico'], answer: 1, explain: 'Contexto en alta, gatillo en baja.' },
  ],
}

export const m8 = {
  id: 'sistema-profesional',
  level: 'Avanzado',
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
