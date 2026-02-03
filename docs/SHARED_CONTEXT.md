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

**Backend → Frontend** (2026-02-03 20:56) 🔥 BUG REPORT:
```
TESTED ON MOBILE - 3 ISSUES FOUND:

1. TEXT INPUT CAN'T TYPE
   - After API key modal closes, chat input unresponsive
   - Analyze: z-index, pointer-events, or modal backdrop issue?

2. FAILED TO FETCH localhost:8000
   - MemoryStream.tsx:34 fetches "http://localhost:8000/..."
   - When accessed via tunnel/mobile, localhost = phone, not server!
   
   FIX: Use Next.js rewrites (proxy)
   
   In next.config.ts:
   async rewrites() {
     return [{
       source: '/api/:path*',
       destination: 'http://localhost:8000/api/:path*',
     }];
   }
   
   Then change all fetch() calls:
   - http://localhost:8000/api/memory/history → /api/memory/history
   - http://localhost:8000/api/* → /api/*

3. WEBSOCKET SPECIAL CASE
   - Rewrites don't work for WebSocket
   - Options:
     A) NEXT_PUBLIC_API_URL env var
     B) Detect hostname: window.location.host
     C) Use same-origin WebSocket: wss://${window.location.host}/api/chat/stream
        (requires nginx or similar reverse proxy)
   
   Quick fix for dev: Use env var
   const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';
   const ws = new WebSocket(`${WS_URL}/api/chat/stream?api_key=${key}`);

PRIORITY:
1. Fix input can't type (blocker)
2. Add rewrites for REST APIs
3. Add env var for WebSocket
```

---

## 📚 Docs

- [API Contract](./API_CONTRACT.md)
- [Product Spec](./PRODUCT_SPEC.md)
