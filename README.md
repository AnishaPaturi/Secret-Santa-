# 🎄 Secret Santa – Real-Time Group Gift Exchange App

A fun, real-time **Secret Santa web application** built with **Next.js, Firebase, and Framer Motion**. Users can create a group, invite friends via QR code or link, and once the host starts the game, each participant privately receives the name of the person they need to gift — **no refresh required, fully real-time.**

🔗 **Live Demo:**  
https://secret-santa-theta-nine.vercel.app/

📁 **GitHub Repository:**  
https://github.com/AnishaPaturi/Secret-Santa-

---

## ✨ Features

- ✅ Create a Secret Santa group with a unique group code  
- ✅ Share group via QR Code or Invite Link  
- ✅ Real-time joining using Firebase Firestore  
- ✅ Admin-controlled Start Game  
- ✅ Private gift assignment (only you see your assigned person)  
- ✅ No page refresh required (real-time updates)  
- ✅ Confetti animations & festive UI  
- ✅ Snowfall animation & animated Santa  
- ✅ Sound effects on game start  
- ✅ Mobile & desktop responsive  
- ✅ Persistent join using localStorage  

---

## 🧑‍💻 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | Frontend Framework |
| React | UI Components |
| Tailwind CSS | Styling |
| Firebase Firestore | Real-time Database |
| Framer Motion | Animations |
| Canvas Confetti | Celebration Effects |
| QRCode.react | QR Code generation |
| Vercel | Deployment |

---

## 🚀 How It Works

### 1️⃣ Create Group (Host)
- Enter your name  
- Generate a unique group code  
- Auto-added as Admin  
- Share invite link or QR code  

### 2️⃣ Join Group (Players)
- Open shared link or scan QR  
- Enter your name  
- All joined users appear in real-time  

### 3️⃣ Start Game (Admin Only)
- Only host can start the game  
- Participants are shuffled  
- Each player gets a unique Secret Santa  

### 4️⃣ Private Reveal
- Each user sees only their own assigned person  
- Other assignments remain hidden  

---

## 🗂️ Project Structure

app/
├── create/ → Create Group Page
├── group/[code]/ → Group Room (Join & Play)
├── page.tsx → Home Page
└── layout.tsx → App Layout

lib/
└── firebase.ts → Firebase Configuration

public/
├── santa.gif
└── sounds/
└── celebrate.mp3


---

## 🔥 Firebase Data Structure

groups/{groupCode} {
admin: "HostName",
members: ["Tom", "Robin", "Mike"],
pairs: [
{
giver: "Tom",
receiver: "Mike"
}
],
started: true,
createdAt: Timestamp
}


---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
  git clone https://github.com/AnishaPaturi/Secret-Santa-.git
  cd Secret-Santa-


2️⃣ Install Dependencies : npm install

3️⃣ Add Firebase Configuration
  Create this file: lib/firebase.ts
    Add your Firebase config:
      import { initializeApp } from 'firebase/app'
      import { getFirestore } from 'firebase/firestore'
      
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
      }
      
      const app = initializeApp(firebaseConfig)
      export const db = getFirestore(app)


4️⃣ Run Locally
  npm run dev
  Open in browser:
  http://localhost:3000

🔐 Privacy & Security
  No login/authentication required
  Each user can only see their own Secret Santa
  Host can only start the game
  All data is synced safely using Firestore
  No personal data is stored permanently

🌟 Future Enhancements
  Email invitations
  Personal wish lists
  Budget limit settings
  Dark mode
  Group reset without recreation
  Admin transfer feature

🧑‍🎓 Author: 
  Anisha Paturi
  Engineering Student | Full-Stack Developer
  GitHub: https://github.com/AnishaPaturi

🏁 License
  This project is open-source and free to use for learning and personal use.
  
  ---
  
  ✅ You can now **open your GitHub repository → click on README.md → paste this → Commit.**
  
  If you want, I can also:
  - Add **screenshots section**
  - Add **GitHub badges**
  - Add a **demo GIF preview**
  - Make a **portfolio-style README**
  
Just say the word 😄
