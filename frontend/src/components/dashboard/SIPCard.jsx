import React from 'react'
import { TrendingUp, Settings, Plus, Minus } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../../utils/formatters'
import { motion } from 'framer-motion'

const SIPCard = ({ 
  amount = 12000, 
  onChange, 
  monthlyReturn = 8.2, 
  loading = false 
}) => {
  const handleAmountChange = (newAmount) => {
    const clampedAmount = Math.max(1000, Math.min(100000, newAmount))
    onChange?.(clampedAmount)
  }

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
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Monthly SIP</h3>
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
      </div>

      {/* Amount Display */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(amount, { compact: true })}
        </div>
        <div className="text-sm text-gray-500">
          {formatCurrency(amount)} per month
        </div>
      </div>

      {/* Quick Adjust Buttons */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => handleAmountChange(amount - 1000)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          disabled={amount <= 1000}
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="flex-1 text-center text-xs text-gray-500">
          Adjust Amount
        </div>
        
        <button
          onClick={() => handleAmountChange(amount + 1000)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          disabled={amount >= 100000}
        >
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Return Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Monthly Return</span>
        <span className="font-medium text-green-600">
          +{formatPercentage(monthlyReturn / 100)}
        </span>
      </div>

      {/* Amount Slider */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <input
          type="range"
          min="1000"
          max="100000"
          step="1000"
          value={amount}
          onChange={(e) => handleAmountChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((amount - 1000) / (100000 - 1000)) * 100}%, #E5E7EB ${((amount - 1000) / (100000 - 1000)) * 100}%, #E5E7EB 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹1K</span>
          <span>₹1L</span>
        </div>
      </div>
    </motion.div>
  )
}

export default SIPCard
