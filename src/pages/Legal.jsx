import { Link } from '../router.jsx'
import { SITE } from '../config.js'

const UPDATED = 'octubre de 2026'
const Mail = () => <a href={`mailto:${SITE.email}`}>{SITE.email}</a>

function LegalPage({ eyebrow, title, children }) {
  return (
    <div className="container page narrow">
      <header className="page-head">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="muted small">Última actualización: {UPDATED}</p>
      </header>
      <article className="prose legal">{children}</article>
    </div>
  )
}

export function Privacy() {
  return (
    <LegalPage eyebrow="Legal" title="Política de privacidad">
      <p>En {SITE.brand} solo pedimos los datos imprescindibles para que puedas seguir el curso con tu cuenta. Aquí te explicamos cuáles son, para qué se usan y cómo puedes controlarlos.</p>

      <h3>1. Responsable del tratamiento</h3>
      <ul>
        <li><strong>Responsable:</strong> {SITE.author}</li>
        <li><strong>Contacto:</strong> <Mail /></li>
        <li><strong>Web:</strong> {SITE.url.replace('https://', '')}</li>
      </ul>

      <h3>2. Qué datos tratamos</h3>
      <ul>
        <li><strong>Datos de tu cuenta:</strong> nombre y apellidos y correo electrónico. La contraseña la gestiona el sistema de autenticación de forma cifrada: nosotros no podemos verla.</li>
        <li><strong>Foto de perfil</strong>, solo si decides subirla. Se guarda reducida a 160×160 píxeles.</li>
        <li><strong>Tu progreso en el curso:</strong> lecciones vistas, resultados de los tests, fechas y certificados conseguidos.</li>
        <li><strong>Datos técnicos</strong> que generan automáticamente los servidores al visitar la web (dirección IP, navegador, fecha y hora), con fines de seguridad y funcionamiento.</li>
      </ul>
      <p>Si usas la web <strong>sin cuenta</strong>, tu progreso y tus preferencias (como el tema claro u oscuro) se guardan solo en tu navegador y no se envían a ningún servidor.</p>

      <h3>3. Para qué los usamos</h3>
      <ul>
        <li>Crear y gestionar tu cuenta e identificarte al iniciar sesión.</li>
        <li>Guardar y sincronizar tu progreso entre dispositivos.</li>
        <li>Emitir tus certificados con tu nombre.</li>
        <li>Enviarte correos del propio servicio: verificación de la dirección y recuperación de contraseña.</li>
      </ul>
      <p>No usamos tus datos para publicidad, no hacemos perfiles comerciales y no los vendemos ni cedemos a terceros.</p>

      <h3>4. Base legal</h3>
      <ul>
        <li><strong>Ejecución del servicio</strong> que solicitas al crear tu cuenta (art. 6.1.b del RGPD): cuenta, progreso, certificados y correos del servicio.</li>
        <li><strong>Consentimiento</strong> (art. 6.1.a del RGPD) para la foto de perfil, que puedes quitar cuando quieras.</li>
        <li><strong>Interés legítimo</strong> (art. 6.1.f del RGPD) en mantener la web segura y evitar abusos.</li>
      </ul>

      <h3>5. Cuánto tiempo los conservamos</h3>
      <p>Mientras mantengas tu cuenta. Si la eliminas desde tu perfil, se borran en ese momento tu perfil, tu foto, tu progreso y tus certificados. Los registros técnicos de los servidores se conservan durante el tiempo limitado que fijan los proveedores.</p>

      <h3>6. Proveedores que intervienen</h3>
      <p>Para que la web funcione usamos estos proveedores, que tratan los datos solo siguiendo nuestras instrucciones:</p>
      <ul>
        <li><strong>Google (Firebase Authentication y Cloud Firestore):</strong> inicio de sesión y almacenamiento de tu perfil y tu progreso.</li>
        <li><strong>Vercel:</strong> alojamiento de la web.</li>
        <li><strong>Google Fonts:</strong> las tipografías de la web se descargan desde servidores de Google, por lo que tu navegador les comunica tu dirección IP.</li>
      </ul>
      <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, en Estados Unidos. En ese caso, la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>

      <h3>7. Tus derechos</h3>
      <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad:</p>
      <ul>
        <li>Desde <Link to="/perfil">tu perfil</Link> puedes cambiar tu nombre y tu foto, y eliminar tu cuenta con todos sus datos.</li>
        <li>Para cualquier otra petición, escríbenos a <Mail />.</li>
      </ul>
      <p>Si consideras que no hemos atendido bien tu solicitud, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noreferrer">aepd.es</a>).</p>

      <h3>8. Cookies y almacenamiento local</h3>
      <p>Esta web <strong>no usa cookies de publicidad ni de analítica</strong>. Solo guarda en tu navegador información técnica necesaria para funcionar: tu sesión iniciada, el tema elegido y tu progreso. Al ser estrictamente necesaria para el servicio que pides, no requiere tu consentimiento (art. 22.2 de la LSSI).</p>

      <h3>9. Edad mínima</h3>
      <p>El contenido está dirigido a personas mayores de 18 años. Si eres menor, no crees una cuenta.</p>

      <h3>10. Seguridad y cambios</h3>
      <p>Aplicamos medidas razonables para proteger tus datos: conexión cifrada (HTTPS), reglas de acceso que impiden que un usuario lea los datos de otro y contraseñas gestionadas por el sistema de autenticación. Si esta política cambia, publicaremos la nueva versión en esta página con su fecha.</p>
    </LegalPage>
  )
}

