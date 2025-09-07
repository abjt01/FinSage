import numpy as np

def compound_interest(principal: float, rate: float, time: float, n: int) -> float:
    """
    Calculate compound interest.
    Formula: FV = P * (1 + r/n)^(n*t)
    
    - principal (P): the initial amount
    - rate (r): annual interest rate (in decimal, e.g. 0.08 for 8%)
    - time (t): number of years
    - n: compounding periods per year (12 = monthly, 4 = quarterly, etc.)
    """
    try:
        return principal * np.power(1 + rate / n, n * time)
    except Exception as e:
        raise Exception(f"Compound interest calculation failed: {str(e)}")

def cagr(beginning_value: float, ending_value: float, periods: float) -> float:
    """
    Calculate Compound Annual Growth Rate (CAGR).
    Formula: CAGR = (Ending / Beginning)^(1 / periods) - 1
    
    - beginning_value: starting investment value
    - ending_value: final investment value
    - periods: number of years
    - returns % CAGR (multiplied by 100 for readability)
    """
    try:
        return (np.power(ending_value / beginning_value, 1 / periods) - 1) * 100
    except Exception as e:
        raise Exception(f"CAGR calculation failed: {str(e)}")

