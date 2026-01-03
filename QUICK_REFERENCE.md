# 🚀 Email OTP - Quick Reference Card

## Setup (One-Time, 5 Minutes)

### 1. Get Gmail App Password
```
https://myaccount.google.com/apppasswords
→ Select: Mail + Your Device
→ Generate → Copy 16-character password
```

### 2. Edit .env
```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-password
```

---

## Running (Every Time)

### Terminal 1: Backend
```bash
npm run server
```
✅ Should see: `🚀 Backend server running on http://localhost:5000`

### Terminal 2: Frontend
```bash
npm run dev
```
✅ Should see: `➜ Local: http://localhost:8080/`

**OR run both together:**
```bash
npm run dev:all
```

---

## Testing Flow

1. Open **http://localhost:8080**
2. Click **"Sign In"**
3. Enter email (any email address)
4. **Check your email inbox** for OTP code
5. Enter OTP → Success! ✅

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| "Backend server not running" | Run `npm run server` |
| "Failed to authenticate" | Check EMAIL_USER/PASSWORD in .env |
| "Email not received" | Check spam folder, verify .env settings |
| "Port 5000 in use" | Change BACKEND_PORT in .env to 5001 |

---

## Files Created

- ✅ `server.ts` - Backend server
- ✅ `.env` - Your email credentials
- ✅ `EMAIL_SETUP.md` - Full guide
- ✅ `QUICK_START_EMAIL.md` - Quick start
- ✅ `IMPLEMENTATION_COMPLETE.md` - Complete docs

---

## Need Help?

📖 **Full Guide:** `EMAIL_SETUP.md`  
📋 **Implementation Summary:** `IMPLEMENTATION_COMPLETE.md`  
⚡ **Quick Start:** `QUICK_START_EMAIL.md`

---

**That's it! 3 simple steps: Get app password → Update .env → Run servers** 🎉
