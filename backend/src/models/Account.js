const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Account Details
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    required: true,
    enum: ['bank', 'investment', 'credit_card', 'loan', 'mutual_fund', 'epf', 'ppf', 'fd'],
    index: true
  },
  
  // Institution Details
  bankName: String,
  branchName: String,
  accountNumber: String, // Masked
  ifscCode: String,
  
  // Balance Information
  balance: {
    type: Number,
    default: 0
  },
  availableBalance: Number,
  currency: {
    type: String,
    default: 'INR'
  },
  
  // MCP Integration
  mcpAccountId: String,
  lastSyncedAt: Date,
  syncStatus: {
    type: String,
    enum: ['active', 'error', 'pending'],
    default: 'pending'
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
})

// Indexes
accountSchema.index({ userId: 1, accountType: 1 })
accountSchema.index({ accountId: 1 })
accountSchema.index({ lastSyncedAt: 1 })

module.exports = mongoose.model('Account', accountSchema)
