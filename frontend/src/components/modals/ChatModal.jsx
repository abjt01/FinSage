import React, { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatWithAI } from '../../services/aiService'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const ChatModal = ({ isOpen, onClose, initialContext = {} }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm FinSage AI. Ask me anything about your finances. Try: 'Can I afford a ₹50L flat in 5 years?'",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Suggested questions
  const suggestedQuestions = [
    "Can I afford a ₹50L flat in 5 years?",
    "How much should I increase my SIP?",
    "What's my current net worth growth?",
    "Should I diversify my portfolio?",
    "When will I reach my goal?"
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await chatWithAI(userMessage.content, initialContext)
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response || generateMockResponse(userMessage.content),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateMockResponse(userMessage.content), // Fallback to mock response
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Mock response generator for demo purposes
  const generateMockResponse = (question) => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('50l') || lowerQuestion.includes('flat') || lowerQuestion.includes('afford')) {
      return "Based on your current ₹12,000/month SIP at 12% returns, you'll accumulate ₹38L in 5 years. To reach your ₹50L goal, increase your SIP by ₹6,000/month to ₹18,000. This gives you an 85% probability of achieving your dream home goal! 🏠"
    }
    
    if (lowerQuestion.includes('sip') && lowerQuestion.includes('increase')) {
      return "Great question! I recommend increasing your SIP by ₹6,000/month. This would take your total to ₹18,000/month and significantly improve your goal achievement probability from 65% to 85%. The extra investment will compound beautifully over 5 years! 📈"
    }
    
    if (lowerQuestion.includes('net worth') || lowerQuestion.includes('growth')) {
      return "Your current net worth is ₹6.5L with a healthy 12.5% growth this month! Your portfolio is well-diversified across bank savings (₹1.25L), mutual funds (₹3.4L), and EPF (₹1.85L). Keep up the excellent momentum! 💪"
    }
    
    if (lowerQuestion.includes('diversify') || lowerQuestion.includes('portfolio')) {
      return "Your portfolio shows good diversification! Current allocation: 52% equity mutual funds, 19% bank savings, 28% EPF, 1% credit exposure. Consider adding 10-15% international funds and 5-10% gold for better risk management. 🌍"
    }
    
    if (lowerQuestion.includes('goal') || lowerQuestion.includes('reach')) {
      return "At your current pace, you're on track to reach ₹38L by Sept 2029. To hit your ₹50L target, increase SIP to ₹18,000/month. This puts you ahead of schedule and gives you a comfortable buffer! 🎯"
    }
    
    return "I understand your question about finances. Based on your current financial profile (₹6.5L net worth, ₹12K monthly SIP, 12% expected returns), here are some personalized insights. Would you like me to analyze a specific aspect of your financial goals? 🤔"
  }

  const handleSuggestedQuestion = (question) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold">FinSage AI Assistant</h3>
                  <p className="text-xs opacity-90">Your financial advisor</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <LoadingSpinner size="small" text="Thinking..." />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Suggested questions:</p>
                <div className="space-y-2">
                  {suggestedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="w-full text-left text-xs bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-2 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your finances..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatModal
