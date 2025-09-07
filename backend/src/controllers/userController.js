const User = require('../models/User')
const Goal = require('../models/Goal')
const logger = require('../utils/logger')
const { validationResult } = require('express-validator')

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    })
  }
}

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    const goals = await Goal.find({ userId, status: 'active' })

    // Calculate net worth
    const netWorthData = user.calculateNetWorth()
    
    // Calculate total SIP amount
    const totalSIP = goals.reduce((sum, goal) => sum + (goal.monthlyContribution || 0), 0)
    
    // Find primary goal
    const primaryGoal = goals
      .filter(g => g.status === 'active')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })[0]

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
      goalProgress: primaryGoal ? primaryGoal.progress : 0,
      accounts: user.mcpIntegration.accounts.map(acc => ({
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
}

// @desc    Get user's net worth
// @route   GET /api/users/networth
// @access  Private
exports.getNetWorth = async (req, res) => {
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
}
