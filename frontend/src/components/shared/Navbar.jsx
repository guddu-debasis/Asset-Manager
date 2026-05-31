import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuth } from '../../hooks/useAuth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const user     = useAuthStore(s => s.user)
  const { logout } = useAuth()
  const location = useLocation()

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <span className={styles.brandIcon}>◈</span>
        <span className={styles.brandName}>AssetVault</span>
      </Link>

      <div className={styles.right}>
        <Link
          to="/"
          className={`${styles.link} ${location.pathname === '/' ? styles.active : ''}`}
        >
          Dashboard
        </Link>

        <div className={styles.divider} />

        <div className={styles.avatar} title={user?.full_name}>
          {initials}
        </div>

        <span className={styles.userName}>{user?.full_name}</span>

        <button className={styles.signout} onClick={logout}>
          Sign out
        </button>
      </div>
    </nav>
  )
}
