import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import SignupPage          from './pages/SignupPage'
import SigninPage          from './pages/SigninPage'
import ForgotPasswordPage  from './pages/ForgotPasswordPage'
import ResetPasswordPage   from './pages/ResetPasswordPage'
import DashboardPage       from './pages/DashboardPage'
import SectionPage         from './pages/SectionPage'
import ItemDetailPage      from './pages/ItemDetailPage'
import ProtectedRoute      from './components/shared/ProtectedRoute'

export default function App() {
  const token = useAuthStore(s => s.token)

  return (
    <Routes>
      {/* Public */}
      <Route path="/signup"           element={!token ? <SignupPage />          : <Navigate to="/" replace />} />
      <Route path="/signin"           element={!token ? <SigninPage />          : <Navigate to="/" replace />} />
      <Route path="/forgot-password"  element={!token ? <ForgotPasswordPage />  : <Navigate to="/" replace />} />
      <Route path="/reset-password"   element={!token ? <ResetPasswordPage />   : <Navigate to="/" replace />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/"                 element={<DashboardPage />} />
        <Route path="/sections/:id"     element={<SectionPage />} />
        <Route path="/items/:id"        element={<ItemDetailPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
