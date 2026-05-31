import SigninForm from '../components/auth/SigninForm'
import styles from './AuthPage.module.css'

export default function SigninPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>◈</div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.sub}>Sign in to manage your personal asset vault</p>
        </div>
        <SigninForm />
      </div>
    </div>
  )
}
