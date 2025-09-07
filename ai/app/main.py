from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import numpy as np
from datetime import datetime

app = FastAPI(title="FinSage AI Engine", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}

class GoalAnalysisRequest(BaseModel):
    goalAmount: float
    years: float
    monthlySIP: float
    expectedReturnPA: float = 0.12

class SimulationRequest(BaseModel):
    monthlySIP: float
    targetAmount: float
    timeHorizon: int
    expectedReturn: float = 0.12
    volatility: float = 0.15

@app.get("/")
async def root():
    return {
        "service": "FinSage AI Engine",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/chat")
async def financial_chat(request: ChatRequest):
    """AI Chat endpoint with smart template responses"""
    
    message = request.message.lower()
    context = request.context
    
    # Pattern matching for common questions
    if any(word in message for word in ['50l', 'flat', 'home', 'afford']):
        return {
            "response": f"Based on your current ₹{context.get('sipAmount', 12000):,}/month SIP at 12% returns, you'll accumulate ₹38L in 5 years. To reach your ₹50L goal, increase your SIP by ₹6,000/month to ₹18,000. This gives you an 85% probability of achieving your dream home goal! 🏠",
            "source": "template",
            "confidence": 0.95
        }
    
    elif any(word in message for word in ['sip', 'increase', 'optimize']):
        return {
            "response": "Great question! I recommend increasing your SIP by ₹6,000/month. This would take your total to ₹18,000/month and significantly improve your goal achievement probability from 65% to 85%. The extra investment will compound beautifully over 5 years! 📈",
            "source": "template",
            "confidence": 0.9
        }
    
    elif any(word in message for word in ['net worth', 'growth']):
        return {
            "response": f"Your current net worth is ₹{context.get('netWorth', 650000)/100000:.1f}L with a healthy 12.5% growth this month! Your portfolio is well-diversified across bank savings, mutual funds, and EPF. Keep up the excellent momentum! 💪",
            "source": "template",
            "confidence": 0.9
        }
    
    else:
        return {
            "response": "I understand your question about finances. Based on your current financial profile, here are some personalized insights. Would you like me to analyze a specific aspect of your financial goals? 🤔",
            "source": "template",
            "confidence": 0.7
        }

@app.post("/analyze/goal")
async def analyze_goal(request: GoalAnalysisRequest):
    """Analyze goal achievement"""
    
    # Calculate SIP future value
    monthly_return = request.expectedReturnPA / 12
    months = request.years * 12
    
    # Future value of SIP
    if monthly_return > 0:
        fv_sip = request.monthlySIP * (((1 + monthly_return) ** months - 1) / monthly_return)
    else:
        fv_sip = request.monthlySIP * months
    
    # Calculate gap
    gap = max(0, request.goalAmount - fv_sip)
    
    # Generate suggestion
    if gap > 0:
        required_additional = gap / months
        suggestion = f"At ₹{request.monthlySIP:,.0f}/month SIP and {request.expectedReturnPA:.0%} returns, you'll reach ₹{fv_sip/100000:.1f}L in {request.years:.0f} years. Increase SIP by ₹{required_additional/1000:.0f}K/month to hit ₹{request.goalAmount/100000:.0f}L target."
    else:
        suggestion = f"Great! At ₹{request.monthlySIP:,.0f}/month SIP, you'll reach ₹{fv_sip/100000:.1f}L, exceeding your ₹{request.goalAmount/100000:.0f}L goal."
    
    success_probability = min(fv_sip / request.goalAmount, 1.0)
    
    return {
        "projectedCorpus": fv_sip,
        "gapToGoal": gap,
        "suggestionText": suggestion,
        "successProbability": success_probability,
        "recommendedAction": "increase_sip" if gap > 0 else "maintain_sip"
    }

@app.post("/simulate/goal")
async def simulate_goal(request: SimulationRequest):
    """Run Monte Carlo simulation"""
    
    months = request.timeHorizon
    monthly_return = request.expectedReturn / 12
    monthly_volatility = request.volatility / np.sqrt(12)
    
    # Simplified Monte Carlo simulation
    simulations = 1000
    final_values = []
    
    for _ in range(simulations):
        portfolio_value = 0
        for month in range(months):
            # Add monthly SIP
            portfolio_value += request.monthlySIP
            
            # Apply random return
            random_return = np.random.normal(monthly_return, monthly_volatility)
            portfolio_value *= (1 + random_return)
        
        final_values.append(max(0, portfolio_value))
    
    final_values = np.array(final_values)
    
    return {
        "mean": float(np.mean(final_values)),
        "median": float(np.median(final_values)),
        "p10": float(np.percentile(final_values, 10)),
        "p90": float(np.percentile(final_values, 90)),
        "success_probability": float(np.mean(final_values >= request.targetAmount)),
        "scenarios": final_values[:100].tolist()  # First 100 for charts
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "ai_available": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
