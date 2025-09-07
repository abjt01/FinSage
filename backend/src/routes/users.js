const express = require('express')
const { body } = require('express-validator')
const User = require('../models/User')
const Goal = require('../models/Goal')
const Account = require('../models/Account')
const { protect } = require('../middleware/auth')
const logger = require('../utils/logger')

const router = express.Router()

// All routes are protected
router.use(protect)

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id

    // Get user with basic info
    const user = await User.findById(userId)

    // Get user's goals
    const goals = await Goal.find({ userId, status: 'active' })
    
    // Get user's accounts
    const accounts = await Account.find({ userId, isActive: true })

    // Calculate net worth
    const netWorthData = user.calculateNetWorth()
    
    // Calculate total SIP amount
    const totalSIP = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
    
    // Find primary goal (highest priority active goal)
    const primaryGoal = goals
      .filter(g => g.status === 'active')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })[0]

    // Calculate goal progress
    const goalProgress = primaryGoal ? primaryGoal.progress : 0

    // Mock some additional data for demo
    const dashboardData = {
      user: {
        name: user.getFullName(),
        email: user.email,
        profile: user.profile
      },
      netWorth: netWorthData.netWorth,
      netWorthChange: 12.5, // Mock percentage change
      totalSIP,
      sipReturn: 8.2, // Mock return percentage
      goal: primaryGoal ? {
        title: primaryGoal.title,
        targetAmount: primaryGoal.targetAmount,
        currentAmount: primaryGoal.currentAmount,
        targetDate: primaryGoal.targetDate,
        timeHorizonMonths: primaryGoal.monthsRemaining
      } : null,
      goalProgress,
      accounts: accounts.map(acc => ({
        type: acc.accountType,
        bankName: acc.bankName,
        balance: acc.balance,
        accountNumber: acc.accountNumber
      })),
      recentGoals: goals.slice(0, 3),
      totalGoals: goals.length
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    logger.error('Dashboard data error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', [
  body('profile.firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('profile.lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('profile.age').optional().isInt({ min: 18, max: 100 }),
  body('profile.monthlyIncome').optional().isFloat({ min: 0 }),
  body('profile.monthlyExpenses').optional().isFloat({ min: 0 }),
  body('profile.riskTolerance').optional().isIn(['low', 'medium', 'high'])
], async (req, res) => {
  try {
    const updates = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Profile update error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    })
  }
})

// @desc    Get user's net worth
// @route   GET /api/users/networth
// @access  Private
router.get('/networth', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const netWorthData = user.calculateNetWorth()

    res.status(200).json({
      success: true,
      data: netWorthData
    })
  } catch (error) {
    logger.error('Net worth error:', error)
    res.status(500).json({
      success: false,
      message: 'Error calculating net worth'
    })
  }
})

module.exports = router
