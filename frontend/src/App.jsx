

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import MainLayout from './layouts/MainLayout';
// import AuthLayout from './layouts/AuthLayout';

// // --- AUTH PAGES ---
// import LoginCandidate from './pages/Auth/LoginCandidate';
// import LoginHR from './pages/Auth/LoginHR';
// import RegisterCandidate from './pages/Auth/RegisterCandidate';
// import RegisterHR from './pages/Auth/RegisterHR';

// // --- SHARED & SWITCHABLE PAGES ---
// import SkillRoadmap from './pages/SkillRoadmap/SkillRoadmap'; 
// import Leaderboard from './pages/Leaderboard/Leaderboard';
// import CandidateResumeAnalysis from './pages/CandidateResumeAnalysis/CandidateResumeAnalysis';
// import HRResumeAnalysis from './pages/HRResumeAnalysis/HRResumeAnalysis'; 
// import JobOpening from './pages/JobOpening/JobOpening';
// import Candidates from './pages/Candidates/Candidates';
// import CandidatePortal from './pages/CandidatePortal/CandidatePortal';
// import AdminPanel from './pages/AdminPanel/AdminPanel';
// import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
// import HRInterviews from './pages/HRInterviews/HRInterviews'; 
// import JobRecommendations from './pages/JobRecommendations/JobRecommendations';
// import HRJobRecommendations from './pages/JobRecommendations/HRJobRecommendations'; 
// import HRProfile from './pages/Profile/HRProfile';
// import StudentProfile from './pages/Profile/StudentProfile';
// import Dashboard from './pages/Dashboard/Dashboard';
// import SkillsAndTags from './pages/SkillsAndTags/SkillsAndTags';
// import ActivityLog from './pages/ActivityLog/ActivityLog';
// import HRResumeUpload from './pages/HRResumeUpload/HRResumeUpload';
// import ResumeUpload from './pages/ResumeUpload/ResumeUpload';
// import MyApplications from './pages/MyApplications/MyApplications'; 
// import SavedJobs from './pages/SavedJobs/SavedJobs'; 

// // --- ROLE SWITCHER COMPONENTS ---
// // Ye functions check karenge ki localStorage mein role kya hai aur sahi component render karenge

// const DashboardSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <Dashboard /> : <CandidatePortal />;
// };

// const InterviewSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <HRInterviews /> : <InterviewPrep />;
// };

// const JobRecSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <HRJobRecommendations /> : <JobRecommendations />;
// };

// const ProfileSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <HRProfile /> : <StudentProfile />;
// };

// const ResumeAnalysisSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <HRResumeAnalysis /> : <CandidateResumeAnalysis />;
// };

// const ResumeUploadSwitcher = () => {
//   const role = localStorage.getItem('role');
//   return role === 'hr' ? <HRResumeUpload /> : <ResumeUpload />;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Step 1: Default Redirect */}
//         <Route path="/" element={<Navigate to="/login-candidate" replace />} />
        
//         {/* Step 2: Auth Layout (No Sidebar/Navbar) */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login-candidate" element={<LoginCandidate />} />
//           <Route path="/register-candidate" element={<RegisterCandidate />} />
//           <Route path="/login-hr" element={<LoginHR />} />
//           <Route path="/register-hr" element={<RegisterHR />} />
//         </Route>

//         {/* Step 3: Main App Routes (Inside MainLayout with Sidebar) */}
//         <Route path="/" element={<MainLayout />}>
          
//           {/* Dashboard Switcher */}
//           <Route path="dashboard" element={<DashboardSwitcher />} /> 
          
//           {/* Shared Routes using Switchers */}
//           <Route path="interviews" element={<InterviewSwitcher />} /> 
//           <Route path="job-recommendations" element={<JobRecSwitcher />} />
//           <Route path="profile" element={<ProfileSwitcher />} />
//           <Route path="resume-analysis" element={<ResumeAnalysisSwitcher />} />
//           <Route path="resume-upload" element={<ResumeUploadSwitcher />} />
          
//           {/* --- CANDIDATE ONLY ROUTES --- */}
//           <Route path="applications" element={<MyApplications />} />
//           <Route path="saved-jobs" element={<SavedJobs />} />
//           <Route path="roadmap" element={<SkillRoadmap />} />
//           <Route path="leaderboard" element={<Leaderboard />} />

//           {/* --- HR ONLY ROUTES --- */}
//           <Route path="skills-tags" element={<SkillsAndTags />} />
//           <Route path="activity-log" element={<ActivityLog />} />
//           <Route path="jobopening" element={<JobOpening />} />
//           <Route path="candidates" element={<Candidates />} />
//           <Route path="admin-panel" element={<AdminPanel />} />
//         </Route>

