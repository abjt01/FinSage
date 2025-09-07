from fastapi import FastAPI, HTTPException   # Import FastAPI (framework to build APIs) and HTTPException (to send custom HTTP errors to clients)
from pydantic import BaseModel               # Import BaseModel from Pydantic (used for defining data validation schemas)
from typing import Optional                  # Import Optional (to declare fields that may or may not be provided in request schemas)
from src.services.ai_orchestrator import AIOrchestrator  # Import AIOrchestrator (custom service that handles AI/LLM queries(LANGCHAIN))
from src.services.simulation_engine import SimulationEngine  # Import SimulationEngine (custom service for financial calculations like SIP, Goal)
from src.models.financial_models import SIPInput, GoalInput  # Import Pydantic models (schemas) related to SIP and Goal inputs
from src.config.settings import Settings     # Import Settings (loads config/env variables like API keys)

# Create the FastAPI application instance
app = FastAPI(title="FinSage AI Service", version="1.0.0")  # "title" and "version" are metadata for documentation (Swagger UI)

# Load configuration (like API keys) from settings
settings = Settings()

# Initialize AI orchestrator with API key (used to connect to external AI model, e.g., Gemini/LLM)()
ai_orchestrator = AIOrchestrator(api_key=settings.gemini_api_key)

# Initialize simulation engine (used for financial simulations)
simulation_engine = SimulationEngine()

# Define input schema for chat requests
class ChatRequest(BaseModel):   # Inherits from BaseModel → validates incoming JSON
    query: str                  # User's question/query (required string)
    user_id: Optional[str] = None   # Optional user_id to track which user asked

# Define response schema for chat
class ChatResponse(BaseModel):  # Inherits from BaseModel → ensures response follows structure
    response: str               # AI’s response as a string

# Health-check endpoint (to test if server is alive and running)
@app.get("/health")             # GET endpoint at /health
async def health_check():       # Async function (non-blocking)
    return {"status": "healthy"}  # Returns JSON response confirming service is healthy

# AI Chat endpoint
@app.post("/ai/chat", response_model=ChatResponse)   # POST endpoint at /ai/chat, response validated against ChatResponse schema
async def chat(request: ChatRequest):   # Accepts request body validated as ChatRequest
    try:
        # Pass user query to AI orchestrator (LLM) and get response
        response = ai_orchestrator.process_query(request.query, request.user_id)
        # Return structured response following ChatResponse schema
        return ChatResponse(response=response)
    except Exception as e:
        # If AI processing fails, raise HTTP 500 error with detail
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

# SIP Simulation endpoint
@app.post("/ai/simulate/sip")   # POST endpoint at /ai/simulate/sip
async def simulate_sip(sip_input: SIPInput):  # Accepts SIPInput schema as request body
    try:
        # Calculate future value of SIP using SimulationEngine
        result = simulation_engine.calculate_sip(
            monthly_investment=sip_input.monthly_investment,
            annual_rate=sip_input.annual_rate,
            tenure_years=sip_input.tenure_years,
            compounding_frequency=sip_input.compounding_frequency
        )
        # Return result as JSON
        return {"future_value": result}
    except Exception as e:
        # If calculation fails, raise HTTP 400 (bad request) with detail
        raise HTTPException(status_code=400, detail=f"SIP calculation error: {str(e)}")

# Goal Simulation endpoint
@app.post("/ai/simulate/goal")   # POST endpoint at /ai/simulate/goal
async def simulate_goal(goal_input: GoalInput):  # Accepts GoalInput schema as request body
    try:
        # Calculate months needed to achieve goal using SimulationEngine
        result = simulation_engine.calculate_goal_timeline(
            target_amount=goal_input.target_amount,
            monthly_investment=goal_input.monthly_investment,
            annual_rate=goal_input.annual_rate
        )
        # Return result as JSON
        return {"months_needed": result}
    except Exception as e:
        # If calculation fails, raise HTTP 400 (bad request) with detail
        raise HTTPException(status_code=400, detail=f"Goal calculation error: {str(e)}")
