import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...')
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      console.log('🔍 Checking if authenticated...')
      if (authService.isAuthenticated()) {
        console.log('✅ User is authenticated, getting current user...')
        const currentUser = await authService.getCurrentUser()
        console.log('👤 Current user:', currentUser)
        setUser(currentUser)
      } else {
        console.log('❌ User not authenticated')
        setUser(null) // ✅ IMPORTANT: Set to null explicitly
      }
    } catch (error) {
      console.error('💥 Auth initialization failed:', error)
      setUser(null) // ✅ IMPORTANT: Set to null on error
      // Don't clear token here, let it retry
    } finally {
      console.log('✅ Setting loading to false')
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    console.log('🔄 Login attempt started:', email)
    try {
      setLoading(true)
      setError(null)

      console.log('📞 Calling authService.login...')
      const response = await authService.login(email, password)
      
      console.log('✅ Login successful:', response)
      
      // ✅ CRITICAL FIX: Properly extract user from response
      const loggedInUser = response.user
      console.log('👤 Setting user in context:', loggedInUser)
      setUser(loggedInUser)
      
      return response
    } catch (error) {
      console.error('❌ Login failed:', error)
      setError(error.message)
      setUser(null) // ✅ Ensure user is null on login failure
      throw error
    } finally {
      setLoading(false)
      console.log('✅ Login loading finished')
    }
  }

  const logout = async () => {
    try {
      console.log('🔄 Logging out...')
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setError(null)
      console.log('✅ User logged out')
    }
  }

  const clearError = () => setError(null)

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user // ✅ Simple boolean check
  }

  console.log('🎯 AuthContext current state:', { user: !!user, loading, isAuthenticated: !!user })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
