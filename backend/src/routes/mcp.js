const express = require('express')
const { connectMCP, syncData, getStatus } = require('../controllers/mcpController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.use(protect) // All routes protected

router.post('/connect', connectMCP)
router.post('/sync', syncData)
router.get('/status', getStatus)

module.exports = router
