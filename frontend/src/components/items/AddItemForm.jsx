import { useState } from 'react'
import styles from './AddItemForm.module.css'

const CONDITIONS = ['new', 'good', 'fair', 'poor', 'refurbished']

export default function AddItemForm({ sectionId, sections, onSubmit, loading, initial, onClose }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    buying_price: initial?.buying_price || '',
    purchase_date: initial?.purchase_date || '',
    purchase_year: initial?.purchase_year || '',
    brand: initial?.brand || '',
    model_number: initial?.model_number || '',
    serial_number: initial?.serial_number || '',
    condition: initial?.condition || 'good',
    notes: initial?.notes || '',
    section_id: initial?.section_id || sectionId || '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      buying_price: form.buying_price ? parseFloat(form.buying_price) : null,
      purchase_year: form.purchase_year ? parseInt(form.purchase_year) : null,
      purchase_date: form.purchase_date || null,
      section_id: parseInt(form.section_id),
    }
    // Remove empty strings
    Object.keys(payload).forEach(k => {
      if (payload[k] === '') payload[k] = null
    })
    onSubmit(payload)
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{initial ? 'Edit Item' : 'Add Item'}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Section selector (only when no fixed sectionId) */}
          {!sectionId && sections && (
            <div className={styles.field}>
              <label className={styles.label}>Section *</label>
              <select className={styles.select} value={form.section_id} onChange={set('section_id')} required>
                <option value="">Select section</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.field} style={{ flex: 2 }}>
              <label className={styles.label}>Item Name *</label>
              <input className={styles.input} type="text" placeholder="iPhone 15 Pro" value={form.name} onChange={set('name')} required maxLength={150} />
            </div>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>Condition</label>
              <select className={styles.select} value={form.condition} onChange={set('condition')}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} placeholder="Brief description..." value={form.description} onChange={set('description')} rows={2} maxLength={2000} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Brand</label>
              <input className={styles.input} type="text" placeholder="Apple" value={form.brand} onChange={set('brand')} maxLength={100} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Model</label>
              <input className={styles.input} type="text" placeholder="A3293" value={form.model_number} onChange={set('model_number')} maxLength={100} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Buying Price (₹)</label>
              <input className={styles.input} type="number" placeholder="89999" value={form.buying_price} onChange={set('buying_price')} min="0" step="0.01" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Purchase Date</label>
              <input className={styles.input} type="date" value={form.purchase_date} onChange={set('purchase_date')} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year</label>
              <input className={styles.input} type="number" placeholder="2024" value={form.purchase_year} onChange={set('purchase_year')} min="1900" max="2100" />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Serial Number</label>
              <input className={styles.input} type="text" placeholder="Optional" value={form.serial_number} onChange={set('serial_number')} maxLength={100} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <textarea className={styles.textarea} placeholder="Any additional notes..." value={form.notes} onChange={set('notes')} rows={2} maxLength={3000} />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submit} disabled={loading || !form.name.trim()}>
              {loading ? <span className={styles.spinner} /> : initial ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
