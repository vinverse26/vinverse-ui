import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = async () => {
    try {
      const me = await authService.getMe()
      setUser(me)
    } catch {
      setUser(null)
      localStorage.removeItem('vinverse_token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authService.USE_MOCK || localStorage.getItem('vinverse_token')) {
      loadMe()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    await authService.login(email, password)
    await loadMe()
  }

  const register = async (email, password, displayName) => {
    await authService.register(email, password, displayName)
    await loadMe()
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
