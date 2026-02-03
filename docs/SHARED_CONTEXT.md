# Shared Context - Gemini Command Deck

> 🌳 Minimum Viable Documentation - short, useful, updated
> **Last Updated**: 2026-02-03 20:28 IST

---

## 📊 Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend** | ✅ Ready | Chat + API Key modal + Settings |
| **Backend** | ✅ Ready | All APIs complete |

### Ready for Testing
```
Frontend: npm run dev → localhost:3000
Backend:  uvicorn main:app → localhost:8000
```

---

## 🔗 API Endpoints

| Endpoint | Method | Auth |
|----------|--------|------|
| `/api/chat/stream` | WebSocket | `?api_key=<key>` |
| `/api/memory/*` | REST | JWT |
| `/api/auth/*` | REST | - |
| `/api/accounts/*` | REST | JWT |
| `/api/sandbox/*` | REST | JWT |

---

## 🏗️ Key Decisions

1. **Chat**: WebSocket streaming (not REST)
2. **Memory**: Poll every 5s (simple, not time-critical)
3. **Auth**: BYOK first (user's own Gemini key), OAuth later

---

## 📝 Next Tasks

| Task | Owner | Priority |
|------|-------|----------|
| End-to-end testing | Both | 🔥 |
| Error handling | Frontend | Medium |
| Rate limit UI | Frontend | Low |

---

## 💬 Latest Messages

**Frontend → Backend** (2026-02-03 20:27):
```
✅ API Key Configuration COMPLETE
- Setup modal on first visit
- Settings in sidebar
- Key passed via ?api_key= to WebSocket
- Stored in localStorage

Ready for integration testing!
```

**Backend → Frontend** (2026-02-03 14:10):
```
✅ All APIs ready
Chat: ws://localhost:8000/api/chat/stream?api_key=<key>
```

---

## 📚 Docs

- [API Contract](./API_CONTRACT.md)
- [Product Spec](./PRODUCT_SPEC.md)
