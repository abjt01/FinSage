import api from './api'

class DashboardService {
  async getDashboardData() {
    try {
      const response = await api.get('/api/users/dashboard')
      return response.data.data
    } catch (error) {
      // Return mock data if backend is not available
      console.warn('Backend not available, using mock data:', error.message)
      return this.getMockDashboardData()
    }
  }

  getMockDashboardData() {
    return {
      user: {
        name: 'Arjun Sharma',
        email: 'arjun@demo.in',
        profile: {
          firstName: 'Arjun',
          lastName: 'Sharma',
          age: 29,
          occupation: 'Software Engineer'
        }
      },
      netWorth: 650000,
      netWorthChange: 12.5,
      totalSIP: 12000,
      sipReturn: 8.2,
      goal: {
        title: 'Dream Home Purchase',
        targetAmount: 5000000,
        currentAmount: 2250000,
        targetDate: '2029-09-01',
        timeHorizonMonths: 60
      },
      goalProgress: 45,
      accounts: [
        {
          type: 'bank',
          bankName: 'HDFC Bank',
          balance: 125000,
          accountNumber: '****6789'
        },
        {
          type: 'mutual_fund', 
          bankName: 'ICICI Prudential',
          balance: 340000
        },
        {
          type: 'epf',
          bankName: 'EPFO',
          balance: 185000
        }
      ]
    }
  }
}

export const getDashboardData = async () => {
  const service = new DashboardService()
  return await service.getDashboardData()
}

export default new DashboardService()
