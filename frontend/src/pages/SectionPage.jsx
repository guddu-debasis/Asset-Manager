import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { sectionsApi } from '../api/sectionsApi'
import { itemsApi } from '../api/itemsApi'
import ItemCard from '../components/items/ItemCard'
import AddItemForm from '../components/items/AddItemForm'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import styles from './SectionPage.module.css'

const ICON_MAP = {
  box: '📦', car: '🚗', phone: '📱', laptop: '💻', home: '🏠',
  kitchen: '🍳', tv: '📺', camera: '📷', watch: '⌚', bike: '🚲',
  tools: '🔧', furniture: '🪑', clothes: '👕', jewellery: '💍',
  gaming: '🎮', music: '🎵', sports: '⚽', book: '📚',
}

export default function SectionPage() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [section, setSection]   = useState(null)
  const [items,   setItems]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [showAdd, setShowAdd]   = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const totalValue = items.reduce((acc, i) => acc + (Number(i.buying_price) || 0), 0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sec, itms] = await Promise.all([
        sectionsApi.get(parseInt(id)),
        itemsApi.list(parseInt(id)),
      ])
      setSection(sec)
      setItems(itms)
    } catch (err) {
      toast.error('Section not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAddItem = async (data) => {
    setSubmitting(true)
    try {
      const item = await itemsApi.create({ ...data, section_id: parseInt(id) })
      setItems(prev => [item, ...prev])
      setShowAdd(false)
      toast.success(`"${item.name}" added`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add item')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await itemsApi.delete(itemId)
      setItems(prev => prev.filter(i => i.id !== itemId))
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
      <LoadingSpinner size="lg" text="Loading section..." />
    </div>
  )

  const icon = ICON_MAP[section?.icon] || '📦'

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Back</button>
        <div className={styles.headerMain}>
          <div className={styles.iconWrap}>{icon}</div>
          <div>
            <h1 className={styles.title}>{section?.name}</h1>
            {section?.description && <p className={styles.desc}>{section.description}</p>}
            <div className={styles.stats}>
              <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
              {totalValue > 0 && (
                <span>Total: ₹{totalValue.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add Item</button>
      </div>

      {/* Items */}
      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>📭</p>
            <h3>No items yet</h3>
            <p>Add your first item to this section.</p>
            <button className={styles.addBtn} onClick={() => setShowAdd(true)}>+ Add Item</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showAdd && (
        <AddItemForm
          sectionId={parseInt(id)}
          onSubmit={handleAddItem}
          loading={submitting}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
