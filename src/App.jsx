import { lazy, Suspense, useEffect } from 'react'
import { Router, useRouter } from './router.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Course from './pages/Course.jsx'
import NotFound from './pages/NotFound.jsx'
import DevPanel from './components/DevPanel.jsx'
import { AuthProvider } from './auth.jsx'

// El resto de páginas se descargan solo cuando se visitan (la web carga antes)
const Lesson = lazy(() => import('./pages/Lesson.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const Tools = lazy(() => import('./pages/Tools.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Certificate = lazy(() => import('./pages/Certificate.jsx'))
const Access = lazy(() => import('./pages/Access.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

const Loading = () => <div className="container page"><div className="gate-loading" role="status"><span className="spinner" /> Cargando…</div></div>

const TITLES = {
  '/': 'EmilioMartelFx · Aprende trading desde cero',
  '/curso': 'Curso gratuito · EmilioMartelFx',
  '/herramientas': 'Herramientas · EmilioMartelFx',
  '/sobre-mi': 'Sobre mí · EmilioMartelFx',
  '/certificado': 'Certificados · EmilioMartelFx',
  '/perfil': 'Mi perfil · EmilioMartelFx',
}

function Routes() {
  const { path } = useRouter()
  const p = path.replace(/\/+$/, '') || '/'

  useEffect(() => { if (TITLES[p]) document.title = TITLES[p] }, [p])

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
