import React from 'react';
import { 
  User, Mail, Phone, GraduationCap, 
  Award, CheckCircle2, Zap, Camera,
  TrendingUp, Star, BookOpen, MapPin
} from 'lucide-react';

const StudentProfile = () => {
  const studentData = {
    name: "Aryan Sharma",
    course: "B.Tech Computer Science",
    studentId: "STU-2026-0412",
    email: "aryan.sharma@university.edu",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    stats: [
      { label: "Attendance", value: "92%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "CGPA", value: "8.5", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
      { label: "Completed", value: "18/20", icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" }
    ],
    skills: ["React.js", "Python", "Tailwind CSS", "Data Structures", "UI Design"]
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* 1. TOP HEADER - SmartHire Style Banner */}
      <div className="relative mb-16">
        {/* Banner Gradient - Matching SmartHire's Professional Vibe */}
        <div className="h-48 w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#3b82f6] rounded-[32px] shadow-xl relative overflow-hidden">
           {/* Abstract Design Elements */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
           <div className="absolute bottom-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        {/* Profile Card Overlay */}
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <div className="relative">
            <div className="w-36 h-36 rounded-[30px] bg-white p-1.5 shadow-2xl shadow-slate-200">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[25px] flex items-center justify-center text-white text-5xl font-black border border-white/20">
                {studentData.name.charAt(0)}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white transform hover:scale-110 transition-all">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="mb-4">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              {studentData.name} <Zap size={22} className="text-amber-500 fill-amber-500" />
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <p className="text-blue-600 text-[11px] font-black bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider border border-blue-100">
                {studentData.course}
              </p>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <MapPin size={14} /> {studentData.location}
              </div>
            </div>
          </div>
        </div>

        <button className="absolute -bottom-8 right-10 bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95">
           Share Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
        
        {/* 2. LEFT COLUMN - Quick Details */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-300 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Contact & ID</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><GraduationCap size={18} /></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID Number</p><p className="text-sm font-bold text-slate-700">{studentData.studentId}</p></div>
              </div>
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Mail size={18} /></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Email Address</p><p className="text-sm font-bold text-slate-700">{studentData.email}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-300 font-black mb-5 text-[10px] uppercase tracking-[0.2em]">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {studentData.skills.map((skill, i) => (
                <span key={i} className="px-3 py-2 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-xl border border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN - Progress & Achievements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentData.stats.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:scale-[1.02] transition-transform shadow-sm">
                <div className={`p-4 rounded-[20px] ${item.bg} ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Roadmap */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-slate-800 font-black text-base flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                  <TrendingUp size={16} className="text-white" />
                </div> 
                Learning Roadmap
              </h3>
            </div>

            <div className="space-y-6">
              {[
                { name: "Backend Logic & APIs", progress: 75, color: "bg-blue-600" },
                { name: "Frontend Optimization", progress: 90, color: "bg-emerald-500" },
                { name: "Interview Preparation", progress: 30, color: "bg-amber-500" }
              ].map((course, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{course.name}</span>
                    <span className="text-xs font-black text-slate-400">{course.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className={`h-full ${course.color} rounded-full shadow-sm transition-all duration-1000`} 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Readiness Badge */}
          <div className="bg-[#0f172a] p-8 rounded-[32px] text-white flex items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">SmartHire Insights</p>
              <h3 className="text-2xl font-bold mb-2 tracking-tight">Placement Ready!</h3>
              <p className="text-slate-400 text-sm max-w-sm font-medium">Your profile is in the top 5% for Full Stack roles this week. Complete 2 more mock interviews to boost visibility.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-[24px] shadow-xl relative z-10 transform rotate-6 hover:rotate-0 transition-transform">
              <Award size={48} className="text-white" />
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px]"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;