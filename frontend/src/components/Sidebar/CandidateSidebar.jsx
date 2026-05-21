

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  ArrowUpTrayIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  BookmarkIcon,
  MapIcon, 
  TrophyIcon 
} from '@heroicons/react/24/outline';

const CandidateSidebar = () => {
  // Menu Items - Updated with AI Resume Score
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Squares2X2Icon className="w-5 h-5" /> },
    
    // 1. Resume Section
    { name: 'Upload Resume', path: '/resume-upload', icon: <ArrowUpTrayIcon className="w-5 h-5" /> },
    { name: 'AI Resume Score', path: '/resume-analysis', icon: <SparklesIcon className="w-5 h-5" /> },
    
    // 2. Job Search Section
    { name: 'Job Openings', path: '/job-recommendations', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: <BookmarkIcon className="w-5 h-5" /> },
    { name: 'My Applications', path: '/applications', icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
    
    // 3. Career Growth Section
    { name: 'Interview Prep', path: '/interviews', icon: <AcademicCapIcon className="w-5 h-5" /> }, 
    { name: 'Skill Roadmap', path: '/roadmap', icon: <MapIcon className="w-5 h-5" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <TrophyIcon className="w-5 h-5" /> },
    
    // 4. Profile Section
    { name: 'My Profile', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-screen bg-white text-slate-600 flex flex-col p-5 border-r border-slate-100 shadow-sm">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2 group cursor-pointer">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-100 group-hover:rotate-6 transition-transform">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <span className="text-slate-900 font-black text-2xl tracking-tighter">SmartHire</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">
          Candidate Menu
        </p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-[-20px] w-1.5 h-6 bg-indigo-600 rounded-r-full" />
                )}
                <span className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[14px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button Section */}
      <div className="mt-auto border-t border-slate-100 pt-4">
        <button 
          onClick={handleLogout}
          className="
            flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 font-bold 
            text-blue-600 hover:bg-red-50 hover:text-red-600 
            group
          "
        >
          <div className="transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CandidateSidebar;