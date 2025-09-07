from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI(title="FinSage AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}

@app.get("/")
async def root():
    return {"service": "FinSage AI Engine", "status": "healthy"}

@app.post("/chat")
async def financial_chat(request: ChatRequest):
    message = request.message.lower()
    context = request.context
    
    if any(word in message for word in ['50l', 'flat', 'home', 'afford']):
        sip_amount = context.get('sipAmount', 12000)
        return {
            "response": f"Based on your current ₹{sip_amount:,}/month SIP at 12% returns, you'll accumulate ₹38L in 5 years. To reach your ₹50L goal, increase your SIP by ₹6,000/month to ₹18,000. This gives you an 85% probability of achieving your dream home goal! 🏠",
            "source": "template"
        }
    
    return {
        "response": "I understand your question about finances. Based on your current financial profile, here are some personalized insights. Would you like me to analyze a specific aspect of your financial goals? 🤔",
        "source": "template"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
