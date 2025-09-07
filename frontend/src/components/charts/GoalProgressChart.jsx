import React from 'react'
import Plot from 'react-plotly.js'

const GoalProgressChart = ({ 
  goals = [],
  height = 300
}) => {
  const chartData = [
    {
      x: goals.map(goal => `${goal.progress}%`),
      y: goals.map(goal => goal.title),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: goals.map(goal => 
          goal.progress >= 80 ? '#22C55E' :
          goal.progress >= 60 ? '#3B82F6' :
          goal.progress >= 40 ? '#F59E0B' : '#EF4444'
        ),
        line: {
          color: 'rgba(255,255,255,0.8)',
          width: 1
        }
      },
      text: goals.map(goal => `₹${(goal.currentAmount / 100000).toFixed(1)}L`),
      textposition: 'inside',
      textfont: { color: 'white', size: 12 },
      hovertemplate: '<b>%{y}</b><br>Progress: %{x}<br>Current: ₹%{text}<extra></extra>'
    }
  ]

  const layout = {
    title: {
      text: 'Goal Progress Overview',
      font: { size: 16, color: '#374151' },
      x: 0.05
    },
    xaxis: {
      title: 'Progress (%)',
      range: [0, 100],
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB'
    },
    yaxis: {
      gridcolor: '#F3F4F6',
      linecolor: '#E5E7EB'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 150, r: 40, t: 50, b: 50 },
    height: height,
    showlegend: false
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  return (
    <Plot
      data={chartData}
      layout={layout}
      config={config}
      className="w-full"
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default GoalProgressChart
