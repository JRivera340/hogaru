import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { USERS_KEY, getSessionUser, loginUser, logoutUser, registerUser } from './authStore'

const AuthContext = createContext(null)

function sameUser(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser())

  const login = useCallback((data) => {
    const u = loginUser(data)
    setUser(u)
    return u
  }, [])

  const register = useCallback((data) => {
    const u = registerUser(data)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  // Si otra pestaña (p. ej. el admin) cambia o suspende la cuenta de ESTA
  // pestaña, se actualiza o se cierra solo esta sesión. Las demás no se tocan.
  useEffect(() => {
    function refresh() {
      const fresh = getSessionUser()
      setUser((current) => {
        if (!current) return current
        return sameUser(current, fresh) ? current : fresh
      })
    }
    function onStorage(e) {
      if (e.key === USERS_KEY || e.key === null) refresh()
    }
    window.addEventListener('storage', onStorage)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
