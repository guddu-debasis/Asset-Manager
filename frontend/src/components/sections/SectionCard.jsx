import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SectionCard.module.css'

const ICON_MAP = {
  box: '📦', car: '🚗', phone: '📱', laptop: '💻', home: '🏠',
  kitchen: '🍳', tv: '📺', camera: '📷', watch: '⌚', bike: '🚲',
  tools: '🔧', furniture: '🪑', clothes: '👕', jewellery: '💍',
  gaming: '🎮', music: '🎵', sports: '⚽', book: '📚',
}

export default function SectionCard({ section, onEdit, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const icon = ICON_MAP[section.icon] || '📦'

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/sections/${section.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/sections/${section.id}`)}
    >
      <div className={styles.iconWrap}>
        <span className={styles.icon}>{icon}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{section.name}</h3>
        {section.description && (
          <p className={styles.desc}>{section.description}</p>
        )}
        <span className={styles.count}>
          {section.item_count ?? 0} item{section.item_count !== 1 ? 's' : ''}
        </span>
      </div>

      <div
        className={styles.menu}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Options"
        >
          ⋯
        </button>
        {menuOpen && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropItem}
              onClick={() => { setMenuOpen(false); onEdit(section) }}
            >
              ✏️ Edit
            </button>
            <button
              className={`${styles.dropItem} ${styles.danger}`}
              onClick={() => { setMenuOpen(false); onDelete(section.id) }}
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
