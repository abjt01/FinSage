from langchain.prompts import PromptTemplate   # Build reusable prompts with placeholders
from langchain_google_genai import ChatGoogleGenerativeAI  # Correct Gemini wrapper for LangChain
from src.config.settings import Settings       # Load API keys & configs from .env/settings


class AIOrchestrator:   # This class orchestrates interaction between your app and the LLM
    def __init__(self, api_key: str):   # Constructor → needs API key to authenticate Gemini usage
        # Initialize Gemini LLM with provided API key
        # - model="gemini-1.5-pro" → choose the advanced Gemini model
        # - google_api_key=api_key → authentication key from settings
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=api_key
        )
        
        # Define a reusable prompt template with placeholders {query}, {context}
        self.prompt_template = PromptTemplate(
            input_variables=["query", "context"],   # Declares required fields to fill into the template
            template="""
            You are FinSage, a financial AI coach. Provide accurate and concise financial advice.
            User query: {query}
            Context (user financial data): {context}
            Answer in a friendly, professional tone. 
            If the query requires calculations, indicate they will be handled separately.
            """
            # ↑ The prompt instructs the AI about:
            #   - Its role (financial AI coach)
            #   - What input it receives (user query + context)
            #   - How to respond (friendly, concise, professional)
            #   - Extra rule → if query requires math, tell user it will be handled separately
        )

    def process_query(self, query: str, user_id: str = None):   # Function to process user queries
        try:
            # Decide context: either dummy text or "fetching" message based on user_id
            context = "No user financial data available." if user_id is None else f"Fetching data for user {user_id}."
            
            # Fill in the prompt template with actual query + context
            prompt = self.prompt_template.format(query=query, context=context)
            
            # Send prompt to Gemini model → returns structured object with responses
            response = self.llm.invoke(prompt)   # NOTE: .invoke() is correct for ChatGoogleGenerativeAI
            
            # Extract the plain text response (strip to clean whitespace/newlines)
            return response.content.strip()
        except Exception as e:
            # Wrap any error in a custom exception message
            raise Exception(f"Failed to process query: {str(e)}")
