import React, { useState, useEffect } from 'react'
import { TrendingUp, Calculator, Target } from 'lucide-react'
import { analyzeGoal } from '../../services/aiService'
import LoadingSpinner from '../common/LoadingSpinner'

const SIPForm = ({ onAnalysis, initialData = {} }) => {
  const [formData, setFormData] = useState({
    goalAmount: initialData.goalAmount || 5000000,
    timeHorizon: initialData.timeHorizon || 5,
    currentSIP: initialData.currentSIP || 12000,
    expectedReturn: initialData.expectedReturn || 12,
    currentAmount: initialData.currentAmount || 0
  })
  
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await analyzeGoal({
        goalAmount: formData.goalAmount,
        years: formData.timeHorizon,
        monthlySIP: formData.currentSIP,
        expectedReturnPA: formData.expectedReturn / 100
      })
      
      setAnalysis(result)
      onAnalysis?.(result)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Real-time calculations
  const monthlyReturn = formData.expectedReturn / 100 / 12
  const totalMonths = formData.timeHorizon * 12
  const projectedAmount = formData.currentSIP * 
    (monthlyReturn > 0 ? 
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) : 
      totalMonths
    )
  const shortfall = Math.max(0, formData.goalAmount - projectedAmount)
  const requiredSIP = shortfall > 0 ? 
    formData.currentSIP + (shortfall * monthlyReturn) / (Math.pow(1 + monthlyReturn, totalMonths) - 1) :
    formData.currentSIP

  return (
    <div className="space-y-6">
      <form onSubmit={handleAnalyze} className="space-y-6">
        {/* Goal Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Amount (₹)
          </label>
          <input
            type="number"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="100000"
            step="100000"
          />
          <div className="text-sm text-gray-500 mt-1">
            ₹{formData.goalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Time Horizon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Horizon (Years)
          </label>
          <input
            type="range"
            name="timeHorizon"
            value={formData.timeHorizon}
            onChange={handleChange}
            min="1"
            max="30"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>1 year</span>
            <span className="font-medium">{formData.timeHorizon} years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Current SIP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly SIP Amount (₹)
          </label>
          <input
            type="number"
            name="currentSIP"
            value={formData.currentSIP}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1000"
            step="1000"
          />
        </div>

        {/* Expected Return */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="range"
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleChange}
            min="6"
            max="18"
            step="0.5"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>6%</span>
            <span className="font-medium">{formData.expectedReturn}%</span>
            <span>18%</span>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <LoadingSpinner size="small" color="white" />
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              <span>Analyze SIP</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Projected Amount</div>
          <div className="text-xl font-bold text-blue-800">
            ₹{(projectedAmount / 100000).toFixed(1)}L
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 mb-1">Shortfall</div>
          <div className="text-xl font-bold text-orange-800">
            ₹{(shortfall / 100000).toFixed(1)}L
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">Required SIP</div>
          <div className="text-xl font-bold text-green-800">
            ₹{Math.round(requiredSIP).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">{analysis.suggestionText}</p>
            </div>
            
            {analysis.gapToGoal > 0 && (
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Recommendation</span>
                </div>
                <p className="text-amber-700">
                  Increase your monthly SIP by ₹{Math.round(analysis.gapToGoal / totalMonths).toLocaleString('en-IN')} 
                  to bridge the gap and achieve your goal.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Success Probability:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {Math.round(analysis.successProbability * 100)}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">Projected Corpus:</span>
                <span className="ml-2 font-medium text-gray-900">
                  ₹{(analysis.projectedCorpus / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SIPForm
