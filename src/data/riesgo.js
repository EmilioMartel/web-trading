import { p, h, ul, ol, tip, warn, ex, f, w, table, chart } from './blocks.js'

/* =========================================================
   GESTIÓN DEL RIESGO · módulo base (obligatorio para ambas rutas)
   ========================================================= */

export const riesgo = {
  id: 'gestion-del-riesgo',
  track: 'base',
  title: 'Gestión del riesgo',
  desc: 'Tan importante como el análisis. Unidad de riesgo, límites, lotaje, ratio, tasa de acierto, parciales, drawdown y cuándo NO operar.',
  lessons: [
    {
      slug: 'que-es-la-gestion-del-riesgo',
      title: 'Qué es la gestión del riesgo',
      minutes: 6,
      blocks: [
        p('Puedes analizar de maravilla, acertar la mayoría de operaciones… y aun así perder dinero si, cuando fallas, pierdes más de lo que ganas cuando aciertas. Casi todo el mundo busca la estrategia perfecta; los que sobreviven se centran en **proteger su herramienta de trabajo: el capital**.'),
        p('El trading es un juego de probabilidades a largo plazo. **Las pérdidas van a existir siempre**; lo que decide tu resultado es cómo las controlas.'),
        h('Los tres peores escenarios'),
        ol(
          '**Perderlo todo**: abres una compra, el precio cae y no cierras "porque ya subirá".',
          '**Perder una parte grande**: si sueles ganar un 4% al mes y en una operación pierdes un 20%, necesitas un 25% para volver al punto de partida. Más de 6 meses de trabajo.',
          '**Perder más de lo acumulado**: aciertas mucho, pero una sola pérdida grande borra todo lo ganado. Nunca habrá beneficio constante.'
        ),
        h('Cuatro enfoques de la gestión del riesgo'),
        table(['Enfoque', 'Qué controla'], [
          ['**Operativa**', 'Cuánto pierdes por operación, por día y por semana'],
          ['**Análisis**', 'En qué situaciones NO debes arriesgar dinero (baja probabilidad)'],
          ['**Cuentas de trading**', 'Límites totales de pérdida (por ejemplo, reglas de cuentas de fondeo)'],
          ['**Diversificación del capital**', 'Qué haces con los beneficios fuera del trading'],
        ]),
        tip('Gestionar el riesgo no es evitar las pérdidas, es conseguir que **sean pequeñas, previstas y siempre del mismo tamaño**.'),
      ],
      takeaways: ['Las pérdidas son parte de la estadística', 'Una sola pérdida grande puede arruinar meses', 'El capital es tu herramienta: protégelo'],
    },
    {
      slug: 'stop-loss-y-unidad-de-riesgo',
      title: 'Stop loss y unidad de riesgo',
      minutes: 7,
      blocks: [
        h('El stop loss'),
        p('Es la orden que cierra tu operación automáticamente si el precio va en tu contra hasta un nivel. Tiene dos funciones:'),
        ul(
          '**Limitar la pérdida**: decides cuánto puedes perder **antes** de entrar.',
          '**Precisión**: lo colocas donde tu análisis queda invalidado. Si el precio llega ahí, el escenario ha cambiado y te sales.'
        ),
        chart({
          title: 'El stop va donde tu idea deja de ser válida', symbol: 'EUR/USD · H1', seed: 31,
          path: [[0, 70], [8, 45], [14, 60], [20, 38], [27, 66], [33, 52], [44, 88]],
          ann: [
            { t: 'h', y: 38, x1: 20, x2: 36, label: 'Mínimo que invalida la compra', c: 'muted', lb: true },
            { t: 'trade', x: 33, x2: 44, entry: 53, sl: 36, tp: 87 },
          ],
          note: 'Si el precio pierde el mínimo que originó el cambio de estructura, la idea alcista ya no tiene sentido: ahí (con margen) va el stop.',
        }),
        h('La unidad de riesgo (UDR)'),
        p('Es la **cantidad fija de tu cuenta que aceptas perder en cada operación**. Lo habitual es entre el 0,5% y el 2%:'),
        table(['Unidad de riesgo', 'Perfil', '5 pérdidas seguidas'], [
          ['0,5%', 'Conservador', '−2,5%'],
          ['1%', 'El más común', '−5%'],
          ['2%', 'Agresivo', '−10%'],
        ]),
        warn('La unidad de riesgo debe ser **siempre la misma**. Si la bajas al 0,5% cuando vas mal y la subes cuando vas bien, cambias tu estadística y puedes convertir un sistema rentable en uno que no lo es.'),
      ],
      takeaways: ['Stop donde se invalida el análisis', 'Unidad de riesgo fija: 0,5–2%', 'No la cambies según las rachas'],
    },
    {
      slug: 'limites-de-perdida',
      title: 'Límites de pérdida: total, semanal y diaria',
      minutes: 7,
      blocks: [
        p('Los límites te dan **enfoque** (un reto claro que no debes incumplir) y **control** (si algo no funciona, paras antes de que el daño sea grande).'),
        table(['Límite', 'Para qué sirve', 'Ejemplo'], [
          ['Pérdida máxima total', 'Hasta dónde permites que caiga la cuenta', '8–10% (como en muchas cuentas de fondeo)'],
          ['Pérdida máxima semanal', 'Repartir las oportunidades y parar a revisar', '3% → si lo alcanzas, la semana se acabó'],
          ['Pérdida máxima diaria', 'Evitar el bucle de "recuperar"', '1% o un número de operaciones (2 × 0,5%)'],
        ]),
        h('La unidad de riesgo sale de tus límites'),
        p('Al revés de lo que hace casi todo el mundo: primero defines tus límites y la peor racha que puede tener tu estrategia, y **de ahí sale** tu unidad de riesgo.'),
        ex('Ejemplo', 'Pérdida máxima 10% y tu estrategia puede encadenar 7 pérdidas. Con un 2% solo aguantarías 5 → tu unidad máxima es el 1%. Con un límite semanal del 3%, eso son 3 pérdidas seguidas por semana (o 6 si arriesgas 0,5%).'),
        w('riskunit'),
        tip('Límite diario también de **operaciones**: tras una ganadora quieres otra; tras una perdedora quieres recuperar. Un tope de operaciones corta ambos bucles.'),
      ],
      takeaways: ['Define límites total, semanal y diario', 'La UDR se deriva de los límites y la peor racha', 'Limita también el número de operaciones'],
    },
    {
      slug: 'lotaje-por-operacion',
      title: 'Lotaje: el mismo riesgo con cualquier stop',
      minutes: 8,
      blocks: [
        p('Tu estrategia es la misma en M5 que en H4, pero **la distancia del stop no**: puede ser 10 pips en una y 60 en otra. Si abres siempre el mismo número de lotes, estarás arriesgando cantidades muy distintas.'),
        ex('Ejemplo', 'Cuenta de 10.000 $, riesgo 1% = 100 $. Operación en M5 con stop a 10 pips → 1 lote. Operación en H4 con stop a 60 pips → 0,16 lotes. Mismo riesgo en dinero, lotes muy diferentes.'),
        ex('Ejemplo en oro', 'Cuenta de 5.000 $, riesgo 50 $, stop de 50 pips (5 $ de precio). En oro 1 lote = 10 $ por pip → 50 / (50 × 10) = **0,10 lotes** (1 $ por pip). Si el stop fuera de 100 pips: 0,05 lotes.'),
        w('lotcalc'),
        h('Con la herramienta de TradingView (pares mayores)'),
        ol(
          'Usa la herramienta **Posición larga** o **Posición corta** y marca entrada, stop y objetivo en el gráfico.',
          'En ajustes: **tamaño de la cuenta**, **riesgo** en % (tu unidad) y **tamaño del lote = 1.000**.',
          'La cantidad que muestra, divídela entre 100: si pone 657, son **6,57 lotes**.',
          'Guarda la configuración como plantilla ("Pares mayores") para no repetirlo cada vez.'
        ),
        p('Para oro, índices o cualquier otro activo, usa una calculadora de tamaño de posición (como la de arriba) y revisa siempre el resultado **en lotes**, no en unidades.'),
        warn('Calcula el lotaje **antes de cada operación**. "Siempre abro 0,5 lotes" no es gestión del riesgo.'),
      ],
      takeaways: ['Mismo riesgo en dinero, lotes distintos', 'Calcula antes de cada operación', 'Revisa el resultado en lotes'],
    },
    {
      slug: 'ratio-riesgo-beneficio-estrategia',
      title: 'Ratio riesgo/beneficio: lo define tu estrategia',
      minutes: 6,
      blocks: [
        p('El ratio compara lo que ganas si aciertas con lo que pierdes si fallas, **medido en unidades de riesgo**. Con un ratio 1:3 y una unidad del 1%, si aciertas ganas un 3%; si arriesgas 100 $, ganas 300 $.'),
        w('rr'),
        h('No se elige, se mide'),
        p('Si tu estrategia siempre entra en el mismo punto (por ejemplo el 0.786 tras un cambio de estructura), con el stop fuera de la estructura y el objetivo en la extensión -0.27, **el ratio será aproximadamente el mismo** en H4 o en M1. Tu estrategia tiene su ratio medio.'),
        warn('Forzar un ratio que tu estrategia no da ("quiero 1:3 porque lo he oído") mueve el stop o el objetivo a sitios sin sentido y puede convertir un sistema rentable en uno perdedor.'),
      ],
      takeaways: ['Ratio = ganancia potencial / riesgo', 'Tu estrategia tiene un ratio medio propio', 'No lo fuerces'],
    },
    {
      slug: 'tasa-de-acierto-vs-ratio',
      title: 'Tasa de acierto vs ratio: el equilibrio',
      minutes: 7,
      blocks: [
        p('La **tasa de acierto (win rate)** es el porcentaje de operaciones ganadoras. Ni un win rate alto ni un ratio alto garantizan nada por separado: lo que importa es **la combinación**.'),
        table(['Estrategia', 'Acierto', 'Ratio', 'De cada 10 operaciones (1% riesgo)'], [
          ['A', '40%', '1:2', '+8% − 6% = **+2%**'],
          ['B', '60%', '1:1', '+6% − 4% = **+2%**'],
          ['C', '30%', '1:3', '+9% − 7% = **+2%**'],
        ]),
        p('Tres estrategias muy distintas con el mismo resultado. Ahora explora la tabla completa:'),
        w('matrix'),
        ul(
          'Con ratio 1:2 necesitas **más del 33%** de acierto; con 1:3, más del 25%.',
          'Con 1:1 y un 50% de acierto no ganas nada (y con comisiones, pierdes).',
          'Pasar de 1:2 a 1:3 sin dominar la estrategia suele bajar tanto el acierto que deja de ser rentable.'
        ),
        tip('El ratio lo marca la estrategia; el acierto es el resultado de **tu ejecución**. La única forma de mejorarlo es tomar solo las entradas que cumplen todas tus condiciones.'),
      ],
      takeaways: ['Mira acierto y ratio juntos', 'Mínimo de acierto = 1 / (1 + R)', 'El acierto se mejora ejecutando mejor'],
    },
    {
      slug: 'beneficios-parciales',
      title: 'Beneficios parciales: cuándo ayudan y cuándo no',
      minutes: 6,
      blocks: [
        p('Cerrar parte de la posición antes del objetivo da tranquilidad… pero **cambia tus números**. Veamos el ejemplo típico:'),
        ex('Misma operación, dos gestiones', 'Ratio 1:2, riesgo 1%. Sin parciales, si toca TP ganas +2%. Si cierras el 50% en 1:1 y dejas correr el resto, ganas 0,5% + 1% = +1,5%.'),
        table(['100 operaciones, 40% de acierto', 'Ganadoras', 'Perdedoras', 'Resultado'], [
          ['Sin parciales', '40 × 2% = +80%', '60 × 1% = −60%', '**+20%**'],
          ['Con parciales (50% en 1:1)', '40 × 1,5% = +60%', '60 × 1% = −60%', '**0%**'],
        ]),
        p('Mismas operaciones, misma estrategia… y con parciales deja de ser rentable. Los parciales solo compensan si **muchas operaciones perdedoras pasan antes por tu nivel de parcial**. Pruébalo:'),
        w('partials'),
        ol(
          'Define exactamente cuándo y cuánto cierras.',
          'Calcula la ganancia total de una operación ganadora con esa gestión.',
          'Compara la expectativa con y sin parciales usando tus datos reales (backtest).'
        ),
      ],
      takeaways: ['Los parciales recortan las ganadoras', 'Solo ayudan si salvan muchas perdedoras', 'Decide con datos, no con sensaciones'],
    },
    {
      slug: 'drawdown-que-es',
      title: 'Drawdown: qué es y por qué es peligroso',
      minutes: 6,
      blocks: [
        p('El **drawdown** es la caída de tu cuenta desde un máximo. Si pasa de 110.000 $ a 98.000 $, has sufrido un drawdown del 11%.'),
        ul(
          '**Drawdown máximo**: la mayor caída que permites (ej.: si la cuenta de 100.000 $ baja de 90.000 $, has roto tu límite del 10%).',
          '**Drawdown diario**: cuánto puede caer en un solo día.',
          'También hay drawdown de beneficios (de +20% a +8%) y dentro de una operación (mientras el precio está contra ti).'
        ),
        w('drawdown'),
        h('El verdadero peligro: tu cabeza'),
        p('Con la cuenta en −6% no piensas igual que en +3%. Aparecen tentaciones:'),
        ul(
          '**Bajar el riesgo** "para no perder más": cuando lleguen las ganadoras, ganarás la mitad y no recuperarás.',
          '**Cerrar antes de tiempo** por miedo: tu ratio real baja.',
          '**Alejar el stop** para que no lo toque: la pérdida acaba siendo mayor.'
        ),
        tip('El drawdown es una **etapa**, no el final. Si tu estrategia es rentable y la cumples, los números acaban poniéndose de tu lado.'),
      ],
      takeaways: ['Drawdown = caída desde un máximo', 'Recuperar cuesta más que perder', 'El riesgo real es cambiar tu gestión por miedo'],
    },
    {
      slug: 'esperanza-matematica',
      title: 'Esperanza matemática: tu ancla en las malas rachas',
      minutes: 7,
      blocks: [
        p('La esperanza matemática te dice si tu estrategia gana dinero **a largo plazo**. Si el resultado es positivo, es rentable; si es cero o negativo, no.'),
        f('Esperanza = (Prob. de ganar × Ganancia media) − (Prob. de perder × Pérdida media)'),
        ul(
          '**Prob. de ganar**: tu tasa de acierto.',
          '**Ganancia media**: en unidades de riesgo (con ratio 1:2, ≈ 2).',
          '**Prob. de perder**: 1 − tasa de acierto.',
          '**Pérdida media**: 1 (tu unidad de riesgo).'
        ),
        ex('Ejemplo', '40% de acierto y ratio 1:2 → 0,4 × 2 − 0,6 × 1 = **+0,2 R** por operación. Rentable.'),
        ex('Qué pasa si el miedo te hace cerrar antes', 'Si en vez de 2 R ganas 1,5 R de media → 0,4 × 1,5 − 0,6 × 1 = **0**. La misma estrategia ya no gana nada.'),
        p('Mira cuántas rachas perdedoras aparecen incluso con una esperanza positiva:'),
        w('montecarlo'),
        tip('Piensa en unidades de riesgo, no en euros. No es lo mismo "estoy en −2.000 €" que "estoy a 2 unidades de mi máximo: con una operación ganadora vuelvo".'),
      ],
      takeaways: ['Esperanza > 0 = estrategia rentable', 'Cambiar una variable por miedo la puede anular', 'Las rachas perdedoras son normales'],
    },
    {
      slug: 'errores-comunes-gestion',
      title: 'Errores comunes en la gestión del riesgo',
      minutes: 6,
      blocks: [
        ol(
          '**Creer que no hace falta.** Hasta que 3 operaciones convierten 10.000 $ en 5.000 $.',
          '**Lotes fijos.** "Siempre 0,5 lotes" con un stop de 7 pips y otro de 3,5 pips = una operación arriesga el doble que la otra.',
          '**Malentender el apalancamiento.** Solo limita el tamaño máximo que puedes abrir. Con 1:100 y 10.000 $, el máximo son 10 lotes de EUR/USD… no significa que debas abrirlos.',
          '**Stop por número de pips.** "Pongo 5 pips porque sí" es un error: el stop lo marca la estrategia, sea la distancia que sea.',
          '**Sobreoperar.** No entrar tiene riesgo cero. Entrar sin confluencias suficientes daña la cuenta y la cabeza.'
        ),
        warn('Si solo pudieras aplicar una regla de este curso: **calcula el lotaje para que cada operación arriesgue exactamente tu unidad de riesgo**.'),
      ],
      takeaways: ['Lotes calculados, no fijos', 'Apalancamiento ≠ tamaño recomendado', 'No operar también es una decisión'],
    },
    {
      slug: 'situaciones-de-baja-probabilidad',
      title: 'Situaciones de baja probabilidad y noticias',
      minutes: 8,
      blocks: [
        p('La gestión del riesgo más importante ocurre **antes de entrar**: saber cuándo no arriesgar. ¿Cuántas veces has perdido y, al mirar el gráfico después, has visto un fallo clarísimo que antes no viste?'),
        h('Las más habituales'),
        ul(
          '**Días de noticias de alto impacto** (IPC, NFP, tipos de interés): volatilidad, indecisión y manipulaciones.',
          '**Escenario incompleto**: la estrategia pide cambio de estructura + confirmación en el 0.786, pero entras al tocar el 0.786 sin confirmación "porque cuadra".',
          '**Tu estado emocional**: después de un stop, de un mal día o de un problema personal no decides igual.'
        ),
        h('Qué hacen las noticias al gráfico'),
        table(['Efecto', 'Por qué te perjudica'], [
          ['Volatilidad', 'Spreads altos y deslizamiento: un stop del 1% puede ejecutarse como 2, 3 o 4%'],
          ['Indecisión', 'Todos esperan el dato: muchas entradas falsas antes'],
          ['Acumulaciones', 'Rangos que se rompen hacia un lado… y luego el precio va al contrario'],
          ['Descuento de la noticia', 'Si el mercado ya lo esperaba, el precio puede moverse al revés de lo "lógico" al publicarse'],
          ['Volumen', 'Movimientos tan fuertes que invalidan la estructura que habías analizado'],
        ]),
        chart({
          title: 'Rango antes de la noticia y ruptura falsa', symbol: 'EUR/USD · M5', seed: 33,
          path: [[0, 50], [4, 56], [8, 47], [12, 55], [16, 48], [18, 54], [19, 64], [20, 45], [22, 42], [30, 30]],
          mods: { 19: { o: 54, c: 62, h: 65 }, 20: { o: 62, c: 46, h: 62.5, l: 44 } },
          ann: [
            { t: 'zone', x1: 0, x2: 18, y1: 46.5, y2: 56.5, c: 'violet', o: 0.08, label: 'Espera del dato' },
            { t: 'txt', x: 19, y: 65, text: 'Publicación', c: 'accent' },
          ],
          note: 'El dato sale, el precio rompe hacia arriba, los que compran quedan atrapados y la vela siguiente se lo lleva todo hacia abajo.',
        }),
        tip('Cada trader es distinto. Si crees que tu estrategia funciona con noticias, **compruébalo con backtest**: si de 100 días de noticias solo 30 salen bien, ya tienes la respuesta.'),
      ],
      takeaways: ['Evalúa el riesgo antes de entrar', 'Noticias = baja probabilidad para la mayoría', 'Comprueba tus excepciones con datos'],
    },
    {
      slug: 'acciones-preventivas-y-checklist',
      title: 'Acciones preventivas y checklist',
      minutes: 7,
      blocks: [
        p('Un avión no despega solo porque la pista esté libre: primero revisa que todo funciona. En trading, igual: define **tus** situaciones de riesgo y qué harás en cada una.'),
        table(['Situación', 'Regla de ejemplo'], [
          ['Mala racha (más pérdidas seguidas de lo habitual)', 'Si suelo encadenar 3 y llevo 4: un día sin operar, haciendo backtest y revisando errores'],
          ['Acabo de tener un stop loss', 'No vuelvo a operar inmediatamente'],
          ['Mal día personal', 'No abro la plataforma'],
          ['Noticias fuertes o festivos bancarios', 'Me mantengo al margen salvo que mi backtest diga lo contrario'],
        ]),
        h('Tu checklist de entrada'),
        ol(
          'Describe por escrito tu operación ideal **con todo detalle** (no "cambio de estructura", sino "cambio de estructura con fuerza, es decir, vela envolvente que cierra por encima…").',
          'Conviértela en una lista de pasos con una casilla cada uno.',
          'Antes de cada entrada, marca las casillas. **Si falta una, no se opera.**'
        ),
        w('checklist'),
        tip('Cuanto más se parezca una operación a tu entrada ideal, más probable es que salga bien. El checklist te obliga a ser objetivo.'),
      ],
      takeaways: ['Define reglas para tus situaciones de riesgo', 'Checklist escrito y detallado', 'Si falta una casilla, no hay operación'],
    },
  ],
  quiz: [
    { q: 'Tu límite total es 10% y tu estrategia puede encadenar 8 pérdidas. ¿Qué unidad de riesgo como máximo?', options: ['2%', '1,25%', '0,5% obligatoriamente', '5%'], answer: 1, explain: '10% / 8 = 1,25%.' },
    { q: 'Siempre abres 0,5 lotes, con stops de 5 y 10 pips según la operación. Esto es…', options: ['Buena gestión', 'Mala gestión: arriesgas cantidades distintas', 'Indiferente', 'Lo que recomiendan los brokers'], answer: 1, explain: 'El riesgo en dinero debe ser constante: el lotaje se ajusta a la distancia del stop.' },
    { q: 'Estrategia 40% de acierto, 1:2. Cierras la mitad en 1:1. ¿Qué pasa con la expectativa?', options: ['Sube a +0,4R', 'Baja de +0,2R a 0', 'No cambia', 'Se vuelve +1R'], answer: 1, explain: '0,4 × 1,5 − 0,6 = 0.' },
    { q: 'Estás en drawdown. ¿Qué NO debes hacer?', options: ['Revisar tus operaciones', 'Bajar el riesgo o cerrar antes por miedo', 'Seguir tu plan', 'Hacer backtest'], answer: 1, explain: 'Cambiar la gestión por miedo altera la estadística de tu sistema.' },
    { q: 'Hay una decisión de tipos de interés en 20 minutos y ves tu setup. Lo prudente es…', options: ['Entrar con el doble', 'Considerarlo baja probabilidad y esperar', 'Quitar el stop', 'Entrar sin mirar'], answer: 1, explain: 'Spread, deslizamiento y manipulaciones: mejor al margen.' },
  ],
}
