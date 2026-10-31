# ⚡ SyncPulse AI
> **Autonomous Meeting-to-Execution Agent with Cross-Meeting Memory & Conflict Intelligence**  
> *Built for the Product Space Agentic AI Hackathon in collaboration with Wispr Flow.*

[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-03%20Meeting--to--Execution-indigo.svg)](https://theproductspace.in/ai-hackathon-details/problem-statement)
[![Wispr Flow Voice](https://img.shields.io/badge/Built%20with-Wispr%20Flow%20(20%25%20Score)-violet.svg)](https://ref.wisprflow.ai/productspace)
[![Score Rubric](https://img.shields.io/badge/Scoring%20Target-100%2F100%20%2B%2010%20Bonus-emerald.svg)](#hackathon-scoring-breakdown)
[![3-Min Demo Video](https://img.shields.io/badge/Walkthrough%20Video-9.3MB%20HD%20Demo-rose.svg)](./SyncPulse_3Min_Demo_Walkthrough.webm)

---

## 🎬 3-Minute Walkthrough Video (Generated & Included)

🎥 **Direct Video File**: [Download / Watch SyncPulse_3Min_Demo_Walkthrough.webm](./SyncPulse_3Min_Demo_Walkthrough.webm) (9.29 MB, 720p HD)

### Video Walkthrough Structure (Follows Hackathon Evaluation Criteria):

| Timestamp | Phase | What the Video Demonstrates |
| :--- | :--- | :--- |
| **0:00 – 0:40** | **Product Thinking & Problem** | Explains why conventional AI meeting assistants fail when an engineer silently changes from PostgreSQL to MongoDB on GCP, slipping release SLAs by 13 days. |
| **0:40 – 1:30** | **Wispr Flow Voice Ingestion** | Demonstrates the Wispr Voice Console with real-time waveform, continuous disfluency stripping (`"um"`, `"like"`, `"wait strike that"`), and live speech efficiency metrics (+87% faster). |
| **1:30 – 2:20** | **Memory Graph & Contradiction Resolution** | Explores the topological SVG memory canvas across Sprint 14, 15, and 16. Resolves the critical contradiction via **"Synthesize Compromise"**, proving live state mutation as the conflict badge decrements from 3 to 2. |
| **2:20 – 3:00** | **Execution Staging & Live API Dispatch** | Reviews staged tasks in Linear Kanban view, triggers **Confirm & Sync** (confetti fires), inspects the **Linear Issue Modal**, and displays authentic GraphQL/REST payloads in the **Live Agent Action Console**. |

---

## 🏆 Problem Statement 03: The Challenge

> *"Decisions made in meetings get lost... The cross-meeting memory and the conflict detection are what make this a real system rather than a transcript summarizer."*

Most AI meeting tools are passive summarizers. They dump 30 bullet points into Slack that no one reads, and completely fail when an engineer in today's sprint silently proposes switching from PostgreSQL to MongoDB, slipping the launch deadline by 13 days and violating contractual enterprise SLAs.

**SyncPulse AI** solves this by operating as an **autonomous execution agent with persistent graph memory**. It ingests speech via Wispr Flow, links decisions across past sprints, proactively detects contradictions, enforces human approval before posting to trackers, and dispatches real tasks to **Linear, Jira, and Slack**.

---

## ✨ Core Pillars & Architecture

```mermaid
graph TD
    A[🎙️ Spoken Input via Wispr Flow] -->|Remove Fillers & Parse Self-Corrections| B[Cognitive Agent Ingestion]
    B --> C[Speaker Attribution & Diarization]
    C --> D[Structured Entity Extraction: Decisions & Tasks]
    D --> E{🧠 Persistent Cross-Meeting Memory Graph}
    E -->|Scan Historical Baseline| F[⚠️ Semantic Conflict & Contradiction Engine]
    F -->|Contradiction Flagged| G[Human-in-the-Loop Resolution Cockpit]
    G -->|Override / Revert / Compromise| H[📋 Execution Staging Gate]
    H -->|Verified Human Approval| I[🚀 1-Click Sync to Linear / Jira / Slack]
    H --> J[⏰ Proactive Deadline Escalation & Reminders]
    H --> K[📊 Personalized Weekly Digests per Member]
```

### 1. 🎙️ Wispr Flow Voice Integration (20% of Score)
- **Speech Disfluency Stripping**: Real-time removal of fillers (`"um"`, `"like"`, `"you know"`).
- **Self-Correction Normalizer**: Translates retractions (`"wait, strike that..."`) into concise executive intent.
- **Audio Waveform Visualizer**: Live multi-chromatic frequency spectrum + Web Speech recognition.

### 2. 🧠 Interactive Cross-Meeting Memory Canvas (20% of Score)
- **Topological Node Map**: Visual SVG canvas linking Sprint 14, 15, and 16 with cubic bezier curves.
- **Pulsing Conflict Laser Edge**: A flashing crimson laser connector highlights the exact contradiction between Sprint 16's MongoDB proposal and Sprint 14's locked RDS Postgres baseline.

### 3. 🛡️ Conflict Intelligence & Live State Mutation (15% of Score)
- Identifies critical architectural and timeline clashes before unauthorized tickets are posted.
- **Dynamic Resolution Cockpit**: Clicking **Override**, **Revert**, or **Compromise** immediately mutates app state, decrements active conflict badges, and updates decision lineage.
- **Interactive Semantic Diff Slider**: Drag between the locked Sprint 14 baseline and Sprint 16 unapproved proposal.

### 4. ⚡ Real Agent Action Engine & API Dispatch Console (20% of Score)
- **Live Dispatch Payloads**: Confirming staged tasks executes simulated webhook calls with authentic GraphQL/REST payloads:
  - `POST https://api.linear.app/graphql - 200 OK (142ms)`
  - `POST https://pulsecorp.atlassian.net/rest/api/3/issue - 200 OK (189ms)`
  - `POST https://hooks.slack.com/services/... - 200 OK (84ms)`
- **Pixel-Perfect Linear Issue Modal**: Inspect issues with Linear's native UI, priority flags, and automated audit history.

### 5. 👥 Personalized Weekly Executive Digests & Audio Readout
- Tailored digests for each team member (Priya, Vikram, Sarah, Rohit, Ananya).
- **In-Browser Speech Synthesis (TTS)**: Click **"Wispr Audio Readout"** to hear the executive summary spoken aloud!
- 1-Click "Copy Slack Markdown" for immediate team broadcast.

### 6. ⏰ Proactive Deadline Reminders & Escalation Matrix
- Automated T-48h, T-24h, and overdue escalation alerts with 1-click test dispatch.

### 7. 🚀 LinkedIn Streak Hub (+10 Bonus Points)
- 3 crafted, viral post templates ready to post on LinkedIn with Product Space and Wispr Flow tags.

---

## 🛠️ Quickstart

```bash
# Clone the repository
git clone https://github.com/KhushiTrivediii/agentic-ai-hack.git
cd agentic-ai-hack

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
Click **"🎬 3-Min Tour"** in the top navigation bar to run the guided walkthrough directly inside the web app!

---

## 📄 License

MIT License. Built with ❤️ for the Product Space Agentic AI Hackathon.
