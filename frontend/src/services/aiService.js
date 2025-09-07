import api from './api'

class AIService {
  async chatWithAI(message, context = {}) {
    try {
      const response = await api.post('/api/ai/chat', {
        message,
        context
      })
      return response.data
    } catch (error) {
      console.warn('AI service not available, using fallback:', error.message)
      return this.getFallbackResponse(message, context)
    }
  }

  getFallbackResponse(message, context) {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('50l') || lowerMessage.includes('flat') || lowerMessage.includes('afford')) {
      return {
        response: `Based on your current ₹${context.sipAmount || 12000}/month SIP at 12% returns, you'll accumulate ₹38L in 5 years. To reach your ₹50L goal, increase your SIP by ₹6,000/month to ₹18,000. This gives you an 85% probability of achieving your dream home goal! 🏠`,
        source: 'fallback'
      }
    }
    
    return {
      response: "I understand your question about finances. Based on your current financial profile, here are some personalized insights. Would you like me to analyze a specific aspect of your financial goals? 🤔",
      source: 'fallback'
    }
  }

  async analyzeGoal(goalData) {
    try {
      const response = await api.post('/api/ai/analyze/goal', goalData)
      return response.data
    } catch (error) {
      // Fallback calculation
      const { goalAmount, years, monthlySIP, expectedReturnPA = 0.12 } = goalData
      const monthlyReturn = expectedReturnPA / 12
      const months = years * 12
      
      const fv = monthlySIP * (((1 + monthlyReturn) ** months - 1) / monthlyReturn)
      const gap = Math.max(0, goalAmount - fv)
      
      return {
        projectedCorpus: fv,
        gapToGoal: gap,
        suggestionText: `With ₹${monthlySIP.toLocaleString()}/month at ${(expectedReturnPA*100).toFixed(0)}% returns, you'll reach ₹${(fv/100000).toFixed(1)}L in ${years} years.`,
        successProbability: Math.min(fv / goalAmount, 1.0),
        source: 'fallback'
      }
    }
  }

  async simulateGoal(simulationData) {
    try {
      const response = await api.post('/api/ai/simulate/goal', simulationData)
      return response.data
    } catch (error) {
      // Simple fallback simulation
      const { monthlySIP, timeHorizon, expectedReturn = 0.12 } = simulationData
      const monthlyReturn = expectedReturn / 12
      
      const scenarios = []
      for (let i = 1; i <= timeHorizon; i++) {
        const expected = monthlySIP * i * Math.pow(1 + monthlyReturn, i)
        scenarios.push(expected)
      }
      
      return {
        mean: scenarios[timeHorizon - 1],
        scenarios: scenarios.slice(0, 100),
        success_probability: 0.75,
        source: 'fallback'
      }
    }
  }
}

export const { chatWithAI, analyzeGoal, simulateGoal } = new AIService()
export default new AIService()
