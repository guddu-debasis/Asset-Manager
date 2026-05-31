import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Navbar from './Navbar'

export default function ProtectedRoute() {
  const token = useAuthStore(s => s.token)
  if (!token) return <Navigate to="/signin" replace />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
