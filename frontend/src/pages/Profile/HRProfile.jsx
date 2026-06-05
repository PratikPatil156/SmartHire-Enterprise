import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, Briefcase, 
  Award, ShieldCheck, Edit3, 
  Users, CheckCircle, Clock, Camera, Save, X, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { hrService, profileService } from '../../services/api';

const HRProfile = () => {
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};

  // Interactive Edit Modes
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Dynamic Profile States
  const [name, setName] = useState(savedUser.name || "");
  const [email, setEmail] = useState(savedUser.email || "");
  const [role, setRole] = useState("Talent Acquisition Manager");
  const [empId, setEmpId] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [avatarImage, setAvatarImage] = useState(localStorage.getItem('hr_profile_avatar') || null);
  const [highlights, setHighlights] = useState([]);
  
  // Dashboard Stats States
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [hiredCount, setHiredCount] = useState(0);
  const [interviewsCount, setInterviewsCount] = useState(0);

  // Custom Toast State
  const [toast, setToast] = useState(null);
  
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!savedUser.id) return;
        const profile = await profileService.getProfile(savedUser.id);
        
        setName(profile.name || savedUser.name || "");
        setEmail(profile.email || savedUser.email || "");
        setRole(profile.course_role || "Talent Acquisition Manager");
        setEmpId(profile.student_emp_id || "");
        setPhone(profile.phone || "");
        setAbout(profile.about || "Talent Acquisition Professional at SmartHire.");
        setAvatarImage(profile.avatar_image || null);
        
        if (profile.achievements) {
          setHighlights(profile.achievements.split(',').map(h => h.trim()).filter(h => h !== ''));
        } else {
          setHighlights([]);
        }

        // Sync local cache
        const updatedUser = { ...savedUser, name: profile.name || savedUser.name, email: profile.email || savedUser.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        if (profile.avatar_image) {
          localStorage.setItem('hr_profile_avatar', profile.avatar_image);
        } else {
          localStorage.removeItem('hr_profile_avatar');
        }
      } catch (err) {
        console.error("Failed to load HR profile from database:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await hrService.getDashboard();
        if (res && res.stats) {
          setActiveJobsCount(res.stats.screened_resumes || 0); // Active jobs/screening count
          setHiredCount(res.stats.hired || 0); // Dynamic Empowered Hires
          setInterviewsCount(res.stats.interviews_scheduled || 0); // Scheduled interviews
        }
      } catch (err) {
        console.error("Error fetching HR dashboard stats:", err);
      }
    };

    fetchProfile();
    fetchStats();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Profile photo exceeds 2MB limit.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        setAvatarImage(base64);
        localStorage.setItem('hr_profile_avatar', base64);
        
        // Auto-save immediately to database
        try {
          if (!savedUser.id) return;
          const achievementsStr = highlights.join(',');
          await profileService.updateProfile(savedUser.id, {
            name,
            course_role: role,
            student_emp_id: empId,
            phone,
            about,
            avatar_image: base64,
            achievements: achievementsStr
          });
          showToast("Profile photo updated and saved successfully!", "success");
        } catch (err) {
          showToast("Failed to save profile photo to database.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!savedUser.id) return;
      const achievementsStr = highlights.map(h => h.trim()).filter(h => h !== '').join(',');
      
      await profileService.updateProfile(savedUser.id, {
        name: name.trim(),
        course_role: role.trim(),
        student_emp_id: empId.trim(),
        phone: phone.trim(),
        about: about.trim(),
        avatar_image: avatarImage,
        achievements: achievementsStr
      });
      
      // Update local storage user name
      const updatedUser = { ...savedUser, name: name.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
      
      // Delayed reload to refresh global state Navbar elements
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      showToast(error || "Failed to update profile.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative pb-16">
      
      {/* 1. TOP HEADER - SmartHire Style Banner */}
      <div className="relative mb-28 md:mb-16">
        {/* Banner Gradient - Matching SmartHire's Professional Vibe */}
        <div className="h-48 w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#3b82f6] rounded-[32px] shadow-xl relative overflow-hidden">
           {/* Abstract Design Elements */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 md:-bottom-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 w-[calc(100%-2rem)] md:w-auto text-center md:text-left">
          {/* Profile Image with Ring Effect */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[28px] bg-white p-1 shadow-2xl shadow-slate-200 overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} className="w-full h-full object-cover rounded-[24px]" alt="HR Avatar" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[24px] flex items-center justify-center text-blue-600 text-5xl font-black border border-slate-100">
                  {name ? name.charAt(0) : "?"}
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white transform hover:scale-110 transition-transform cursor-pointer"
              title="Upload photo"
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          
          <div className="mb-4">
            {isEditing ? (
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-black text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 tracking-tight"
              />
            ) : (
              <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                {name || "Recruiter"} <ShieldCheck size={24} className="text-blue-500 shrink-0" />
              </h1>
            )}
            <div className="mt-2">
              {isEditing ? (
                <input 
                  type="text" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10 tracking-wider uppercase"
                />
              ) : (
                <p className="text-slate-500 text-xs font-bold bg-white/80 backdrop-blur shadow-sm inline-block px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-wider">{role}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="absolute -bottom-24 right-1/2 translate-x-1/2 md:translate-x-0 md:-bottom-8 md:right-10 flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <X size={14} /> Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-95 cursor-pointer"
            >
              <Save size={14} /> Save Profile
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-24 right-1/2 translate-x-1/2 md:translate-x-0 md:-bottom-8 md:right-10 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-xl shadow-slate-200/50 transition-all active:scale-95 cursor-pointer"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-28 md:mt-12 animate-in fade-in duration-300">
        
        {/* 2. LEFT COLUMN - Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-inner shadow-blue-100/50 shrink-0"><Mail size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Official Email</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner shadow-emerald-100/50 shrink-0"><Phone size={18} /></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Phone Number</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Add phone number"
                      className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{phone || "Not provided"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Organization Details</h3>
            <div className="flex items-center gap-5">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner shadow-indigo-100/50 shrink-0"><Award size={18} /></div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Employee ID</p>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={empId} 
                    onChange={(e) => setEmpId(e.target.value)}
                    placeholder="e.g. HR-2026-0001"
                    className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/10"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-700">{empId || "Not assigned"}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN - Stats & Journey */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Active Jobs */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
              <div className="p-4 rounded-[20px] bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{activeJobsCount}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Resumes Uploaded</p>
              </div>
            </div>

            {/* Empowered Hires */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
              <div className="p-4 rounded-[20px] bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{hiredCount}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Empowered Hires</p>
              </div>
            </div>

            {/* Interviews Scheduled */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
              <div className="p-4 rounded-[20px] bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight">{interviewsCount}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scheduled</p>
              </div>
            </div>

          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-20"><User size={80} /></div>
            <h3 className="text-slate-800 font-black mb-4 text-base flex items-center gap-3">
              <User size={20} className="text-blue-500" /> Professional Journey
            </h3>
            
            {isEditing ? (
              <textarea 
                rows="4"
                value={about} 
                onChange={(e) => setAbout(e.target.value)} 
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 w-full leading-relaxed resize-none"
              />
            ) : (
              <p className="text-slate-500 text-sm leading-[1.8] font-medium max-w-2xl">
                {about || "Talent Acquisition Professional at SmartHire. Share your recruiter journey here!"}
              </p>
            )}
          </div>

          {/* Career Highlights */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Recent Career Highlights</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {isEditing ? (
                <div className="space-y-4">
                  {highlights.map((text, i) => (
                    <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-3 duration-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[70px]">Highlight #{i+1}</span>
                      <input 
                        type="text" 
                        value={text} 
                        onChange={(e) => {
                          const newHl = [...highlights];
                          newHl[i] = e.target.value;
                          setHighlights(newHl);
                        }} 
                        className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 flex-1 leading-relaxed"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          const newHl = highlights.filter((_, idx) => idx !== i);
                          setHighlights(newHl);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Remove highlight"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={() => setHighlights([...highlights, ""])}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors w-fit border border-blue-100 cursor-pointer"
                  >
                    + Add Highlight
                  </button>
                </div>
              ) : (
                highlights.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                    <Sparkles className="text-slate-300 mx-auto mb-2" size={24} />
                    <p className="text-xs font-bold text-slate-400 italic">No highlights added yet.</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Click Edit Profile to share your recruitment successes and highlights!
                    </p>
                  </div>
                ) : (
                  highlights.map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-50 hover:bg-blue-50/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle size={14} className="text-emerald-600" />
                      </div>
                      <span className="truncate">{text}</span>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
            'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-4 p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default HRProfile;
