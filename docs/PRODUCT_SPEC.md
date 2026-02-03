# Gemini Command Deck - Product Spec

> 🌳 *Minimum Viable Documentation - Keep it short, useful, updated*
> 
> **Last Updated**: 2026-02-03

---

## 🎯 Vision

**"An AI friend that lives on your computer"**

Chat-first interface where users talk naturally to an AI that has full access to their sandbox, can see their screen, remembers everything, and gets smarter over time.

Inspired by: [Claw/ClawBot](https://claw.bot)

---

## 👥 Users

- Developers who want AI assistance
- Non-technical users who want a smart assistant
- Teams wanting shared AI workspaces

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  YOUR SERVER (Central - 4GB Ubuntu)                        │
│  • Auth + Login                                             │
│  • User profiles                                            │
│  • Memory storage                                           │
│  • API Gateway                                              │
│  • Web UI (Next.js)                                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  User A  │    │  User B  │    │  User C  │
    │  Laptop  │    │  Daytona │    │  Laptop  │
    │  Docker  │    │  Cloud   │    │  Docker  │
    └──────────┘    └──────────┘    └──────────┘
    (BYOC)          (Cloud)         (BYOC)
```

---

## 🧩 Core Components

| Component | Tech | Owner |
|-----------|------|-------|
| **Frontend** | Next.js 15, React 19 | Frontend Agent |
| **Backend API** | FastAPI, Python | Backend Agent |
| **Database** | SQLite → PostgreSQL | Backend Agent |
| **Sandbox** | Docker + VNC | Backend Agent |
| **AI** | Gemini API (multi-key) | Backend Agent |

---

## 🔑 Key Features (V1)

### 1. Chat Interface
- Natural conversation
- AI is proactive ("I noticed your quota is low...")
- Approve/reject actions

### 2. Multi-Account AI
- Multiple Gemini Pro subscriptions (OAuth)
- Multiple AI Studio API keys
- Auto-rotation on 429 errors
- Quota tracking & warnings

### 3. Sandbox (BYOC)
- User runs Docker on their machine
- OR connects Daytona cloud
- VNC display in UI
- Gemini CLI pre-installed

### 4. Memory
- AI remembers everything
- Skills saved and reused
- User can view/edit memories

### 5. GitHub Integration
- AI sees user's repos
- Can create/edit code
- PR and commit support

---

## 📊 Database Schema (Simple)

```sql
-- Users
users (id, email, name, created_at)

-- AI Accounts (multi-key support)
ai_accounts (id, user_id, provider, token, api_key, daily_limit, daily_used, expires_at)

-- Memories
memories (id, user_id, content, type, created_at)

-- Skills
skills (id, user_id, name, definition, created_at)

-- Sandboxes
sandboxes (id, user_id, type, connection_url, status, specs)
```

---

## 🚀 Roadmap

| Phase | What | When |
|-------|------|------|
| **V1** | Chat + Auth + Basic AI | 4 weeks |
| **V2** | Multi-account + Sandbox | 4 weeks |
| **V3** | Memory + Skills | 4 weeks |
| **V4** | Polish + Launch | 2 weeks |

---

## 📁 Repo Structure

```
Frontend: github.com/krishamaze/gemini-deck-ui
Backend:  github.com/krishamaze/gemini-deck-backend
```

---

## 📚 Related Docs

- [API Contract](./API_CONTRACT.md)
- [Shared Context](./SHARED_CONTEXT.md)
- [Agent Workflow](./AGENT_WORKFLOW.md)
