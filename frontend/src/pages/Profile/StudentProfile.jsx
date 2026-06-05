import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, GraduationCap, 
  Award, CheckCircle2, Zap, Camera,
  TrendingUp, Star, BookOpen, MapPin,
  Edit3, Save, X, Sparkles, AlertCircle, FileText,
  Globe
} from 'lucide-react';
import { profileService } from '../../services/api';

const StudentProfile = () => {
  const savedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Profile fields states
  const [name, setName] = useState(savedUser.name || "");
  const [email, setEmail] = useState(savedUser.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [studentId, setStudentId] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillsInput, setSkillsInput] = useState(""); // Comma-separated string for editing
  const [avatarImage, setAvatarImage] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certsInput, setCertsInput] = useState(""); // Comma-separated string for editing
  
  // Progress & Stats states from backend
  const [placementReady, setPlacementReady] = useState("10%");
  const [profileStatus, setProfileStatus] = useState("Pending");
  const [profileCompleted, setProfileCompleted] = useState("1/20");
  const [backendProgress, setBackendProgress] = useState(0);
  const [frontendProgress, setFrontendProgress] = useState(0);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [insightTitle, setInsightTitle] = useState("Build Your Profile!");
  const [insightDesc, setInsightDesc] = useState("Upload your resume to sync your skills and start getting matched to jobs.");
  
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
        setPhone(profile.phone || "");
        setLocation(profile.location || "");
        setCourse(profile.course_role || "SmartHire Candidate");
        setStudentId(profile.student_emp_id || "");
        setAbout(profile.about || "");
        setAvatarImage(profile.avatar_image || null);
        if (profile.avatar_image) {
          localStorage.setItem('student_profile_avatar', profile.avatar_image);
        }
        
        // Skills
        const skillsStr = profile.skills || "";
        setSkillsInput(skillsStr);
        setSkills(skillsStr.split(',').map(s => s.trim()).filter(Boolean));
        
        // Social links
        setGithubLink(profile.github_link || "");
        setLinkedinLink(profile.linkedin_link || "");
        setPortfolioLink(profile.portfolio_link || "");
        
        // Certifications
        const certsStr = profile.certifications || "";
        setCertsInput(certsStr);
        setCertifications(certsStr.split(',').map(c => c.trim()).filter(Boolean));
        
        // Dynamic progress & stats
        setPlacementReady(profile.placement_ready || "10%");
        setProfileStatus(profile.profile_status || "Pending");
        setProfileCompleted(profile.profile_completed || "1/20");
        setBackendProgress(profile.backend_progress || 0);
        setFrontendProgress(profile.frontend_progress || 0);
        setInterviewProgress(profile.interview_progress || 0);
        setInsightTitle(profile.placement_insights_title || "Build Your Profile!");
        setInsightDesc(profile.placement_insights_desc || "Upload your resume to sync your skills.");
      } catch (err) {
        console.error("Failed to load candidate profile:", err);
        showToast("Error loading profile from database.", "error");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
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
        localStorage.setItem('student_profile_avatar', base64);
        
        // Auto-save immediately to database
        try {
          if (!savedUser.id) return;
          await profileService.updateProfile(savedUser.id, {
            name,
            phone,
            location,
            course_role: course,
            student_emp_id: studentId,
            about,
            skills: skillsInput,
            avatar_image: base64,
            github_link: githubLink,
            linkedin_link: linkedinLink,
            portfolio_link: portfolioLink,
            certifications: certsInput
          });
          showToast("Profile photo updated successfully!", "success");
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
      
      const skillsStr = skillsInput.trim();
      const certsStr = certsInput.trim();
      
      await profileService.updateProfile(savedUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        course_role: course.trim(),
        student_emp_id: studentId.trim(),
        about: about.trim(),
        skills: skillsStr,
        avatar_image: avatarImage,
        github_link: githubLink.trim(),
        linkedin_link: linkedinLink.trim(),
        portfolio_link: portfolioLink.trim(),
        certifications: certsStr
      });
      
      // Update local storage user name
      const updatedUser = { ...savedUser, name: name.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Parse skills & certs string back into array
      setSkills(skillsStr.split(',').map(s => s.trim()).filter(Boolean));
      setCertifications(certsStr.split(',').map(c => c.trim()).filter(Boolean));
      setIsEditing(false);
      showToast("Profile details updated successfully!", "success");
      
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative pb-16">
      
      {/* 1. TOP HEADER - SmartHire Style Banner */}
      <div className="relative mb-16">
        {/* Banner Gradient - Matching SmartHire's Professional Vibe */}
        <div className="h-48 w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#3b82f6] rounded-[32px] shadow-xl relative overflow-hidden">
           {/* Abstract Design Elements */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        {/* Profile Card Overlay */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 md:-bottom-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 text-center md:text-left w-[calc(100%-2rem)] md:w-auto">
          <div className="relative group">
            <div className="w-36 h-36 rounded-[30px] bg-white p-1.5 shadow-2xl shadow-slate-200 overflow-hidden">
              {avatarImage ? (
                <img src={avatarImage} className="w-full h-full object-cover rounded-[25px]" alt="Candidate Avatar" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[25px] flex items-center justify-center text-white text-5xl font-black border border-white/20">
                  {name ? name.charAt(0) : "?"}
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white transform hover:scale-110 transition-transform cursor-pointer"
              title="Upload photo"
            >
              <Camera size={16} />
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
              <h1 className="text-3xl font-black text-slate-800 md:text-white flex items-center justify-center md:justify-start gap-3 tracking-tight">
                {name || "Candidate"} <Zap size={22} className="text-amber-500 fill-amber-500" />
              </h1>
            )}
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              {isEditing ? (
                <input 
                  type="text" 
                  value={course} 
                  onChange={(e) => setCourse(e.target.value)}
                  className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/10"
                />
              ) : (
                <p className="text-blue-600 text-[10px] font-black bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider border border-blue-100">
                  {course}
                </p>
              )}
              
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <MapPin size={14} /> 
                {isEditing ? (
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded outline-none focus:ring-2 focus:ring-blue-500/10"
                  />
                ) : (
                  <span>{location || "Not Specified"}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="absolute -bottom-28 right-1/2 translate-x-1/2 md:translate-x-0 md:-bottom-8 md:right-10 flex gap-3 z-10">
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <X size={14} /> Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="bg-[#1a56db] hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-blue-200 transition-all active:scale-[0.95] cursor-pointer whitespace-nowrap"
            >
              <Save size={14} /> Save Profile
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-28 right-1/2 translate-x-1/2 md:translate-x-0 md:-bottom-8 md:right-10 bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95 cursor-pointer whitespace-nowrap z-10"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-32 md:mt-16 animate-in fade-in duration-300">
        
        {/* 2. LEFT COLUMN - Quick Details */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-300 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Contact & ID</h3>
            <div className="space-y-6">
              
              <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 shrink-0"><GraduationCap size={18} /></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Student ID</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={studentId} 
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. STU-2026-0001"
                      className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{studentId || "Not assigned"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 group shrink-0">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-inner shrink-0"><Mail size={18} /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner shrink-0"><Phone size={18} /></div>
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
                    <p className="text-sm font-bold text-slate-700">{phone || "Not specified"}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-inner shrink-0"><MapPin size={18} /></div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Location</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location"
                      className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg w-full outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{location || "Not specified"}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-5 text-[10px] uppercase tracking-[0.2em]">Tech Stack</h3>
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold leading-normal">Enter skills separated by commas (,)</p>
                <textarea 
                  rows="3"
                  value={skillsInput} 
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="React, Python, HTML, CSS"
                  className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 w-full leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-semibold">No skills linked yet.</p>
                ) : (
                  skills.map((skill, i) => (
                    <span key={i} className="px-3 py-2 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            )}
          </div>

        </div>

        {/* 3. RIGHT COLUMN - Progress & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          

          {/* About Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-20"><User size={80} /></div>
            <h3 className="text-slate-800 font-black mb-4 text-base flex items-center gap-3">
              <User size={20} className="text-blue-600" /> Candidate Biography
            </h3>
            
            {isEditing ? (
              <textarea 
                rows="4"
                value={about} 
                onChange={(e) => setAbout(e.target.value)} 
                className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 w-full leading-relaxed resize-none"
              />
            ) : (
              <p className="text-slate-500 text-sm leading-[1.8] font-medium max-w-2xl whitespace-pre-line">
                {about || "Computer Science student. Upload your resume or click Edit Profile to share your background journey!"}
              </p>
            )}
          </div>

          {/* Certifications Card */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mt-6">
            <h3 className="text-slate-800 font-black mb-6 text-base flex items-center gap-3">
              <Award size={20} className="text-blue-600" /> Certifications & Licenses
            </h3>
            
            {isEditing ? (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-bold leading-normal">Enter certifications separated by commas (,)</p>
                <textarea 
                  rows="3"
                  value={certsInput} 
                  onChange={(e) => setCertsInput(e.target.value)}
                  placeholder="e.g. AWS Certified Developer, Oracle Java SE Certification, Scrum Master"
                  className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-semibold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 w-full leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-semibold col-span-2">No certifications added yet. Click Edit Profile to add them!</p>
                ) : (
                  certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                        <Award size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-800 truncate">{cert}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Verified Certification</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Social & Professional Links Card */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm mt-6">
            <h3 className="text-slate-800 font-black mb-6 text-base flex items-center gap-3">
              <Globe size={20} className="text-blue-600" /> Social & Professional Links
            </h3>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">GitHub Link</label>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <input 
                      type="text" 
                      value={githubLink} 
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="https://github.com/username"
                      className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">LinkedIn Link</label>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <input 
                      type="text" 
                      value={linkedinLink} 
                      onChange={(e) => setLinkedinLink(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Portfolio Website</label>
                  <div className="flex items-center gap-2 mt-1 text-slate-400">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    <input 
                      type="text" 
                      value={portfolioLink} 
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="https://myportfolio.com"
                      className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group">
                  <div className="p-3 bg-slate-50 text-slate-700 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">GitHub</p>
                    {githubLink ? (
                      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline truncate block">
                        {githubLink.replace('https://', '')}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold italic">Not added</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">LinkedIn</p>
                    {linkedinLink ? (
                      <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline truncate block">
                        {linkedinLink.replace('https://', '')}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold italic">Not added</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Portfolio Website</p>
                    {portfolioLink ? (
                      <a href={portfolioLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline truncate block">
                        {portfolioLink.replace('https://', '')}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-semibold italic">Not added</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
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

export default StudentProfile;