/* =========================================================
   BASE · Fundamentos del trading
   ========================================================= */
import { p, h, ul, ol, tip, warn, ex, f, w, table } from './blocks.js'

export const fundamentos = {
  id: 'fundamentos',
  track: 'base',
  title: 'Fundamentos del trading',
  desc: 'Qué es el trading, qué mercados vamos a operar y el vocabulario básico que necesitas para entender todo lo demás.',
  lessons: [
    {
      slug: 'que-es-el-trading',
      title: '¿Qué es el trading?',
      minutes: 5,
      blocks: [
        p('Hacer trading es **comprar y vender activos financieros intentando beneficiarte de sus cambios de precio**. A diferencia de la inversión a largo plazo, donde compras algo para mantenerlo años, el trader busca movimientos en plazos más cortos: minutos, horas, días o semanas.'),
        p('Una idea clave desde el primer día: en trading **puedes ganar tanto si el precio sube como si baja**. Si crees que va a subir, compras (posición larga). Si crees que va a bajar, vendes (posición corta).'),
        h('Estilos de trading'),
        table(['Estilo', 'Duración de la operación', 'Para quién'], [
          ['Scalping', 'Segundos a minutos', 'Mucho tiempo frente a la pantalla, decisiones muy rápidas'],
          ['Intradía (day trading)', 'Minutos a horas, se cierra en el día', 'Quien puede dedicar unas horas fijas al día'],
          ['Swing trading', 'Días a semanas', 'Compatible con un trabajo; menos estrés'],
          ['Posicional', 'Semanas a meses', 'Visión macro, mucha paciencia'],
        ]),
        tip('Si estás empezando y trabajas o estudias, el **swing trading** o el intradía en temporalidades de 1 hora suelen ser los más llevaderos.'),
        h('Lo que el trading NO es'),
        ul(
          'No es una forma de hacerse rico rápido. Es una habilidad que se construye durante años.',
          'No es adivinar. Es gestionar probabilidades y riesgo de forma repetible.',
          'No es apostar: la diferencia está en tener un plan, una ventaja estadística y control del riesgo.'
        ),
        warn('La mayoría de las cuentas minoristas que operan con CFDs pierden dinero (los brokers regulados están obligados a publicar ese porcentaje y suele superar el 70%). Por eso este curso pone tanto peso en la **gestión del riesgo** y la **psicología**.'),
      ],
      takeaways: ['Trading = especular con cambios de precio', 'Se puede ganar en subidas (largos) y en bajadas (cortos)', 'Elige un estilo que encaje con tu tiempo disponible'],
    },
    {
      slug: 'mercados-forex-indices-oro',
      title: 'Los mercados: Forex, índices y oro',
      minutes: 6,
      blocks: [
        p('En este curso nos centramos en tres mercados muy líquidos y muy populares entre traders minoristas.'),
        h('1. Forex (divisas)'),
        p('El mercado de divisas es el más grande del mundo: se negocian **billones de dólares al día**. Siempre se opera en **pares**: compras una moneda y vendes otra a la vez.'),
        ul(
          '**Pares mayores**: incluyen el dólar (USD) y otra moneda fuerte. EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD.',
          '**Cruces**: no incluyen el dólar. EUR/GBP, GBP/JPY, EUR/JPY…',
          '**Exóticos**: una moneda fuerte con una emergente (USD/TRY, EUR/ZAR). Spreads altos y movimientos bruscos: no recomendados al empezar.'
        ),
        h('2. Índices bursátiles'),
        p('Un índice agrupa a muchas empresas y refleja cómo va un mercado bursátil. Con CFDs puedes operar el índice entero con una sola posición.'),
        table(['Índice', 'Nombre habitual en brokers', 'Qué representa'], [
          ['S&P 500', 'US500 / SPX500', '500 grandes empresas de EE. UU.'],
          ['Nasdaq 100', 'NAS100 / US100 / USTEC', '100 grandes tecnológicas y no financieras'],
          ['Dow Jones', 'US30', '30 grandes empresas industriales de EE. UU.'],
          ['DAX 40', 'GER40 / DE40', '40 mayores empresas alemanas'],
        ]),
        h('3. Oro (XAU/USD)'),
        p('El oro se cotiza contra el dólar: **XAU/USD** indica cuántos dólares cuesta una onza. Es un activo refugio: suele atraer compras en momentos de miedo o incertidumbre, y es muy sensible al dólar y a los tipos de interés reales.'),
        warn('El oro y el Nasdaq se mueven mucho más que el EUR/USD en términos de dinero por lote. Con el mismo tamaño de posición, el riesgo puede ser varias veces mayor. Lo veremos en detalle en el módulo de gestión de riesgo.'),
        tip('Consejo de novato a novato: elige **2 o 3 activos** y conócelos a fondo (por ejemplo EUR/USD, XAU/USD y NAS100). Saltar entre 20 gráficos solo genera confusión.'),
      ],
      takeaways: ['Forex se opera en pares: base / cotizada', 'Índices = una cesta de empresas en una sola posición', 'El oro es muy volátil y reacciona al dólar y a los tipos'],
    },
    {
      slug: 'como-funciona-un-par',
      title: 'Cómo funciona un par de divisas',
      minutes: 6,
      blocks: [
        p('Tomemos **EUR/USD = 1,0850**. Significa que **1 euro vale 1,0850 dólares**. La primera moneda (EUR) es la **base** y la segunda (USD) es la **cotizada**.'),
        ul(
          'Si **compras** EUR/USD, compras euros y vendes dólares. Ganas si el euro se fortalece frente al dólar (el precio sube).',
          'Si **vendes** EUR/USD, vendes euros y compras dólares. Ganas si el euro se debilita (el precio baja).'
        ),
        h('Bid, Ask y spread'),
        p('En la plataforma siempre verás dos precios:'),
        ul(
          '**Bid** (precio de venta): el precio al que puedes vender.',
          '**Ask** (precio de compra): el precio al que puedes comprar. Siempre es algo más alto.',
          '**Spread**: la diferencia entre ambos. Es uno de los costes principales de operar.'
        ),
        ex('Ejemplo', 'Bid 1,08500 / Ask 1,08510 → spread de 1 pip. Si compras y cierras al instante, pierdes ese pip. Por eso cada operación empieza ligeramente en negativo.'),
        tip('Los spreads se amplían en momentos de poca liquidez (madrugada, fines de sesión, noticias importantes). Evita entrar justo en esos momentos.'),
        h('Otros costes'),
        ul(
          '**Comisión**: algunas cuentas (tipo ECN/RAW) cobran una comisión fija por lote a cambio de spreads muy bajos.',
          '**Swap**: interés que pagas o cobras por mantener una posición abierta de un día para otro.'
        ),
      ],
      takeaways: ['Base / cotizada: el precio indica cuánto de la cotizada vale 1 unidad de la base', 'Compras al Ask, vendes al Bid', 'Spread, comisión y swap son tus costes'],
    },
    {
      slug: 'pips-lotes-apalancamiento',
      title: 'Pips, lotes y apalancamiento',
      minutes: 8,
      blocks: [
        h('El pip'),
        p('Un **pip** es la unidad estándar de movimiento en Forex. En la mayoría de pares es el **cuarto decimal (0,0001)**. En los pares con yen japonés es el **segundo decimal (0,01)**.'),
        ex('Ejemplo', 'EUR/USD pasa de 1,0850 a 1,0875 → se ha movido 25 pips. USD/JPY pasa de 150,20 a 150,50 → 30 pips.'),
        p('Muchos brokers muestran un quinto decimal: es el **pipette** (una décima de pip).'),
        h('El lote'),
        table(['Tipo', 'Volumen', 'Unidades de la divisa base', 'Valor aprox. del pip (pares …/USD)'], [
          ['Estándar', '1,00', '100.000', '10 $'],
          ['Mini', '0,10', '10.000', '1 $'],
          ['Micro', '0,01', '1.000', '0,10 $'],
        ]),
        w('pipvalue'),
        h('Oro e índices'),
        p('En el **oro (XAU/USD)** el precio cotiza con dos decimales y **1 pip = 0,10 $** de movimiento (de 2.350,00 a 2.350,10). Con el contrato estándar (1 lote = 100 onzas), el valor del pip es el mismo que en EUR/USD:'),
        table(['Lotes en oro', 'Valor por pip', '50 pips (5 $ de precio)'], [
          ['0,01', '0,10 $', '5 $'],
          ['0,10', '1 $', '50 $'],
          ['1,00', '10 $', '500 $'],
        ]),
        tip('Así lo verás en MT5 con el contrato estándar. El valor va en dólares: en una cuenta en euros la plataforma lo convierte al tipo EUR/USD del momento (10 $ son algo menos de 10 €).'),
        p('En los **índices**, el valor por punto depende del contrato de tu broker (a menudo 1 $ por punto y lote, pero hay variaciones). **Compruébalo siempre en la especificación del símbolo** (MT5: clic derecho en el símbolo → Especificación).'),
        h('Apalancamiento y margen'),
        p('El apalancamiento te permite abrir posiciones mayores que tu capital. Con un apalancamiento de **30:1**, para abrir una posición de 30.000 € necesitas depositar **1.000 € de margen**.'),
        warn('El apalancamiento **no cambia cuánto ganas o pierdes por pip**: eso lo decide el tamaño del lote. Lo que hace es permitirte abrir lotes más grandes con menos dinero… y por tanto arruinarte más rápido si no controlas el riesgo.'),
        p('En la Unión Europea (normativa ESMA), el apalancamiento máximo para clientes minoristas es **30:1** en pares mayores, **20:1** en pares no mayores, oro e índices principales.'),
      ],
      takeaways: ['1 pip = 0,0001 (0,01 en pares con JPY)', '1 lote estándar ≈ 10 $/pip en EUR/USD', 'El riesgo lo define el tamaño de posición, no el apalancamiento'],
    },
    {
      slug: 'brokers-cfds-plataformas',
      title: 'Brokers, CFDs y plataformas',
      minutes: 6,
      blocks: [
        p('Para operar necesitas un **broker**: la empresa que te da acceso al mercado. Como minorista normalmente operarás **CFDs** (contratos por diferencia): no compras el activo real, sino un contrato que replica su precio.'),
        h('Cómo elegir broker'),
        ol(
          '**Regulación**: lo primero y no negociable. Busca supervisión de organismos serios (CNMV en España, FCA en Reino Unido, CySEC en Chipre, ASIC en Australia…).',
          '**Costes**: spreads, comisiones y swaps en los activos que vas a operar.',
          '**Protección de saldo negativo**: que nunca puedas deber más de lo depositado (obligatoria en la UE para minoristas).',
          '**Plataforma y ejecución**: estabilidad, velocidad, facilidad para retirar dinero.'
        ),
        warn('Desconfía de cualquiera que te prometa rentabilidades fijas, te pida enviarle dinero para "gestionarlo" o te empuje a un broker no regulado. Son las estafas más comunes del sector.'),
        h('Plataformas más usadas'),
        ul(
          '**TradingView**: análisis de gráficos, muy intuitiva, ideal para estudiar y marcar niveles.',
          '**MetaTrader 4 / 5**: el estándar de la industria para ejecutar operaciones.',
          '**cTrader**: alternativa moderna con buena ejecución.'
        ),
        tip('Empieza **siempre** en una **cuenta demo** (dinero ficticio). No pases a real hasta tener un plan escrito y resultados consistentes durante al menos 2-3 meses en demo.'),
      ],
      takeaways: ['La regulación es lo primero al elegir broker', 'Operarás CFDs: contratos que replican el precio', 'Demo primero, real después'],
    },
    {
      slug: 'sesiones-de-mercado',
      title: 'Sesiones de mercado',
      minutes: 5,
      blocks: [
        p('El mercado de divisas abre **24 horas, 5 días a la semana**: desde el domingo por la noche hasta el viernes por la noche (hora europea). Pero no todas las horas son iguales.'),
        p('El día se divide en cuatro grandes sesiones según los centros financieros: **Sídney, Tokio, Londres y Nueva York**.'),
        w('sessions'),
        h('¿Cuándo hay más movimiento?'),
        ul(
          '**Sesión de Londres**: la de mayor volumen en Forex. Muchos movimientos fuertes empiezan aquí.',
          '**Solapamiento Londres–Nueva York**: el momento de más liquidez y volatilidad del día.',
          '**Sesión asiática**: suele ser más tranquila, con rangos estrechos (salvo en pares con JPY, AUD o NZD).'
        ),
        tip('Los índices estadounidenses (NAS100, US30, US500) tienen su mayor movimiento en la **apertura de Wall Street** (15:30 hora peninsular española, 14:30 en Canarias).'),
      ],
      takeaways: ['Forex: 24 h de lunes a viernes', 'Londres y el solape con Nueva York concentran la volatilidad', 'Opera en las horas en las que tu activo se mueve'],
    },
    {
      slug: 'tipos-de-ordenes',
      title: 'Tipos de órdenes',
      minutes: 6,
      blocks: [
        table(['Orden', 'Qué hace', 'Cuándo usarla'], [
          ['A mercado', 'Entra ya, al mejor precio disponible', 'Cuando el setup está confirmado ahora'],
          ['Buy Limit', 'Compra MÁS ABAJO del precio actual', 'Esperas un retroceso a un soporte'],
          ['Sell Limit', 'Vende MÁS ARRIBA del precio actual', 'Esperas un retroceso a una resistencia'],
          ['Buy Stop', 'Compra MÁS ARRIBA del precio actual', 'Quieres entrar en la ruptura al alza'],
          ['Sell Stop', 'Vende MÁS ABAJO del precio actual', 'Quieres entrar en la ruptura a la baja'],
        ]),
        h('Stop Loss y Take Profit'),
        ul(
          '**Stop Loss (SL)**: cierra la operación automáticamente si el precio va en tu contra hasta un nivel. Es tu seguro de vida.',
          '**Take Profit (TP)**: cierra la operación con beneficio al llegar al objetivo.',
          '**Trailing Stop**: un stop que se va moviendo a favor a medida que el precio avanza.'
        ),
        warn('Operar sin stop loss es la forma más rápida de quemar una cuenta. Una sola operación sin stop puede borrar meses de trabajo.'),
        tip('Truco para recordarlo: **Limit** = espero a un precio mejor. **Stop** = entro cuando el precio confirma el movimiento.'),
      ],
      takeaways: ['Limit = precio mejor que el actual; Stop = ruptura', 'Toda operación lleva stop loss desde el primer segundo', 'Define TP antes de entrar'],
    },
  ],
  quiz: [
    { q: 'Si compras EUR/USD, ¿qué necesitas que ocurra para ganar?', options: ['Que el euro se debilite frente al dólar', 'Que el euro se fortalezca frente al dólar', 'Que ambos suban a la vez', 'Que baje el spread'], answer: 1, explain: 'Comprar EUR/USD es comprar euros vendiendo dólares: ganas si el precio (euros en dólares) sube.' },
    { q: 'EUR/USD pasa de 1,1000 a 1,1045. ¿Cuántos pips se ha movido?', options: ['4,5 pips', '45 pips', '450 pips', '0,45 pips'], answer: 1, explain: 'En EUR/USD 1 pip = 0,0001. 0,0045 / 0,0001 = 45 pips.' },
    { q: '¿Qué determina cuánto dinero ganas o pierdes por pip?', options: ['El apalancamiento', 'El tamaño del lote', 'El broker', 'La sesión de mercado'], answer: 1, explain: 'El tamaño de la posición (lotes) fija el valor del pip. El apalancamiento solo cambia el margen necesario.' },
    { q: 'Quieres comprar si el precio retrocede hasta un soporte que está por debajo del precio actual. ¿Qué orden usas?', options: ['Buy Stop', 'Sell Limit', 'Buy Limit', 'Sell Stop'], answer: 2, explain: 'Buy Limit = compra a un precio más bajo que el actual.' },
    { q: '¿Cuál es el momento con más liquidez del día en Forex?', options: ['La sesión asiática', 'El fin de semana', 'El solapamiento Londres–Nueva York', 'La medianoche en Europa'], answer: 2, explain: 'Cuando Londres y Nueva York están abiertas a la vez se concentra el mayor volumen.' },
  ],
}
