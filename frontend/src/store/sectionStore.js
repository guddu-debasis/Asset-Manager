import { create } from 'zustand'

export const useSectionStore = create((set, get) => ({
  sections: [],
  loading:  false,
  error:    null,

  setSections: (sections) => set({ sections }),

  addSection: (section) =>
    set((s) => ({ sections: [section, ...s.sections] })),

  updateSection: (updated) =>
    set((s) => ({
      sections: s.sections.map((sec) => sec.id === updated.id ? updated : sec),
    })),

  removeSection: (id) =>
    set((s) => ({ sections: s.sections.filter((sec) => sec.id !== id) })),

  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error }),
}))
