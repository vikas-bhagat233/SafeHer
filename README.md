# SafeHer 🚨 - Women's Safety Emergency App

**AI-powered emergency response system for women's personal safety with real-time alerts, contact management, and offline functionality.**

---

## 📱 Features

- **🆘 SOS Emergency Alerts** - One-tap emergency trigger with location sharing
- **📞 Contact Management** - Add, edit, delete emergency contacts with phone support
- **📍 Live Location Tracking** - GPS-based location in emergency alerts
- **📧 Email Notifications** - Automated alert emails to emergency contacts
- **🔒 Security Questions** - Password recovery via security questions
- **🔐 Biometric Authentication** - Optional fingerprint/face recognition at login
- **📹 Evidence Capture** - Record video/audio evidence during emergencies
- **📊 Alert History** - Track all emergency alerts with timestamps and locations
- **🆘 Offline SOS Queue** - Queue alerts when offline, sync when back online
- **🗺️ Emergency Resources** - City-wise emergency helplines and maps
- **🌍 Language Support** - English and Hindi interface

---

## 🏗️ Tech Stack

### Frontend
- **React Native** 0.81.5 with Expo SDK 54.0.34
- **React Navigation** 6.1.6 for screen navigation
- **Expo Modules**: Local Auth (biometric), Image Picker, Location, Audio/Video
- **AsyncStorage** for offline queue persistence
- **Axios** for API calls

### Backend
- **Node.js** with Express 4.18.2
- **PostgreSQL** via Supabase
- **Authentication**: JWT (jsonwebtoken 9.0.0)
- **Security**: bcrypt 5.1.0, express-rate-limit 8.4.1
- **Email**: Nodemailer 6.9.1

### Database
- **PostgreSQL** on Supabase
- Real-time data syncing via polling intervals
- Automatic backups

---

## 🚀 Quick Start

### Prerequisites

Before you start, ensure you have:

