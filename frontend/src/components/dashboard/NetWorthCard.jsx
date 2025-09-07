import React from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { motion } from 'framer-motion'

const NetWorthCard = ({ netWorth = 650000, change = 12.5, loading = false }) => {
  const isPositive = change >= 0
  const Icon = isPositive ? TrendingUp : TrendingDown

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Total Net Worth</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(netWorth, { compact: true })}
        </div>
        <div className="text-sm text-gray-500">
          {formatCurrency(netWorth)} total
        </div>
      </div>

      {/* Change Indicator */}
      <div className={`flex items-center space-x-1 ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {formatPercentage(Math.abs(change) / 100)} this month
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Monthly Growth</span>
          <span>{isPositive ? '+' : ''}{formatPercentage(change / 100)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isPositive ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default NetWorthCard
