const { body, param, query, validationResult } = require('express-validator')

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// Common validators
const validators = {
  // User validators
  email: body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  password: body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters'),

  firstName: body('profile.firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  lastName: body('profile.lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  age: body('profile.age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),

  // Goal validators
  goalTitle: body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Goal title must be between 3 and 100 characters'),

  goalAmount: body('targetAmount')
    .isFloat({ min: 1000, max: 100000000 })
    .withMessage('Goal amount must be between ₹1,000 and ₹10 crores'),

  goalCategory: body('category')
    .isIn(['home', 'car', 'education', 'retirement', 'emergency', 'travel', 'other'])
    .withMessage('Invalid goal category'),

  targetDate: body('targetDate')
    .isISO8601()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Target date must be in the future')
      }
      return true
    }),

  // Financial validators
  sipAmount: body('monthlySIP')
    .isFloat({ min: 100, max: 1000000 })
    .withMessage('SIP amount must be between ₹100 and ₹10 lakhs'),

  returnRate: body('expectedReturn')
    .optional()
    .isFloat({ min: 0.01, max: 1.0 })
    .withMessage('Return rate must be between 1% and 100%'),

  // MongoDB ObjectId validator
  mongoId: (field = 'id') => 
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),

  // Query validators
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  // File upload validators
  fileUpload: body('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required')
      }
      return true
    })
}

// Validation chains for different endpoints
const validationChains = {
  // Auth
  register: [
    validators.email,
    validators.password,
    validators.firstName,
    validators.lastName,
    validators.age,
    handleValidationErrors
  ],

  login: [
    validators.email,
    body('password').exists().withMessage('Password is required'),
    handleValidationErrors
  ],

  // Goals
  createGoal: [
    validators.goalTitle,
    validators.goalAmount,
    validators.goalCategory,
    validators.targetDate,
    body('description').optional().trim().isLength({ max: 500 }),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    handleValidationErrors
  ],

  updateGoal: [
    validators.mongoId(),
    validators.goalTitle,
    validators.goalAmount,
    validators.goalCategory,
    validators.targetDate,
    handleValidationErrors
  ],

  // AI
  chatRequest: [
    body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message is required and must be under 1000 characters'),
    body('context').optional().isObject(),
    handleValidationErrors
  ],

  goalAnalysis: [
    validators.goalAmount.withMessage('Goal amount is required'),
    body('years').isFloat({ min: 0.5, max: 50 }).withMessage('Years must be between 0.5 and 50'),
    validators.sipAmount,
    validators.returnRate,
    handleValidationErrors
  ],

  // Profile
  updateProfile: [
    validators.firstName.optional(),
    validators.lastName.optional(),
    validators.age,
    body('profile.monthlyIncome').optional().isFloat({ min: 0 }),
    body('profile.monthlyExpenses').optional().isFloat({ min: 0 }),
    body('profile.riskTolerance').optional().isIn(['low', 'medium', 'high']),
    handleValidationErrors
  ]
}

module.exports = {
  validators,
  validationChains,
  handleValidationErrors
}