1. **Node.js** 16+ and npm installed
2. **Expo CLI**: `npm install -g expo-cli`
3. **Supabase Account** (for PostgreSQL database) - [Sign up free](https://supabase.com)
4. **Nodemailer Account** (for email service)
   - Gmail: Use App Password (2FA required)
   - SendGrid/Mailgun: Use API key
5. **For Android Build**: 
   - Android Studio installed OR
   - Android SDK with API level 23+
   - Java Development Kit (JDK) 11+

---

## 📋 Environment Setup

### 1. Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

**Getting Supabase URL:**
1. Sign in at [supabase.com](https://supabase.com)
2. Create new project → Copy Connection String from Settings → Database → Connection Pooling
3. Format: `postgresql://user:password@host:5432/database`

**Gmail App Password (recommended):**
1. Enable 2FA on Gmail account
2. Go to myaccount.google.com → Security → App passwords
3. Select Mail + Windows Computer → Generate
4. Use the generated 16-char password as `EMAIL_PASSWORD`

### 2. Frontend Environment Variables

Create `frontend/.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.106:3000/api
```

**Important**: Update `192.168.0.106` to your backend server's actual IP address.

---

## 🛠️ Installation & Running Locally

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Verify .env file is created with DATABASE_URL and EMAIL credentials
# Then run migrations on your Supabase database (see Database Setup section)

# Start server
npm start
```

Server runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variable and start Expo
$env:REACT_NATIVE_PACKAGER_HOSTNAME='192.168.0.106'
npx expo start --host lan -c

# Scan QR code with Expo Go app on your phone
# OR press 'a' for Android emulator
```

---

## 🗄️ Database Setup

### Initial Schema

Run these SQL migrations on your Supabase database (SQL Editor in Supabase Console):

**Create Tables:**
```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  security_question TEXT,
  security_answer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_contacts_user ON contacts(user_id);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
```

**Or run migration files:**
```bash
# Run these SQL files in Supabase SQL Editor in order:
# 1. database/schema.sql
# 2. database/migrations/2026-04-30-add-contact-phone.sql
# 3. database/migrations/2026-04-30-add-security-questions.sql
```

---

## 📱 Building Android APK

### Prerequisites for Android Build

1. **Install Android SDK** (via Android Studio):
   - Download Android Studio
   - Install API level 23 (Android 6.0) or higher
   - Install Build Tools

2. **Set Environment Variables** (Windows):
   ```powershell
   $env:ANDROID_HOME = "$env:USERPROFILE\AppData\Local\Android\Sdk"
   $env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools\bin"
   ```
   
   **Make permanent** (Optional):
   - Windows: System Properties → Environment Variables → New
   - Variable name: `ANDROID_HOME`
   - Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

3. **Verify Setup**:
   ```bash
   # Check if Android tools are accessible
   adb --version
   sdkmanager --version
   ```

### Build Steps

Navigate to `frontend/` folder and run:

#### Step 1: Prebuild
```bash
npx expo prebuild --clean
```
This generates the native Android/iOS project structure. Use `--clean` flag to remove old builds.

#### Step 2: Build APK
```bash
npx expo run:android
```
This:
- Compiles the app for Android
- Runs on connected emulator/device
- Creates a debug APK

#### Step 3: Build Production APK (Optional)
For production release (publish to Play Store):
```bash
# Create Keystore (first time only)
keytool -genkey -v -keystore ~/.android/safeher-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias safeher

# Then build production APK
eas build --platform android --distribution playstore
# (Requires Expo Account and EAS service)
```

---

## ☁️ Backend Deployment on Render

### Step-by-Step Render Deployment

#### 1. **Create Render Account**
- Go to [render.com](https://render.com)
- Sign up with GitHub/email
- Verify email

#### 2. **Prepare Backend for Deployment**

Update `backend/package.json`:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

Update `backend/server.js` to use `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### 3. **Create GitHub Repository** (if not already)

```bash
cd /d/SafeHer
git init
git add .
git commit -m "Initial commit: SafeHer app with security questions"
git remote add origin https://github.com/YOUR_USERNAME/safeher.git
git push -u origin main
```

#### 4. **Deploy Backend on Render**

**In Render Dashboard:**
1. Click **New +** → **Web Service**
2. **Connect GitHub**: Select your `safeher` repository
3. **Configure Service**:
   - **Name**: `safeher-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter)
4. **Add Environment Variables** (click **Advanced**):
   ```
   DATABASE_URL = your-supabase-url (from .env)
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASSWORD = your-app-password
   JWT_SECRET = your-strong-random-string
   NODE_ENV = production
   ```
5. Click **Deploy**

**Get Backend URL:**
- After deployment, Render gives you a URL like: `https://safeher-backend.onrender.com`
- This is your new backend URL!

#### 5. **Update Frontend to Use Render Backend**

Update `frontend/.env`:
```env
EXPO_PUBLIC_API_URL=https://safeher-backend.onrender.com/api
```

Rebuild frontend with this new URL.

#### 6. **Database Connection on Render**

- Your Supabase PostgreSQL connection remains unchanged
- Just copy the same `DATABASE_URL` to Render environment variables
- **Important**: Make sure your Supabase IP whitelist allows Render's IP range

**In Supabase:**
1. Go to Project Settings → Database → Connection Pooling
2. Copy Connection String (looks like: `postgresql://postgres.xxxxx:password@aws-0-xxxxx.pooler.supabase.com:5432/postgres`)
3. Paste as `DATABASE_URL` in Render

---

## 🔄 Full Deployment Workflow

### Timeline
1. **Local Testing**: ~30 minutes
   - Backend running locally
   - Frontend connected to local backend
   - Test all features

2. **Render Deployment**: ~10 minutes
   - Push code to GitHub
   - Create service on Render
   - Add environment variables
   - Deployment automatic

3. **APK Build**: ~15-20 minutes
   - Run prebuild
   - Run android build
   - Transfer APK to phone

### Checklist Before Going Live

- [ ] Database migrations run on Supabase
- [ ] `.env` files created with all credentials
- [ ] Backend tested locally with fresh signup/login/password recovery
- [ ] Frontend `.env` has correct `EXPO_PUBLIC_API_URL`
- [ ] GitHub repository created and code pushed
- [ ] Render backend deployed and URL noted
- [ ] Frontend `.env` updated with Render URL
- [ ] APK built and tested on Android phone

---

## 🐛 Troubleshooting

### Backend Issues

**"Unable to reach server" in app**
- Check `frontend/.env` has correct `EXPO_PUBLIC_API_URL`
- Verify backend server is running: `npm start` in backend folder
- Check firewall isn't blocking port 3000
- Verify database connection string in `.env`

**Database connection error**
- Confirm `DATABASE_URL` is correct format
- Test connection: `psql $DATABASE_URL -c "SELECT 1"`
- Ensure Supabase IP whitelist is configured

**Email not sending**
- Verify Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Ensure 2FA is enabled on Gmail

### Frontend Issues

**Metro bundler cache issues**
```bash
cd frontend
npx expo start --host lan -c  # -c clears cache
```

**Module not found errors**
```bash
cd frontend
npm install
npx expo prebuild --clean
```

**Android build fails**
```bash
# Clean and rebuild
npx expo prebuild --clean
npx expo run:android --clear
```

### Render Issues

**Cold start delays** (Free plan): 
- First request takes 30-50 seconds (service spins up)
- Subsequent requests faster
- Consider upgrading to Starter plan for always-on

**Logs not showing**
- Click service → Logs tab
- Check for error messages
- Restart service if needed

---

## 📚 Project Structure

```
SafeHer/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── alertController.js
│   │   └── contactController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── alertRoutes.js
│   │   └── contactRoutes.js
│   ├── config/
│   │   ├── db.js
│   │   └── mail.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js
│   ├── .env (create this)
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── navigation/
│   │   └── utils/
│   ├── .env (create this)
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── migrations/
│       ├── 2026-04-30-add-contact-phone.sql
│       └── 2026-04-30-add-security-questions.sql
│
├── .gitignore
└── README.md
```

---

## 🤝 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user with security question
- `POST /auth/login` - Login with email/password (includes biometric prompt)
- `POST /auth/verify-security` - Verify security question answer
- `POST /auth/reset-password` - Reset password using token
- `POST /auth/update-security` - Update security question

### Contacts
- `POST /contact/add` - Add emergency contact
- `GET /contact/:user_id` - Get user's contacts
- `PUT /contact/:id` - Update contact (with phone support)
- `DELETE /contact/:id` - Delete contact

### Alerts
- `POST /alert/send` - Send SOS alert to contacts
- `GET /alert/history/:user_id` - Get user's alert history

---

## 📞 Support & Contact

For issues or feature requests:
- Create GitHub issue
- Contact: support@safeher.com

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Vikas Bhagat**

---

**Last Updated**: April 30, 2026
**Version**: 1.0.0