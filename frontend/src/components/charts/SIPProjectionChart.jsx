import React, { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import { formatCurrency } from '../../utils/formatters'

const SIPProjectionChart = ({ 
  sipAmount = 12000,
  targetAmount = 5000000,
  expectedReturn = 0.12,
  volatility = 0.15,
  timeHorizon = 60,
  onSipChange,
  height = 400
}) => {
  const [projectionData, setProjectionData] = useState(null)
  const [loading, setLoading] = useState(false)

  // Calculate SIP projections with Monte Carlo simulation
  const calculateProjections = useMemo(() => {
    const months = Array.from({ length: timeHorizon }, (_, i) => i + 1)
    const monthlyReturn = expectedReturn / 12
    const monthlyVolatility = volatility / Math.sqrt(12)
    
    // Monte Carlo simulation (simplified)
    const simulations = 1000
    const results = []
    
    for (let month of months) {
      const monthlyResults = []
      
      for (let sim = 0; sim < simulations; sim++) {
        let portfolioValue = 0
        
        for (let m = 1; m <= month; m++) {
          // Add monthly SIP
          portfolioValue += sipAmount
          
          // Apply random return
          const randomReturn = monthlyReturn + (Math.random() - 0.5) * monthlyVolatility * 2
          portfolioValue *= (1 + randomReturn)
        }
        
        monthlyResults.push(portfolioValue)
      }
      
      monthlyResults.sort((a, b) => a - b)
      results.push({
        month,
        p10: monthlyResults[Math.floor(simulations * 0.1)],
        p50: monthlyResults[Math.floor(simulations * 0.5)],
        p90: monthlyResults[Math.floor(simulations * 0.9)]
      })
    }
    
    return results
  }, [sipAmount, expectedReturn, volatility, timeHorizon])

  const chartData = [
    // P90 area (upper confidence)
    {
      x: calculateProjections.map(d => d.month),
      y: calculateProjections.map(d => d.p90),
      fill: 'tonexty',
      type: 'scatter',
      mode: 'none',
      name: '90th Percentile',
      fillcolor: 'rgba(59, 130, 246, 0.1)',
      line: { color: 'transparent' },
      hovertemplate: 'Month %{x}<br>P90: ₹%{y:,.0f}<extra></extra>'
    },
    // P50 (median) line
    {
      x: calculateProjections.map(d => d.month),
      y: calculateProjections.map(d => d.p50),
      type: 'scatter',
      mode: 'lines',
      name: 'Expected Value (P50)',
      line: { color: '#3B82F6', width: 3 },
      hovertemplate: 'Month %{x}<br>Expected: ₹%{y:,.0f}<extra></extra>'
    },
    // P10 area (lower confidence)
    {
      x: calculateProjections.map(d => d.month),
      y: calculateProjections.map(d => d.p10),
      fill: 'tonexty',
      type: 'scatter',
      mode: 'none',
      name: '10th Percentile',
      fillcolor: 'rgba(59, 130, 246, 0.1)',
      line: { color: 'transparent' },
      hovertemplate: 'Month %{x}<br>P10: ₹%{y:,.0f}<extra></extra>'
    },
    // Target line
    {
      x: [1, timeHorizon],
      y: [targetAmount, targetAmount],
      type: 'scatter',
      mode: 'lines',
      name: 'Goal Target',
      line: { color: '#EF4444', width: 2, dash: 'dash' },
      hovertemplate: 'Target: ₹%{y:,.0f}<extra></extra>'
    }
  ]

  const layout = {
    title: {
      text: `SIP Projection: ₹${sipAmount.toLocaleString('en-IN')}/month`,
      font: { size: 16, color: '#374151' },
      x: 0.05
    },
    xaxis: {
      title: 'Months',
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB'
    },
    yaxis: {
      title: 'Portfolio Value (₹)',
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB',
      tickformat: '₹,.0s'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 80, r: 40, t: 60, b: 80 },
    height: height,
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#E5E7EB',
      borderwidth: 1
    },
    hovermode: 'x unified'
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  return (
    <div className="space-y-4">
      <Plot
        data={chartData}
        layout={layout}
        config={config}
        className="w-full"
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* SIP Amount Slider */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Monthly SIP Amount
          </label>
          <span className="text-lg font-semibold text-blue-600">
            ₹{sipAmount.toLocaleString('en-IN')}
          </span>
        </div>
        
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={sipAmount}
          onChange={(e) => onSipChange?.(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((sipAmount - 1000) / (50000 - 1000)) * 100}%, #E5E7EB ${((sipAmount - 1000) / (50000 - 1000)) * 100}%, #E5E7EB 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <div className="text-xs text-gray-500">Expected (5Y)</div>
            <div className="text-sm font-semibold text-gray-900">
              ₹{calculateProjections[timeHorizon - 1]?.p50?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Best Case</div>
            <div className="text-sm font-semibold text-green-600">
              ₹{calculateProjections[timeHorizon - 1]?.p90?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Worst Case</div>
            <div className="text-sm font-semibold text-red-600">
              ₹{calculateProjections[timeHorizon - 1]?.p10?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SIPProjectionChart
