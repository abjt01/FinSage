import React, { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { formatCurrency } from '../../utils/formatters'

const PortfolioChart = ({ 
  data = [], 
  height = 300, 
  title = "Portfolio Growth Over Time",
  loading = false 
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate sample data if none provided
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (11 - i))
        return date.toISOString().slice(0, 7)
      })
      
      const values = [
        500000, 520000, 515000, 545000, 560000, 580000,
        575000, 610000, 625000, 640000, 650000, 665000
      ]
      
      return [
        {
          x: months,
          y: values,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Portfolio Value',
          line: { 
            color: '#3B82F6', 
            width: 3,
            shape: 'spline'
          },
          marker: { 
            size: 8, 
            color: '#3B82F6',
            line: { color: 'white', width: 2 }
          },
          hovertemplate: '<b>%{x}</b><br>Value: ₹%{y:,.0f}<extra></extra>'
        }
      ]
    }
    
    return data
  }, [data])

  const layout = {
    title: {
      text: title,
      font: { size: 16, color: '#374151' },
      x: 0.05
    },
    xaxis: {
      title: 'Month',
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB',
      tickformat: '%b %Y'
    },
    yaxis: {
      title: 'Portfolio Value (₹)',
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB',
      tickformat: '₹,.0f'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 80, r: 40, t: 50, b: 50 },
    height: height,
    showlegend: false,
    hovermode: 'x unified'
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  if (loading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg animate-pulse" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Plot
        data={chartData}
        layout={layout}
        config={config}
        className="w-full"
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default PortfolioChart
