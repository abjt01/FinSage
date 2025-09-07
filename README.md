# FinSage - AI-Powered Financial Coach 🪙

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Plotly](https://img.shields.io/badge/Plotly.js-Graphing-blueviolet.svg)](https://plotly.com/javascript/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com)
[![LangChain](https://img.shields.io/badge/LangChain-Framework-orange.svg)](https://www.langchain.com)
[![Gemini](https://img.shields.io/badge/Google-GeminiAI-red.svg)](https://deepmind.google/technologies/gemini/)

> A conversational AI finance coach that unifies your personal finance data, runs smart simulations, and provides actionable steps to help you reach your goals.

Instead of staring at scattered account numbers and guessing, FinSage answers the real question: **Will I reach my goal, and what must I change today to get there?**

---

## 🎯 Problem

Managing multiple bank accounts, cards, loans, and investments makes it difficult to understand if you’re on track to meet important milestones such as buying a home, funding education, or retiring comfortably. Most financial apps only show balances—they don’t provide personalized, goal-driven strategies.

---

## 💡 Solution

FinSage consolidates financial data, runs predictive simulations, and responds conversationally.  
Example:  
**Q:** *"Can I buy a ₹50L flat in five years?"*  
**A:** *"Increase your SIP by ₹6,000 per month to close the gap and stay on track."*

---

## ✨ Features

- 🤖 **Conversational AI Interface** – Natural, interactive financial guidance  
- 📊 **Personalized Insights** – Based on live financial data  
- 🎯 **Goal-Based Simulations** – What-if scenarios for major milestones  
- 📈 **SIP Auto-Optimizer** – Monthly investment recommendations  
- 📉 **Rich Visualizations** – Interactive charts and progress tracking  
- ⚠️ **Smart Alerts** – Notifications when goals drift off course  
- 🔌 **Fi MCP Integration** – Unified portfolio data (mutual funds, stocks, loans, EPF, NPS, etc.)  
- 🔐 **Secure Access** – Session-bound, API-based authentication  

---

## 🏗️ System Architecture

financial-ai-agent/
├── frontend/ → React + Tailwind, user interface and charts
├── backend/ → Node.js API Gateway, auth and orchestration
├── ai-service/ → FastAPI microservice for AI, simulations, exports
├── mcp-integration/ → Fi MCP connector for financial data
└── docs/ → Documentation and setup guides

shell
Copy code

### High-Level Data Flow
[ User ]
│
▼
[ Frontend (React) ]
│
▼
[ Backend (Node API Gateway) ]
│
├── Auth + Validation
├── Database (PostgreSQL, MongoDB)
└── Calls → [ AI Service (FastAPI) ]
│
├── LangChain orchestration
├── Gemini LLM integration
├── Simulation Engine (NumPy, Pandas)
├── Export Service (CSV, JSON, PDF)
└── Fi MCP Connector (Bank + Investment data)

markdown
Copy code

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with Vite  
- **Tailwind CSS** for responsive UI  
- **Plotly.js** for financial charting  
- **Framer Motion** for animations  
- **React Hot Toast** for notifications  

### Backend
- **Node.js** with Express.js  
- **PostgreSQL** for structured data  
- **MongoDB** for flexible storage  
- **JWT + bcrypt** for authentication  
- **Winston** for logging  

### AI Service
- **FastAPI** for APIs  
- **LangChain** for orchestration  
- **Google Gemini API** for natural language understanding  
- **NumPy / Pandas** for simulations  
- **Matplotlib** for chart exports  

### Financial Integration
- **Fi MCP** for consolidated financial data  
- **Secure API authentication**  
- **Real-time synchronization**  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+  
- Node.js 18+  
- PostgreSQL 14+  
- Git  

### Installation
```bash
# Clone the repository
git clone https://github.com/abjt01/FinSage.git
cd FinSage

# Copy environment variables
cp .env.example .env
# Edit .env with API keys and credentials

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Run Services
bash
Copy code
# Backend (Terminal 1)
cd backend
npm run dev

# AI Service (Terminal 2)
cd ai-service/src
uvicorn main:app --reload --port 8001

# Frontend (Terminal 3)
cd frontend
npm run dev
Access the app:

Frontend → http://localhost:5173

Backend API → http://localhost:8000

AI Service → http://localhost:8001

Docs → http://localhost:8001/docs

📊 Demo Usage
Goal Planning

text
Copy code
User: "Can I afford a ₹50L flat in 5 years?"
FinSage: "At your current ₹12,000/month SIP (12% returns), you’ll accumulate ₹38L.  
Increase your SIP by ₹6,000/month for an 85% probability of achieving your goal."
SIP Optimization

text
Copy code
User: "How much should I increase my SIP?"
FinSage: "Increase by ₹6,000/month (to ₹18,000).  
Your goal probability improves from 65% → 85%."
📈 Financial Calculations
SIP Future Value:
FV = PMT × [((1 + r)^n - 1) / r]

Goal Timeline:
n = log(1 + (FV × r) / PMT) / log(1 + r)

CAGR:
CAGR = (Ending / Beginning)^(1/n) - 1

🔧 Configuration
Sample .env file:

env
Copy code
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/finsage
MONGODB_URI=mongodb://localhost:27017/finsage

# JWT Authentication
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

# AI Service
GEMINI_API_KEY=your-gemini-api-key
AI_ENGINE_URL=http://localhost:8001

# MCP
MCP_API_KEY=your-mcp-api-key
MCP_BASE_URL=https://mcp.fi.money:8080/mcp

# Frontend
VITE_API_URL=http://localhost:8000
🧪 Testing
bash
Copy code
# Backend
cd backend
npm test

# AI Service
cd ai-service
pytest tests/

# Frontend
cd frontend
npm test
