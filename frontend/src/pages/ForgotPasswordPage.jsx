import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import styles from './AuthPage.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await authApi.forgotPassword({ email })
      setSubmitted(true)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successIcon}>📧</div>
          <h2 className={styles.title}>Check your email</h2>
          <p className={styles.subtitle}>
            If an account exists for <strong>{email}</strong>, we've sent
            a password reset link. Check your inbox (and spam folder).
          </p>
          <p className={styles.subtitle}>The link expires in <strong>30 minutes</strong>.</p>
          <Link to="/signin" className={styles.linkBtn}>
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className={styles.switchText}>
          Remember your password?{' '}
          <Link to="/signin" className={styles.switchLink}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
