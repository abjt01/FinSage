const express = require('express')
const { body } = require('express-validator')
const {
  signup,
  login,
  getMe,
  logout,
  forgotPassword
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Validation middleware
const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('age')
    .optional()
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100')
]

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
]

// Routes
router.post('/signup', signupValidation, signup)
router.post('/login', loginValidation, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgotpassword', forgotPassword)

module.exports = router
