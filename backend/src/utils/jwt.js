const jwt = require('jsonwebtoken')
const config = require('../config')

const jwtUtils = {
  // Generate token
  generateToken: (payload, expiresIn = config.jwtExpiresIn) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn })
  },

  // Verify token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, config.jwtSecret)
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  },

  // Decode token without verification (for inspection)
  decodeToken: (token) => {
    return jwt.decode(token)
  },

  // Generate refresh token (longer expiry)
  generateRefreshToken: (payload) => {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '30d' })
  },

  // Extract token from request headers
  extractTokenFromHeader: (authHeader) => {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    try {
      const decoded = jwt.decode(token)
      const now = Date.now() / 1000
      return decoded.exp < now
    } catch (error) {
      return true
    }
  },

  // Get token expiry date
  getTokenExpiry: (token) => {
    try {
      const decoded = jwt.decode(token)
      return new Date(decoded.exp * 1000)
    } catch (error) {
      return null
    }
  }
}

module.exports = jwtUtils
