import { useState } from 'react'
import { useMutation } from 'react-query'
import { simulateGoal, analyzeGoal } from '../services/aiService'

export const useSimulation = () => {
  const [simulationData, setSimulationData] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)

  const simulateMutation = useMutation(
    simulateGoal,
    {
      onSuccess: (data) => {
        setSimulationData(data)
      }
    }
  )

  const analyzeMutation = useMutation(
    analyzeGoal,
    {
      onSuccess: (data) => {
        setAnalysisData(data)
      }
    }
  )

  return {
    simulationData,
    analysisData,
    runSimulation: simulateMutation.mutate,
    runAnalysis: analyzeMutation.mutate,
    isSimulating: simulateMutation.isLoading,
    isAnalyzing: analyzeMutation.isLoading,
    simulationError: simulateMutation.error,
    analysisError: analyzeMutation.error
  }
}
