const { body, param, query } = require('express-validator')

// User validation
exports.validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('profile.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('profile.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
]

exports.validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
]

// Goal validation
exports.validateGoal = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
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
    })
]

// AI validation
exports.validateChatRequest = [
  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message is required')
]

exports.validateGoalAnalysis = [
  body('goalAmount')
    .isFloat({ min: 1000 })
    .withMessage('Goal amount must be at least ₹1,000'),
  body('years')
    .isFloat({ min: 0.5, max: 50 })
    .withMessage('Years must be between 0.5 and 50'),
  body('monthlySIP')
    .isFloat({ min: 100 })
    .withMessage('Monthly SIP must be at least ₹100')
]

// Profile validation
exports.validateProfileUpdate = [
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }),
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }),
  body('profile.age')
    .optional()
    .isInt({ min: 18, max: 100 }),
  body('profile.monthlyIncome')
    .optional()
    .isFloat({ min: 0 }),
  body('profile.monthlyExpenses')
    .optional()
    .isFloat({ min: 0 })
]
