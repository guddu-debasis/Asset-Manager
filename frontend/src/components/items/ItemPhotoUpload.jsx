import { useRef, useState } from 'react'
import { itemsApi } from '../../api/itemsApi'
import { toast } from 'react-hot-toast'
import styles from './ItemPhotoUpload.module.css'

export default function ItemPhotoUpload({ item, onPhotoUpdated }) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const inputRef = useRef()

  const photoUrl = item.photo_path ? `/storage/${item.photo_path}` : null

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB')
      return
    }

    setUploading(true)
    try {
      const res = await itemsApi.uploadPhoto(item.id, file)
      onPhotoUpdated(res)
      toast.success('Photo uploaded')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Remove this photo?')) return
    setDeleting(true)
    try {
      await itemsApi.deletePhoto(item.id)
      onPhotoUpdated({ photo_url: null, thumb_url: null })
      toast.success('Photo removed')
    } catch {
      toast.error('Failed to remove photo')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {photoUrl ? (
        <div className={styles.preview}>
          <img src={photoUrl} alt={item.name} className={styles.previewImg} />
          <div className={styles.previewActions}>
            <button
              className={styles.changeBtn}
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : '🔄 Change'}
            </button>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '...' : '🗑 Remove'}
            </button>
          </div>
        </div>
      ) : (
        <button
          className={styles.uploadZone}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading
            ? <><span className={styles.spinner} /> Uploading...</>
            : <><span className={styles.uploadIcon}>📷</span><span>Click to upload photo</span><small>JPG, PNG, WEBP · max 10 MB</small></>
          }
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hidden}
        onChange={handleUpload}
      />
    </div>
  )
}
