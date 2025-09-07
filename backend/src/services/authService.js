const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const logger = require('../utils/logger')
const config = require('../config')

class AuthService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    )
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  // Hash password
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
  }

  // Compare password
  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, profile } = userData

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        throw new Error('User already exists with this email')
      }

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password,
        profile
      })

      // Generate token
      const token = this.generateToken(user._id)

      logger.info(`New user registered: ${user.email}`)

      return { user, token }
    } catch (error) {
      logger.error('Registration error:', error)
      throw error
    }
  }

  // Authenticate user
  async authenticate(email, password) {
    try {
      // Find user with password
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
      
      if (!user) {
        throw new Error('Invalid email or password')
      }

      // Check password
      const isValidPassword = await user.comparePassword(password)
      if (!isValidPassword) {
        throw new Error('Invalid email or password')
      }

      // Update login info
      user.lastLogin = new Date()
      user.loginCount += 1
      await user.save()

      // Generate token
      const token = this.generateToken(user._id)

      logger.info(`User authenticated: ${user.email}`)

      // Remove password from response
      user.password = undefined

      return { user, token }
    } catch (error) {
      logger.error('Authentication error:', error)
      throw error
    }
  }

  // Get user by token
  async getUserByToken(token) {
    try {
      const decoded = this.verifyToken(token)
      const user = await User.findById(decoded.userId)
      
      if (!user) {
        throw new Error('User not found')
      }

      return user
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  // Refresh token
  async refreshToken(oldToken) {
    try {
      const decoded = this.verifyToken(oldToken)
      const user = await User.findById(decoded.userId)
      
      if (!user) {
        throw new Error('User not found')
      }

      const newToken = this.generateToken(user._id)
      return { user, token: newToken }
    } catch (error) {
      throw new Error('Token refresh failed')
    }
  }
}

module.exports = new AuthService()
