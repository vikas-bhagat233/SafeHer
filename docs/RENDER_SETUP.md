# Render Backend Deployment - Complete Guide

## What is Render?

**Render** is a cloud platform for deploying applications. It's free to start and perfect for hosting Node.js backends.

- **Free Tier**: Suitable for development/testing
- **Starter Plan**: $7/month, recommended for production

---

## Step-by-Step: Deploy SafeHer Backend on Render

### Prerequisites

1. GitHub account (required)
2. Supabase account with database ready
3. Gmail account with App Password (for email)

---

### Phase 1: Prepare Your Code

#### 1.1 Create GitHub Repository

If your code isn't on GitHub yet:

```bash
# Navigate to your SafeHer folder
cd D:\SafeHer

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "SafeHer: Initial commit with security questions and offline support"

# Go to GitHub.com and create new repo named "safeher"
# Then connect:
git remote add origin https://github.com/YOUR_USERNAME/safeher.git
git branch -M main
git push -u origin main
```

#### 1.2 Verify Backend Configuration

Ensure `backend/package.json` has:

```json
{
  "name": "safeher-backend",
  "version": "1.0.0",
  "main": "server.js",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-rate-limit": "^8.4.1",
    "jsonwebtoken": "^9.0.0",
    "nodemailer": "^6.9.1",
    "pg": "^8.11.0"
  }
}
```

Ensure `backend/server.js` uses `process.env.PORT`:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### Phase 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **Sign up**
3. Choose **Sign up with GitHub** (easiest)
4. Click **Authorize** to allow Render to access your GitHub
5. Verify your email

---

### Phase 3: Deploy on Render

#### 3.1 Create Web Service

1. From Render dashboard, click **New +** (top right)
2. Select **Web Service**
3. A list of your GitHub repos appears
4. Click **Select** next to **safeher**
5. Authorize Render if prompted

#### 3.2 Configure Deployment Settings

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `safeher-backend` |
| **Environment** | `Node` |
| **Region** | `Frankfurt` (or your closest) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (we'll upgrade later) |

#### 3.3 Add Environment Variables

Click **Advanced** to expand options.

Look for **Environment** section and add these:

| Key | Value |
|-----|-------|
| DATABASE_URL | YOUR_SUPABASE_URL |
| EMAIL_USER | your-email@gmail.com |
| EMAIL_PASSWORD | Your Gmail App Password |
| JWT_SECRET | Random strong string |
| NODE_ENV | production |

**How to get DATABASE_URL:**
1. Go to Supabase dashboard
2. Select your project
3. Click **Settings** → **Database**
4. Click **Connection Pooling**
5. Copy the connection string (looks like `postgresql://postgres.xxxxx:password@...`)
6. Paste in Render's DATABASE_URL field

#### 3.4 Deploy

1. Scroll down and click **Create Web Service**
2. Render starts building (this takes 2-5 minutes)
3. You'll see deployment logs in real-time

**Wait until you see:**
```
=== Build successful ===
```

---

### Phase 4: Get Your Backend URL

After deployment completes:

1. You'll see a URL like: **`https://safeher-backend.onrender.com`**
2. Click the URL to test if backend is running
3. Should see: `{"message": "..."}` response

**Save this URL!** You'll use it in your frontend app.

---

### Phase 5: Update Frontend

Edit `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
```

Then rebuild the APK:

```bash
cd frontend
npx expo prebuild --clean
npx expo run:android
```

---

## Verifying Deployment

### Test 1: Direct URL Test

Open browser and visit:
```
https://safeher-backend.onrender.com/api/auth/login
```

Should get an error response (expected, since we're not sending login data), but **NOT** a "connection refused" error.

### Test 2: From App

1. Update frontend `.env` with Render URL
2. Rebuild and run app
3. Try to sign up
4. Should work without "Unable to reach server" error

### Test 3: Check Logs

From Render dashboard:
1. Click your service (`safeher-backend`)
2. Click **Logs** tab
3. You should see request logs when app makes API calls

---

## Monitoring & Maintenance

### View Logs
- Dashboard → Your service → **Logs** tab
- See all requests and errors in real-time

### Restart Service
- Dashboard → Your service → **Settings** → **Manual Deploy**
- Click to restart

### Monitor Resource Usage
- Dashboard → Your service → **Metrics** tab
- See CPU, memory, network usage

---

## Cost & Scaling

### Current (Free Plan)
- **Cost**: Free
- **Downtime**: Service stops after 15 min of inactivity
- **Performance**: Slower due to "cold starts"
- **Good for**: Development/testing

### Recommended (Starter Plan - $7/month)
- **Cost**: $7/month
- **Uptime**: 99.9% SLA
- **Performance**: Always running, no cold starts
- **Good for**: Production apps

### To Upgrade
1. Dashboard → Your service → **Settings**
2. Click **Change Plan** button
3. Select **Starter** ($7/month)
4. Click **Update**

---

## Troubleshooting

### Deployment Failed

**In Render Logs you see:**
```
TypeError: Cannot find module 'dotenv'
```

**Fix**: Ensure `backend/package.json` has all dependencies listed.

---

### App Says "Unable to Reach Server"

**Check 1:** Frontend `.env` URL is correct
```env
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api  # ✅ Correct
```

**Check 2:** Test URL in browser
```
https://safeher-backend.onrender.com/api
```

**Check 3:** Check Render logs for errors
- Dashboard → Service → Logs tab

---

### "Internal Server Error" on Every Request

**Check 1:** DATABASE_URL is correct in Render environment variables
- Dashboard → Service → Settings → Environment
- Verify DATABASE_URL matches Supabase connection string

**Check 2:** Email credentials are correct
- Verify EMAIL_USER and EMAIL_PASSWORD

---

### App Loads Slowly (Cold Start)

This is normal on Free plan:
- First request: 30-50 seconds (service spins up)
- Subsequent requests: Normal speed
- Solution: Upgrade to Starter plan ($7/month)

---

## Important Security Notes

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Keep `JWT_SECRET` secret** - Use strong random string
3. **Use Gmail App Password** - Not your actual password
4. **Limit database access** - Only from Render IP

---

## What Happens on Render

When you push code to GitHub:

1. Render automatically detects changes
2. Runs `npm install` (Build Command)
3. Starts server with `npm start` (Start Command)
4. Your app is live!

No manual deployment needed - it's automatic!

---

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend updated with Render URL
3. ✅ APK built with new URL
4. Test app with Render backend
5. Monitor logs for errors
6. Deploy to Play Store (optional)

---

## Support

- **Render Docs**: https://render.com/docs
- **Check service logs** first for errors
- **Test locally** before assuming deployment issue

---

**Congratulations! Your backend is now live on Render!** 🎉
