import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch {
      setUser(null)
      localStorage.removeItem('vinverse_token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('vinverse_token')) {
      loadMe()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const res = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('vinverse_token', res.data.access_token)
    await loadMe()
  }

  const register = async (email, password, displayName) => {
    const res = await api.post('/auth/register', {
      email,
      password,
      display_name: displayName,
    })
    localStorage.setItem('vinverse_token', res.data.access_token)
    await loadMe()
  }

  const logout = () => {
    localStorage.removeItem('vinverse_token')
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
