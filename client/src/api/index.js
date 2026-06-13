import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const loginApi = (data) => api.post('/auth/login', data)
export const registerApi = (data) => api.post('/auth/register', data)
export const getMeApi = () => api.get('/auth/me')
export const updateProfileApi = (data) => api.put('/auth/update', data)

// Consultations
export const getConsultations = (params) => api.get('/consultations', { params })
export const getConsultationById = (id) => api.get(`/consultations/${id}`)
export const createConsultation = (data) => api.post('/consultations', data)
export const updateConsultation = (id, data) => api.put(`/consultations/${id}`, data)
export const deleteConsultation = (id) => api.delete(`/consultations/${id}`)
export const getStats = () => api.get('/consultations/stats')

// Recordings
export const uploadRecording = (consultationId, file, onProgress) => {
  const formData = new FormData()
  formData.append('recording', file)
  return api.post(`/consultations/${consultationId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress && onProgress(Math.round((e.loaded * 100) / e.total)),
  })
}
export const generateSummary = (id, transcript) => api.post(`/consultations/${id}/summary`, { transcript })
export const deleteRecording = (id) => api.delete(`/consultations/${id}/recording`)
export const getRecordingUrl = (id) => `/api/consultations/${id}/recording`

// Astrologers & Clients
export const getAstrologers = () => api.get('/astrologers')
export const getClients = () => api.get('/clients')
export const createAstrologer = (data) => api.post('/astrologers', data)
export const createClient = (data) => api.post('/clients', data)

export default api