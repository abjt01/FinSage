import React from 'react'
import { Download, FileText, Calendar, TrendingUp } from 'lucide-react'

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Export and analyze your financial data</p>
        </div>
      </div>

      {/* Reports Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Reports Coming Soon
          </h3>
          <p className="text-gray-600 mb-6">
            Generate comprehensive financial reports and insights
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto">
            <Download className="w-5 h-5" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reports  // ✅ This is the important line!
