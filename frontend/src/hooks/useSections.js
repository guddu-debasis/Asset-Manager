import { useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { sectionsApi } from '../api/sectionsApi'
import { useSectionStore } from '../store/sectionStore'

export function useSections() {
  const { sections, loading, error, setSections, addSection, updateSection, removeSection, setLoading, setError } =
    useSectionStore()

  const fetchSections = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sectionsApi.list()
      setSections(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSections() }, [fetchSections])

  const createSection = async (payload) => {
    try {
      const section = await sectionsApi.create(payload)
      addSection(section)
      toast.success(`Section "${section.name}" created`)
      return section
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create section')
      throw err
    }
  }

  const editSection = async (id, payload) => {
    try {
      const section = await sectionsApi.update(id, payload)
      updateSection(section)
      toast.success('Section updated')
      return section
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update section')
      throw err
    }
  }

  const deleteSection = async (id) => {
    try {
      await sectionsApi.delete(id)
      removeSection(id)
      toast.success('Section deleted')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete section')
      throw err
    }
  }

  return { sections, loading, error, fetchSections, createSection, editSection, deleteSection }
}
