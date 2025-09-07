export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me'
  },
  users: {
    profile: '/api/users/profile',
    dashboard: '/api/users/dashboard',
    networth: '/api/users/networth'
  },
  goals: {
    list: '/api/goals',
    create: '/api/goals',
    update: (id) => `/api/goals/${id}`,
    delete: (id) => `/api/goals/${id}`
  },
  ai: {
    analyze: '/api/ai/analyze',
    simulate: '/api/ai/simulate', 
    chat: '/api/ai/chat'
  }
}
