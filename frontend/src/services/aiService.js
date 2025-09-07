import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

class AIService {
  async analyzeGoal(goalData) {
    try {
      const response = await api.post(`${API_ENDPOINTS.ai.analyze}/goal`, goalData)
      return response.data
    } catch (error) {
      throw new Error('Failed to analyze goal: ' + error.message)
    }
  }

  async simulateGoal(simulationData) {
    try {
      const response = await api.post(`${API_ENDPOINTS.ai.simulate}/goal`, simulationData)
      return response.data
    } catch (error) {
      throw new Error('Failed to simulate goal: ' + error.message)
    }
  }

  async optimizeSIP(optimizationData) {
    try {
      const response = await api.post(`${API_ENDPOINTS.ai.optimize}/sip`, optimizationData)
      return response.data
    } catch (error) {
      throw new Error('Failed to optimize SIP: ' + error.message)
    }
  }

  async chatWithAI(message, context = {}) {
    try {
      const response = await api.post(API_ENDPOINTS.ai.chat, {
        message,
        context
      })
      return response.data
    } catch (error) {
      throw new Error('Failed to get AI response: ' + error.message)
    }
  }

  async exportReport(reportData) {
    try {
      const response = await api.post('/api/ai/export/pdf', reportData, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'finsage-report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      throw new Error('Failed to export report: ' + error.message)
    }
  }
}

// Export individual functions for easier use
export const analyzeGoal = async (goalData) => {
  const service = new AIService()
  return await service.analyzeGoal(goalData)
}

export const simulateGoal = async (simulationData) => {
  const service = new AIService()
  return await service.simulateGoal(simulationData)
}

export const optimizeSIP = async (optimizationData) => {
  const service = new AIService()
  return await service.optimizeSIP(optimizationData)
}

export const chatWithAI = async (message, context) => {
  const service = new AIService()
  return await service.chatWithAI(message, context)
}

export const exportReport = async (reportData) => {
  const service = new AIService()
  return await service.exportReport(reportData)
}

export default new AIService()
