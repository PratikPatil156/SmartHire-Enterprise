import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, Search, Bell, ChevronDown, User, X, Plus, UserCheck, Clock
} from 'lucide-react';
import { hrService, profileService } from '../../services/api';

const HRNavbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [readActivityIds, setReadActivityIds] = useState([]);
  const notificationTimerRef = useRef(null);

  // Automatically clear global search bar when viewing the candidates pipeline page
  useEffect(() => {
    if (location.pathname === '/candidates') {
      setSearchQuery("");
    }
  }, [location.pathname]);

  // Recruiter credentials loaded dynamically from LocalStorage
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [hrAvatar, setHrAvatar] = useState(localStorage.getItem('hr_profile_avatar') || null);
  const [hrName, setHrName] = useState(savedUser.name || "HR Recruiter");
  const hrEmail = savedUser.email || "hr@hireflow.ai";

  // Dynamically fetch and sync profile avatar/details on load so they are always visible without manual reloads
  useEffect(() => {
    if (savedUser.id) {
      profileService.getProfile(savedUser.id)
        .then(profile => {
          if (profile?.avatar_image) {
            localStorage.setItem('hr_profile_avatar', profile.avatar_image);
            setHrAvatar(profile.avatar_image);
          }
          if (profile?.name) {
            const updatedUser = { ...savedUser, name: profile.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setHrName(profile.name);
          }
        })
        .catch(err => console.error("Error fetching HR profile details:", err));
    }
  }, [savedUser.id]);

  useEffect(() => {
    // Read user ID dynamically to avoid stale closures
    let userId = null;
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        const parsed = JSON.parse(rawUser);
        userId = parsed?.id;
      }
    } catch (e) {
      console.error(e);
    }

    if (userId) {
      try {
        const stored = localStorage.getItem(`read_hr_notifications_${userId}`);
        if (stored) {
          setReadActivityIds(JSON.parse(stored) || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await hrService.getDashboard();
        setData(res);
        
        // Count unread activities
        let userId = null;
        try {
          const rawUser = localStorage.getItem('user');
          if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
            const parsed = JSON.parse(rawUser);
            userId = parsed?.id;
          }
        } catch (e) {
          console.error(e);
        }

        let unreadCount = 0;
        if (res?.activities) {
          let readIds = [];
          if (userId) {
            try {
              const stored = localStorage.getItem(`read_hr_notifications_${userId}`);
              if (stored) readIds = JSON.parse(stored) || [];
            } catch (e) {
              console.error(e);
            }
          }
          const unread = res.activities.filter(act => {
            const actId = act.id || `hr_act_${act.title || ''}_${act.time || ''}`;
            return !readIds.includes(actId);
          });
          unreadCount = unread.length;
        }
        setBadgeCount(unreadCount);
      } catch (err) {
        console.error("Error loading HR dashboard stats:", err);
      }
    };
    fetchDashboard();
  }, [location.pathname]);

  useEffect(() => {
    if (showNotifications) {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = setTimeout(() => {
        setShowNotifications(false);
      }, 5000);
    }
    return () => {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    };
  }, [showNotifications]);

  const handleMouseEnterNotifications = () => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
  };

  const handleMouseLeaveNotifications = () => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    notificationTimerRef.current = setTimeout(() => {
      setShowNotifications(false);
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('hr_profile_avatar');
    localStorage.removeItem('student_profile_avatar');
    window.location.href = '/login-hr';
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    let userId = null;
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
        const parsed = JSON.parse(rawUser);
        userId = parsed?.id;
      }
    } catch (err) {
      console.error(err);
    }
    
    if (userId) {
      try {
        let currentReadIds = [];
        const stored = localStorage.getItem(`read_hr_notifications_${userId}`);
        if (stored) currentReadIds = JSON.parse(stored) || [];
        
        const newIds = activitiesList.map(a => a.id);
        const updatedIds = Array.from(new Set([...currentReadIds, ...newIds]));
        localStorage.setItem(`read_hr_notifications_${userId}`, JSON.stringify(updatedIds));
        
        setReadActivityIds(updatedIds);
        setBadgeCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const activitiesList = data?.activities?.map((act) => {
    let iconEl = <Clock size={16} />;
    let colorClass = 'bg-blue-50 text-blue-600';
    if (act.icon === 'plus') {
      iconEl = <Plus size={16} />;
      colorClass = 'bg-blue-50 text-blue-600';
    } else if (act.icon === 'check') {
      iconEl = <UserCheck size={16} />;
      colorClass = 'bg-emerald-50 text-emerald-600';
    } else if (act.icon === 'close') {
      iconEl = <X size={16} />;
      colorClass = 'bg-rose-50 text-rose-600';
    }
    return {
      id: act.id || `hr_act_${act.title || ''}_${act.time || ''}`,
      icon: iconEl,
      title: act.title || "Activity logged",
      sub: act.sub || "Details not specified",
      time: act.time || "Just now",
      color: colorClass
    };
  }) || [];

  const activeActivities = activitiesList.filter(act => !readActivityIds.includes(act.id));

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-40 w-full shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <Menu 
          className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" 
          size={20} 
          onClick={onToggleSidebar}
        />
        <div className="relative w-full max-w-md">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" 
            size={18} 
            onClick={() => {
              if (searchQuery.trim()) {
                navigate('/candidates', { state: { searchQuery } });
                setSearchQuery("");
              }
            }}
          />
          <input 
            type="text" 
            placeholder="Search candidates, skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate('/candidates', { state: { searchQuery } });
                setSearchQuery("");
              }
            }}
            className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 transition-all text-slate-700 font-medium"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative">
        
        {/* Notifications */}
        <div 
          className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full" 
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfileDropdown(false);
          }}
        >
          <Bell className="text-slate-500 hover:text-blue-600 transition-colors" size={22} />
          {badgeCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{badgeCount}</span>
          )}
        </div>

        {showNotifications && (
          <div 
            onMouseEnter={handleMouseEnterNotifications}
            onMouseLeave={handleMouseLeaveNotifications}
            className="absolute top-12 right-24 bg-white border border-slate-100 rounded-2xl shadow-xl w-80 py-3 z-50 animate-fadeIn"
          >
            <div className="flex justify-between items-center px-4 pb-2 border-b border-slate-50 mb-2">
              <span className="font-bold text-[12px] text-slate-800">Notifications</span>
              {badgeCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead} 
                  className="text-blue-600 hover:text-blue-700 text-[10px] font-bold"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto px-2 space-y-2">
              {activeActivities.map((a, i) => (
                <div key={i} className="flex gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                  <div className={`${a.color} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs`}>
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-800 leading-tight">{a.title}</p>
                    <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{a.sub}</p>
                    <span className="text-[9px] text-slate-300 font-bold block mt-1">{a.time}</span>
                  </div>
                </div>
              ))}
              {activeActivities.length === 0 && (
                <p className="text-slate-400 text-xs italic text-center py-4">No recent notifications.</p>
              )}
            </div>
          </div>
        )}

        {/* Profile Dropdown */}
        <div 
          className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all"
          onClick={() => {
            setShowProfileDropdown(!showProfileDropdown);
            setShowNotifications(false);
          }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black overflow-hidden border border-slate-100 shadow-sm shadow-blue-100">
            {hrAvatar ? (
              <img src={hrAvatar} alt="HR Avatar" className="w-full h-full object-cover" />
            ) : (
              hrName.charAt(0)
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-bold text-slate-800 leading-tight">{hrName}</p>
            <p className="text-[11px] text-slate-400">Admin</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        {showProfileDropdown && (
          <div className="absolute top-12 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl w-48 py-2 z-50 animate-fadeIn">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-[11px] font-bold text-slate-700 truncate">{hrName}</p>
              <p className="text-[10px] text-slate-400 truncate">{hrEmail}</p>
            </div>
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <User size={14} /> My Profile
            </button>
            <button 
              onClick={handleLogout} 
              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <X size={14} /> Logout
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default HRNavbar;
