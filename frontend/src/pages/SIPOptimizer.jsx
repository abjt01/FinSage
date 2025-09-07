import React, { useState } from 'react'
import { TrendingUp, Target, Calculator, Zap } from 'lucide-react'
import { useSimulation } from '../hooks/useSimulation'
import SIPProjectionChart from '../components/charts/SIPProjectionChart'
import { formatCurrency } from '../utils/formatters'

const SIPOptimizer = () => {
  const [optimizationParams, setOptimizationParams] = useState({
    currentSIP: 12000,
    targetAmount: 5000000,
    timeHorizon: 60, // months
    expectedReturn: 0.12,
    riskTolerance: 'medium'
  })

  const { runAnalysis, analysisData, isAnalyzing } = useSimulation()

  const handleOptimize = () => {
    runAnalysis({
      goalAmount: optimizationParams.targetAmount,
      years: optimizationParams.timeHorizon / 12,
      monthlySIP: optimizationParams.currentSIP,
      expectedReturnPA: optimizationParams.expectedReturn
    })
  }

  const recommendations = [
    {
      title: 'Increase SIP Amount',
      description: 'Boost monthly investment by ₹6,000',
      impact: '+₹12L potential gain',
      risk: 'Low',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Extend Time Horizon',
      description: 'Extend goal timeline by 1 year',
      impact: '+₹8L potential gain',
      risk: 'Low',
      icon: Target,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Higher Risk Portfolio',
      description: 'Increase equity allocation to 80%',
      impact: '+₹15L potential gain',
      risk: 'High',
      icon: Zap,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SIP Optimizer</h1>
          <p className="text-gray-600 mt-1">Optimize your SIP strategy for better returns</p>
        </div>
      </div>

      {/* Optimization Parameters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly SIP Amount
            </label>
            <input
              type="number"
              value={optimizationParams.currentSIP}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                currentSIP: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Amount
            </label>
            <input
              type="number"
              value={optimizationParams.targetAmount}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                targetAmount: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Horizon (Years)
            </label>
            <input
              type="number"
              value={optimizationParams.timeHorizon / 12}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                timeHorizon: Number(e.target.value) * 12
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Return (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={optimizationParams.expectedReturn * 100}
              onChange={(e) => setOptimizationParams({
                ...optimizationParams,
                expectedReturn: Number(e.target.value) / 100
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleOptimize}
          disabled={isAnalyzing}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Calculator className="w-5 h-5" />
          <span>{isAnalyzing ? 'Optimizing...' : 'Optimize SIP'}</span>
        </button>
      </div>

      {/* Projection Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">SIP Projection</h3>
        <SIPProjectionChart
          sipAmount={optimizationParams.currentSIP}
          targetAmount={optimizationParams.targetAmount}
          timeHorizon={optimizationParams.timeHorizon}
          expectedReturn={optimizationParams.expectedReturn}
        />
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Optimization Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${rec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">{rec.impact}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.risk === 'Low' ? 'bg-green-100 text-green-700' :
                    rec.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {rec.risk} Risk
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">{analysisData.suggestionText}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SIPOptimizer
