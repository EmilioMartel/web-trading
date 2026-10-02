import { lazy, Suspense, useEffect } from 'react'
import { Router, useRouter } from './router.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Course from './pages/Course.jsx'
import NotFound from './pages/NotFound.jsx'
import DevPanel from './components/DevPanel.jsx'
import { AuthProvider } from './auth.jsx'
import { routeMeta, applyMeta } from './seo.js'

// El resto de páginas se descargan solo cuando se visitan (la web carga antes)
const Lesson = lazy(() => import('./pages/Lesson.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const Tools = lazy(() => import('./pages/Tools.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Certificate = lazy(() => import('./pages/Certificate.jsx'))
const Access = lazy(() => import('./pages/Access.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Privacy = lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Privacy })))
const LegalNotice = lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.LegalNotice })))

const Loading = () => <div className="container page"><div className="gate-loading" role="status"><span className="spinner" /> Cargando…</div></div>

function Routes() {
  const { path } = useRouter()
  const p = path.replace(/\/+$/, '') || '/'

  // Título, descripción, URL canónica y datos para Google de cada página
  useEffect(() => { applyMeta(routeMeta(p)) }, [p])

  let page
  let m
  if (p === '/') page = <Home />
  else if (p === '/curso') page = <Course />
  else if ((m = p.match(/^\/curso\/test\/([\w-]+)$/))) page = <QuizPage id={m[1]} />
  else if ((m = p.match(/^\/curso\/([\w-]+)$/))) page = <Lesson slug={m[1]} />
  else if (p === '/herramientas') page = <Tools />
  else if (p === '/sobre-mi') page = <About />
  else if (p === '/certificado') page = <Certificate />
  else if (p === '/acceso') page = <Access />
  else if (p === '/perfil') page = <Profile />
  else if (p === '/privacidad') page = <Privacy />
  else if (p === '/aviso-legal') page = <LegalNotice />
  else page = <NotFound />

  return <main key={p} className="fade-in"><Suspense fallback={<Loading />}>{page}</Suspense></main>
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <a href="#contenido" className="skip">Saltar al contenido</a>
        <Navbar />
        <div id="contenido"><Routes /></div>
        <Footer />
        <DevPanel />
      </Router>
    </AuthProvider>
  )
}
