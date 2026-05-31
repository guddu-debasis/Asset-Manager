import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import styles from './AuthPage.module.css'

export default function ResetPasswordPage() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token') || ''
  const navigate                = useNavigate()

  const [newPassword, setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading]             = useState(false)
  const [showNew, setShowNew]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Invalid Link</h2>
          <p className={styles.subtitle}>
            This reset link is missing or invalid.
          </p>
          <Link to="/forgot-password" className={styles.linkBtn}>
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ token, new_password: newPassword })
      toast.success('Password reset! Please sign in.')
      navigate('/signin')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Reset link is invalid or expired'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>Enter your new password below.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showNew ? 'text' : 'password'}
                className={styles.input}
                placeholder="Min 8 chars, 1 uppercase, 1 digit"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowNew(p => !p)}
              >
                {showNew ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirm ? 'text' : 'password'}
                className={styles.input}
                placeholder="Repeat your new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm(p => !p)}
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className={styles.switchText}>
          <Link to="/signin" className={styles.switchLink}>Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
