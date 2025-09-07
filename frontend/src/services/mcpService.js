import api from './api'

class MCPService {
  // Connect to Fi MCP
  async connect(authCode) {
    try {
      const response = await api.post('/api/mcp/connect', { authCode })
      return response.data
    } catch (error) {
      throw new Error('Failed to connect to Fi MCP: ' + error.message)
    }
  }

  // Sync financial data
  async syncData() {
    try {
      const response = await api.post('/api/mcp/sync')
      return response.data
    } catch (error) {
      // Return mock data if MCP is not available
      console.warn('MCP not available, using mock data')
      return this.getMockMCPData()
    }
  }

  // Get connection status
  async getStatus() {
    try {
      const response = await api.get('/api/mcp/status')
      return response.data
    } catch (error) {
      return {
        isConnected: false,
        syncStatus: 'disconnected',
        lastSyncedAt: null,
        accountCount: 0
      }
    }
  }

  // Disconnect from MCP
  async disconnect() {
    try {
      const response = await api.post('/api/mcp/disconnect')
      return response.data
    } catch (error) {
      throw new Error('Failed to disconnect from Fi MCP: ' + error.message)
    }
  }

  // Get mock data for demo purposes
  getMockMCPData() {
    return {
      accounts: [
        {
          id: 'hdfc_savings_001',
          type: 'bank',
          bankName: 'HDFC Bank',
          balance: 125000,
          accountNumber: '****6789',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'icici_mf_001',
          type: 'mutual_fund',
          bankName: 'ICICI Prudential',
          balance: 340000,
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'epf_001',
          type: 'epf',
          bankName: 'EPFO',
          balance: 185000,
          lastUpdated: new Date().toISOString()
        }
      ],
      transactions: [
        {
          id: 'txn_001',
          amount: 12000,
          type: 'debit',
          description: 'SIP - ICICI Prudential Bluechip Fund',
          date: new Date().toISOString(),
          category: 'investment'
        },
        {
          id: 'txn_002',
          amount: 5000,
          type: 'debit',
          description: 'Emergency Fund Transfer',
          date: new Date(Date.now() - 86400000).toISOString(),
          category: 'savings'
        }
      ],
      syncedAt: new Date().toISOString(),
      totalBalance: 650000
    }
  }

  // Process MCP webhook data
  async processWebhook(webhookData) {
    try {
      const response = await api.post('/api/mcp/webhook', webhookData)
      return response.data
    } catch (error) {
      throw new Error('Failed to process MCP webhook: ' + error.message)
    }
  }

  // Get account balances
  async getAccountBalances() {
    try {
      const data = await this.syncData()
      return data.accounts || []
    } catch (error) {
      console.error('Failed to get account balances:', error)
      return []
    }
  }

  // Get transaction history
  async getTransactions(limit = 50, offset = 0) {
    try {
      const response = await api.get(`/api/mcp/transactions?limit=${limit}&offset=${offset}`)
      return response.data
    } catch (error) {
      console.warn('MCP transactions not available, using mock data')
      return {
        transactions: this.getMockMCPData().transactions,
        total: 2,
        hasMore: false
      }
    }
  }

  // Calculate net worth from MCP data
  calculateNetWorth(accounts) {
    let assets = 0
    let liabilities = 0

    accounts.forEach(account => {
      if (['bank', 'investment', 'mutual_fund', 'epf', 'ppf', 'fd'].includes(account.type)) {
        assets += account.balance || 0
      } else if (['credit_card', 'loan'].includes(account.type)) {
        liabilities += Math.abs(account.balance || 0)
      }
    })

    return {
      assets,
      liabilities,
      netWorth: assets - liabilities
    }
  }
}

export default new MCPService()
