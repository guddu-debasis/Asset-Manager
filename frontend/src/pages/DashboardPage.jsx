import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useSections } from '../hooks/useSections'
import SectionCard from '../components/sections/SectionCard'
import CreateSectionModal from '../components/sections/CreateSectionModal'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const { sections, loading, createSection, editSection, deleteSection } = useSections()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (data) => {
    setSubmitting(true)
    try {
      await createSection(data)
      setShowCreate(false)
    } catch { /* toast handled in hook */ }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      await editSection(editTarget.id, data)
      setEditTarget(null)
    } catch {}
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this section and all its items?')) return
    await deleteSection(id)
  }

  const totalItems = sections.reduce((acc, s) => acc + (s.item_count || 0), 0)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.greeting}>Good day, {user?.full_name?.split(' ')[0]} 👋</p>
          <h1 className={styles.heroTitle}>Your Asset Vault</h1>
          <p className={styles.heroSub}>
            {sections.length} section{sections.length !== 1 ? 's' : ''} · {totalItems} item{totalItems !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
          + New Section
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.center}>
            <LoadingSpinner size="lg" text="Loading sections..." />
          </div>
        ) : sections.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>◈</div>
            <h2 className={styles.emptyTitle}>No sections yet</h2>
            <p className={styles.emptySub}>Create your first section to start tracking assets — Car, Kitchen, Electronics, anything.</p>
            <button className={styles.createBtn} onClick={() => setShowCreate(true)}>
              + Create your first section
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {sections.map(s => (
              <SectionCard
                key={s.id}
                section={s}
                onEdit={() => setEditTarget(s)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateSectionModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          loading={submitting}
        />
      )}
      {editTarget && (
        <CreateSectionModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={handleEdit}
          loading={submitting}
        />
      )}
    </div>
  )
}
