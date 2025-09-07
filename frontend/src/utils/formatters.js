export const formatCurrency = (amount, options = {}) => {
  const {
    locale = 'en-IN',
    currency = 'INR',
    showDecimals = false,
    compact = false
  } = options

  if (compact && Math.abs(amount) >= 100000) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount)
}

export const formatNumber = (num, options = {}) => {
  const { locale = 'en-IN', compact = false } = options
  
  if (compact) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num)
  }
  
  return new Intl.NumberFormat(locale).format(num)
}

export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

export const formatDate = (date, options = {}) => {
  const { locale = 'en-IN', format = 'short' } = options
  
  const formatOptions = {
    short: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    compact: { day: '2-digit', month: '2-digit', year: '2-digit' }
  }
  
  return new Intl.DateTimeFormat(locale, formatOptions[format]).format(new Date(date))
}

export const formatRelativeTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}
