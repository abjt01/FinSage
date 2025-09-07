import React, { useState } from 'react'
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'

const Header = () => {
  const { user, logout } = useAuth()
  const { toggleSidebar, notifications } = useApp()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪙</span>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              FinSage AI
            </h1>
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {getInitials(user?.profile?.firstName, user?.profile?.lastName)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.profile?.occupation || 'User'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
