const axios = require('axios')
const logger = require('../utils/logger')
const config = require('../config')

class AIService {
  constructor() {
    this.baseURL = config.aiEngineUrl
    this.timeout = 15000
  }

  async makeRequest(endpoint, data, timeout = this.timeout) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, { timeout })
      return response.data
    } catch (error) {
      logger.error(`AI Service request failed for ${endpoint}:`, error.message)
      throw new Error(`AI service unavailable: ${error.message}`)
    }
  }

  async chat(message, context = {}) {
    return await this.makeRequest('/chat', { message, context })
  }

  async analyzeGoal(goalData) {
    return await this.makeRequest('/analyze/goal', goalData)
  }

  async simulateGoal(simulationData) {
    return await this.makeRequest('/simulate/goal', simulationData, 20000) // Longer timeout for simulation
  }

  async optimizeSIP(sipData) {
    return await this.makeRequest('/optimize/sip', sipData)
  }

  async generateReport(reportData) {
    return await this.makeRequest('/export/pdf', reportData, 30000) // Long timeout for report generation
  }

  // Health check for AI service
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/health`, { timeout: 5000 })
      return response.status === 200
    } catch (error) {
      return false
    }
  }
}

module.exports = new AIService()
