import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, {
        email,
        password
      })
      
      const { token, user } = response.data
      
      // Store token in localStorage
      localStorage.setItem('token', token)
      
      return { user, token }
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  async logout() {
    try {
      await api.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error('Logout API failed:', error)
    } finally {
      localStorage.removeItem('token')
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.auth.me)
      return response.data.user
    } catch (error) {
      throw new Error('Failed to get current user')
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false
    
    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch (error) {
      return false
    }
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new AuthService()
