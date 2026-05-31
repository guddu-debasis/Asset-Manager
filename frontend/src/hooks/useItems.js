import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { itemsApi } from '../api/itemsApi'

/**
 * useItems — manages item CRUD for a given section (or all items).
 * @param {number|null} sectionId  — pass null to fetch all items
 */
export function useItems(sectionId = null) {
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await itemsApi.list(sectionId)
      setItems(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [sectionId])

  const createItem = async (payload) => {
    const item = await itemsApi.create(payload)
    setItems(prev => [item, ...prev])
    toast.success(`"${item.name}" added`)
    return item
  }

  const updateItem = async (id, payload) => {
    const updated = await itemsApi.update(id, payload)
    setItems(prev => prev.map(i => (i.id === id ? updated : i)))
    toast.success('Item updated')
    return updated
  }

  const deleteItem = async (id) => {
    await itemsApi.delete(id)
    setItems(prev => prev.filter(i => i.id !== id))
    toast.success('Item deleted')
  }

  const updateItemPhoto = (id, { photo_url, thumb_url }) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              photo_path:       photo_url ? photo_url.replace('/storage/', '') : null,
              photo_thumb_path: thumb_url ? thumb_url.replace('/storage/', '') : null,
            }
          : i
      )
    )
  }

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    updateItemPhoto,
    setItems,
  }
}
