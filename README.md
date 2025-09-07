FinSage

A conversational AI finance coach that unifies your personal finance data, runs smart simulations, and gives you actionable steps to reach your goals.

Instead of staring at scattered account numbers and guessing, FinSage answers the real question:
Will I reach my goal, and what must I change today to get there?

Problem

People juggle multiple bank accounts, cards, and investments, but rarely get a clear view of whether they’re on track to hit important milestones like buying a home, funding education, or retiring comfortably. Current apps show balances but not personalized, goal-driven plans.

Solution

FinSage connects your financial data, simulates future outcomes, and responds conversationally.
Ask: “Can I buy a flat worth 50 lakh in five years?”
Get: “Increase your SIP by ₹6,000 per month to close the gap and stay on track.”

Features

Conversational interface powered by AI

Personalized insights computed from live data

Goal-based What-If simulations

SIP auto-optimizer with precise monthly adjustments

Rich visualizations for progress and shortfall analysis

Smart alerts when goals drift off course

Financial MCP connector for seamless account integration

Actionable, transparent recommendations

System Architecture
financial-ai-agent/
├── frontend/        → React + Tailwind, user interface and charts
├── backend/         → Node.js API Gateway, auth and data orchestration
├── ai-service/      → FastAPI microservice for AI, simulations, exports
└── docs/            → Documentation and setup guides

High-Level Diagram
[ User ]
   │
   ▼
[ Frontend (React) ]
   │
   ▼
[ Backend (Node API Gateway) ]
   │
   ├── Auth + Validation
   ├── Database (PostgreSQL)
   └── Calls → [ AI Service (FastAPI) ]
                  │
                  ├── LangChain orchestration
                  ├── Gemini LLM integration
                  ├── Simulation Engine (NumPy, Pandas)
                  ├── Export Service (CSV, JSON, PDF)
                  └── Financial MCP Connector (Bank + Investment data)
