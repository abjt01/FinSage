import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

class AuthService {
  async login(email, password) {
    console.log('🌐 API login call...')
    
    try {
      const response = await api.post(API_ENDPOINTS.auth.login, {
        email,
        password
      })

      console.log('📨 Raw API response:', response.data)

      const data = response.data
      
      // Handle different response structures
      let user, token
      
      if (data.success && data.user && data.token) {
        user = data.user
        token = data.token
      } else if (data.user && data.token) {
        user = data.user
        token = data.token
      } else {
        throw new Error('Invalid login response structure')
      }

      // Store token
      localStorage.setItem('token', token)
      console.log('💾 Token stored')

      return { user, token }
      
    } catch (error) {
      console.error('🚨 Login API error:', error)
      
      // Clean up on error
      localStorage.removeItem('token')
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     error.message ||
                     'Login failed'
      
      throw new Error(message)
    }
  }

  async getCurrentUser() {
    console.log('👤 Getting current user...')
    
    try {
      const response = await api.get(API_ENDPOINTS.auth.me)
      const user = response.data.user || response.data
      
      console.log('👤 Current user:', user.email)
      return user
      
    } catch (error) {
      console.error('❌ Get user failed:', error)
      localStorage.removeItem('token')
      throw error
    }
  }

  async logout() {
    try {
      await api.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      console.error('Logout API failed:', error)
    }
    localStorage.removeItem('token')
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }
}

export default new AuthService()
