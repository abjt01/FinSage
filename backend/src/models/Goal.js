const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Basic Goal Info
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['home', 'car', 'education', 'retirement', 'emergency', 'travel', 'other'],
    index: true
  },

  // Financial Details
  targetAmount: {
    type: Number,
    required: true,
    min: 1000, // Minimum ₹1,000
    max: 100000000 // Maximum ₹10 Crore
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  targetDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date()
      },
      message: 'Target date must be in the future'
    }
  },

  // SIP Details
  monthlyContribution: {
    type: Number,
    default: 0,
    min: 0
  },
  sipDetails: {
    amount: {
      type: Number,
      default: 0
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly'
    },
    startDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },

  // Goal Management
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active',
    index: true
  },

  // AI Recommendations
  aiRecommendations: [{
    recommendation: {
      type: String,
      required: true
    },
    reasoning: {
      type: String,
      required: true
    },
    suggestedAction: String,
    actionTaken: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Tracking
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for performance
goalSchema.index({ userId: 1, status: 1 })
goalSchema.index({ userId: 1, category: 1 })
goalSchema.index({ targetDate: 1 })

// Virtual for progress percentage
goalSchema.virtual('progress').get(function() {
  if (this.targetAmount <= 0) return 0
  return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100)
})

// Virtual for remaining amount
goalSchema.virtual('remainingAmount').get(function() {
  return Math.max(this.targetAmount - this.currentAmount, 0)
})

// Virtual for months remaining
goalSchema.virtual('monthsRemaining').get(function() {
  const now = new Date()
  const target = new Date(this.targetDate)
  return Math.max(Math.ceil((target - now) / (1000 * 60 * 60 * 24 * 30)), 0)
})

// Instance method to add AI recommendation
goalSchema.methods.addRecommendation = function(recommendation, reasoning, suggestedAction) {
  this.aiRecommendations.unshift({
    recommendation,
    reasoning,
    suggestedAction,
    createdAt: new Date()
  })
  
  // Keep only last 10 recommendations
  if (this.aiRecommendations.length > 10) {
    this.aiRecommendations = this.aiRecommendations.slice(0, 10)
  }
  
  return this.save()
}

// Instance method to update progress
goalSchema.methods.updateProgress = function(newAmount) {
  this.currentAmount = newAmount
  this.lastUpdated = new Date()
  
  // Auto-complete goal if target reached
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed'
  }
  
  return this.save()
}

// Static method to get user goals summary
goalSchema.statics.getUserSummary = async function(userId) {
  const summary = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalTarget: { $sum: '$targetAmount' },
        totalCurrent: { $sum: '$currentAmount' }
      }
    }
  ])
  
  return summary
}

module.exports = mongoose.model('Goal', goalSchema)
