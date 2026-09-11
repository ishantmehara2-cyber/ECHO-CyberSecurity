# ECHO — Evidence-Centric Hypothesis & Correlation Oracle

ECHO is an explainable cybersecurity telemetry correlation, evidence gap detection, and attack sequence reconstruction platform built for Security Operations Centers (SOCs).

## 🛡️ Problem Statement
Security analysts face alert fatigue caused by thousands of disconnected logs across disparate tools (IAM, Firewalls, EDR, Syslog, Cloud Gateways). Manually stitching together scattered events to understand an attack kill chain takes hours of tedious query engineering.

ECHO solves this problem with one core philosophy: **"Make the invisible investigation process visible."** It ingests heterogeneous telemetry, normalizes unstructured vendor logs into a unified schema, correlates related events across independent data silos, reconstructs multi-stage attack paths with transparent reasoning, and detects missing evidence gaps.

---

## ⚡ Key Capabilities & Features

1. **Four Dedicated Telemetry Silos**:
   - Identity & Authentication Gateway
   - Network Sensor
   - Threat Intelligence Feed
   - Endpoint & System Sensor

2. **Multi-Source Ingestion & Normalization Engine**:
   - Standardizes raw JSON, Syslog, and CEF vendor logs into the unified ECHO Schema (`entity_user`, `entity_device`, `entity_ip`, `entity_asset`, `event_type`, `severity`).
   - Side-by-side JSON schema normalization inspection view.

3. **Explainable Cross-Silo Correlation Graph**:
   - Graph network with interactive nodes and explicit correlation edges.
   - **"WHY CONNECTED?"** reasoning inspector detailing exact matching factors (shared account, shared host, 8-minute temporal window) and confidence scores.

4. **Chronological Attack Reconstruction Engine**:
   - Synthesizes multi-stage kill chains (Initial Activity → Access → Execution → Collection → Staging → Exfiltration).
   - Transparent confidence score breakdowns and risk level badges.

5. **Evidence Gap Detection & Next Best Evidence**:
   - Identifies missing telemetry between correlated stages without making false assumptions (`✓ OBSERVED` vs `? POSSIBLE GAP`).
   - Calculates Evidence Coverage % and recommends targeted data sources to ingest next.

6. **ECHO Attack DNA**:
   - Converts thousands of records into a single structured Digital Attack Fingerprint.

7. **"Ask ECHO" Investigation Search Engine**:
   - Deterministic, explainable natural language search over current investigation data.

8. **Executive Report Generator**:
   - One-click executive summary report ready for export.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React icons
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic v2
- **Data Models**: Deterministic JSON evidence models, network graph structures, and weighted confidence rules.

---

## 📂 System Architecture

```
ECHO-CyberSecurity/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommandCenter/       # Hero, Status Cards, Connection Demo
│   │   │   ├── Correlation/          # Graph, Timeline, Story Narrative
│   │   │   ├── Demo/                 # Demo Flow Presentation Navigation
│   │   │   ├── Executive/            # Executive Overview & Control Panel
│   │   │   ├── Gaps/                 # Gap Detection, Coverage, Path Completion
│   │   │   ├── Search/               # Ask ECHO Query Engine
│   │   │   ├── Telemetry/            # Stream, Connectors, Normalization
│   │   │   └── Vault/                # 4 Silos, Upload, Stage Controllers
│   │   ├── data/                     # Telemetry & Vault Datasets
│   │   ├── layouts/                  # Main Layout & Topbar Health Check
│   │   ├── pages/                    # Main Module Pages
│   │   └── types/                    # TypeScript Data Schemas
├── backend/
│   ├── app/
│   │   └── main.py                   # FastAPI Application & Health API
│   └── requirements.txt
└── README.md
```

---

## 🚀 How to Run the Application

### 1. Start the Backend API
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- API Health Endpoint: `http://localhost:8000/health`
- API Documentation: `http://localhost:8000/docs`

### 2. Start the Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- Access the web interface at: `http://localhost:5173`

---

## 🎭 Guided Hackathon Presentation Flow

For a live demonstration to judges:

1. **Step 1 — Command Center (`/`)**: Overview of the platform and conceptual pipeline.
2. **Step 2 — Evidence Vault (`/evidence-vault`)**: Click **"Load 4 Official Demo PDFs"** to populate all four independent security silos (*Identity*, *Network*, *Intel*, *Endpoint*).
3. **Step 3 — Launch Investigation**: Click **"⚡ BEGIN FULL ECHO INVESTIGATION"** to watch the automated 5-stage correlation.
4. **Step 4 — Correlation Graph (`/correlation-engine`)**: Click any edge or node to inspect the **"WHY CONNECTED?"** reasoning box and matching factors.
5. **Step 5 — Attack Reconstruction (`/attack-reconstruction`)**: Review the 6 chronological kill-chain stages with confidence scores.
6. **Step 6 — Evidence Intelligence (`/evidence-intelligence`)**: Inspect the **78% Evidence Coverage Score** and **Evidence Gap Detection** (`✓ OBSERVED` vs `? POSSIBLE GAP`).
7. **Step 7 — Ask ECHO**: Query the search engine using quick-triggers like *"Show activity related to employee_07"*.
8. **Step 8 — Executive Report**: Click **"Generate Investigation Summary Report"** to review or export the final executive report.

---

## 📜 Development Disclosure
Developed using iterative full-stack engineering standards with zero external paid API requirements. All telemetry parsing and correlation models execute locally.
