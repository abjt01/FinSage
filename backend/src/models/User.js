const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile Information
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    phone: String,
    dateOfBirth: Date,
    occupation: String,
    
    // Financial Profile
    monthlyIncome: {
      type: Number,
      default: 0
    },
    monthlyExpenses: {
      type: Number,
      default: 0
    },
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    investmentExperience: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  },

  // Fi MCP Integration
  mcpIntegration: {
    isConnected: {
      type: Boolean,
      default: false
    },
    fiAccessToken: String,
    lastSyncedAt: Date,
    syncStatus: {
      type: String,
      enum: ['pending', 'active', 'error', 'disconnected'],
      default: 'pending'
    },
    
    // Financial Accounts
    accounts: [{
      accountId: String,
      accountType: {
        type: String,
        enum: ['bank', 'investment', 'credit_card', 'loan', 'mutual_fund', 'epf']
      },
      bankName: String,
      accountNumber: String,
      balance: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'INR'
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // App Settings
  settings: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      goalReminders: {
        type: Boolean,
        default: true
      },
      marketUpdates: {
        type: Boolean,
        default: false
      }
    },
    
    // Default financial assumptions
    defaultAssumptions: {
      expectedReturn: {
        type: Number,
        default: 0.12 // 12% annual
      },
      inflation: {
        type: Number,
        default: 0.06 // 6% annual
      },
      taxRate: {
        type: Number,
        default: 0.30 // 30%
      }
    },
    
    // Display preferences
    currency: {
      type: String,
      default: 'INR'
    },
    locale: {
      type: String,
      default: 'en-IN'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },

  // Authentication & Security
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Login tracking
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  
  // Demo/Test accounts
  isDemo: {
    type: Boolean,
    default: false
  },
  demoProfile: String, // 'arjun', 'priya', etc.

}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password
      delete ret.resetPasswordToken
      delete ret.verificationToken
      return ret
    }
  }
})

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ 'mcpIntegration.isConnected': 1 })
userSchema.index({ isDemo: 1 })
userSchema.index({ createdAt: 1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

// Instance method to get full name
userSchema.methods.getFullName = function() {
  return `${this.profile.firstName} ${this.profile.lastName}`
}

// Instance method to calculate net worth
userSchema.methods.calculateNetWorth = function() {
  let assets = 0
  let liabilities = 0
  
  this.mcpIntegration.accounts.forEach(account => {
    if (['bank', 'investment', 'mutual_fund', 'epf'].includes(account.accountType)) {
      assets += account.balance || 0
    } else if (['credit_card', 'loan'].includes(account.accountType)) {
      liabilities += account.balance || 0
    }
  })
  
  return {
    assets,
    liabilities,
    netWorth: assets - liabilities
  }
}

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() })
}

// Virtual for account count
userSchema.virtual('accountCount').get(function() {
  return this.mcpIntegration.accounts.length
})

// Virtual for monthly savings
userSchema.virtual('monthlySavings').get(function() {
  return Math.max(0, this.profile.monthlyIncome - this.profile.monthlyExpenses)
})

module.exports = mongoose.model('User', userSchema)