# 🚀 Quick Start - Email OTP Implementation

## What was added?

### New Files:
1. **server.ts** - Express backend for email sending
2. **src/server/email.ts** - Email helper functions
3. **EMAIL_SETUP.md** - Complete setup guide
4. **.env** - Environment variables configuration
5. **.env.example** - Template for sharing with team

### Updated Files:
1. **package.json** - Added `server` and `dev:all` scripts
2. **src/lib/email-otp.ts** - Now calls backend API instead of console logging

---

## Quick Setup (5 minutes)

### 1️⃣ Get Gmail App Password
```
🔗 https://myaccount.google.com/apppasswords
Select: Mail + Your Device → Generate
Copy the 16-character password
```

### 2️⃣ Update .env File
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-password
BACKEND_PORT=5000
VITE_API_URL=http://localhost:5000
```

### 3️⃣ Start Backend (Terminal 1)
```bash
npm run server
```
✅ You should see:
```
🚀 Backend server running on http://localhost:5000
📧 Email service configured with: your-email@gmail.com
```

### 4️⃣ Start Frontend (Terminal 2)
```bash
npm run dev
```

### 5️⃣ Test It!
1. Open http://localhost:8080
2. Sign in with any email
3. Check your inbox for OTP code
4. Enter OTP to complete sign-in

---

## How It Works

```
User enters email
       ↓
Frontend: SignIn.tsx → sendOTPEmail()
       ↓
API Call: POST /api/send-otp-email
       ↓
Backend: server.ts → transporter.sendMail()
       ↓
Gmail SMTP → User's Email
       ↓
User enters OTP → Success! ✅
```

---

## File Locations

| File | Purpose | Status |
|------|---------|--------|
| `server.ts` | Express backend server | ✅ Created |
| `src/lib/email-otp.ts` | Frontend email service | ✅ Updated |
| `.env` | Your credentials | ✅ Created (add values) |
| `.env.example` | Template for sharing | ✅ Created |
| `package.json` | Scripts added | ✅ Updated |

---

## Commands

```bash
# Run backend only
npm run server

# Run frontend only
npm run dev

# Run both together (recommended)
npm run dev:all

# Build for production
npm run build
```

---

## ✅ Checklist

- [ ] Get Gmail app password from myaccount.google.com/apppasswords
- [ ] Fill in EMAIL_USER and EMAIL_PASSWORD in .env
- [ ] Run `npm run server` (keep terminal open)
- [ ] Run `npm run dev` (in another terminal)
- [ ] Test sign-in with email
- [ ] Verify OTP received in email inbox
- [ ] Enter OTP and complete sign-in

---

## Troubleshooting

**Backend won't start?**
```bash
# Check if port 5000 is in use
# Change in .env: BACKEND_PORT=5001
# Update VITE_API_URL=http://localhost:5001
```

**Emails not sending?**
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check browser console (F12) for error messages
- Check backend terminal for logs
- Generate new app password from Gmail settings

**Still stuck?**
- See detailed guide: `EMAIL_SETUP.md`
- Check backend logs for error messages
- Verify all .env values are correct

---

## Next Steps

1. **Customize email template** in `server.ts` (lines ~80-120)
2. **Add email rate limiting** to prevent abuse
3. **Deploy backend** to Heroku, Railway, or AWS
4. **Update VITE_API_URL** for production
5. **Set up error monitoring** with Sentry

---

For complete setup instructions, see **EMAIL_SETUP.md**
