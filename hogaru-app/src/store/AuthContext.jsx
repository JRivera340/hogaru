import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getSessionUser, loginUser, logoutUser, registerUser } from './authStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser())

  const login = useCallback(({ email, password }) => {
    const u = loginUser({ email, password })
    setUser(u)
    return u
  }, [])

  const register = useCallback(({ name, email, password }) => {
    const u = registerUser({ name, email, password })
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
