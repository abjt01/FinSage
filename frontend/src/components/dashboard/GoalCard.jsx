import React from 'react'
import { Target, Calendar, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { motion } from 'framer-motion'

const GoalCard = ({ 
  goal = {
    title: 'Dream Home Purchase',
    targetAmount: 5000000,
    currentAmount: 2250000,
    targetDate: '2029-09-01'
  }, 
  progress = 45, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  const progressColor = progress >= 75 ? 'green' : progress >= 50 ? 'blue' : progress >= 25 ? 'yellow' : 'red'
  const progressColorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  const remaining = goal.targetAmount - goal.currentAmount
  const monthsLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Primary Goal</h3>
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <Target className="w-4 h-4 text-purple-600" />
        </div>
      </div>

      {/* Goal Details */}
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-1">
          {goal.title}
        </h4>
        <div className="text-sm text-gray-500">
          {formatCurrency(goal.targetAmount, { compact: true })} target
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-3 rounded-full ${progressColorClasses[progressColor]} transition-all duration-500`}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Current Amount</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(goal.currentAmount, { compact: true })}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Remaining</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(remaining, { compact: true })}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Time Left</span>
          <span className="font-medium text-gray-900">
            {monthsLeft > 12 ? `${Math.floor(monthsLeft / 12)}y ${monthsLeft % 12}m` : `${monthsLeft}m`}
          </span>
        </div>
      </div>

      {/* Achievement Badge */}
      {progress >= 80 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              On track to achieve goal!
            </span>
          </div>
        </div>
      )}

      {progress < 50 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Consider increasing SIP amount
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GoalCard
