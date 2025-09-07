import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Target, 
  PieChart, 
  TrendingUp, 
  FileText,
  ChevronLeft,
  Home
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { clsx } from 'clsx'

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const location = useLocation()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your finances'
    },
    {
      name: 'Goals',
      href: '/goals',
      icon: Target,
      description: 'Track your financial goals'
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: PieChart,
      description: 'Investment portfolio analysis'
    },
    {
      name: 'SIP Optimizer',
      href: '/sip-optimizer',
      icon: TrendingUp,
      description: 'Optimize your SIP investments'
    },
    {
      name: 'Reports',
      href: '/reports',
      icon: FileText,
      description: 'Financial reports and exports'
    }
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪙</span>
            <span className="text-lg font-semibold text-gray-900">FinSage AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={clsx(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                )} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Dream Home Goal</div>
                <div className="text-xs opacity-90">₹50L • 45% complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content margin when sidebar is open */}
      <div className={clsx(
        'lg:ml-64 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'ml-64' : 'ml-0'
      )} />
    </>
  )
}

export default Sidebar
