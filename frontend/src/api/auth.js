import api from './config'

export const authAPI = {
  login: (username, password) => api.post('/accounts/login/', { username, password }),
  register: (data) => api.post('/accounts/register/', data),
  logout: () => {
    const refreshToken = localStorage.getItem('refresh_token')
    return api.post('/accounts/logout/', { refresh: refreshToken })
  },
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.patch('/accounts/profile/', data),
}

export const coursesAPI = {
  getHome: () => api.get('/courses/home/'),
  getAll: (params) => api.get('/courses/', { params }),
  getBySlug: (slug) => api.get(`/courses/${slug}/`),
  getCategories: () => api.get('/courses/categories/'),
}

export const bookingsAPI = {
  getAll: () => api.get('/bookings/'),
  create: (data) => api.post('/bookings/create/', data),
  getById: (id) => api.get(`/bookings/${id}/`),
  cancel: (id) => api.post(`/bookings/${id}/cancel/`),
}

export const paymentsAPI = {
  create: (data) => api.post('/payments/create/', data),
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}/`),
}

export const dashboardAPI = {
  getRedirect: () => api.get('/dashboards/'),
  getStudent: () => api.get('/dashboards/student/'),
  getMentor: () => api.get('/dashboards/mentor/'),
}
