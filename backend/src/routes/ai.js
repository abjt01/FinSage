const express = require('express')
const { body } = require('express-validator')
const { chat, analyzeGoal, simulateGoal } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect) // All routes protected

router.post('/chat', [
  body('message').trim().isLength({ min: 1 }).withMessage('Message is required')
], chat)

router.post('/analyze/goal', [
  body('goalAmount').isFloat({ min: 1000 }).withMessage('Goal amount must be at least ₹1,000'),
  body('years').isFloat({ min: 0.5, max: 50 }).withMessage('Years must be between 0.5 and 50'),
  body('monthlySIP').isFloat({ min: 100 }).withMessage('Monthly SIP must be at least ₹100'),
  body('expectedReturnPA').isFloat({ min: 0.01, max: 1 }).withMessage('Expected return must be between 1% and 100%')
], analyzeGoal)

router.post('/simulate/goal', [
  body('monthlySIP').isFloat({ min: 100 }).withMessage('Monthly SIP required'),
  body('timeHorizon').isInt({ min: 6, max: 600 }).withMessage('Time horizon between 6-600 months'),
  body('expectedReturn').isFloat({ min: 0.01, max: 1 }).withMessage('Expected return required')
], simulateGoal)

module.exports = router
