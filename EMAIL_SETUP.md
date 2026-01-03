# 📧 Email OTP Setup Guide

## Overview
This guide will help you set up actual email sending for OTP codes in Dayflow HR Suite.

## Architecture
```
Frontend (React/Vite) 
    ↓ HTTP POST /api/send-otp-email
Backend (Express + Nodemailer) 
    ↓ SMTP
Gmail/Email Service
    ↓ Email
User's Inbox
```

## Step 1: Get Gmail App Password

### Why App Password?
You cannot use your regular Gmail password with Nodemailer due to Google's security restrictions.

### How to Generate:
1. Go to **https://myaccount.google.com/apppasswords**
2. You'll see a prompt to "Select the app and device you're using"
3. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device)
4. Click **Generate**
5. Google will show you a **16-character password** (spaces included, but remove them)
6. Copy this password immediately

### Example:
- Regular Gmail: `yourname@gmail.com`
- App Password: `abcd efgh ijkl mnop` → Remove spaces → `abcdefghijklmnop`

## Step 2: Update .env File

Open `.env` in the project root and fill in:

```env
# Your Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop

# Keep these settings
EMAIL_FROM=Dayflow HR Suite <noreply@dayflow-hr.com>
BACKEND_PORT=5000
VITE_API_URL=http://localhost:5000
```

**⚠️ Security Note:**
- **NEVER** commit `.env` to GitHub
- `.env` is already in `.gitignore`
- Only share `.env.example` with collaborators

## Step 3: Run the Backend Server

Open a terminal and run:

```bash
npm run server
```

Expected output:
```
🚀 Backend server running on http://localhost:5000
📧 Email service configured with: your-email@gmail.com
🔗 CORS enabled for: http://localhost:5173, http://localhost:3000, http://localhost:8080
```

**Keep this terminal open!**

## Step 4: Run the Frontend (in another terminal)

```bash
npm run dev
```

## Step 5: Test Email OTP

1. Open http://localhost:8080
2. Click "Sign In"
3. Enter any email address (it will receive the OTP if backend is configured)
4. You should see a message: "OTP email sent successfully! Check your email."
5. Check your email inbox for the OTP code
6. Enter the OTP code in the app to complete sign-in

## Alternative: Run Both Simultaneously

To run frontend + backend together:

```bash
npm run dev:all
```

This uses `npm-run-all` to run both servers in parallel.

---

## Troubleshooting

### Error: "Backend server not running. Please start: npm run server"
- **Solution:** Open a new terminal and run `npm run server`
- Make sure you're in the project root directory
- The backend must run on port 5000

### Error: "Failed to authenticate user"
- **Problem:** Gmail app password is incorrect
- **Solution:** 
  1. Go to https://myaccount.google.com/apppasswords again
  2. Generate a **NEW** app password
  3. Replace the old one in `.env`
  4. Restart the backend server

### Error: "Invalid email address"
- **Problem:** Backend email service validation failed
- **Solution:** Use a valid email format (example@domain.com)

### Emails not arriving
- **Check:**
  1. Is the backend server running? (check terminal)
  2. Is the email configuration correct in `.env`?
  3. Check spam/junk folder in your email
  4. Check browser console (F12) for errors
  5. Check backend terminal logs for error messages

### Port 5000 already in use
- **Solution 1:** Close other applications using port 5000
- **Solution 2:** Change port in `.env`:
  ```env
  BACKEND_PORT=5001
  VITE_API_URL=http://localhost:5001
  ```

---

## File Structure

```
project-root/
├── server.ts                    # Express backend
├── .env                         # Your email credentials (NOT in Git)
├── .env.example                 # Template (in Git)
├── package.json                 # Updated with 'server' script
├── src/
│   ├── lib/
│   │   ├── email-otp.ts        # Frontend email service
│   │   ├── otp.ts              # OTP generation logic
│   │   └── firebase.ts          # Firebase config
│   ├── components/auth/
│   │   └── OTPVerification.tsx  # OTP UI
│   └── pages/
│       └── SignIn.tsx           # Sign-in page
```

---

## Production Deployment

When deploying to production:

1. **Environment Variables:**
   - Set `EMAIL_USER`, `EMAIL_PASSWORD` in your hosting platform (Vercel, Heroku, etc.)
   - Set `VITE_API_URL` to your backend domain

2. **Backend Server:**
   - Deploy backend to a service like Heroku, Railway, or AWS
   - Update `VITE_API_URL` to point to your production backend

3. **SMTP Provider:**
   - Consider using SendGrid, AWS SES, or another service for better reliability
   - Update `server.ts` to use their SMTP credentials

4. **Security:**
   - Use environment variables for all sensitive data
   - Never hardcode credentials
   - Enable HTTPS only
   - Configure CORS properly for your domain

---

## Next Steps

- [x] Set up Gmail app password
- [x] Configure .env file
- [x] Run backend server
- [x] Run frontend
- [x] Test OTP email sending
- [ ] Deploy to production
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Add email rate limiting
- [ ] Implement email templates

---

## Support

If you encounter issues:
1. Check browser console (F12) → Console tab
2. Check backend terminal logs
3. Verify `.env` file settings
4. Restart both services

For more help, refer to:
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
