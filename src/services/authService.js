import api from '../api'
import { mockLogin, mockRegister, mockGetMe, mockUpdateProfile, mockLogout } from '../mock/mockStore'

// Defaults to mock mode so the UI runs standalone with no backend required.
// Set VITE_USE_MOCK=false once the real FastAPI backend is running.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function login(email, password) {
  if (USE_MOCK) {
    const data = await mockLogin(email, password)
    localStorage.setItem('vinverse_token', data.access_token)
    return
  }
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)
  const res = await api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  localStorage.setItem('vinverse_token', res.data.access_token)
}

export async function register(email, password, displayName) {
  if (USE_MOCK) {
    const data = await mockRegister(email, password, displayName)
    localStorage.setItem('vinverse_token', data.access_token)
    return
  }
  const res = await api.post('/auth/register', { email, password, display_name: displayName })
  localStorage.setItem('vinverse_token', res.data.access_token)
}

export async function getMe() {
  if (USE_MOCK) return mockGetMe()
  const res = await api.get('/auth/me')
  return res.data
}

export async function updateProfile(payload) {
  if (USE_MOCK) return mockUpdateProfile(payload)
  const res = await api.put('/auth/me/profile', payload)
  return res.data
}

export function logout() {
  if (USE_MOCK) mockLogout()
  localStorage.removeItem('vinverse_token')
}
