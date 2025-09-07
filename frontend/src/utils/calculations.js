// Financial calculation utilities

export const calculateFutureValue = (pv, rate, nper, pmt = 0) => {
  if (rate === 0) {
    return pv + pmt * nper
  }
  
  const futureValueLumpSum = pv * Math.pow(1 + rate, nper)
  const futureValueAnnuity = pmt * (Math.pow(1 + rate, nper) - 1) / rate
  
  return futureValueLumpSum + futureValueAnnuity
}

export const calculateSIPFutureValue = (monthlyAmount, annualRate, years) => {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12
  
  if (monthlyRate === 0) {
    return monthlyAmount * totalMonths
  }
  
  return monthlyAmount * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate
}

export const calculateRequiredSIP = (targetAmount, annualRate, years) => {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12
  
  if (monthlyRate === 0) {
    return targetAmount / totalMonths
  }
  
  return (targetAmount * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
}

export const calculateCompoundInterest = (principal, rate, compoundingFreq, years) => {
  return principal * Math.pow(1 + rate / compoundingFreq, compoundingFreq * years)
}

export const calculateEMI = (loanAmount, annualRate, years) => {
  const monthlyRate = annualRate / 12
  const totalMonths = years * 12
  
  if (monthlyRate === 0) {
    return loanAmount / totalMonths
  }
  
  return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
         (Math.pow(1 + monthlyRate, totalMonths) - 1)
}

export const calculateInflationAdjusted = (amount, inflationRate, years) => {
  return amount / Math.pow(1 + inflationRate, years)
}

export const calculateReturns = (initialValue, finalValue, years) => {
  return Math.pow(finalValue / initialValue, 1 / years) - 1
}

export const calculateRiskScore = (returns, volatility) => {
  // Sharpe ratio calculation (assuming risk-free rate of 4%)
  const riskFreeRate = 0.04
  return (returns - riskFreeRate) / volatility
}

export const calculatePortfolioReturn = (weights, returns) => {
  return weights.reduce((sum, weight, index) => sum + weight * returns[index], 0)
}

export const calculatePortfolioVolatility = (weights, volatilities, correlations) => {
  let variance = 0
  
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      const correlation = i === j ? 1 : correlations[i][j]
      variance += weights[i] * weights[j] * volatilities[i] * volatilities[j] * correlation
    }
  }
  
  return Math.sqrt(variance)
}

export const calculateGoalProgress = (currentAmount, targetAmount) => {
  return Math.min((currentAmount / targetAmount) * 100, 100)
}

export const calculateMonthsToGoal = (currentAmount, targetAmount, monthlyContribution, annualReturn) => {
  if (currentAmount >= targetAmount) return 0
  
  const monthlyRate = annualReturn / 12
  const remaining = targetAmount - currentAmount
  
  if (monthlyRate === 0) {
    return remaining / monthlyContribution
  }
  
  // Using logarithms to solve for n in FV formula
  const numerator = Math.log(1 + (remaining * monthlyRate) / monthlyContribution)
  const denominator = Math.log(1 + monthlyRate)
  
  return numerator / denominator
}

export const calculateTaxSavings = (investment, taxRate, section = '80C') => {
  const limits = {
    '80C': 150000,
    '80D': 25000,
    'ELSS': 150000
  }
  
  const eligibleAmount = Math.min(investment, limits[section] || 0)
  return eligibleAmount * taxRate
}

// Monte Carlo simulation for portfolio projection
export const monteCarloSimulation = (
  initialAmount,
  monthlyContribution,
  expectedReturn,
  volatility,
  years,
  simulations = 1000
) => {
  const results = []
  const months = years * 12
  const monthlyReturn = expectedReturn / 12
  const monthlyVolatility = volatility / Math.sqrt(12)
  
  for (let sim = 0; sim < simulations; sim++) {
    let portfolioValue = initialAmount
    
    for (let month = 0; month < months; month++) {
      // Add monthly contribution
      portfolioValue += monthlyContribution
      
      // Generate random return using normal distribution approximation
      const randomReturn = monthlyReturn + monthlyVolatility * (Math.random() - 0.5) * 2
      portfolioValue *= (1 + randomReturn)
      portfolioValue = Math.max(0, portfolioValue) // Prevent negative values
    }
    
    results.push(portfolioValue)
  }
  
  results.sort((a, b) => a - b)
  
  return {
    mean: results.reduce((sum, val) => sum + val, 0) / results.length,
    median: results[Math.floor(results.length / 2)],
    p10: results[Math.floor(results.length * 0.1)],
    p90: results[Math.floor(results.length * 0.9)],
    min: results[0],
    max: results[results.length - 1],
    scenarios: results
  }
}
