const User = require('../models/User')
const Goal = require('../models/Goal')
const Account = require('../models/Account')
const logger = require('../utils/logger')

class SeedService {
  async createDemoUser() {
    try {
      // Check if demo user already exists
      const existingUser = await User.findOne({ email: 'arjun@demo.in' })
      if (existingUser) {
        logger.info('Demo user already exists')
        return existingUser
      }

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
              balance: 125000,
              currency: 'INR'
            },
            {
              accountId: 'icici_mf_001',
              accountType: 'mutual_fund',
              bankName: 'ICICI Prudential',
              balance: 340000,
              currency: 'INR'
            },
            {
              accountId: 'epf_001',
              accountType: 'epf',
              bankName: 'EPFO',
              balance: 185000,
              currency: 'INR'
            }
          ]
        }
      })

      // Create demo goal
      await Goal.create({
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
      })

      logger.info('Demo user and data created successfully')
      return demoUser
    } catch (error) {
      logger.error('Failed to create demo user:', error)
      throw error
    }
  }
}

module.exports = new SeedService()
