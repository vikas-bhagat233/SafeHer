# SafeHer 🛡️

**SafeHer** is a comprehensive personal safety application designed to provide immediate assistance and reliable communication during emergencies. Built with a React Native (Expo) frontend and a Node.js/PostgreSQL backend, it prioritizes speed, reliability, and offline-resilience to ensure users can reach their trusted contacts when it matters most.

---

## ✨ Key Features

*   **⚡ 1-Tap SOS Alert:** Instantly captures your live GPS coordinates and securely logs the emergency event to the backend database.
*   **📱 Native SMS Notification:** Automatically opens your phone's SMS composer with a pre-filled message containing your live Google Maps link, addressed to all your pre-configured trusted contacts. Works reliably even on slow cellular networks.
*   **📳 Hardware "Shake" Detection:** In situations where unlocking the phone takes too long, vigorously shaking the device triggers the SOS alert automatically using the built-in accelerometer.
*   **🏥 Nearest Safe Zones:** Quick-action buttons that instantly open your native map app (Apple Maps/Google Maps) to route you to the nearest **Police Station** or **Hospital**.
*   **📶 Offline Resilience:** If the internet is disconnected, the app queues your SOS alerts locally and intelligently syncs them to the backend the moment your connection is restored.
*   **🔒 Secure Sessions:** Fully authenticated user accounts and encrypted database storage.

---

## 🛠️ Technology Stack

**Frontend (Mobile App)**
*   React Native
*   Expo (React Navigation, Expo Location, Expo Sensors)
*   Axios (for API communication)

**Backend (Server)**
*   Node.js & Express.js
*   PostgreSQL (Database)
*   JSON Web Tokens (JWT) for Authentication

---

## 🚀 Getting Started

Follow these instructions to run the SafeHer project locally on your machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [PostgreSQL](https://www.postgresql.org/) database running locally or in the cloud.
*   [Expo CLI](https://docs.expo.dev/get-started/installation/) and the **Expo Go** app on your physical mobile device.

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder based on `.env.example`:
   ```env
   PORT=3000
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=safeher_db
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder to point to your backend:
   ```env
   # Replace with your computer's local IPv4 address (e.g., 192.168.1.x)
   EXPO_PUBLIC_API_URL=http://<YOUR_IP_ADDRESS>:3000/api
   ```
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android) to launch the app on your physical device. *(Note: Hardware shake and SMS features work best on physical devices, not emulators).*

---

## 📱 Using the App

1. **Register/Login:** Create a new account.
2. **Add Contacts:** Go to the Contacts page and add the phone numbers of your trusted friends/family.
3. **Test SOS:** Press the large SOS button on the home screen. It will gather your location, log it, and prompt you to send an SMS.
4. **Test Shake:** Shake your phone vigorously for 1-2 seconds.
5. **Safe Zones:** Tap the Police or Hospital buttons to test native map routing.

---

## 📄 License
This project is licensed under the MIT License.