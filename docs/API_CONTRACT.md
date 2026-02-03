# Gemini Command Deck - API Contract

> **Last Updated**: 2026-02-03
> **Version**: 1.0.0
> **Status**: Draft

This document is the **single source of truth** for Frontend-Backend communication.

---

## 📡 Base Configuration

| Environment | Base URL | WebSocket URL |
|-------------|----------|---------------|
| Development | `http://localhost:8000` | `ws://localhost:8000` |
| Production | TBD | TBD |

---

## 🔐 Authentication

| Method | Header | Format |
|--------|--------|--------|
| Bearer Token | `Authorization` | `Bearer <token>` |

---

## 📍 Endpoints

### 1. Chat - WebSocket Streaming

**Endpoint**: `ws://localhost:8000/api/chat/stream`

**Protocol**: WebSocket

**Client → Server Message**:
```json
{
  "type": "message",
  "content": "string",
  "metadata": {
    "timestamp": "ISO8601",
    "client_id": "string"
  }
}
```

**Server → Client Messages**:

| Type | Description | Payload |
|------|-------------|---------|
| `chunk` | Streaming text chunk | `{ "type": "chunk", "content": "string", "trace_id": "string" }` |
| `done` | Stream complete | `{ "type": "done", "trace_id": "string" }` |
| `error` | Error occurred | `{ "type": "error", "error": "string", "trace_id": "string" }` |

**Frontend Implementation**: `src/components/ChatConsole/ChatConsole.tsx`

---

### 2. Memory History

**Endpoint**: `GET /api/memory/history`

**Response**:
```json
{
  "memories": [
    {
      "id": "string",
      "content": "string",
      "type": "thought" | "observation" | "decision" | "action",
      "timestamp": "ISO8601",
      "metadata": {}
    }
  ]
}
```

**Frontend Implementation**: `src/components/MemoryStream/MemoryStream.tsx`

---

### 3. Agent Plan - Generate

**Endpoint**: `POST /api/agent/plan`

**Request**:
```json
{
  "goal": "string",
  "context": {}
}
```

**Response**:
```json
{
  "plan_id": "string",
  "goal": "string",
  "steps": [
    {
      "id": 1,
      "action": "string",
      "description": "string",
      "tool": "browser" | "file_edit" | "terminal" | "code_exec",
      "status": "pending"
    }
  ]
}
```

**Frontend Implementation**: `src/components/AgentPlanner/AgentPlanner.tsx`

---

### 4. Agent Plan - Execute

**Endpoint**: `POST /api/agent/execute`

**Request**:
```json
{
  "plan_id": "string",
  "step_id": 1
}
```

**Response**:
```json
{
  "step_id": 1,
  "status": "completed" | "error",
  "result": "string",
  "error": null | "string"
}
```

---

### 5. VNC Display

**Endpoint**: `ws://localhost:6080`

**Protocol**: VNC over WebSocket (noVNC compatible)

**Frontend Implementation**: `src/components/VirtualDisplay/VirtualDisplay.tsx`

---

## 🔄 Change Log

| Date | Change | Agent | Breaking |
|------|--------|-------|----------|
| 2026-02-03 | Initial API contract created | Frontend | No |

---

## ✅ Checklist for API Changes

When **Backend Agent** changes an endpoint:
- [ ] Update this document
- [ ] Update `openapi.yaml` if exists
- [ ] Add entry to Change Log
- [ ] Notify Frontend Agent via CHANGELOG.md

When **Frontend Agent** needs a new endpoint:
- [ ] Add proposed endpoint to this document with `[PROPOSED]` tag
- [ ] Backend Agent reviews and implements
- [ ] Remove `[PROPOSED]` tag when implemented
