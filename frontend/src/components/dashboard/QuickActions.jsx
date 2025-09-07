import React from 'react'
import { MessageCircle, Download, Plus, TrendingUp, Calculator } from 'lucide-react'
import { motion } from 'framer-motion'

const QuickActions = ({ onChatOpen, onExport, onNewGoal, onOptimize }) => {
  const actions = [
    {
      id: 'chat',
      name: 'Ask AI',
      description: 'Get financial insights',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: onChatOpen
    },
    {
      id: 'optimize',
      name: 'Optimize SIP',
      description: 'Improve returns',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: onOptimize
    },
    {
      id: 'calculate',
      name: 'Calculator',
      description: 'Financial planning',
      icon: Calculator,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => console.log('Calculator clicked')
    },
    {
      id: 'export',
      name: 'Export PDF',
      description: 'Download report',
      icon: Download,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: onExport
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              onClick={action.onClick}
              className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105`}
            >
              <Icon className="w-6 h-6 mb-2 mx-auto" />
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs opacity-90 mt-1">{action.description}</div>
            </motion.button>
          )
        })}
      </div>
      
      {/* Featured Action */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Try asking: "Can I afford a ₹50L flat in 5 years?"
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Get AI-powered insights about your financial goals
              </p>
            </div>
            <button
              onClick={onChatOpen}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Ask Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default QuickActions
