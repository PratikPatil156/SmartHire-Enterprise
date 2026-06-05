# SmartHire - AI Resume Analyzer & Job Recommendation System


> **Production-Ready:** This software has been fully optimized, responsive-tested, compiled, and is verified production-ready.

SmartHire is a premium, enterprise-grade AI-driven recruitment and career acceleration platform. Built on top of **FastAPI (Python)**, **React (Vite)**, and **MySQL**, it provides recruiters and job candidates with automated tools to evaluate resumes, calculate ATS compatibility match scores, track application pipelines, and schedule interviews.

---

## 🚀 Key Features

### 🏢 Recruiter (HR) Portal
*   **Job Openings Manager:** Create, update, publish, and delete active job descriptions.
*   **Resume Parser & Uploader:** Drag-and-drop multiple resume PDFs to automatically extract skills, contact details, education, and calculate ATS compatibility scores.
*   **Applicant Tracking Pipeline:** Visual dashboard tracking candidate statuses (Applied, Under Review, Shortlisted, Hired, Rejected) with custom cards for mobile viewports.
*   **Interactive Scheduler:** Schedule interviews with automated calendar times, passcode generation, and direct joining meet links.
*   **Activity Logs & Metrics:** Recruiter audit logs and real-time dashboard analytics tracking recruitment pipelines.
*   **Skill Tag System:** Configure, group, and map key skills required for matching algorithms.

### 🎓 Candidate Portal
*   **Career Dashboard:** Upload resume PDF to run automated ATS parser and sync profile tags.
*   **AI Resume Score Card:** Comprehensive ATS score card showing overall index (/100), missing keywords, and recommended quick fixes.
*   **Match-fit Job Recommendations:** Dynamic cards matching active job openings with candidate profiles sorted by compatibility scores (e.g. `95% Match`).
*   **Bookmark Opportunities:** Bookmark matching jobs to save them in a personal wishlist.
*   **My Applications Tracker:** Status tracker showing application history, match percentages, and interview meeting passcodes with join links.
*   **Responsive Profile Editor:** Responsive candidate biography banner with profile photo upload, course details, location tag, certifications, and GitHub/LinkedIn link configurations.

---

## 🛠️ Technology Stack

*   **Frontend:** React (Vite), Vanilla CSS (Harmony Palette), Tailwind CSS utilities, Lucide React Icons, Heroicons (v24 outline/solid).
*   **Backend:** FastAPI (Python), PyPDF, PyJWT (Token Auth), SMTP mail notifications, Uvicorn development server.
*   **Database:** MySQL Server (Database Connector).

---

## 📁 Project Structure

```text
SmartHire/
├── backend/
│   ├── routers/            # FastAPI Endpoint Routers (auth, applications, jobs, resume, etc.)
│   ├── auth_utils.py       # JWT creation and dependency verification
│   ├── database.py         # MySQL connection pooling and query executions
│   ├── email_utils.py      # Automated email SMTP notifications for scheduled interviews
│   ├── parser_utils.py     # Regex and keyword parsing for resume PDFs and ATS scoring
│   ├── main.py             # FastAPI App Entrypoint
│   ├── requirements.txt    # Backend dependencies list
│   └── .env                # Local Environment configurations
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar, Toast alerts)
│   │   ├── layouts/        # Layout wrappers (MainLayout, AuthLayout)
│   │   ├── pages/          # Application views (Dashboard, Profiles, Lists)
│   │   ├── services/       # Service layer API calls (Axios client)
│   │   └── App.jsx         # React Router routes and role-swapping gateways
│   ├── package.json        # Frontend configuration and scripts
│   └── tailwind.config.js  # Tailwind theme configurations
└── README.md               # Project Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
*   [Python 3.8+](https://www.python.org/)
*   [Node.js (v16+)](https://nodejs.org/)
*   [MySQL Server](https://www.mysql.com/)

---

### 1. Database Configuration
1. Open your MySQL client and create a new database:
   ```sql
   CREATE DATABASE smarthire_db;
   ```
2. The tables are configured to initialize automatically on startup using queries defined in `backend/database.py`.

---

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure the environment variables by updating the `.env` file:
   ```ini
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=smarthire_db
   JWT_SECRET=your_super_secret_key_string

   # SMTP Configurations (Optional - uncomment to enable email alerts)
   # SMTP_HOST=smtp.gmail.com
   # SMTP_PORT=587
   # SMTP_USER=your_gmail_address@gmail.com
   # SMTP_PASSWORD=your_app_password
   ```
4. Start the FastAPI development server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`.

---

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install the frontend Node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Production Build (Frontend)
To bundle the frontend application for production:
```bash
npm run build
```
This compiles assets into the `dist/` directory, optimized for deployment.
