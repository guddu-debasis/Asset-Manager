import api from './axiosInstance'

export const authApi = {
  signup:          (data) => api.post('/auth/signup', data).then(r => r.data),
  signin:          (data) => api.post('/auth/signin', data).then(r => r.data),
  forgotPassword:  (data) => api.post('/auth/forgot-password', data).then(r => r.data),
  resetPassword:   (data) => api.post('/auth/reset-password', data).then(r => r.data),
}
