import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

export default function AppShell() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
