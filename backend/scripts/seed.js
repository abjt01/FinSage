require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../src/models/User')
const Goal = require('../src/models/Goal')
const Account = require('../src/models/Account')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finsage')
    console.log('MongoDB connected for seeding')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Goal.deleteMany({})
    await Account.deleteMany({})

    // Create demo user
    const demoUser = await User.create({
      email: 'arjun@demo.in',
      password: 'demo123',
      profile: {
        firstName: 'Arjun',
        lastName: 'Sharma',
        age: 29,
        occupation: 'Software Engineer',
        monthlyIncome: 120000,
        monthlyExpenses: 65000,
        riskTolerance: 'medium'
      },
      isDemo: true,
      demoProfile: 'arjun',
      mcpIntegration: {
        isConnected: true,
        syncStatus: 'active',
        lastSyncedAt: new Date(),
        accounts: [
          {
            accountId: 'hdfc_savings_001',
            accountType: 'bank',
            bankName: 'HDFC Bank',
            accountNumber: '****6789',
            balance: 125000
          },
          {
            accountId: 'icici_mf_001',
            accountType: 'mutual_fund',
            bankName: 'ICICI Prudential',
            balance: 340000
          },
          {
            accountId: 'epf_001',
            accountType: 'epf',
            bankName: 'EPFO',
            balance: 185000
          }
        ]
      }
    })

    // Create demo goals
    await Goal.create([
      {
        userId: demoUser._id,
        title: 'Dream Home Purchase',
        description: 'Buy a 2BHK apartment in Bangalore',
        category: 'home',
        targetAmount: 5000000,
        currentAmount: 2250000,
        targetDate: new Date('2029-09-01'),
        monthlyContribution: 12000,
        priority: 'high',
        status: 'active'
      },
      {
        userId: demoUser._id,
        title: 'Emergency Fund',
        description: '6 months expenses as emergency fund',
        category: 'emergency',
        targetAmount: 300000,
        currentAmount: 180000,
        targetDate: new Date('2026-03-01'),
        monthlyContribution: 5000,
        priority: 'high',
        status: 'active'
      }
    ])

    console.log('✅ Database seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

const main = async () => {
  await connectDB()
  await seedDatabase()
}

main()
