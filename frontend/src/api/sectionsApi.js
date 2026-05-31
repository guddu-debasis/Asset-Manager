import api from './axiosInstance'

export const sectionsApi = {
  list:   ()          => api.get('/sections').then(r => r.data),
  get:    (id)        => api.get(`/sections/${id}`).then(r => r.data),
  create: (data)      => api.post('/sections', data).then(r => r.data),
  update: (id, data)  => api.patch(`/sections/${id}`, data).then(r => r.data),
  delete: (id)        => api.delete(`/sections/${id}`).then(r => r.data),
}
