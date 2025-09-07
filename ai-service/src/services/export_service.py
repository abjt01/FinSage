import pandas as pd              # Pandas → for handling tabular data
import matplotlib.pyplot as plt  # Matplotlib → for plotting charts
import io                        # io → for in-memory buffers (StringIO, BytesIO)
import base64                    # base64 → for encoding binary chart images into text
from typing import Dict, List    # Typing → type hints (List of Dicts, etc.)

class ExportService:
    # ---------------- CSV Export ----------------
    def export_to_csv(self, data: List[Dict], filename: str = "financial_data.csv") -> str:
        """
        Convert a list of dictionaries (records) into CSV format and return as a string.
        - data: List of dicts → e.g., [{"year": 2020, "revenue": 1000}, ...]
        - filename: Optional (not directly used since we return the CSV string)
        """
        try:
            df = pd.DataFrame(data)    # Convert list of dicts into Pandas DataFrame
            buffer = io.StringIO()     # In-memory text buffer
            df.to_csv(buffer, index=False)  # Write CSV data into buffer
            return buffer.getvalue()   # Return CSV as a plain string
        except Exception as e:
            raise Exception(f"Failed to export to CSV: {str(e)}")

    # ---------------- Chart Generation ----------------
    def generate_chart(self, data: List[Dict], x_key: str, y_key: str, title: str) -> str:
        """
        Generate a line chart from given data and return as Base64-encoded PNG.
        - data: List of dicts
        - x_key: Key for x-axis values
        - y_key: Key for y-axis values
        - title: Title of the chart
        """
        try:
            df = pd.DataFrame(data)        # Convert list of dicts into DataFrame
            plt.figure(figsize=(10, 6))    # Set chart size (10x6 inches)
            plt.plot(df[x_key], df[y_key], marker='o')  # Line chart with markers
            plt.title(title)               # Add chart title
            plt.xlabel(x_key)              # Label x-axis
            plt.ylabel(y_key)              # Label y-axis
            plt.grid(True)                 # Add grid for readability
            
            buffer = io.BytesIO()          # Binary buffer for image
            plt.savefig(buffer, format='png')  # Save chart into buffer as PNG
            plt.close()                    # Close plot (frees memory)
            buffer.seek(0)                 # Reset buffer pointer
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            return f"data:image/png;base64,{image_base64}"  # Return embeddable image string
        except Exception as e:
            raise Exception(f"Failed to generate chart: {str(e)}")


