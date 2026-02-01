Here is a comprehensive **README.md** file for your project. You can copy and paste this directly into the root of your project folder.
---

# 🏠 GidaNa - Property Management System

**GidaNa** (Hausa for _"My House"_) is a modern, full-stack property management application designed specifically for the Nigerian real estate market. It bridges the gap between Landlords and Tenants, offering seamless rent collection via Paystack, maintenance tracking, and automated property management.

<img src="./hero.img" alt="GidaNa Dashboard" width="100%" />

## 🚀 Features

### 🔑 For Landlords

- **Property & Unit Management:** Create properties and units with ease.
- **Tenant Linking Codes:** Automatically generate unique 4-digit codes (e.g., `GIDA-4829`) for tenants to link to their units.
- **Financial Reports:** Real-time revenue tracking and occupancy rates.
- **Maintenance Tracking:** Receive and manage maintenance requests from tenants.
- **Lease Management:** Track lease start/end dates and status.

### 👤 For Tenants

- **Easy Onboarding:** Link to a unit instantly using a Property Code.
- **Rent Payments:** Secure, real-time rent payments using **Paystack** (Card, Bank Transfer, USSD).
- **Maintenance Requests:** Report issues (e.g., broken pipes) directly to the landlord with priority levels.
- **Payment History:** View a complete history of all rent payments.

---

## 📌 Project Status

GidaNa is currently under active development. Core property and tenant management features are functional, with ongoing improvements to reporting, notifications, and performance.
While tailored for the Nigerian real estate ecosystem, GidaNa is designed with flexibility to support broader property management use cases.

---

## 🎯 Project Vision

GidaNa aims to simplify property management across Nigeria by providing an affordable, transparent, and easy-to-use digital platform for both landlords and tenants.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript
- **Styling:** Tailwind CSS
- **Animations:** GSAP (GreenSock)
- **Icons:** Lucide React
- **Backend / Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth
- **Payments:** React-Paystack

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gidana-app.git
cd gidana-app

```

### 2. Install Dependencies

```bash
npm install
# Note: If you encounter dependency issues with React 19, use:
npm install --legacy-peer-deps

```

### 3. Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Enable **Authentication** (Email/Password provider).
4. Enable **Firestore Database** (Start in Test Mode).
5. Go to **Project Settings** -> **General** -> **SDK Setup** and copy your config.
6. Create a file named `src/firebase.ts` and paste your config:

```typescript
// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 4. Paystack Configuration

1. Sign up at [Paystack](https://paystack.com/).
2. Go to **Settings** -> **API Keys & Webhooks**.
3. Copy your **Test Public Key** (e.g., `pk_test_...`).
4. Open `src/components/TenantDashboard.tsx` and paste the key into the config object:

```typescript
const config = {
  // ...
  publicKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your key
};
```

### 5. Run the App

```bash
npm run dev

```

Open your browser to `http://localhost:5173` (or the port shown in your terminal).

## 📖 Usage Guide

### The Landlord Flow

1. **Sign Up:** Create an account and select "Landlord".
2. **Add Property:** Go to the Properties tab and add a new property.
3. **Get Code:** Note the generated code (e.g., `GIDA-1234`) displayed on the property card.
4. **Add Units:** Create units under that property and set the rent price.

### The Tenant Flow

1. **Sign Up:** Create an account and select "Tenant".
2. **Link Property:** You will be prompted to enter a **Property Code**. Enter the code provided by the Landlord.
3. **Select Unit:** Choose your specific unit from the list.
4. **Dashboard:** You can now see your rent due, pay via Paystack, or make maintenance requests.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Auth.tsx            # Login/Signup logic
│   ├── Dashboard.tsx       # Landlord Dashboard (Main)
│   ├── TenantDashboard.tsx # Tenant Dashboard & Payments
│   ├── PropertyLink.tsx    # Tenant Onboarding (Code Search)
│   ├── Navbar.tsx          # Landing Page Nav
│   ├── Hero.tsx            # Landing Page Hero
│   ├── Features.tsx        # Landing Page Features
│   └── ...
├── App.tsx                 # Main Routing Logic
├── firebase.ts             # Firebase Connection
└── main.tsx                # Entry Point

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
```
