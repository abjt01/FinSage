const config = {
  development: {
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/finsage',
    jwtSecret: process.env.JWT_SECRET || 'finsage-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    aiEngineUrl: process.env.AI_ENGINE_URL || 'http://localhost:8001'
  },
  production: {
    port: process.env.PORT || 8000,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL,
    aiEngineUrl: process.env.AI_ENGINE_URL
  }
}

const env = process.env.NODE_ENV || 'development'
module.exports = config[env]
