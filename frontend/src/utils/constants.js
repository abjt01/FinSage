export const COLORS = {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a'
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706'
  },
  danger: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626'
  }
}

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me'
  },
  users: {
    profile: '/api/users/profile',
    settings: '/api/users/settings'
  },
  dashboard: {
    data: '/api/users/dashboard'
  },
  goals: {
    list: '/api/goals',
    create: '/api/goals',
    update: '/api/goals',
    delete: '/api/goals'
  },
  ai: {
    analyze: '/api/ai/analyze',
    simulate: '/api/ai/simulate',
    optimize: '/api/ai/optimize',
    chat: '/api/ai/chat'
  }
}

export const DEMO_USERS = {
  arjun: {
    email: 'arjun@demo.in',
    password: 'demo123',
    name: 'Arjun',
    description: '29yr Software Engineer, ₹50L home goal'
  },
  priya: {
    email: 'priya@demo.in',
    password: 'demo123',
    name: 'Priya',
    description: '25yr Marketing Manager, aggressive investor'
  },
  raj: {
    email: 'raj@demo.in',
    password: 'demo123',
    name: 'Raj',
    description: '35yr Business Analyst, conservative approach'
  }
}

export const FINANCIAL_CONSTANTS = {
  DEFAULT_SIP_AMOUNT: 12000,
  MIN_SIP_AMOUNT: 1000,
  MAX_SIP_AMOUNT: 100000,
  DEFAULT_EXPECTED_RETURN: 0.12, // 12% annual
  DEFAULT_INFLATION: 0.06, // 6% annual
  MONTHS_IN_YEAR: 12
}
