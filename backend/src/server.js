require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/database')
const logger = require('./utils/logger')

const PORT = process.env.PORT || 8000

// Connect to MongoDB
connectDB()

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...')
  process.exit(0)
})

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 FinSage Backend running on port ${PORT}`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  
  if (process.env.NODE_ENV === 'development') {
    logger.info(`📊 Health check: http://localhost:${PORT}/health`)
    logger.info(`📚 API Base URL: http://localhost:${PORT}/api`)
  }
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err)
  // Close server & exit process
  server.close(() => {
    process.exit(1)
  })
})

module.exports = server