export function LegalNotice() {
  return (
    <LegalPage eyebrow="Legal" title="Aviso legal">
      <h3>1. Titular de la web</h3>
      <p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa de los datos del titular:</p>
      <ul>
        <li><strong>Titular:</strong> {SITE.author}</li>
        <li><strong>Correo de contacto:</strong> <Mail /></li>
        <li><strong>Sitio web:</strong> {SITE.url.replace('https://', '')}</li>
        <li><strong>Actividad:</strong> divulgación educativa gratuita sobre trading y mercados financieros.</li>
      </ul>

      <h3>2. Condiciones de uso</h3>
      <p>El acceso a la web es gratuito. Al usarla te comprometes a hacerlo de forma lícita y a no intentar dañarla, acceder a datos de otros usuarios ni usar sus contenidos con fines comerciales sin autorización. Podemos suspender cuentas que incumplan estas condiciones.</p>

      <h3>3. Contenido educativo, sin asesoramiento</h3>
      <p>Todo el contenido de {SITE.brand} (lecciones, ejemplos, herramientas, tests y certificados) tiene una <strong>finalidad exclusivamente educativa</strong>. No constituye asesoramiento financiero ni de inversión, ni una recomendación para comprar o vender ningún instrumento. {SITE.brand} no es una empresa de servicios de inversión.</p>
      <p>Operar en los mercados financieros, y en especial con productos apalancados como los CFDs, conlleva un <strong>alto riesgo de perder dinero</strong>. Las decisiones que tomes son de tu exclusiva responsabilidad. Rentabilidades pasadas no garantizan resultados futuros.</p>
      <p>Los gráficos de las lecciones son ilustrativos: no son datos reales de mercado. Los resultados de las calculadoras son orientativos y debes comprobarlos con las especificaciones de tu bróker.</p>

      <h3>4. Certificados</h3>
      <p>Los certificados acreditan que se han superado las pruebas de evaluación de la web. Son de carácter formativo y no constituyen una titulación oficial.</p>

      <h3>5. Propiedad intelectual</h3>
      <p>Los textos, gráficos, diseño, código y marca {SITE.brand} pertenecen a su titular. Puedes compartir enlaces a la web y las imágenes de tus certificados y logros. No está permitido copiar o redistribuir el contenido del curso sin autorización.</p>

      <h3>6. Enlaces externos</h3>
      <p>La web puede incluir enlaces a sitios de terceros, como Instagram. No somos responsables de sus contenidos ni de sus políticas de privacidad.</p>

      <h3>7. Responsabilidad</h3>
      <p>Trabajamos para que la información sea correcta y la web esté disponible, pero no podemos garantizar que no contenga errores ni que funcione sin interrupciones. No nos hacemos responsables de las pérdidas derivadas del uso de la información publicada.</p>

      <h3>8. Protección de datos</h3>
      <p>El tratamiento de tus datos personales se explica en la <Link to="/privacidad">Política de privacidad</Link>.</p>

      <h3>9. Legislación aplicable</h3>
      <p>Estas condiciones se rigen por la legislación española.</p>
    </LegalPage>
  )
}
