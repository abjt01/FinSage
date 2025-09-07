require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../src/models/User')
const Goal = require('../src/models/Goal')
const Account = require('../src/models/Account')
const Transaction = require('../src/models/Transaction')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finsage')
    console.log('MongoDB connected for reset')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

const resetDatabase = async () => {
  try {
    await User.deleteMany({})
    await Goal.deleteMany({})
    await Account.deleteMany({})
    await Transaction.deleteMany({})
    
    console.log('✅ Database reset successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Reset failed:', error)
    process.exit(1)
  }
}

const main = async () => {
  await connectDB()
  await resetDatabase()
}

main()
