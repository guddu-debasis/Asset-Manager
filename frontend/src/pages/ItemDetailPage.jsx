import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { itemsApi } from '../api/itemsApi'
import { sectionsApi } from '../api/sectionsApi'
import ItemPhotoUpload from '../components/items/ItemPhotoUpload'
import AddItemForm from '../components/items/AddItemForm'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import styles from './ItemDetailPage.module.css'

const CONDITIONS = { good: '✅ Good', fair: '🟡 Fair', poor: '🔴 Poor', new: '🆕 New', refurbished: '♻️ Refurb' }

export default function ItemDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [item,     setItem]     = useState(null)
  const [sections, setSections] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [editing,  setEditing]  = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fetchItem = useCallback(async () => {
    setLoading(true)
    try {
      const [itm, secs] = await Promise.all([
        itemsApi.get(parseInt(id)),
        sectionsApi.list(),
      ])
      setItem(itm)
      setSections(secs)
    } catch {
      toast.error('Item not found')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchItem() }, [fetchItem])

  const handlePhotoUpdated = ({ photo_url, thumb_url }) => {
    setItem(prev => ({
      ...prev,
      photo_path:       photo_url ? photo_url.replace('/storage/', '') : null,
      photo_thumb_path: thumb_url ? thumb_url.replace('/storage/', '') : null,
    }))
  }

  const handleEdit = async (data) => {
    setSubmitting(true)
    try {
      const updated = await itemsApi.update(item.id, data)
      setItem(updated)
      setEditing(false)
      toast.success('Item updated')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this item permanently?')) return
    try {
      await itemsApi.delete(item.id)
      toast.success('Item deleted')
      navigate(`/sections/${item.section_id}`)
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
      <LoadingSpinner size="lg" text="Loading item..." />
    </div>
  )

  if (!item) return null

  const sectionName = sections.find(s => s.id === item.section_id)?.name || 'Unknown Section'
  const price = item.buying_price ? `₹${Number(item.buying_price).toLocaleString('en-IN')}` : '—'

  const details = [
    { label: 'Section',      value: sectionName },
    { label: 'Buying Price', value: price },
    { label: 'Brand',        value: item.brand },
    { label: 'Model',        value: item.model_number },
    { label: 'Serial No.',   value: item.serial_number },
    { label: 'Condition',    value: CONDITIONS[item.condition] || item.condition },
    { label: 'Purchase Date',value: item.purchase_date },
    { label: 'Year',         value: item.purchase_year },
  ].filter(d => d.value)

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate(`/sections/${item.section_id}`)}>
          ← {sectionName}
        </button>
        <div className={styles.headerActions}>
          <button className={styles.editBtn} onClick={() => setEditing(true)}>✏️ Edit</button>
          <button className={styles.deleteBtn} onClick={handleDelete}>🗑 Delete</button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Left: Photo */}
        <div className={styles.photoCol}>
          <ItemPhotoUpload item={item} onPhotoUpdated={handlePhotoUpdated} />
        </div>

        {/* Right: Details */}
        <div className={styles.detailCol}>
          <h1 className={styles.name}>{item.name}</h1>
          {item.description && <p className={styles.desc}>{item.description}</p>}

          <div className={styles.table}>
            {details.map(d => (
              <div key={d.label} className={styles.row}>
                <span className={styles.rowLabel}>{d.label}</span>
                <span className={styles.rowValue}>{d.value}</span>
              </div>
            ))}
          </div>

          {item.notes && (
            <div className={styles.notes}>
              <p className={styles.notesLabel}>Notes</p>
              <p className={styles.notesText}>{item.notes}</p>
            </div>
          )}

          <p className={styles.meta}>
            Added {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <AddItemForm
          initial={item}
          sections={sections}
          onSubmit={handleEdit}
          loading={submitting}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  )
}
