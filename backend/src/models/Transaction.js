const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  
  // Transaction Details
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit'],
    index: true
  },
  
  // Transaction Info
  description: String,
  category: {
    type: String,
    enum: ['food', 'transport', 'shopping', 'bills', 'entertainment', 'healthcare', 'education', 'investment', 'salary', 'other'],
    default: 'other',
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // MCP Integration
  mcpTransactionId: String,
  
  // Balance after transaction
  balanceAfter: Number,
  
  // Merchant/Counter-party
  merchant: String,
  merchantCategory: String,
  
  // Location (if available)
  location: {
    city: String,
    state: String,
    country: String
  }
}, {
  timestamps: true
})

// Indexes for performance
transactionSchema.index({ userId: 1, date: -1 })
transactionSchema.index({ userId: 1, category: 1, date: -1 })
transactionSchema.index({ accountId: 1, date: -1 })

module.exports = mongoose.model('Transaction', transactionSchema)
