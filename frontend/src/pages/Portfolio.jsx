import React from 'react'
import { useQuery } from 'react-query'
import { PieChart, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../utils/formatters'
import PortfolioChart from '../components/charts/PortfolioChart'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Portfolio = () => {
  const { data: portfolioData, isLoading } = useQuery('portfolio', () => 
    Promise.resolve({
      totalValue: 650000,
      allocation: [
        { name: 'Equity Mutual Funds', value: 340000, percentage: 52.3, color: '#3B82F6' },
        { name: 'EPF', value: 185000, percentage: 28.5, color: '#10B981' },
        { name: 'Bank Savings', value: 125000, percentage: 19.2, color: '#F59E0B' }
      ],
      performance: {
        monthlyReturn: 8.2,
        yearlyReturn: 12.5,
        totalGain: 85000
      }
    })
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Loading portfolio..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
          <p className="text-gray-600 mt-1">Track your investment performance and allocation</p>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolioData.totalValue, { compact: true })}
              </div>
              <div className="text-sm text-gray-600">Total Portfolio Value</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                +{formatPercentage(portfolioData.performance.yearlyReturn / 100)}
              </div>
              <div className="text-sm text-gray-600">Annual Return</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {portfolioData.allocation.length}
              </div>
              <div className="text-sm text-gray-600">Asset Classes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Asset Allocation</h3>
          <div className="space-y-4">
            {portfolioData.allocation.map((asset, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-gray-900">{asset.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(asset.value, { compact: true })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {asset.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Trend</h3>
          <PortfolioChart />
        </div>
      </div>
    </div>
  )
}

export default Portfolio
