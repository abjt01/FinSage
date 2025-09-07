# FinSage 🔥

> A conversational AI finance coach that unifies your personal finance data, runs smart simulations, and gives you actionable steps to reach your goals.

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

FinSage is a conversational AI finance coach that unifies personal finance data, runs smart simulations, and gives actionable steps to reach goals—so the question “Will I make it, and what must I change today?” is answered with clarity. [1][12][19]

## 🔥 The Torch Metaphor

- A single matchstick can feel small—until it becomes a torch that lights the path ahead, and FinSage is that torch for money decisions. [1]
- Instead of peering at scattered numbers in the dark, ignite one spark and turn complexity into a clear route to the goal. [1]
- Where dashboards stop at “what you have,” FinSage moves to “what to do,” “what-if,” and “what changes to win.” [1]

## 🎯 Problem

People juggle bank accounts, cards, loans, and investments without a confident, goal-driven plan for buying a home, funding education, or retiring on time, because most tools show balances but not the path. [1]

## 💡 Solution

FinSage connects live financial data via Fi MCP, simulates outcomes, and responds conversationally, so a question like “Can I buy a ₹50L flat in five years?” returns “Increase your SIP by ₹6,000 per month to close the gap and stay on track.” [1][2][3][11]

## ✨ Features

- 🤖 Conversational AI interface with goal-first answers powered by an AI orchestrator. [12][9]
- 📊 Personalized insights computed from live data across accounts via Fi MCP. [1][2]
- 🎯 Goal-based what‑if simulations for timelines, contributions, and returns. [12]
- 📈 SIP auto-optimizer with precise monthly adjustment suggestions. [12]
- 📉 Rich visualizations for progress, shortfall, and scenario analysis. [19][7]
- ⚠️ Smart alerts when goals drift off course with transparent next actions. [12]
- 🔌 Financial MCP connector for unified, query-ready portfolio context. [1][3]
- 🔐 Secure, session-bound access patterns aligned with Fi MCP guidance. [1][3]

## 🧠 Why Fi MCP Matters

Fi MCP provides a secure, structured, query‑ready stream of a person’s consolidated finances—making money “programmable” for an AI assistant and turning static dashboards into real‑time, context‑aware decisions. [1]
It can include mutual funds, Indian and US stocks, bank balances, credit cards, loans, EPF, NPS, FDs, gold, ESOPs, and more, so simulations and advice are grounded in reality. [2][5]
This lets FinSage act as a portfolio analyst that answers the actual question—what to do next—rather than just report a number. [1]

## 🏗️ System Architecture

financial-ai-agent/
├── frontend/ → React + Tailwind, user interface and charts
├── backend/ → Node.js API Gateway, auth and orchestration
├── ai-service/ → FastAPI microservice for AI, simulations, exports
├── mcp-integration/ → Fi MCP connector for financial data
└── docs/ → Guides and references

text

High‑Level Data Flow: User → Frontend → Backend → AI Service, with Fi MCP providing unified, secure financial context to drive conversations and simulations. [1][12][19]

## 🛠️ Technology Stack

### Frontend
- React 18 with concurrent foundations for responsive experiences and modern hooks. [19][16][7]
- Tailwind CSS for rapid, consistent UI delivery and theming. [19]
- Plotly.js and React bindings for interactive, data‑rich charts. [19][7]

### Backend
- Node.js API Gateway for auth, validation, and routing to AI and MCP integrations. [19]
- PostgreSQL or other store layered behind services for reliability and reporting. [19]
- Structured logging and request governance for production readiness. [19]

### AI Service
- FastAPI for high‑performance, typed endpoints with automatic docs and validation. [12][15][6]
- LangChain‑style orchestration to shape prompts, tools, and context for the LLM. [9]
- Google Gemini API for natural language capabilities within finance workflows. [11]
- NumPy/Pandas for accurate financial math and simulation data handling. [12]

### Financial Integration
- Fi MCP connector to unify portfolios and accounts into a queryable stream. [1][3]
- Scoped, time‑bound sessions and secure access patterns consistent with Fi MCP FAQs and setup. [1][4]

## 🚀 Quick Start

1) Set environment variables for backend, AI engine URL, and Fi MCP configuration to enable secure calls and unified data access. [1][12]
2) Run the backend API gateway to handle auth, proxying, and orchestration with the AI service. [19]
3) Start the FastAPI AI service and verify interactive docs load for chat and simulation endpoints. [12][15]
4) Launch the React frontend to chat with FinSage, tune SIPs, and visualize progress. [19][7]

## 🧪 Demo Journey

Ask “Can I afford a ₹50L flat in 5 years?” and receive a concrete SIP adjustment, probability estimate, and a shortfall chart grounded in current holdings and flows. [1][12][19]
Explore “what‑if” by sliding time horizon, expected returns, and contributions to see median, P10, and P90 paths. [12]
Let SIP auto‑optimizer suggest the incremental monthly amount that turns red‑zone risk into green‑zone confidence. [12]

## 📈 Financial Math (Core)

- SIP Future Value: FV = PMT × [((1 + r)^n − 1) / r] used to project contributions with monthly compounding. [12]
- Timeline Solve: n = log(1 + (FV × r)/PMT) / log(1 + r) for finishing time under given assumptions. [12]
- CAGR: (Ending/Beginning)^(1/n) − 1 for normalized performance across horizons. [12]

## 🔧 Configuration (Essentials)

- AI_ENGINE_URL points the backend to the FastAPI service for chat, analyze, and simulate routes. [12]
- GEMINI_API_KEY authorizes LLM calls for conversational and explanatory responses. [11]
- MCP credentials or session config connect the Fi MCP stream for real‑time financial context. [1][3]

## 🩺 Health & Docs

- FastAPI auto‑generates OpenAPI docs to test requests, review schemas, and validate inputs at runtime. [12][15][6]
- Keep an eye on gateway and AI logs for prompt shaping, latency, and fallback behavior under load. [12]

## 🔥 Brand Motif: The Matchstick Torch

- The matchstick is small, but when struck, it becomes a torch—FinSage is that spark that turns numbers into navigation. [1]
- With Fi MCP as the fuel and FastAPI+React as the flint and steel, the flame stays bright, reliable, and ready. [1][12][19]
- The torch isn’t just light—it’s direction, confidence, and momentum for every financial journey. [1]

## 📝 API Snapshot

- POST /api/ai/chat → Conversational answers with live context from MCP‑fed profiles. [1][12]
- POST /api/ai/simulate/goal or /simulate/sip → What‑if projections for timelines and monthly contributions. [12]
- GET /api/users/dashboard → Goal‑centric view and progress metrics, refreshed with MCP syncs. [1]

## 🚨 Troubleshooting

- If the AI docs don’t load, ensure the FastAPI service URL matches backend configuration and the process is healthy. [12][15]
- If React renders legacy warnings, upgrade to React 18 root APIs like createRoot to align with concurrent foundations. [16][7]
- If MCP data appears incomplete, verify Fi MCP linking covers mutual funds, stocks, accounts, and benefits like EPF/NPS. [2][5]