//         {/* 404 Handle: Redirect back to dashboard if logged in */}
//         <Route path="*" element={
//           <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
//             <div className="text-center">
//               <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
//               <p className="text-slate-400 mb-6">Page not found!</p>
//               <button 
//                 onClick={() => window.location.href='/dashboard'} 
//                 className="bg-blue-600 px-6 py-2 rounded-xl font-bold"
//               >
//                 Go to Dashboard
//               </button>
//             </div>
//           </div>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// --- AUTH PAGES ---
import LoginCandidate from './pages/Auth/LoginCandidate';
import LoginHR from './pages/Auth/LoginHR';
import RegisterCandidate from './pages/Auth/RegisterCandidate';
import RegisterHR from './pages/Auth/RegisterHR';

// --- SHARED & SWITCHABLE PAGES ---
import SkillRoadmap from './pages/SkillRoadmap/SkillRoadmap'; 
import Leaderboard from './pages/Leaderboard/Leaderboard';
import CandidateResumeAnalysis from './pages/CandidateResumeAnalysis/CandidateResumeAnalysis';
import HRResumeAnalysis from './pages/HRResumeAnalysis/HRResumeAnalysis'; 
import JobOpening from './pages/JobOpening/JobOpening';
import Candidates from './pages/Candidates/Candidates';
import CandidatePortal from './pages/CandidatePortal/CandidatePortal';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import HRInterviews from './pages/HRInterviews/HRInterviews'; 
import JobRecommendations from './pages/JobRecommendations/JobRecommendations';
import HRJobRecommendations from './pages/JobRecommendations/HRJobRecommendations'; 
import HRProfile from './pages/Profile/HRProfile';
import StudentProfile from './pages/Profile/StudentProfile';
import Dashboard from './pages/Dashboard/Dashboard';
import SkillsAndTags from './pages/SkillsAndTags/SkillsAndTags';
import ActivityLog from './pages/ActivityLog/ActivityLog';
import HRResumeUpload from './pages/HRResumeUpload/HRResumeUpload';
import ResumeUpload from './pages/ResumeUpload/ResumeUpload';
import MyApplications from './pages/MyApplications/MyApplications'; 
import SavedJobs from './pages/SavedJobs/SavedJobs'; 
import LandingPage from './pages/LandingPage/LandingPage';

// --- ROLE SWITCHER COMPONENTS ---
const DashboardSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <Dashboard /> : <CandidatePortal />;
};

const InterviewSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <HRInterviews /> : <InterviewPrep />;
};

const JobRecSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <HRJobRecommendations /> : <JobRecommendations />;
};

const ProfileSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <HRProfile /> : <StudentProfile />;
};

const ResumeAnalysisSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <HRResumeAnalysis /> : <CandidateResumeAnalysis />;
};

const ResumeUploadSwitcher = () => {
  const role = localStorage.getItem('role');
  return role === 'hr' ? <HRResumeUpload /> : <ResumeUpload />;
};


function App() {
  return (
    <Router>
      <Routes>
        {/* --- STEP 1: LANDING PAGE (SABSE PEHLE YE DIKHEGA) --- */}
        {/* Isse Navigate hatakar LandingPage set kar diya hai */}
        <Route path="/" element={<LandingPage />} />
        
        {/* --- STEP 2: AUTH LAYOUT (Login/Register) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login-candidate" element={<LoginCandidate />} />
          <Route path="/register-candidate" element={<RegisterCandidate />} />
          <Route path="/login-hr" element={<LoginHR />} />
          <Route path="/register-hr" element={<RegisterHR />} />
        </Route>

        {/* --- STEP 3: MAIN APP (Dashboard/Sidebar logic) --- */}
        {/* Dhyaan dein: Yahan path "/app" ya similar ho sakta hai, ya fir niche dashboard ko handle karein */}
        <Route element={<MainLayout />}>
          
          <Route path="/dashboard" element={<DashboardSwitcher />} /> 
          <Route path="/interviews" element={<InterviewSwitcher />} /> 
          <Route path="/job-recommendations" element={<JobRecSwitcher />} />
          <Route path="/profile" element={<ProfileSwitcher />} />
          <Route path="/resume-analysis" element={<ResumeAnalysisSwitcher />} />
          <Route path="/resume-upload" element={<ResumeUploadSwitcher />} />
          
          {/* --- CANDIDATE ONLY --- */}
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/roadmap" element={<SkillRoadmap />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* --- HR ONLY --- */}
          <Route path="/skills-tags" element={<SkillsAndTags />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/jobopening" element={<JobOpening />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Route>

        {/* 404 Handle */}
        <Route path="*" element={
          <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
              <p className="text-slate-400 mb-6">Oops! Page not found!</p>
              <button 
                onClick={() => window.location.href='/'} 
                className="bg-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Go to Home
              </button>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;