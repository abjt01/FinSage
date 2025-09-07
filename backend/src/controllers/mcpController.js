const mcpService = require('../services/mcpService')
const User = require('../models/User')
const logger = require('../utils/logger')

// @desc    Connect user to Fi MCP
// @route   POST /api/mcp/connect
// @access  Private
exports.connectMCP = async (req, res) => {
  try {
    const { authCode } = req.body
    const userId = req.user._id

    const result = await mcpService.connectUser(userId, authCode)
    
    res.status(200).json({
      success: true,
      message: 'Successfully connected to Fi MCP',
      data: result
    })
  } catch (error) {
    logger.error('MCP connection error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Sync user financial data
// @route   POST /api/mcp/sync
// @access  Private
exports.syncData = async (req, res) => {
  try {
    const userId = req.user._id
    
    const syncResult = await mcpService.syncUserData(userId)
    
    res.status(200).json({
      success: true,
      data: syncResult
    })
  } catch (error) {
    logger.error('MCP sync error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get MCP connection status
// @route   GET /api/mcp/status
// @access  Private
exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    res.status(200).json({
      success: true,
      data: {
        isConnected: user.mcpIntegration.isConnected,
        syncStatus: user.mcpIntegration.syncStatus,
        lastSyncedAt: user.mcpIntegration.lastSyncedAt,
        accountCount: user.mcpIntegration.accounts.length
      }
    })
  } catch (error) {
    logger.error('MCP status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get MCP status'
    })
  }
}
