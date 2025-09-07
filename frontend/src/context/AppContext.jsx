import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext({})

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([])

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('finsage-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('finsage-theme', theme)
    document.documentElement.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const addNotification = (notification) => {
    const id = Date.now()
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification
    }
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep last 50
    
    // Auto-remove after 5 seconds for success/info notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(id)
      }, 5000)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const value = {
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
