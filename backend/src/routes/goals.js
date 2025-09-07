const express = require('express')
const { body } = require('express-validator')
const {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  addRecommendation,
  updateProgress
} = require('../controllers/goalController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation middleware
const goalValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .isIn(['home', 'car', 'education', 'retirement', 'emergency', 'travel', 'other'])
    .withMessage('Invalid category'),
  body('targetAmount')
    .isFloat({ min: 1000, max: 100000000 })
    .withMessage('Target amount must be between ₹1,000 and ₹10 crores'),
  body('targetDate')
    .isISO8601()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Target date must be in the future')
      }
      return true
    }),
  body('monthlyContribution')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Monthly contribution must be a positive number'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
]

const progressValidation = [
  body('currentAmount')
    .isFloat({ min: 0 })
    .withMessage('Current amount must be a positive number')
]

// Routes
router.route('/')
  .get(getGoals)
  .post(goalValidation, createGoal)

router.route('/:id')
  .get(getGoal)
  .put(goalValidation, updateGoal)
  .delete(deleteGoal)

router.post('/:id/recommendations', [
  body('recommendation').trim().isLength({ min: 10 }).withMessage('Recommendation is required'),
  body('reasoning').trim().isLength({ min: 10 }).withMessage('Reasoning is required'),
  body('suggestedAction').optional().trim()
], addRecommendation)

router.patch('/:id/progress', progressValidation, updateProgress)

module.exports = router
