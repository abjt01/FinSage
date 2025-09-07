from langchain.prompts import PromptTemplate   # Import PromptTemplate → lets us define reusable prompt structures with placeholders
from langchain.llms import GoogleGemini        # Import GoogleGemini LLM wrapper from LangChain (to interact with Gemini model)
from src.config.settings import Settings       # Import Settings (so API key and configs can be pulled from environment)

class AIOrchestrator:   # Main class that coordinates prompt creation + LLM call
    def __init__(self, api_key: str):   # Constructor, takes API key as argument
        # Initialize Gemini LLM with provided API key
        self.llm = GoogleGemini(api_key=api_key)
        
        # Define a prompt template with placeholders {query} and {context}
        self.prompt_template = PromptTemplate(
            input_variables=["query", "context"],   # Variables that must be filled when formatting prompt
            template="""
            You are FinSage, a financial AI coach. Provide accurate and concise financial advice.
            User query: {query}
            Context (user financial data): {context}
            Answer in a friendly, professional tone.
            """   # Prompt guides the AI’s behavior and output style
        )

    def process_query(self, query: str, user_id: str = None):  # Main function to handle incoming user query
        try:
            # If no user_id provided → assume no personal data, otherwise pretend to fetch user-specific context
            context = "No user financial data available." if user_id is None else f"Fetching data for user {user_id}."
            
            # Format the prompt template by injecting actual query + context
            prompt = self.prompt_template.format(query=query, context=context)
            
            # Send formatted prompt to Gemini model → returns structured generations
            response = self.llm.generate([prompt])
            
            # Extract the text from first generation, clean spaces, return as final answer
            return response.generations[0][0].text.strip()
        except Exception as e:
            # If anything fails (e.g., API issue), raise a custom error
            raise Exception(f"Failed to process query: {str(e)}")
