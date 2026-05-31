import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './AuthForm.module.css'

export default function SigninForm() {
  const { signin, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    signin(form)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          placeholder="arjun@example.com"
          value={form.email}
          onChange={set('email')}
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label}>Password</label>
          <Link to="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>
        <div className={styles.pwWrap}>
          <input
            className={styles.input}
            type={showPw ? 'text' : 'password'}
            placeholder="Your password"
            value={form.password}
            onChange={set('password')}
            required
          />
          <button
            type="button"
            className={styles.pwToggle}
            onClick={() => setShowPw(p => !p)}
          >
            {showPw ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? <span className={styles.spinner} /> : 'Sign In'}
      </button>

      <p className={styles.switchLink}>
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </form>
  )
}
