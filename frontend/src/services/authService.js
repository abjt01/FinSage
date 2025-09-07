// src/services/authService.js
import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

class AuthService {
  async login(email, password) {
    console.log('🌐 Making API call to login endpoint...')

    try {
      const response = await api.post(API_ENDPOINTS.auth.login, {
        email,
        password,
      })

      console.log('📨 Login API response:', response.data)

      const { token, user } = response.data

      // Store token in localStorage
      localStorage.setItem('token', token)

      return { user, token }
    } catch (error) {
      console.error('🚨 Login API error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async logout() {
    console.log('🔒 Logging out...')
    try {
      await api.post(API_ENDPOINTS.auth.logout)
      console.log('✅ Logout API call successful')
    } catch (error) {
      // Even if logout API fails, clear local storage
      console.error('❌ Logout API failed:', error)
    } finally {
      localStorage.removeItem('token')
      console.log('🧹 Token removed from localStorage')
    }
  }

  async getCurrentUser() {
    console.log('👤 Fetching current user...')
    try {
      const response = await api.get(API_ENDPOINTS.auth.me)
      console.log('👤 Current user fetched:', response.data.user)
      return response.data.user
    } catch (error) {
      console.error('❌ Failed to get current user:', error)
      throw new Error('Failed to get current user')
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    console.log('🔑 Checking authentication, token exists:', !!token)

    if (!token) return false

    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isValid = payload.exp * 1000 > Date.now()
      console.log('⏰ Token valid:', isValid)
      return isValid
    } catch (error) {
      console.log('💥 Invalid token format')
      return false
    }
  }

  getToken() {
    return localStorage.getItem('token')
  }
}

export default new AuthService()
