# SafeHer Deployment Guide 🚀

Complete step-by-step guide for building APK and deploying backend.

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Android APK Build](#android-apk-build)
3. [Render Backend Deployment](#render-backend-deployment)
4. [Post-Deployment Testing](#post-deployment-testing)

---

## Pre-Deployment Checklist

Before you start, verify everything:

### ✅ Local Testing

- [ ] Backend `.env` file created with:
  - `DATABASE_URL` from Supabase
  - `EMAIL_USER` and `EMAIL_PASSWORD`
  - `JWT_SECRET` set to random string
  - `PORT=3000`
  - `NODE_ENV=development`

- [ ] Frontend `.env` file created with:
  - `EXPO_PUBLIC_API_URL=http://192.168.0.106:3000/api`

- [ ] Database migrations run on Supabase:
  ```sql
  -- Run in Supabase SQL Editor:
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS security_question TEXT,
  ADD COLUMN IF NOT EXISTS security_answer TEXT;
  
  ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS phone TEXT;
  ```

- [ ] Backend starts successfully:
  ```bash
  cd backend
  npm install
  npm start
  # Should see: Server running on port 3000
  ```

- [ ] Frontend connects to backend:
  ```bash
  cd frontend
  npm install
  $env:REACT_NATIVE_PACKAGER_HOSTNAME='192.168.0.106'
  npx expo start --host lan -c
  # Scan QR code and test login/signup
  ```

- [ ] Test full workflow locally:
  1. Signup with new account → Fill security question
  2. Login → Complete biometric check
  3. View contacts → Add new contact with phone
  4. Go Home → Check "Send SOS" button works
  5. Test "Forgot password" → Answer security question → Reset password

---

## Android APK Build

### Step 1: Install Android Build Tools

**Option A: Android Studio (Recommended)**

1. Download [Android Studio](https://developer.android.com/studio)
2. Install it
3. Open Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK
4. Select **SDK Platforms**:
   - ✅ Android 6.0 (API level 23) or higher
5. Select **SDK Tools**:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
6. Click Apply and wait for installation

**Option B: Command Line Only**

```bash
# Set environment variables (Windows PowerShell)
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools\bin"

# Download SDK
sdkmanager --list_modules
sdkmanager "platform-tools" "build-tools;33.0.0" "platforms;android-33"
```

### Step 2: Verify Installation

Open PowerShell and run:

```bash
adb --version
# Should output: Android Debug Bridge version 1.x.x

sdkmanager --version
# Should output: sdkmanager version X.X.X
```

### Step 3: Check Frontend Configuration

Before building, ensure `frontend/.env` is correct:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.106:3000/api
```

**For production APK on Render backend**, use:
```env
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
```

### Step 4: Build APK

Navigate to frontend folder:

```bash
cd frontend

# Step 4.1: Clear previous builds (recommended)
npx expo prebuild --clean

# Step 4.2: Generate native Android project
npx expo prebuild

# Step 4.3: Build and install on device/emulator
npx expo run:android

# Wait 5-10 minutes for compilation...
```

**Output**:
- App installs automatically on connected device/emulator
- Check: Open SafeHer app and verify login works

### Step 5: Extract APK File (Optional)

If you want to distribute the APK file:

```bash
# After build completes, find APK at:
# frontend/android/app/build/outputs/apk/debug/app-debug.apk

# Copy it to shared location:
Copy-Item "frontend/android/app/build/outputs/apk/debug/app-debug.apk" -Destination "$env:USERPROFILE\Downloads\SafeHer.apk"
```

Transfer `SafeHer.apk` to Android phone and install.

---

## Render Backend Deployment

### Step 1: GitHub Repository Setup

If not already on GitHub:

```bash
cd D:\SafeHer

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "SafeHer: Women's safety app with security questions and offline support"

# Connect to GitHub (create repo first at github.com/NEW)
git remote add origin https://github.com/YOUR_USERNAME/safeher.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign up**
3. Choose: **Sign up with GitHub** (easiest)
4. Authorize GitHub access
5. Verify email

### Step 3: Deploy Backend on Render

**In Render Dashboard:**

1. Click **New +** button (top right)
2. Select **Web Service**
3. Choose repository: Select **safeher**
4. **Configure service**:
   - **Name**: `safeher-backend`
   - **Environment**: `Node`
   - **Region**: `Frankfurt` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (you can upgrade later)

5. Click **Advanced** and add Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://user:password@host:port/database` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Your Gmail App Password |
| `JWT_SECRET` | Any random strong string (e.g., `abc123xyz789...`) |
| `NODE_ENV` | `production` |

6. Click **Create Web Service**

**Deployment will start automatically** (~5 minutes)

### Step 4: Get Backend URL

After deployment completes:
- You'll see a URL like: `https://safeher-backend.onrender.com`
- Click it to verify backend is running
- Should see: `{"message": "SafeHer API"}` or similar

### Step 5: Update Frontend to Use Render

Edit `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
```

Then rebuild APK:

```bash
cd frontend
npx expo prebuild --clean
npx expo run:android
```

---

## Post-Deployment Testing

### Test 1: Backend Connectivity

```bash
# In PowerShell
curl "https://safeher-backend.onrender.com/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test"}'
```

Should get a response (not "connection refused").

### Test 2: Local Backend + Remote Frontend

1. Stop backend if running
2. Update `frontend/.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.0.106:3000/api
   ```
3. Start backend: `npm start` (in backend folder)
4. Rebuild frontend: `npx expo prebuild --clean && npx expo run:android`
5. Test signup → login → password reset

### Test 3: Full Production Setup

1. Update `frontend/.env`:
   ```env
   EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
   ```
2. Rebuild APK
3. Test all features:
   - ✅ Signup with security question
   - ✅ Login
   - ✅ Add emergency contacts
   - ✅ Send SOS alert
   - ✅ Check alert history
   - ✅ Test "Forgot password"

---

## Troubleshooting

### Android Build Issues

**Error: "Android SDK not found"**
```bash
# Solution: Set ANDROID_HOME environment variable
$env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
```

**Error: "Gradle build failed"**
```bash
# Solution: Clean and rebuild
cd frontend
npx expo prebuild --clean
npx expo run:android --clear
```

**Error: "Port 5555 in use" (ADB)**
```bash
# Solution: Kill and restart ADB
adb kill-server
adb start-server
```

### Render Deployment Issues

**Logs showing errors:**
- Click service → **Logs** tab
- Look for error messages
- Common causes:
  - Wrong `DATABASE_URL` format
  - Missing environment variables
  - Port binding issue

**Solution**: Restart service from **Settings** → **Manual Deploy** button

**Cold start (Free plan):**
- First request takes 30-50 seconds
- This is normal on free tier
- Upgrade to **Starter** ($7/month) for always-on

### App Connection Issues

**"Unable to reach server"**
1. Verify `frontend/.env` has correct URL
2. Check backend is running/deployed
3. Check phone has internet connection
4. Try: Settings → App info → Clear cache

---

## Production Checklist

Before sharing app with others:

- [ ] Backend URL is correct in `frontend/.env`
- [ ] Database backups enabled on Supabase
- [ ] Email credentials are active and tested
- [ ] Rate limiting is active on backend
- [ ] All features tested end-to-end
- [ ] APK signed (if distributing via Play Store)
- [ ] Privacy policy created
- [ ] Terms of service created

---

## Next Steps After Deployment

1. **Monitor Backend**: Check Render logs daily for errors
2. **Collect User Feedback**: Beta test with real users
3. **Update Features**: Based on feedback, add new features
4. **Scale Infrastructure**: Upgrade Render plan if needed
5. **Security Updates**: Keep dependencies updated

---

## Support

If you get stuck:
1. Check the [main README.md](README.md) troubleshooting section
2. Review Render deployment logs: Service → Logs
3. Check Android Studio logs for build errors
4. Test locally first before deploying to Render

---

**Happy Deployment! 🎉**
