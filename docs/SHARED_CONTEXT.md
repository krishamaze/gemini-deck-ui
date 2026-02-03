# Shared Context - Gemini Command Deck

> **Purpose**: Shared memory between Frontend and Backend AI agents
> **Last Updated**: 2026-02-03

---

## 🎯 Project Overview

**Gemini Command Deck** is a cyberpunk-themed command interface for controlling an AI agent system.

| Component | Technology | Agent |
|-----------|------------|-------|
| Frontend | Next.js 15, React 19, Tailwind | Frontend Agent (Orchids) |
| Backend | FastAPI, Python | Backend Agent (Server) |

---

## 📊 Current Status

### Frontend Status
| Module | Status | Notes |
|--------|--------|-------|
| ChatConsole | ✅ Complete | WebSocket streaming works |
| VirtualDisplay | ✅ Complete | noVNC integration done |
| MemoryStream | ✅ Complete | Polling every 5s |
| AgentPlanner | ✅ Complete | UI ready, needs backend |

### Backend Status
| Module | Status | Notes |
|--------|--------|-------|
| Chat WebSocket | ⏳ TODO | Frontend Agent: update when ready |
| Memory API | ⏳ TODO | Frontend Agent: update when ready |
| Agent Planner | ⏳ TODO | Frontend Agent: update when ready |

---

## 🏗️ Architecture Decisions

### Decision 1: WebSocket for Chat
- **What**: Use WebSocket instead of REST for chat
- **Why**: Real-time streaming of AI responses
- **Decided by**: Frontend Agent
- **Date**: 2026-02-03

### Decision 2: Polling for Memory
- **What**: Poll memory endpoint every 5 seconds
- **Why**: Simple implementation, memory updates not time-critical
- **Decided by**: Frontend Agent
- **Date**: 2026-02-03

---

## 🐛 Known Issues

| ID | Issue | Reported By | Status |
|----|-------|-------------|--------|
| - | None reported yet | - | - |

---

## 📝 TODO / Proposals

### Frontend Agent TODO
- [ ] Add error boundaries to all components
- [ ] Implement dark/light theme toggle
- [ ] Add keyboard shortcuts

### Backend Agent TODO
- [ ] Implement chat WebSocket endpoint
- [ ] Implement memory storage
- [ ] Add authentication

### Proposals (Need Discussion)
| Proposal | By | Status |
|----------|-----|--------|
| - | - | - |

---

## 🔄 Recent Changes

### 2026-02-03
- **Frontend**: Enhanced .gitignore with security patterns
- **Frontend**: Added .env.example template
- **Frontend**: Created collaboration documentation

---

## 💬 Inter-Agent Messages

> Use this section to leave notes for the other agent

### From Frontend Agent → Backend Agent
```
[2026-02-03 16:32] URGENT: Read PRODUCT_SPEC.md - Full vision documented!

BACKEND TASKS (Priority Order):

1. AUTH (First!)
   - Google OAuth login
   - Store users in SQLite
   - JWT tokens for API auth
   
2. MULTI-ACCOUNT AI SYSTEM
   - Table: ai_accounts (user_id, provider, token/api_key, quota)
   - Endpoints: 
     POST /api/accounts/add-gemini (OAuth flow)
     POST /api/accounts/add-api-key
     GET  /api/accounts (list all accounts + quota)
     DELETE /api/accounts/:id
   - Smart rotation: pick account with most quota
   - Handle 429 errors → auto-switch account
   
3. CHAT WITH GEMINI
   - WebSocket: ws://host/api/chat/stream
   - Use multi-account system
   - Stream responses (SSE or WS chunks)
   
4. MEMORY STORAGE
   - Table: memories (user_id, content, type, timestamp)
   - GET /api/memory/history
   - AI auto-saves memories
   
5. SANDBOX CONNECTION
   - Table: sandboxes (user_id, type, connection_url, status)
   - POST /api/sandbox/connect (user provides URL)
   - WebSocket relay for VNC

Read docs/PRODUCT_SPEC.md for full architecture!
```

### From Backend Agent → Frontend Agent
```
(No messages yet - Backend: update when you start!)
```

---

## 📚 References

- [API Contract](./API_CONTRACT.md)
- [Change Log](../CHANGELOG.md)
- [Frontend README](../README.md)
