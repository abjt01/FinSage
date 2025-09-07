const mongoose = require('mongoose')

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Notification Preferences
  notifications: {
    email: {
      goalReminders: { type: Boolean, default: true },
      marketUpdates: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true },
      transactionAlerts: { type: Boolean, default: true }
    },
    push: {
      goalReminders: { type: Boolean, default: true },
      sipReminders: { type: Boolean, default: true },
      marketAlerts: { type: Boolean, default: false }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      goalAchievements: { type: Boolean, default: false },
      criticalAlerts: { type: Boolean, default: true }
    }
  },

  // Display Preferences
  display: {
    currency: { type: String, default: 'INR' },
    locale: { type: String, default: 'en-IN' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
    dashboardLayout: { type: String, enum: ['compact', 'detailed'], default: 'detailed' }
  },

  // Financial Assumptions
  assumptions: {
    expectedReturn: { type: Number, default: 0.12 }, // 12% annual
    inflation: { type: Number, default: 0.06 }, // 6% annual
    taxRate: { type: Number, default: 0.30 }, // 30%
    emergencyMonths: { type: Number, default: 6 }
  },

  // Privacy Settings
  privacy: {
    shareData: { type: Boolean, default: false },
    analyticsOptIn: { type: Boolean, default: true },
    marketingOptIn: { type: Boolean, default: false }
  },

  // AI Preferences
  ai: {
    riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    adviceFrequency: { type: String, enum: ['weekly', 'monthly', 'quarterly'], default: 'monthly' },
    recommendationTypes: {
      goalOptimization: { type: Boolean, default: true },
      sipAdjustments: { type: Boolean, default: true },
      taxPlanning: { type: Boolean, default: true },
      portfolioRebalancing: { type: Boolean, default: false }
    }
  },

  // Security Settings
  security: {
    twoFactorEnabled: { type: Boolean, default: false },
    lastPasswordChange: { type: Date, default: Date.now },
    loginNotifications: { type: Boolean, default: true }
  }

}, {
  timestamps: true
})

// Indexes for performance
settingsSchema.index({ userId: 1 })

// Static method to get user settings with defaults
settingsSchema.statics.getUserSettings = async function(userId) {
  let settings = await this.findOne({ userId })
  
  if (!settings) {
    settings = await this.create({ userId })
  }
  
  return settings
}

// Instance method to update specific setting
settingsSchema.methods.updateSetting = function(path, value) {
  this.set(path, value)
  return this.save()
}

module.exports = mongoose.model('Settings', settingsSchema)
