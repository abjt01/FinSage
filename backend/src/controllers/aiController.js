const axios = require('axios')
const logger = require('../utils/logger')

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8001'

// @desc    Proxy AI chat requests
// @route   POST /api/ai/chat
// @access  Private
exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body
    
    // Add user context
    const userContext = {
      ...context,
      userId: req.user._id,
      userProfile: req.user.profile
    }

    const response = await axios.post(`${AI_ENGINE_URL}/chat`, {
      message,
      context: userContext
    }, { timeout: 10000 })
    
    res.status(200).json(response.data)
  } catch (error) {
    logger.error('AI chat error:', error)
    
    // Fallback response
    res.status(200).json({
      response: "I'm having trouble connecting to the AI service right now. However, based on your financial profile, I can see you're making good progress toward your goals. Would you like me to analyze your SIP strategy?",
      source: 'fallback'
    })
  }
}

// @desc    Analyze financial goal
// @route   POST /api/ai/analyze/goal
// @access  Private
exports.analyzeGoal = async (req, res) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/analyze/goal`, req.body, {
      timeout: 15000
    })
    
    res.status(200).json(response.data)
  } catch (error) {
    logger.error('AI analyze error:', error)
    
    // Fallback calculation
    const { goalAmount, years, monthlySIP, expectedReturnPA } = req.body
    const monthlyReturn = expectedReturnPA / 12
    const months = years * 12
    
    const fv = monthlySIP * (((1 + monthlyReturn) ** months - 1) / monthlyReturn)
    const gap = Math.max(0, goalAmount - fv)
    
    res.status(200).json({
      projectedCorpus: fv,
      gapToGoal: gap,
      suggestionText: `With ₹${monthlySIP.toLocaleString()}/month at ${(expectedReturnPA*100).toFixed(0)}% returns, you'll reach ₹${(fv/100000).toFixed(1)}L in ${years} years.`,
      successProbability: Math.min(fv / goalAmount, 1.0),
      source: 'fallback'
    })
  }
}

// @desc    Simulate SIP projections
// @route   POST /api/ai/simulate/goal
// @access  Private
exports.simulateGoal = async (req, res) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/simulate/goal`, req.body, {
      timeout: 20000
    })
    
    res.status(200).json(response.data)
  } catch (error) {
    logger.error('AI simulate error:', error)
    
    // Simple fallback simulation
    const { monthlySIP, timeHorizon, expectedReturn } = req.body
    const monthlyReturn = expectedReturn / 12
    
    const scenarios = []
    for (let i = 1; i <= timeHorizon; i++) {
      const expected = monthlySIP * i * Math.pow(1 + monthlyReturn, i)
      scenarios.push(expected)
    }
    
    res.status(200).json({
      mean: scenarios[timeHorizon - 1],
      scenarios: scenarios.slice(0, 100),
      success_probability: 0.75,
      source: 'fallback'
    })
  }
}
