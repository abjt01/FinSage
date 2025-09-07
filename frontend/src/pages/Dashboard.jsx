import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, DollarSign, Brain, MessageCircle, Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

import { useQuery } from 'react-query'
import Plot from 'react-plotly.js'
import toast from 'react-hot-toast'

// Import services
import { getDashboardData } from '../services/dashboardService'
import { analyzeGoal, simulateGoal } from '../services/aiService'

// Import components
import NetWorthCard from '../components/dashboard/NetWorthCard'
import SIPCard from '../components/dashboard/SIPCard'
import GoalCard from '../components/dashboard/GoalCard'
import QuickActions from '../components/dashboard/QuickActions'
import ChatModal from '../components/modals/ChatModal'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
  const [chatOpen, setChatOpen] = useState(false)
  const [sipAmount, setSipAmount] = useState(12000)
  const [projectionData, setProjectionData] = useState(null)
  const [analysis, setAnalysis] = useState(null)

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboardData',
    getDashboardData,
    { refetchInterval: 30000 } // Refetch every 30 seconds
  )

  // Simulate SIP projection when amount changes
  useEffect(() => {
    if (dashboardData?.goal) {
      handleSipSimulation(sipAmount)
    }
  }, [sipAmount, dashboardData])

  const handleSipSimulation = async (amount) => {
    try {
      const simulation = await simulateGoal({
        monthlySIP: amount,
        targetAmount: dashboardData.goal.targetAmount,
        timeHorizon: dashboardData.goal.timeHorizonMonths,
        expectedReturn: 0.12, // 12% annual return
        volatility: 0.15 // 15% volatility
      })
      setProjectionData(simulation)
    } catch (error) {
      console.error('Simulation failed:', error)
    }
  }

  const handleGoalAnalysis = async () => {
    if (!dashboardData?.goal) return

    try {
      const analysisResult = await analyzeGoal({
        goalAmount: dashboardData.goal.targetAmount,
        years: dashboardData.goal.timeHorizonMonths / 12,
        monthlySIP: sipAmount,
        expectedReturnPA: 0.12
      })
      setAnalysis(analysisResult)
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error('Analysis failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Failed to load dashboard data</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  const createProjectionChart = () => {
    if (!projectionData) return null

    const months = Array.from({ length: 60 }, (_, i) => i + 1)
    const scenarios = projectionData.scenarios || []
    
    // Calculate corpus growth over time
    const corpusData = months.map(month => {
      const monthlyReturn = 0.01 // 1% monthly return (12% annual)
      return sipAmount * month * (1 + monthlyReturn) ** month
    })

    return (
      <Plot
        data={[
          {
            x: months,
            y: corpusData,
            type: 'scatter',
            mode: 'lines',
            name: 'Projected Corpus',
            line: { color: '#3B82F6', width: 3 }
          },
          {
            x: [60],
            y: [dashboardData?.goal?.targetAmount || 5000000],
            type: 'scatter',
            mode: 'markers+text',
            name: 'Goal Target',
            marker: { color: '#EF4444', size: 12 },
            text: ['Goal: ₹50L'],
            textposition: 'top'
          }
        ]}
        layout={{
          title: 'SIP Projection Over Time',
          xaxis: { title: 'Months' },
          yaxis: { title: 'Amount (₹)', tickformat: ',.0f' },
          height: 300,
          margin: { l: 80, r: 40, t: 50, b: 50 },
          showlegend: false
        }}
        config={{ displayModeBar: false }}
        className="w-full"
      />
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData?.user?.name || 'Arjun'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Let's check on your financial goals today
          </p>
        </div>
        <button
          onClick={() => setChatOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all"
        >
          <Brain className="w-5 h-5" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NetWorthCard 
          netWorth={dashboardData?.netWorth || 650000}
          change={dashboardData?.netWorthChange || 12.5}
        />
        <SIPCard 
          amount={sipAmount}
          onChange={setSipAmount}
          monthlyReturn={dashboardData?.sipReturn || 8.2}
        />
        <GoalCard 
          goal={dashboardData?.goal}
          progress={dashboardData?.goalProgress || 45}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              SIP Projection
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Monthly SIP:</span>
              <span className="font-semibold text-blue-600">
                ₹{sipAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          {createProjectionChart()}
          
          {/* SIP Slider */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adjust Monthly SIP Amount
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={sipAmount}
              onChange={(e) => setSipAmount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹5K</span>
              <span>₹50K</span>
            </div>
          </div>
        </motion.div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              AI Analysis
            </h3>
            <button
              onClick={handleGoalAnalysis}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Analyze Goal
            </button>
          </div>
          
          {analysis ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Goal Achievement Analysis
                </h4>
                <p className="text-blue-700 text-sm">
                  {analysis.suggestionText || 
                    `At ₹${sipAmount.toLocaleString('en-IN')}/month SIP and 12% returns, you'll reach ₹${Math.round(analysis.projectedCorpus / 100000)}L. ${analysis.gapToGoal > 0 ? `Increase SIP by ₹${Math.round(analysis.gapToGoal / 1000)}K/month to hit your ₹50L target.` : 'You\'re on track to meet your goal!'}`}
                </p>
              </div>
              
              {analysis.gapToGoal > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="text-amber-800 font-semibold mb-1">
                    Recommendation
                  </div>
                  <div className="text-amber-700 text-sm">
                    Increase monthly SIP by ₹{Math.round(analysis.gapToGoal / 1000)}K to reach your goal
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Click "Analyze Goal" to get AI-powered insights</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Chat Modal */}
      <ChatModal 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialContext={{
          netWorth: dashboardData?.netWorth,
          sipAmount: sipAmount,
          goal: dashboardData?.goal
        }}
      />

      {/* Success Animation */}
      {projectionData?.success_probability > 0.8 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          🎉 Goal Achievable!
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard