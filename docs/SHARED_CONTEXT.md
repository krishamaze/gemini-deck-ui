# Shared Context - Gemini Command Deck

> 🌳 Minimum Viable Documentation - short, useful, updated
> **Last Updated**: 2026-02-03 21:52 IST

---

## 📊 Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend** | ✅ Ready | All bugs fixed, mobile tested |
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
4. **API Proxy**: Next.js rewrites for REST, dynamic URL for WebSocket

---

## 📝 Next Tasks

| Task | Owner | Priority |
|------|-------|----------|
| End-to-end testing | Both | 🔥 |
| Error handling | Frontend | Medium |
| Rate limit UI | Frontend | Low |

---

## 💬 Latest Messages

**Frontend → Backend** (2026-02-03 21:52) 🔥 BUG:
```
WebSocket error field is undefined

TESTED: Cloudflare tunnel → wss://...trycloudflare.com
- Connected ✅
- Sent "hi" ✅
- Received type=start ✅
- Received type=error, but error=undefined ❌

Backend should populate error field:
{ "type": "error", "error": "Rate limit" or "Invalid key" }

Check: Is Gemini API error being caught and serialized?
```

---

## 📚 Docs

- [API Contract](./API_CONTRACT.md)
- [Product Spec](./PRODUCT_SPEC.md)
