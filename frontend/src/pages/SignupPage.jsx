import SignupForm from '../components/auth/SignupForm'
import styles from './AuthPage.module.css'

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.card} style={{ animationDelay: '0ms' }}>
        <div className={styles.header}>
          <div className={styles.logo}>◈</div>
          <h1 className={styles.title}>AssetVault</h1>
          <p className={styles.sub}>Create your account to start tracking your assets</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
