import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const RouterCtx = createContext({ path: '/', navigate: () => {} })

export function Router({ children }) {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to) => {
    const url = new URL(to, window.location.origin)
    if (url.pathname + url.hash !== window.location.pathname + window.location.hash) {
      window.history.pushState({}, '', to)
    }
    setPath(url.pathname)
    if (url.hash) {
      setTimeout(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [])

  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>
}

export const useRouter = () => useContext(RouterCtx)

export function Link({ to, children, className, onClick, ...rest }) {
  const { navigate, path } = useRouter()
  const active = to === '/' ? path === '/' : path.startsWith(to.split('#')[0])
  return (
    <a
      href={to}
      className={[className, active ? 'active' : ''].filter(Boolean).join(' ')}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onClick?.(e)
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
