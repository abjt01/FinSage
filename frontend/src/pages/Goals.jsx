import React, { useState } from 'react'
import { Plus, Target, Calendar, TrendingUp, Edit3, Trash2 } from 'lucide-react'
import { useQuery } from 'react-query'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Goals = () => {
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock data - replace with actual API call
  const { data: goals, isLoading } = useQuery('goals', () => 
    Promise.resolve([
      {
        id: 1,
        title: 'Dream Home Purchase',
        description: 'Buy a 2BHK apartment in Bangalore',
        category: 'home',
        targetAmount: 5000000,
        currentAmount: 2250000,
        targetDate: '2029-09-01',
        monthlyContribution: 12000,
        priority: 'high',
        status: 'active',
        progress: 45,
        createdAt: '2022-01-01'
      },
      {
        id: 2,
        title: 'Emergency Fund',
        description: '6 months of expenses as emergency fund',
        category: 'emergency',
        targetAmount: 300000,
        currentAmount: 180000,
        targetDate: '2026-03-01',
        monthlyContribution: 5000,
        priority: 'high',
        status: 'active',
        progress: 60,
        createdAt: '2023-06-01'
      },
      {
        id: 3,
        title: 'Vacation to Europe',
        description: 'Two week European tour with family',
        category: 'travel',
        targetAmount: 400000,
        currentAmount: 95000,
        targetDate: '2026-12-01',
        monthlyContribution: 8000,
        priority: 'medium',
        status: 'active',
        progress: 24,
        createdAt: '2024-01-01'
      }
    ])
  )

  const getCategoryIcon = (category) => {
    const icons = {
      home: '🏠',
      emergency: '🛡️',
      travel: '✈️',
      education: '🎓',
      retirement: '🏖️',
      car: '🚗'
    }
    return icons[category] || '🎯'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-green-600 bg-green-50 border-green-200'
    }
    return colors[priority] || colors.medium
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading your goals..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-1">Track and manage your financial objectives</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Goals Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{goals?.length || 0}</div>
              <div className="text-sm text-gray-600">Active Goals</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(goals?.reduce((sum, goal) => sum + goal.currentAmount, 0) || 0, { compact: true })}
              </div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(goals?.reduce((sum, goal) => sum + goal.progress, 0) / (goals?.length || 1))}%
              </div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals?.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between">
              {/* Goal Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className={`h-3 rounded-full ${getProgressColor(goal.progress)}`}
                    />
                  </div>
                </div>

                {/* Goal Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Target Amount</span>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(goal.targetAmount, { compact: true })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Amount</span>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(goal.currentAmount, { compact: true })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Monthly SIP</span>
                    <div className="font-semibold text-blue-600">
                      ₹{goal.monthlyContribution.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Target Date</span>
                    <div className="font-semibold text-gray-900">
                      {formatDate(goal.targetDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Achievement Status */}
            {goal.progress >= 90 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🎉</span>
                  <span className="text-sm font-medium text-green-800">
                    Almost there! You're {100 - goal.progress}% away from achieving this goal!
                  </span>
                </div>
              </div>
            )}

            {goal.progress < 25 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-amber-600">⚡</span>
                  <span className="text-sm font-medium text-amber-800">
                    Consider increasing your monthly contribution to stay on track
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {(!goals || goals.length === 0) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Target className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first financial goal</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  )
}

export default Goals
