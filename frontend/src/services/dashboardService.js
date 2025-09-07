import api from './api'
import { API_ENDPOINTS } from '../utils/constants'

class DashboardService {
  async getDashboardData() {
    try {
      const response = await api.get(API_ENDPOINTS.dashboard.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch dashboard data')
    }
  }

  async getNetWorth() {
    try {
      const response = await api.get('/api/users/networth')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch net worth')
    }
  }

  async getGoalProgress() {
    try {
      const response = await api.get('/api/goals/progress')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch goal progress')
    }
  }
}

export const getDashboardData = async () => {
  const service = new DashboardService()
  return await service.getDashboardData()
}

export default new DashboardService()
