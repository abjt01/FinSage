import React, { useState } from 'react'
import { X, Play, BarChart3, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { simulateGoal } from '../../services/aiService'
import LoadingSpinner from '../common/LoadingSpinner'
import Plot from 'react-plotly.js'

const SimulationModal = ({ isOpen, onClose, initialData = {} }) => {
  const [simulationParams, setSimulationParams] = useState({
    monthlySIP: initialData.monthlySIP || 12000,
    targetAmount: initialData.targetAmount || 5000000,
    timeHorizon: initialData.timeHorizon || 60, // months
    expectedReturn: initialData.expectedReturn || 0.12,
    volatility: initialData.volatility || 0.15
  })
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const simulation = await simulateGoal(simulationParams)
      setResults(simulation)
    } catch (error) {
      console.error('Simulation failed:', error)
      // Generate fallback simulation
      setResults(generateFallbackSimulation())
    } finally {
      setLoading(false)
    }
  }

  const generateFallbackSimulation = () => {
    const scenarios = []
    const months = simulationParams.timeHorizon
    const monthlyReturn = simulationParams.expectedReturn / 12
    
    // Generate 100 scenarios
    for (let i = 0; i < 100; i++) {
      let value = 0
      for (let month = 1; month <= months; month++) {
        value += simulationParams.monthlySIP
        const randomReturn = monthlyReturn + (Math.random() - 0.5) * 0.02
        value *= (1 + randomReturn)
      }
      scenarios.push(Math.max(0, value))
    }
    
    scenarios.sort((a, b) => a - b)
    
    return {
      mean: scenarios.reduce((sum, val) => sum + val, 0) / scenarios.length,
      median: scenarios[Math.floor(scenarios.length / 2)],
      p10: scenarios[Math.floor(scenarios.length * 0.1)],
      p90: scenarios[Math.floor(scenarios.length * 0.9)],
      success_probability: scenarios.filter(s => s >= simulationParams.targetAmount).length / scenarios.length,
      scenarios: scenarios
    }
  }

  const handleParamChange = (param, value) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }))
  }

  const createDistributionChart = () => {
    if (!results) return null

    // Create histogram data
    const scenarios = results.scenarios || []
    const bins = 20
    const min = Math.min(...scenarios)
    const max = Math.max(...scenarios)
    const binSize = (max - min) / bins
    
    const histogram = Array(bins).fill(0)
    const binLabels = []
    
    for (let i = 0; i < bins; i++) {
      binLabels.push((min + i * binSize) / 100000) // Convert to lakhs
    }
    
    scenarios.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1)
      histogram[binIndex]++
    })

    return (
      <Plot
        data={[
          {
            x: binLabels,
            y: histogram,
            type: 'bar',
            marker: {
              color: binLabels.map(bin => 
                bin * 100000 >= simulationParams.targetAmount ? '#22C55E' : '#3B82F6'
              )
            },
            name: 'Outcomes'
          },
          // Target line
          {
            x: [simulationParams.targetAmount / 100000, simulationParams.targetAmount / 100000],
            y: [0, Math.max(...histogram)],
            type: 'scatter',
            mode: 'lines',
            line: { color: '#EF4444', width: 3, dash: 'dash' },
            name: 'Target'
          }
        ]}
        layout={{
          title: 'Simulation Results Distribution',
          xaxis: { title: 'Final Amount (₹ Lakhs)' },
          yaxis: { title: 'Frequency' },
          height: 400,
          showlegend: true,
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)'
        }}
        config={{ displayModeBar: false }}
        className="w-full"
      />
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Monte Carlo Simulation</h3>
                    <p className="text-sm text-gray-500">Analyze goal achievement probability</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Parameters */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Simulation Parameters</h4>
                    
                    {/* Monthly SIP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly SIP: ₹{simulationParams.monthlySIP.toLocaleString('en-IN')}
                      </label>
                      <input
                        type="range"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={simulationParams.monthlySIP}
                        onChange={(e) => handleParamChange('monthlySIP', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Target Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Amount: ₹{(simulationParams.targetAmount / 100000).toFixed(1)}L
                      </label>
                      <input
                        type="range"
                        min="1000000"
                        max="20000000"
                        step="500000"
                        value={simulationParams.targetAmount}
                        onChange={(e) => handleParamChange('targetAmount', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Time Horizon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Horizon: {Math.round(simulationParams.timeHorizon / 12)} years
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="360"
                        step="12"
                        value={simulationParams.timeHorizon}
                        onChange={(e) => handleParamChange('timeHorizon', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Expected Return */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Return: {(simulationParams.expectedReturn * 100).toFixed(1)}%
                      </label>
                      <input
                        type="range"
                        min="0.06"
                        max="0.18"
                        step="0.005"
                        value={simulationParams.expectedReturn}
                        onChange={(e) => handleParamChange('expectedReturn', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Volatility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volatility: {(simulationParams.volatility * 100).toFixed(1)}%
                      </label>
                      <input
                        type="range"
                        min="0.05"
                        max="0.30"
                        step="0.01"
                        value={simulationParams.volatility}
                        onChange={(e) => handleParamChange('volatility', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Run Simulation Button */}
                    <button
                      onClick={handleSimulate}
                      disabled={loading}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <LoadingSpinner size="small" color="white" />
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          <span>Run Simulation</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                    {results ? (
                      <>
                        <h4 className="font-semibold text-gray-900">Results</h4>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm text-blue-600">Success Rate</div>
                            <div className="text-xl font-bold text-blue-800">
                              {Math.round(results.success_probability * 100)}%
                            </div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-sm text-green-600">Expected Value</div>
                            <div className="text-xl font-bold text-green-800">
                              ₹{(results.mean / 100000).toFixed(1)}L
                            </div>
                          </div>
                        </div>

                        {/* Percentiles */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">10th Percentile:</span>
                            <span className="font-medium">₹{(results.p10 / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Median:</span>
                            <span className="font-medium">₹{(results.median / 100000).toFixed(1)}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">90th Percentile:</span>
                            <span className="font-medium">₹{(results.p90 / 100000).toFixed(1)}L</span>
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className={`p-3 rounded-lg ${
                          results.success_probability >= 0.8 
                            ? 'bg-green-50 border border-green-200' 
                            : results.success_probability >= 0.6
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className={`w-4 h-4 ${
                              results.success_probability >= 0.8 ? 'text-green-600' :
                              results.success_probability >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                            }`} />
                            <span className={`font-medium ${
                              results.success_probability >= 0.8 ? 'text-green-800' :
                              results.success_probability >= 0.6 ? 'text-yellow-800' : 'text-red-800'
                            }`}>
                              {results.success_probability >= 0.8 ? 'Excellent' :
                               results.success_probability >= 0.6 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            results.success_probability >= 0.8 ? 'text-green-700' :
                            results.success_probability >= 0.6 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {results.success_probability >= 0.8 
                              ? 'You have a high probability of achieving your goal with current settings.'
                              : results.success_probability >= 0.6
                              ? 'Consider increasing SIP amount or extending timeline for better results.'
                              : 'Significant changes needed. Consider increasing SIP amount substantially.'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Run simulation to see results</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart */}
                {results && (
                  <div className="mt-6">
                    {createDistributionChart()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SimulationModal
