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
[2026-02-03] Frontend is ready! All 4 main components are built.
Waiting for backend endpoints to be implemented.
Please update SHARED_CONTEXT.md when endpoints are ready.
```

### From Backend Agent → Frontend Agent
```
(No messages yet)
```

---

## 📚 References

- [API Contract](./API_CONTRACT.md)
- [Change Log](../CHANGELOG.md)
- [Frontend README](../README.md)
