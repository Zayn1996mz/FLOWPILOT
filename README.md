# FlowPilot - SQA Automation Tool

FlowPilot is a powerful, full-stack web automation application that allows you to record browser interactions, parameterize them with Excel data, and run them as automated test cases with detailed reporting.

Developed by **Zain Shahid**.

## 🚀 Features
- **Intelligent Recorder**: Capture web interactions using Playwright codegen.
- **Data-Driven Testing**: Map Excel/CSV columns to form inputs for bulk execution.
- **Batch Processing**: Run multiple test scripts sequentially.
- **Looping**: Repeat test suites multiple times.
- **Execution Scheduling**: Schedule tests to run at specific dates and times automatically.
- **Visible Execution**: Watch tests run live with `slowMo` and headful browser support.
- **Comprehensive Reports**: View detailed logs and pass/fail status for every iteration.
- **Management**: Easily delete test cases directly from the dashboard.
- **Responsive Design**: Modern, glassmorphism UI that works on all devices.

## 🛠 Tech Stack
- **Frontend**: React, Vite, React Router, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Playwright, node-cron, XLSX, Multer.
- **Styling**: Vanilla CSS with modern dark-mode aesthetics.

## 📂 Project Structure
- `/backend`: Node.js server, test scripts, uploads, and execution reports.
- `/frontend`: React application (Vite).
- `/FlowPilot-ChromeExtension`: (Optional) Packaged Chrome Extension version.

## ⚙️ Installation & Setup

For a detailed step-by-step guide, please see **[SETUP.md](./SETUP.md)**.

### Quick Start:
1. **Backend**:
   ```bash
   cd backend
   npm install
   npx playwright install
   node server.js
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📄 License
Created for educational and professional SQA automation purposes. Developed by Zain Shahid.
