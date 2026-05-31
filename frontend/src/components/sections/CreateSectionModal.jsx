import { useState, useEffect } from 'react'
import styles from './CreateSectionModal.module.css'

const ICONS = [
  { key: 'box', emoji: '📦', label: 'General' },
  { key: 'car', emoji: '🚗', label: 'Car' },
  { key: 'phone', emoji: '📱', label: 'Phone' },
  { key: 'laptop', emoji: '💻', label: 'Laptop' },
  { key: 'home', emoji: '🏠', label: 'Home' },
  { key: 'kitchen', emoji: '🍳', label: 'Kitchen' },
  { key: 'tv', emoji: '📺', label: 'TV' },
  { key: 'camera', emoji: '📷', label: 'Camera' },
  { key: 'watch', emoji: '⌚', label: 'Watch' },
  { key: 'bike', emoji: '🚲', label: 'Bike' },
  { key: 'tools', emoji: '🔧', label: 'Tools' },
  { key: 'furniture', emoji: '🪑', label: 'Furniture' },
  { key: 'clothes', emoji: '👕', label: 'Clothes' },
  { key: 'jewellery', emoji: '💍', label: 'Jewellery' },
  { key: 'gaming', emoji: '🎮', label: 'Gaming' },
  { key: 'music', emoji: '🎵', label: 'Music' },
  { key: 'sports', emoji: '⚽', label: 'Sports' },
  { key: 'book', emoji: '📚', label: 'Books' },
]

export default function CreateSectionModal({ onClose, onSubmit, loading, initial }) {
  const [name, setName]       = useState(initial?.name || '')
  const [desc, setDesc]       = useState(initial?.description || '')
  const [icon, setIcon]       = useState(initial?.icon || 'box')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ name: name.trim(), description: desc.trim() || null, icon })
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{initial ? 'Edit Section' : 'New Section'}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Section Name *</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Electronics, Car, Kitchen"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description (optional)</label>
            <textarea
              className={styles.textarea}
              placeholder="Brief note about this section..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Icon</label>
            <div className={styles.iconGrid}>
              {ICONS.map(i => (
                <button
                  key={i.key}
                  type="button"
                  className={`${styles.iconBtn} ${icon === i.key ? styles.iconSelected : ''}`}
                  onClick={() => setIcon(i.key)}
                  title={i.label}
                >
                  {i.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submit} disabled={loading || !name.trim()}>
              {loading ? <span className={styles.spinner} /> : initial ? 'Save Changes' : 'Create Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
