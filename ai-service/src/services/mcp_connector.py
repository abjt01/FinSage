import requests                           # Import requests → used for making HTTP calls to external MCP service
from src.config.settings import Settings  # Import Settings → holds API keys, base URLs, etc. (though not directly used here)

class MCPConnector:   # Connector class to interact with the MCP (some external financial data provider)
    def __init__(self, mcp_api_key: str, mcp_base_url: str):   # Constructor → needs API key + base URL
        # Store API key and base URL
        self.api_key = mcp_api_key
        self.base_url = mcp_base_url
        
        # Define headers for authentication → Bearer token style
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    def fetch_user_financial_data(self, user_id: str):   # Method → fetches full financial data for a given user
        try:
            # Send GET request to MCP endpoint /users/{user_id}/financials
            response = requests.get(
                f"{self.base_url}/users/{user_id}/financials",
                headers=self.headers
            )
            # Raise error if status code not 200 (4xx/5xx)
            response.raise_for_status()
            
            # Return parsed JSON response
            return response.json()
        except requests.RequestException as e:
            # Catch network/HTTP errors and wrap in custom exception
            raise Exception(f"Failed to fetch MCP data: {str(e)}")

    def fetch_account_balances(self, user_id: str):   # Method → extracts specific sections of user financial data
        try:
            # Get complete user financial data
            data = self.fetch_user_financial_data(user_id)
            
            # Return only relevant parts (with safe defaults if missing)
            return {
                "bank_accounts": data.get("bank_accounts", []),   # list of bank accounts
                "investments": data.get("investments", []),       # list of investment accounts
                "credit_cards": data.get("credit_cards", [])      # list of credit card accounts
            }
        except Exception as e:
            # If anything fails (fetching/parsing), raise exception with details
            raise Exception(f"Failed to fetch account balances: {str(e)}")

