from pydantic import BaseModel, Field, validator   # BaseModel = schema base class, Field = validation & docs, validator = custom rules
from typing import List, Dict, Optional            # Typing helpers for lists, dicts, and optional fields


# -----------------------------
# Input schema for "What-If" scenario simulations
# -----------------------------
class WhatIfScenarioInput(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")  
    # Required string → links simulation to a specific user

    monthly_investment: float = Field(..., gt=0, description="Monthly investment amount in dollars")
    # Required float → must be > 0

    annual_rate: float = Field(..., ge=0, le=100, description="Annual interest rate in percentage")
    # Required float → between 0% and 100%

    tenure_years: int = Field(..., gt=0, description="Investment duration in years")
    # Required int → must be positive (at least 1 year)

    adjustments: Dict[str, float] = Field(
        default_factory=dict,
        description="Adjustments to simulate (e.g., {'rate_increase': 2, 'extra_investment': 100})"
    )
    # Optional dictionary → allows flexible tweaks like extra investment, interest rate bump, etc.


# -----------------------------
# Output schema for simulation results
# -----------------------------
class SimulationResult(BaseModel):
    scenario_id: str = Field(..., description="Unique identifier for the simulation scenario")
    # Required → each simulation result is uniquely identifiable

    future_value: float = Field(..., ge=0, description="Projected future value in dollars")
    # Required float → cannot be negative

    timeline_months: Optional[int] = Field(None, ge=0, description="Months to reach goal, if applicable")
    # Optional int → how long until target goal is reached (not always relevant)

    chart_data: Optional[List[Dict[str, float]]] = Field(
        None,
        description="Data points for visualization (e.g., [{'month': 1, 'value': 1000}, ...])"
    )
    # Optional list of dicts → stores month/value pairs for graphs or dashboards


# -----------------------------
# Input schema for portfolio projections
# -----------------------------
class PortfolioProjectionInput(BaseModel):
    user_id: str = Field(..., description="Unique user identifier")
    # Required string → links projection to user

    initial_investment: float = Field(..., gt=0, description="Initial investment amount in dollars")
    # Required float → must be > 0

    allocation: Dict[str, float] = Field(
        ...,
        description="Asset allocation as percentage (e.g., {'equity': 60, 'bonds': 40})"
    )
    # Required dictionary → defines how the portfolio is split into asset classes

    annual_rates: Dict[str, float] = Field(
        ...,
        description="Expected annual rates per asset class (e.g., {'equity': 8, 'bonds': 4})"
    )
    # Required dictionary → growth rate assumption for each asset class

    tenure_years: int = Field(..., gt=0, description="Projection duration in years")
    # Required int → simulation period in years

    # -----------------------------
    # Validators: enforce extra rules
    # -----------------------------
    @validator("allocation")
    def validate_allocation(cls, v: Dict[str, float]):
        total = sum(v.values())   # Add up all percentages
        if not (99.9 <= total <= 100.1):  # Allow slight rounding tolerance
            raise ValueError(f"Allocation percentages must add up to 100, got {total}")
        return v
        # Ensures allocation like {'equity': 60, 'bonds': 40} is valid,
        # but {'equity': 70, 'bonds': 50} is rejected

    @validator("annual_rates")
    def validate_annual_rates(cls, v: Dict[str, float]):
        for asset, rate in v.items():      # Check each asset’s rate
            if rate < 0 or rate > 100:     # Must be between 0 and 100
                raise ValueError(f"Annual rate for {asset} must be between 0 and 100, got {rate}")
        return v
        # Prevents unrealistic values like negative returns or >100% growth

