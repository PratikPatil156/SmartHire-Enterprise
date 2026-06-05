import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileSearch, Star, 
  Calendar, Tags, BarChart3, History, Bot,
  Shield, User, BriefcaseBusiness, LogOut,
  AlertCircle, X
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onClose }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // --- LOGOUT FUNCTION ---
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('hr_profile_avatar');
    localStorage.removeItem('student_profile_avatar');
    navigate('/login-candidate'); // Wapas login page par bheja
  };

  const role = localStorage.getItem('role');

  const menuItems = role === 'hr' ? [
    { 
      section: "MAIN", 
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { name: "Job Openings", icon: <BriefcaseBusiness size={18} />, path: "/jobopening" },
        { name: "Candidates", icon: <Users size={18} />, path: "/candidates" },
        { name: "Resume Analytics", icon: <BarChart3 size={18} />, path: "/resume-analysis" },
      ]
    },
    { 
      section: "MANAGE", 
      items: [
        { name: "Interviews", icon: <Calendar size={18} />, path: "/interviews" }, 
        { name: "Job Recommendations", icon: <Star size={18} />, path: "/job-recommendations" },
        { name: "Profile", icon: <User size={18} />, path: "/profile" },
        { name: "Admin Panel", icon: <Shield size={18} />, path: "/admin-panel" },
      ]
    },
    { 
      section: "REPORTS", 
      items: [
        { name: "Skills & Tags", icon: <Tags size={18} />, path: "/skills-tags" },
        { name: "Activity Log", icon: <History size={18} />, path: "/activity-log" },
      ]
    }
  ] : [
    { 
      section: "MAIN", 
      items: [
        { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { name: "Resume Upload", icon: <FileSearch size={18} />, path: "/resume-upload" },
        { name: "Resume Analysis", icon: <BarChart3 size={18} />, path: "/resume-analysis" },
        { name: "My Applications", icon: <BriefcaseBusiness size={18} />, path: "/applications" },
        { name: "Saved Jobs", icon: <Star size={18} />, path: "/saved-jobs" },
      ]
    },
    { 
      section: "LEARNING & PREP", 
      items: [
        { name: "Interview Prep", icon: <Calendar size={18} />, path: "/interviews" }, 
        { name: "Job Recommendations", icon: <Star size={18} />, path: "/job-recommendations" },
        { name: "Profile", icon: <User size={18} />, path: "/profile" },
      ]
    }
  ];

  return (
    <div className={`bg-white h-screen flex flex-col p-4 text-slate-500 border-r border-slate-100 sticky top-0 left-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 flex-shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo Section */}
      <div className="flex items-center justify-between px-3 mb-10 mt-2">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-[14px] shadow-lg shadow-blue-100 flex-shrink-0">
            <Bot className="text-white" size={22} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-slate-800 font-black text-sm leading-tight uppercase tracking-tighter">AI Resume</h1>
              <p className="text-[10px] text-blue-500 font-black tracking-widest uppercase">Enterprise</p>
            </div>
          )}
        </div>
        
        {/* Mobile/Tablet Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto space-y-7 pr-2 custom-scrollbar">
        {menuItems.map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <p className="text-[10px] font-black text-slate-300 mb-4 px-4 tracking-[0.15em] uppercase">
                {group.section}
              </p>
            )}
            <div className="space-y-1.5">
              {group.items.map((item, i) => (
                <NavLink
                  key={i}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-[16px] cursor-pointer transition-all duration-300 group ${
                      isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm font-bold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    } ${isCollapsed ? "justify-center px-2" : ""}`
                  }
                >
                  <span className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- SIGN OUT SECTION --- */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <button 
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-red-500 hover:bg-red-50 transition-all duration-300 group ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <span className="group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <LogOut size={18} />
          </span>
          {!isCollapsed && <span className="text-[13px] font-bold tracking-tight">Sign Out</span>}
        </button>
      </div>

      {/* Bottom AI Assistant Card */}
      {!isCollapsed && (
        <div className="mt-4 bg-gradient-to-b from-slate-50 to-white border border-slate-100 p-5 rounded-[24px] shadow-sm mb-2 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white p-2 rounded-xl shadow-md border border-slate-50">
              <Bot size={18} className="text-blue-600" />
            </div>
            <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight">AI Assistant</span>
          </div>
          <button 
            onClick={() => showToast("Feature currently not available.", "info")}
            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white text-[11px] font-bold py-3 rounded-[14px] transition-all uppercase tracking-wider"
          >
            Ask AI Now
          </button>
        </div>
      )}

      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[999] flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-4 p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;