# SafeHer Build & Deploy Quick Reference

**TL;DR** - Step-by-step commands to build APK and deploy backend.

---

## 🚀 Quick Deployment Flow (30 mins)

### Phase 1: Local Testing (5 mins)

```bash
# Terminal 1: Start Backend
cd D:\SafeHer\backend
npm start

# Terminal 2: Start Frontend
cd D:\SafeHer\frontend
$env:REACT_NATIVE_PACKAGER_HOSTNAME='192.168.0.106'
npx expo start --host lan -c

# Test: Signup → Login → Password reset → Works ✅
```

### Phase 2: Prepare for Deployment (5 mins)

```bash
# Create GitHub repo (if not done)
cd D:\SafeHer
git init
git add .
git commit -m "SafeHer: Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/safeher.git
git push -u origin main
```

### Phase 3: Deploy Backend on Render (10 mins)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **New +** → **Web Service**
3. Select your **safeher** repository
4. **Configuration**:
   - Name: `safeher-backend`
   - Environment: `Node`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: `Free`
5. **Click Advanced** → Add environment variables:
   ```
   DATABASE_URL = your-supabase-url
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASSWORD = app-specific-password
   JWT_SECRET = random-strong-string
   NODE_ENV = production
   ```
6. **Deploy** - Wait 2-5 minutes ✅

### Phase 4: Build APK (10 mins)

```bash
cd D:\SafeHer\frontend

# Update .env with Render URL
# EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api

# Build
npx expo prebuild --clean
npx expo run:android

# Wait 5-10 minutes... APK installs automatically ✅
```

---

## 📋 Prerequisites Checklist

Before starting, you need:

- [ ] Node.js 16+ installed
- [ ] Git installed and GitHub account
- [ ] Supabase account with database
- [ ] Gmail with 2FA enabled (for app password)
- [ ] Android SDK installed (for APK build)
- [ ] `.env` files created (backend and frontend)
- [ ] All local tests passing

---

## 🗄️ Database Setup (Run Once)

**In Supabase SQL Editor** - Run this once:

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS security_question TEXT,
ADD COLUMN IF NOT EXISTS security_answer TEXT;

ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS phone TEXT;
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
DATABASE_URL=postgresql://user:password@host:port/db
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
JWT_SECRET=use-random-strong-string
PORT=3000
NODE_ENV=development
```

### Frontend `.env`
```env
# Local development
EXPO_PUBLIC_API_URL=http://192.168.0.106:3000/api

# Production (after Render deployment)
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
```

---

## 🏗️ Build Commands

### Backend Build (Render)
```bash
# Render runs these automatically:
npm install
npm start
```

### Frontend Build (APK)
```bash
cd frontend

# Clear cache and prebuild
npx expo prebuild --clean

# Build APK
npx expo run:android

# Or build production APK (requires EAS)
eas build --platform android --distribution playstore
```

---

## 🧪 Testing Checklist

After deployment, verify:

- [ ] Backend URL accessible: `https://safeher-backend.onrender.com/api`
- [ ] Frontend can connect to backend (no "unable to reach server")
- [ ] Signup works → security question saves
- [ ] Login works → biometric check works
- [ ] Password reset: forgot password → answer question → reset password
- [ ] Contacts: add → edit → delete works
- [ ] SOS: send alert → email received
- [ ] History: alerts show with timestamps
- [ ] Offline: queue alerts when backend is down, sync when back up

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Render Dashboard | https://render.com |
| Supabase Dashboard | https://supabase.com |
| GitHub Repository | https://github.com/YOUR_USERNAME/safeher |
| Backend (after deploy) | https://safeher-backend.onrender.com |
| Frontend API | `EXPO_PUBLIC_API_URL` in `.env` |

---

## 📱 File Locations

```
SafeHer/
├── backend/
│   ├── .env ← Create this (not in repo)
│   ├── server.js ← Contains PORT config
│   └── package.json
├── frontend/
│   ├── .env ← Create this (not in repo)
│   └── package.json
└── database/
    ├── schema.sql
    └── migrations/
        ├── 2026-04-30-add-contact-phone.sql
        └── 2026-04-30-add-security-questions.sql
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Unable to reach server" | Check `frontend/.env` URL, verify backend is running |
| Android build fails | `npx expo prebuild --clean` then rebuild |
| Render deployment failed | Check logs: Dashboard → Service → Logs |
| Port already in use | Kill process: `lsof -ti:3000 \| xargs kill -9` (Mac/Linux) |
| Database connection error | Verify DATABASE_URL format, test connection |
| Email not sending | Verify EMAIL_USER/PASSWORD, check Gmail 2FA |

---

## 📞 Key Files to Review

1. **[README.md](../README.md)** - Full project documentation
2. **[DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Detailed step-by-step guide
3. **[RENDER_SETUP.md](./RENDER_SETUP.md)** - Render deployment deep dive
4. **[backend/.env.example](../backend/.env.example)** - Environment template
5. **[frontend/.env.example](../frontend/.env.example)** - Frontend env template

---

## ✅ Completion Checklist

- [ ] Backend deployed on Render
- [ ] Frontend `.env` updated with Render URL
- [ ] APK built successfully
- [ ] All tests passed
- [ ] Ready to share app!

---

**Time Estimate**:
- First deployment: 30-45 minutes (learning curve)
- Subsequent updates: 10-15 minutes

**Need help?** Check:
1. The detailed [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
2. Render logs for backend errors
3. Android Studio logs for APK build errors
4. Supabase console for database issues

---

**Happy Deploying!** 🎉
