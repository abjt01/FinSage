import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const DashboardCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  bgColor = 'bg-white',
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
  loading = false,
  onClick
}) => {
  if (loading) {
    return (
      <div className={`${bgColor} rounded-xl shadow-lg p-6 animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  const isPositive = changeType === 'positive'
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {Icon && (
          <div className={`w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className={`flex items-center space-x-1 ${changeColor}`}>
          <ChangeIcon className="w-4 h-4" />
          <span className="text-sm font-medium">
            {change} {changeType === 'positive' ? 'increase' : 'decrease'}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default DashboardCard
