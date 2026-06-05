

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
  TrophyIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CandidateSidebar = ({ isCollapsed, onClose }) => {
  // Menu Items
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Squares2X2Icon className="w-5 h-5" /> },
    
    // 1. Resume Section
    { name: 'AI Resume Score', path: '/resume-analysis', icon: <SparklesIcon className="w-5 h-5" /> },
    
    // 2. Job Search Section
    { name: 'Job Openings', path: '/job-recommendations', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: 'Saved Jobs', path: '/saved-jobs', icon: <BookmarkIcon className="w-5 h-5" /> },
    { name: 'My Applications', path: '/applications', icon: <ClipboardDocumentCheckIcon className="w-5 h-5" /> },
    
    // 3. Profile Section
    { name: 'My Profile', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('student_profile_avatar');
    localStorage.removeItem('hr_profile_avatar');
    window.location.href = '/login-candidate';
  };

  return (
    <div className={`h-screen bg-white text-slate-600 flex flex-col p-5 border-r border-slate-100 shadow-sm transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo Section */}
      <div className="flex items-center justify-between px-2 mb-10 mt-2">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-100 group-hover:rotate-6 transition-transform">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && <span className="text-slate-900 font-black text-2xl tracking-tighter">SmartHire</span>}
        </div>

        {/* Mobile/Tablet Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition-all"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
        {!isCollapsed && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 mb-4">
            Candidate Menu
          </p>
        )}
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
              ${isCollapsed ? 'justify-center px-2' : ''}
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
                {!isCollapsed && <span className="text-[14px] font-medium">{item.name}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button Section */}
      <div className="mt-auto border-t border-slate-100 pt-4">
        <button 
          onClick={handleLogout}
          className={`
            flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-300 font-bold 
            text-blue-600 hover:bg-red-50 hover:text-red-600 
            group ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <div className="transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </div>
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default CandidateSidebar;