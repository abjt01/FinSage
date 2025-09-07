import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/api'

export const useFinancialData = () => {
  const queryClient = useQueryClient()

  // Get dashboard data
  const dashboardQuery = useQuery(
    'dashboard',
    async () => {
      const response = await api.get('/api/users/dashboard')
      return response.data.data
    },
    {
      staleTime: 30000, // 30 seconds
      refetchInterval: 60000, // 1 minute
    }
  )

  // Get goals
  const goalsQuery = useQuery(
    'goals',
    async () => {
      const response = await api.get('/api/goals')
      return response.data.data
    },
    {
      staleTime: 60000, // 1 minute
    }
  )

  // Sync MCP data
  const syncMutation = useMutation(
    async () => {
      const response = await api.post('/api/mcp/sync')
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dashboard')
        queryClient.invalidateQueries('goals')
      }
    }
  )

  return {
    dashboard: dashboardQuery.data,
    goals: goalsQuery.data,
    isLoading: dashboardQuery.isLoading || goalsQuery.isLoading,
    error: dashboardQuery.error || goalsQuery.error,
    syncData: syncMutation.mutate,
    isSyncing: syncMutation.isLoading
  }
}

export const useGoals = () => {
  const queryClient = useQueryClient()

  const goalsQuery = useQuery('goals', async () => {
    const response = await api.get('/api/goals')
    return response.data
  })

  const createGoalMutation = useMutation(
    async (goalData) => {
      const response = await api.post('/api/goals', goalData)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals')
        queryClient.invalidateQueries('dashboard')
      }
    }
  )

  const updateGoalMutation = useMutation(
    async ({ id, ...data }) => {
      const response = await api.put(`/api/goals/${id}`, data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals')
        queryClient.invalidateQueries('dashboard')
      }
    }
  )

  return {
    goals: goalsQuery.data?.data || [],
    isLoading: goalsQuery.isLoading,
    error: goalsQuery.error,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    isCreating: createGoalMutation.isLoading,
    isUpdating: updateGoalMutation.isLoading
  }
}
