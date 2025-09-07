import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner'
import Header from './components/common/Header'
import Sidebar from './components/common/Sidebar'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import Portfolio from './pages/Portfolio'
import SIPOptimizer from './pages/SIPOptimizer'
import Reports from './pages/Reports'

function App() {
  const { user, loading } = useAuth()

  console.log('🎯 App render - User:', !!user, 'Loading:', loading)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="large" text="Loading FinSage AI..." />
      </div>
    )
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <Login />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/sip-optimizer" element={<SIPOptimizer />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
