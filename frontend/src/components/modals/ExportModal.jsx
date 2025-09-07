import React, { useState } from 'react'
import { X, Download, FileText, Calendar, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { exportReport } from '../../services/aiService'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'
import { formatDate, formatCurrency } from '../../utils/formatters'

const ExportModal = ({ isOpen, onClose, userData = {} }) => {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('comprehensive')
  const [dateRange, setDateRange] = useState('lastYear')

  const reportTypes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Report',
      description: 'Complete financial overview with goals, portfolio, and recommendations',
      pages: '8-12 pages'
    },
    {
      id: 'goals',
      name: 'Goals Analysis',
      description: 'Detailed analysis of your financial goals and achievement plans',
      pages: '4-6 pages'
    },
    {
      id: 'portfolio',
      name: 'Portfolio Summary',
      description: 'Investment portfolio breakdown and performance analysis',
      pages: '3-4 pages'
    },
    {
      id: 'tax',
      name: 'Tax Planning',
      description: 'Tax optimization strategies and deduction opportunities',
      pages: '2-3 pages'
    }
  ]

  const dateRanges = [
    { id: 'lastMonth', name: 'Last Month', description: 'Recent activity' },
    { id: 'lastQuarter', name: 'Last 3 Months', description: 'Quarterly overview' },
    { id: 'lastYear', name: 'Last 12 Months', description: 'Annual summary' },
    { id: 'allTime', name: 'All Time', description: 'Complete history' }
  ]

  const handleExport = async () => {
    setLoading(true)
    
    try {
      const reportData = {
        type: reportType,
        dateRange: dateRange,
        userData: userData,
        generatedAt: new Date().toISOString(),
        includeCharts: true,
        includeRecommendations: true
      }

      await exportReport(reportData)
      toast.success('Report exported successfully!')
      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedReportType = reportTypes.find(type => type.id === reportType)
  const selectedDateRange = dateRanges.find(range => range.id === dateRange)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Export Financial Report</h3>
                    <p className="text-sm text-gray-500">Generate and download your personalized report</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* User Info Preview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {userData?.profile?.firstName} {userData?.profile?.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Net Worth: {formatCurrency(userData?.netWorth || 650000, { compact: true })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Report generated on {formatDate(new Date(), { format: 'long' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Type Selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Select Report Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reportTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setReportType(type.id)}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          reportType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className={`w-5 h-5 mt-0.5 ${
                            reportType === type.id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{type.name}</h5>
                            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                            <p className="text-xs text-blue-600 mt-1">{type.pages}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Selection */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Data Period</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dateRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setDateRange(range.id)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          dateRange === range.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{range.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{range.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Report Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Report Preview</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Type:</strong> {selectedReportType?.name}</p>
                    <p><strong>Period:</strong> {selectedDateRange?.name}</p>
                    <p><strong>Includes:</strong> Charts, tables, AI recommendations</p>
                    <p><strong>Format:</strong> PDF document</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Generated on {formatDate(new Date())}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="small" color="white" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ExportModal
