import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ItemCard.module.css'

const CONDITIONS = { good: '✅ Good', fair: '🟡 Fair', poor: '🔴 Poor', new: '🆕 New', refurbished: '♻️ Refurb' }

export default function ItemCard({ item, onDelete }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const imgUrl = item.photo_thumb_path
    ? `/storage/${item.photo_thumb_path}`
    : null

  const price = item.buying_price
    ? `₹${Number(item.buying_price).toLocaleString('en-IN')}`
    : null

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/items/${item.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/items/${item.id}`)}
    >
      <div className={styles.imgWrap}>
        {imgUrl
          ? <img className={styles.img} src={imgUrl} alt={item.name} />
          : <div className={styles.imgPlaceholder}>📷</div>
        }
      </div>

      <div className={styles.body}>
        <h4 className={styles.name}>{item.name}</h4>
        {item.brand && <p className={styles.brand}>{item.brand}</p>}
        {price && <p className={styles.price}>{price}</p>}
        {item.purchase_year && (
          <p className={styles.year}>Purchased {item.purchase_year}</p>
        )}
        {item.condition && (
          <span className={styles.condition}>
            {CONDITIONS[item.condition] || item.condition}
          </span>
        )}
      </div>

      <div className={styles.menu} onClick={e => e.stopPropagation()}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)}>⋯</button>
        {menuOpen && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropItem}
              onClick={() => { setMenuOpen(false); navigate(`/items/${item.id}`) }}
            >
              👁 View / Edit
            </button>
            <button
              className={`${styles.dropItem} ${styles.danger}`}
              onClick={() => { setMenuOpen(false); onDelete(item.id) }}
            >
              🗑 Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
