import React, { useState } from 'react'
import { Calendar, Target, DollarSign } from 'lucide-react'
import { useGoals } from '../../hooks/useFinancialData'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const GoalForm = ({ goal = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'home',
    targetAmount: goal?.targetAmount || '',
    targetDate: goal?.targetDate ? goal.targetDate.split('T')[0] : '',
    monthlyContribution: goal?.monthlyContribution || '',
    priority: goal?.priority || 'medium'
  })

  const { createGoal, updateGoal, isCreating, isUpdating } = useGoals()
  const isEditing = !!goal

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        monthlyContribution: parseFloat(formData.monthlyContribution) || 0
      }

      if (isEditing) {
        await updateGoal({ id: goal._id, ...goalData })
        toast.success('Goal updated successfully!')
      } else {
        await createGoal(goalData)
        toast.success('Goal created successfully!')
      }
      
      onSuccess?.()
      onClose?.()
    } catch (error) {
      toast.error(error.message || 'Failed to save goal')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const categories = [
    { value: 'home', label: '🏠 Home', description: 'House purchase, renovation' },
    { value: 'car', label: '🚗 Vehicle', description: 'Car, bike purchase' },
    { value: 'education', label: '🎓 Education', description: 'Studies, courses' },
    { value: 'retirement', label: '🏖️ Retirement', description: 'Post-retirement fund' },
    { value: 'emergency', label: '🛡️ Emergency', description: 'Emergency fund' },
    { value: 'travel', label: '✈️ Travel', description: 'Vacation, trips' },
    { value: 'other', label: '🎯 Other', description: 'Other goals' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Goal Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Dream Home Purchase"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your goal..."
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <label
              key={cat.value}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                formData.category === cat.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={formData.category === cat.value}
                onChange={handleChange}
                className="hidden"
              />
              <div className="font-medium text-gray-900">{cat.label}</div>
              <div className="text-xs text-gray-500">{cat.description}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Target Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Amount (₹) *
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50,00,000"
            min="1000"
            required
          />
        </div>
      </div>

      {/* Target Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Date *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
      </div>

      {/* Monthly Contribution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly SIP Amount (₹)
        </label>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            name="monthlyContribution"
            value={formData.monthlyContribution}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="12,000"
            min="0"
          />
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* Submit Buttons */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {(isCreating || isUpdating) ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span className="ml-2">{isEditing ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            isEditing ? 'Update Goal' : 'Create Goal'
          )}
        </button>
      </div>
    </form>
  )
}

export default GoalForm
