import api from './axiosInstance'

export const itemsApi = {
  list:        (sectionId)  => api.get('/items', { params: sectionId ? { section_id: sectionId } : {} }).then(r => r.data),
  get:         (id)         => api.get(`/items/${id}`).then(r => r.data),
  create:      (data)       => api.post('/items', data).then(r => r.data),
  update:      (id, data)   => api.patch(`/items/${id}`, data).then(r => r.data),
  delete:      (id)         => api.delete(`/items/${id}`).then(r => r.data),
  uploadPhoto: (id, file)   => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/uploads/items/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
  deletePhoto: (id) => api.delete(`/uploads/items/${id}/photo`).then(r => r.data),
}
