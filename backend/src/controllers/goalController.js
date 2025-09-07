const Goal = require('../models/Goal')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const logger = require('../utils/logger')

// @desc    Get all goals for logged in user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res) => {
  try {
    const { status, category, sort } = req.query
    const userId = req.user._id

    // Build query
    let query = { userId }
    
    if (status) {
      query.status = status
    }
    
    if (category) {
      query.category = category
    }

    // Build sort
    let sortOption = { createdAt: -1 } // Default: newest first
    
    if (sort === 'progress') {
      sortOption = { currentAmount: -1 }
    } else if (sort === 'deadline') {
      sortOption = { targetDate: 1 }
    } else if (sort === 'amount') {
      sortOption = { targetAmount: -1 }
    }

    const goals = await Goal.find(query)
      .sort(sortOption)
      .populate('userId', 'profile.firstName profile.lastName')

    // Calculate summary statistics
    const summary = {
      totalGoals: goals.length,
      activeGoals: goals.filter(g => g.status === 'active').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
      averageProgress: goals.length > 0 
        ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
        : 0
    }

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
      summary
    })

  } catch (error) {
    logger.error('Get goals error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching goals'
    })
  }
}

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      })
    }

    res.status(200).json({
      success: true,
      data: goal
    })

  } catch (error) {
    logger.error('Get goal error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching goal'
    })
  }
}

// @desc    Create new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    // Add user ID to request body
    req.body.userId = req.user._id

    const goal = await Goal.create(req.body)

    logger.info(`New goal created: ${goal.title} for user: ${req.user.email}`)

    res.status(201).json({
      success: true,
      data: goal
    })

  } catch (error) {
    logger.error('Create goal error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating goal'
    })
  }
}

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    let goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      })
    }

    // Update lastUpdated
    req.body.lastUpdated = new Date()

    goal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    logger.info(`Goal updated: ${goal.title} for user: ${req.user.email}`)

    res.status(200).json({
      success: true,
      data: goal
    })

  } catch (error) {
    logger.error('Update goal error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating goal'
    })
  }
}

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      })
    }

    await goal.deleteOne()

    logger.info(`Goal deleted: ${goal.title} for user: ${req.user.email}`)

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    })

  } catch (error) {
    logger.error('Delete goal error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting goal'
    })
  }
}

// @desc    Add AI recommendation to goal
// @route   POST /api/goals/:id/recommendations
// @access  Private
exports.addRecommendation = async (req, res) => {
  try {
    const { recommendation, reasoning, suggestedAction } = req.body

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      })
    }

    await goal.addRecommendation(recommendation, reasoning, suggestedAction)

    res.status(200).json({
      success: true,
      data: goal
    })

  } catch (error) {
    logger.error('Add recommendation error:', error)
    res.status(500).json({
      success: false,
      message: 'Error adding recommendation'
    })
  }
}

// @desc    Update goal progress
// @route   PATCH /api/goals/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { currentAmount } = req.body

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id
    })

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      })
    }

    await goal.updateProgress(currentAmount)

    res.status(200).json({
      success: true,
      data: goal
    })

  } catch (error) {
    logger.error('Update progress error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating progress'
    })
  }
}
