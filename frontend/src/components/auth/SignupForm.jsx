import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './AuthForm.module.css'

export default function SignupForm() {
  const { signup, loading } = useAuth()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(form)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Full Name</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Arjun Kumar"
          value={form.full_name}
          onChange={set('full_name')}
          required
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          placeholder="arjun@example.com"
          value={form.email}
          onChange={set('email')}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <div className={styles.pwWrap}>
          <input
            className={styles.input}
            type={showPw ? 'text' : 'password'}
            placeholder="Min 8 chars, 1 uppercase, 1 digit"
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
        {loading ? <span className={styles.spinner} /> : 'Create Account'}
      </button>

      <p className={styles.switchLink}>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </form>
  )
}
