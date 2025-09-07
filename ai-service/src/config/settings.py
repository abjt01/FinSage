from pydantic_settings import BaseSettings   # Pydantic: allows defining config fields that auto-load from env/.env
from pathlib import Path                     # For building OS-independent file paths
from dotenv import load_dotenv               # To load .env variables into system environment
import os                                    # Standard library, used implicitly by dotenv/pydantic

# ------------------------------------------------------------
# STEP 1: Build absolute path to your .env file
# ------------------------------------------------------------
# __file__ → current file (settings.py)
# .resolve() → returns absolute path
# .parents[3] → walk 3 levels up (src/config → ai-service → FinSage root)
# At root, we expect `.env` file
env_path = Path(__file__).resolve().parents[3] / ".env"

# ------------------------------------------------------------
# STEP 2: Load .env so its variables become available to os.environ
# ------------------------------------------------------------
load_dotenv(dotenv_path=env_path)

# ------------------------------------------------------------
# STEP 3: Define Settings model
# ------------------------------------------------------------
class Settings(BaseSettings):
    # REQUIRED CONFIGS → Must exist in .env file, otherwise validation error
    gemini_api_key: str       # Google Gemini API key
    mcp_api_key: str          # MCP API key (custom service auth)
    mcp_base_url: str         # Base URL for MCP API
    api_port: int             # Port number where FastAPI will run
    database_url: str         # PostgreSQL connection string

    class Config:
        # Tell Pydantic explicitly where to look for env vars
        env_file = env_path
        env_file_encoding = 'utf-8'

# ------------------------------------------------------------
# STEP 4: Instantiate global settings object
# ------------------------------------------------------------
# This makes `settings` importable everywhere in the app.
settings = Settings()

