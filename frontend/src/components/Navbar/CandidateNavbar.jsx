import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Menu, ChevronDown, User, X, Clock, Plus, UserCheck } from 'lucide-react';
import { profileService, logsService } from '../../services/api';

const CandidateNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [avatar, setAvatar] = useState(localStorage.getItem('student_profile_avatar') || null);
  const [candidateName, setCandidateName] = useState(savedUser.name || "Candidate");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [readActivityIds, setReadActivityIds] = useState([]);
  const notificationTimerRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const logs = await logsService.getAll();
      setNotifications(logs || []);
      
      let userId = savedUser.id || null;
      let readIds = [];
      if (userId) {
        try {
          const stored = localStorage.getItem(`read_candidate_notifications_${userId}`);
          if (stored) {
            readIds = JSON.parse(stored) || [];
            setReadActivityIds(readIds);
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      const unread = (logs || []).filter(log => {
        const actId = log.id || `candidate_act_${log.action || ''}_${log.time || ''}`;
        return !readIds.includes(actId);
      });
      setBadgeCount(unread.length);
    } catch (err) {
      console.error("Error loading candidate notifications:", err);
    }
  };

  useEffect(() => {
    if (savedUser.id) {
      profileService.getProfile(savedUser.id)
        .then(profile => {
          if (profile?.avatar_image) {
            localStorage.setItem('student_profile_avatar', profile.avatar_image);
            setAvatar(profile.avatar_image);
          }
          if (profile?.name) {
            const updatedUser = { ...savedUser, name: profile.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCandidateName(profile.name);
          }
        })
        .catch(err => console.error("Error fetching candidate profile details:", err));
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [savedUser.id]);

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
    localStorage.removeItem('student_profile_avatar');
    localStorage.removeItem('hr_profile_avatar');
    window.location.href = '/login-candidate';
  };

  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    let userId = savedUser.id || null;
    if (userId) {
      try {
        let currentReadIds = [];
        const stored = localStorage.getItem(`read_candidate_notifications_${userId}`);
        if (stored) currentReadIds = JSON.parse(stored) || [];
        
        const newIds = notifications.map(n => n.id || `candidate_act_${n.action || ''}_${n.time || ''}`);
        const updatedIds = Array.from(new Set([...currentReadIds, ...newIds]));
        localStorage.setItem(`read_candidate_notifications_${userId}`, JSON.stringify(updatedIds));
        
        setReadActivityIds(updatedIds);
        setBadgeCount(0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const activeNotifications = notifications.filter(n => {
    const actId = n.id || `candidate_act_${n.action || ''}_${n.time || ''}`;
    return !readActivityIds.includes(actId);
  });

  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Left section: Menu Icon & Search Bar */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
          />
        </div>
      </div>

      {/* Profile & Notification Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <div 
          className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full" 
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfileDropdown(false);
            if (!showNotifications) {
              fetchNotifications();
            }
          }}
        >
          <BellIcon className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition-colors" />
          {badgeCount > 0 && (
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">{badgeCount}</span>
          )}
        </div>

        {/* Notifications Panel */}
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
                  className="text-indigo-600 hover:text-indigo-700 text-[10px] font-bold cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto px-2 space-y-2">
              {activeNotifications.map((n, i) => {
                let iconEl = <Clock size={16} />;
                let colorClass = 'bg-blue-50 text-blue-600';
                
                if (n.action === 'Registered') {
                  iconEl = <Plus size={16} />;
                  colorClass = 'bg-indigo-50 text-indigo-600';
                } else if (n.action === 'Applied') {
                  iconEl = <UserCheck size={16} />;
                  colorClass = 'bg-emerald-50 text-emerald-600';
                } else if (n.action === 'Uploaded Resume') {
                  iconEl = <Plus size={16} />;
                  colorClass = 'bg-violet-50 text-violet-600';
                } else if (n.action === 'Accepted' || n.action === 'Shortlisted') {
                  iconEl = <UserCheck size={16} />;
                  colorClass = 'bg-emerald-100 text-emerald-800';
                } else if (n.action === 'Rejected') {
                  iconEl = <X size={16} />;
                  colorClass = 'bg-rose-50 text-rose-600';
                }

                return (
                  <div key={i} className="flex gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-left">
                    <div className={`${colorClass} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs`}>
                      {iconEl}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">{n.action} - {n.target}</p>
                      <p className="text-[10px] text-slate-400 leading-snug mt-0.5">{n.details}</p>
                      <span className="text-[9px] text-slate-300 font-bold block mt-1">{n.time}</span>
                    </div>
                  </div>
                );
              })}
              {activeNotifications.length === 0 && (
                <p className="text-slate-400 text-xs italic text-center py-4">No recent notifications.</p>
              )}
            </div>
          </div>
        )}

        {/* Profile Card & Dropdown */}
        <div 
          className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all"
          onClick={() => {
            setShowProfileDropdown(!showProfileDropdown);
            setShowNotifications(false);
          }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black overflow-hidden border border-slate-100 shadow-sm shadow-blue-100">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              candidateName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-bold text-slate-800 leading-tight">{candidateName}</p>
            <p className="text-[11px] text-slate-400">Candidate</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>

        {/* Dropdown Menu */}
        {showProfileDropdown && (
          <div className="absolute top-12 right-0 bg-white border border-slate-100 rounded-2xl shadow-xl w-48 py-2 z-50 animate-fadeIn">
            <div className="px-4 py-2 border-b border-slate-50 mb-1 text-left">
              <p className="text-[11px] font-bold text-slate-700 truncate">{candidateName}</p>
              <p className="text-[10px] text-slate-400 truncate">{savedUser.email || "candidate@smarthire.com"}</p>
            </div>
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
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
    </nav>
  );
};

export default CandidateNavbar;