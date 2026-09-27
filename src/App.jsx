import { useEffect } from 'react'
import { Router, useRouter } from './router.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Course from './pages/Course.jsx'
import Lesson from './pages/Lesson.jsx'
import QuizPage from './pages/QuizPage.jsx'
import Tools from './pages/Tools.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'

const TITLES = {
  '/': 'EmilioMartelFx · Aprende trading desde cero',
  '/curso': 'Curso gratuito · EmilioMartelFx',
  '/herramientas': 'Herramientas · EmilioMartelFx',
  '/sobre-mi': 'Sobre mí · EmilioMartelFx',
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
  else page = <NotFound />

  return <main key={p} className="fade-in">{page}</main>
}

export default function App() {
  return (
    <Router>
      <a href="#contenido" className="skip">Saltar al contenido</a>
      <Navbar />
      <div id="contenido"><Routes /></div>
      <Footer />
    </Router>
  )
}
