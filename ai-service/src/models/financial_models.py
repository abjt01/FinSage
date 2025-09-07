from pydantic import BaseModel, Field   # BaseModel → for schema validation, Field → add constraints & metadata
from typing import Optional             # Optional → allows some fields to be left out

# ---------- SIP Simulation Input Schema ----------
class SIPInput(BaseModel):   # Represents input required to calculate SIP
    # Monthly amount invested; must be >0 (gt=0) to ensure valid investment
    monthly_investment: float = Field(..., gt=0, description="Monthly investment amount in dollars")
    
    # Annual rate of return in %; must be between 0 and 100
    annual_rate: float = Field(..., ge=0, le=100, description="Annual interest rate in percentage")
    
    # Duration of investment in years; must be >0
    tenure_years: int = Field(..., gt=0, description="Investment duration in years")
    
    # Number of times interest is compounded in a year; default=12, must be between 1 and 12
    compounding_frequency: int = Field(12, ge=1, le=12, description="Compounding periods per year")

# ---------- Goal Simulation Input Schema ----------
class GoalInput(BaseModel):   # Represents input required to calculate timeline to reach a goal
    # Final amount user wants to achieve
    target_amount: float = Field(..., gt=0, description="Target financial goal in dollars")
    
    # Monthly amount invested
    monthly_investment: float = Field(..., gt=0, description="Monthly investment amount in dollars")
    
    # Expected annual return rate (0–100%)
    annual_rate: float = Field(..., ge=0, le=100, description="Annual interest rate in percentage")
    
    # Compounding frequency is optional (default=12); allows flexibility if not provided
    compounding_frequency: Optional[int] = Field(12, ge=1, le=12, description="Compounding periods per year")

# ---------- Portfolio Schema ----------
class InvestmentPortfolio(BaseModel):   # Represents a user’s overall portfolio data
    # Unique ID for the user
    user_id: str = Field(..., description="Unique user identifier")
    
    # Total balance in portfolio; must be >=0 since negative balance is invalid
    total_balance: float = Field(..., ge=0, description="Total portfolio balance in dollars")
    
    # Allocation dictionary: keys=asset classes (e.g., equity, bonds), values=percentage
    allocation: dict = Field(..., description="Asset allocation as percentage (e.g., {'equity': 60, 'bonds': 40})")

