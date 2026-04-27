# FLOWPILOT
 🚀 FlowPilot - Installation & Setup Guide

This guide will walk you through the steps to get FlowPilot up and running on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- A modern web browser (Chrome, Firefox, or Edge)

---

## ⚙️ Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/FlowPilot_Lite.git
cd FlowPilot_Lite
```

### 2. Setup the Backend
The backend handles test execution, reports, and file uploads.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   # Note: If you are on Windows and encounter execution policy errors, use:
   # npm.cmd install
   ```
3. **CRITICAL**: Install Playwright browsers (Required for automation):
   ```bash
   npx playwright install
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *The backend will run on `http://localhost:3000`.*

### 3. Setup the Frontend
The frontend provides the modern web interface for managing tests.

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # Or on Windows: npm.cmd install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # Or on Windows: npm.cmd run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 🧪 Verifying the Installation

1. Open your browser and go to `http://localhost:5173`.
2. You should see the **FlowPilot Dashboard**.
3. Click on **"New Recording"** to verify that the recorder launches correctly.
4. Try running the **"Login Test"** from the dashboard to ensure the automation engine is working.

---

## 🛠 Troubleshooting

- **Playwright Errors**: If you see a "browser not found" error, ensure you ran `npx playwright install` in the `backend` folder.
- **Port Conflicts**: Ensure ports `3000` and `5173` are not being used by other applications.
- **Permissions**: On Windows, run your terminal (PowerShell or CMD) as Administrator if you encounter permission issues during installation.

---

Developed by **Zain Shahid**.
