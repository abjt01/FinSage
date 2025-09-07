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

FinSage/
├── frontend/          # React + Tailwind UI, charts, and client logic
├── backend/           # Node.js API Gateway (auth, routing, orchestration)
├── ai-service/        # FastAPI service (AI, simulations, exports)
├── mcp-integration/   # Fi MCP connector (bank/investment sync)
├── database/          # PostgreSQL + MongoDB persistence layer
└── docs/              # Guides, API specs, and developer notes

### High-Level Data Flow
 [ User ]
    │
    ▼
[ Frontend (React + Tailwind) ]
    │  HTTP/REST, WebSocket
    ▼
[ Backend (Node.js API Gateway) ]
    │
    ├── Authentication & Authorization (JWT, bcrypt)
    ├── Database Layer (PostgreSQL + MongoDB)
    └── Service Routing
           │
           ▼
     [ AI Service (FastAPI) ]
           │
           ├── LangChain Orchestration
           ├── Gemini LLM (NLP & reasoning)
           ├── Simulation Engine (NumPy / Pandas)
           └── Export Module (CSV, JSON, PDF)

     [ Fi MCP Integration ]
           │
           └── Real-time account & portfolio sync

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

### 1\. Prerequisites

*   **Python 3.10+**
    
*   **Node.js 18+**
    
*   **PostgreSQL 14+**
    
*   **Git**
    

### 2\. Clone Repository

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/abjt01/FinSage.git  cd FinSage   `

### 3\. Environment Setup

Copy and configure environment variables:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cp .env.example .env  # Edit with your API keys and database credentials   `

### 4\. Install Dependencies

#### Backend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd backend  npm install   `

#### Frontend

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd ../frontend  npm install   `

#### AI Service

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd ../ai-service  python -m venv venv  source venv/bin/activate    # Windows: venv\Scripts\activate  pip install -r requirements.txt   `

### 5\. Start Services

Run each service in a separate terminal:

**Backend (API Gateway):**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd backend  npm run dev   `

**AI Service (FastAPI):**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd ai-service/src  uvicorn main:app --reload --port 8001   `

**Frontend (React):**

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd frontend  npm run dev   `
