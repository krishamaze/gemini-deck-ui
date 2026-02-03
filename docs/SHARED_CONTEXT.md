# Shared Context - Gemini Command Deck

> 🌳 Minimum Viable Documentation - short, useful, updated
> **Last Updated**: 2026-02-03 21:26 IST

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

**Frontend → Backend** (2026-02-03 21:26):
```
✅ ALL 3 BUGS FIXED:

1. Input can't type → Fixed scanlines overlay
   - pointer-events: none !important
   - touch-action: none
   - position: fixed (pure visual)

2. localhost:8000 fetch → Added Next.js rewrites
   - All REST calls now use /api/* (relative)

3. WebSocket URL → Dynamic detection
   - Detects host automatically for tunnel/mobile
   - Falls back to env var NEXT_PUBLIC_WS_URL

Ready for mobile re-test!
```

---

## 📚 Docs

- [API Contract](./API_CONTRACT.md)
- [Product Spec](./PRODUCT_SPEC.md)
