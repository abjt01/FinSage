const axios = require('axios')
const User = require('../models/User')
const Account = require('../models/Account')
const Transaction = require('../models/Transaction')
const logger = require('../utils/logger')

class MCPService {
  constructor() {
    this.baseURL = process.env.FI_MCP_URL || 'https://mcp.fi.money:8080/mcp'
    this.isDemo = process.env.NODE_ENV === 'development'
  }

  async connectUser(userId, authCode) {
    try {
      if (this.isDemo) {
        // For demo - simulate successful connection
        await User.findByIdAndUpdate(userId, {
          'mcpIntegration.isConnected': true,
          'mcpIntegration.syncStatus': 'active',
          'mcpIntegration.lastSyncedAt': new Date()
        })
        return { success: true, message: 'Demo mode - MCP connected' }
      }

      const response = await axios.post(`${this.baseURL}/connect`, {
        userId,
        authCode,
        scopes: ['accounts', 'transactions', 'investments']
      })
      
      const { accessToken } = response.data
      
      await User.findByIdAndUpdate(userId, {
        'mcpIntegration.fiAccessToken': accessToken,
        'mcpIntegration.isConnected': true,
        'mcpIntegration.syncStatus': 'active',
        'mcpIntegration.lastSyncedAt': new Date()
      })
      
      return { success: true, accessToken }
    } catch (error) {
      logger.error('Fi MCP connection failed:', error)
      throw new Error('Failed to connect to Fi MCP')
    }
  }

  async syncUserData(userId) {
    try {
      const user = await User.findById(userId)
      
      if (this.isDemo || !user.mcpIntegration.isConnected) {
        // Return mock data for demo
        return this.getMockFinancialData(userId)
      }

      // Real MCP API calls would go here
      const accountsResponse = await this.apiCall('/accounts', user.mcpIntegration.fiAccessToken)
      const transactionsResponse = await this.apiCall('/transactions', user.mcpIntegration.fiAccessToken)

      return {
        accounts: accountsResponse.accounts,
        transactions: transactionsResponse.transactions,
        syncedAt: new Date()
      }
    } catch (error) {
      logger.error('Fi MCP sync failed:', error)
      return this.getMockFinancialData(userId)
    }
  }

  getMockFinancialData(userId) {
    // Return realistic mock data based on user
    return {
      accounts: [
        {
          id: 'hdfc_savings_001',
          type: 'bank',
          bankName: 'HDFC Bank',
          balance: 125000,
          accountNumber: '****6789'
        },
        {
          id: 'icici_sip_001',
          type: 'mutual_fund',
          bankName: 'ICICI Prudential',
          balance: 340000
        }
      ],
      transactions: [],
      syncedAt: new Date()
    }
  }

  async apiCall(endpoint, accessToken) {
    const response = await axios.get(`${this.baseURL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    return response.data
  }
}

module.exports = new MCPService()
