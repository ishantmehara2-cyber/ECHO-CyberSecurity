# ECHO - Evidence-Centric Hypothesis & Correlation Oracle

ECHO is a professional web-based cybersecurity investigation platform.

## Problem Being Solved
Modern Security Operations Centers (SOCs) are overwhelmed with disconnected alerts from disparate tools (EDR, NDR, IAM, etc.). ECHO's goal is to ingest this disconnected telemetry, normalize it, and automatically identify similarities (same identity, device, IP, and time) to reconstruct explainable multi-stage cyberattack sequences. 

The most important product philosophy of ECHO is: **"Make the invisible investigation process visible."**

## Conceptual Workflow
1. **INGEST**: Receive raw security events.
2. **NORMALIZE**: Convert different security data into one comparable format.
3. **COMPARE**: Look for the same people, devices, addresses, and time patterns.
4. **CONNECT**: Link events when meaningful similarities are found.
5. **RECONSTRUCT**: Build the attack timeline.
6. **EXPLAIN**: Translate findings to plain text.

## Phase 1 Status
Phase 1 focuses exclusively on establishing the **professional project foundation** and **cybersecurity command-center design system**.
Currently, the UI is an interactive shell demonstrating how future processing will occur. The frontend successfully communicates with the backend health endpoint, validating the architecture. Live telemetry ingestion, graph correlation, and attack reconstruction are planned for Phase 2.

## Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React icons
- **Backend**: Python, FastAPI, Uvicorn, Pydantic
## Setup & Running Instructions

The backend API will run at `http://localhost:8000`. You can check the health endpoint at `http://localhost:8000/health`.
The frontend application will be available at `http://localhost:5173`.
