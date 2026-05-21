

import React from 'react';
import { 
  User, Mail, Phone, Briefcase, 
  Award, ShieldCheck, Edit3, 
  Users, CheckCircle, Clock, Camera
} from 'lucide-react';

const HRProfile = () => {
  const hrData = {
    name: "Rajesh Malhotra",
    role: "Senior Talent Acquisition Manager",
    empId: "HR-2024-9901",
    email: "rajesh.m@hireflow.ai",
    phone: "+91 98765 43210",
    stats: [
      { label: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Hired", value: "145", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Interviews", value: "28", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
    ]
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* 1. TOP HEADER - Professional Banner */}
      <div className="relative mb-16">
        {/* Banner Gradient */}
        <div className="h-44 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-[32px] shadow-lg shadow-blue-100">
           <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-[32px]"></div>
        </div>
        
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          {/* Profile Image with Ring Effect */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-[28px] bg-white p-1 shadow-2xl shadow-slate-200">
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-[24px] flex items-center justify-center text-blue-600 text-5xl font-black border border-slate-100">
                {hrData.name.charAt(0)}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          
          <div className="mb-4">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
              {hrData.name} <ShieldCheck size={24} className="text-blue-500" />
            </h1>
            <p className="text-slate-500 text-sm font-bold bg-white/80 backdrop-blur shadow-sm inline-block px-3 py-1 rounded-lg mt-1 border border-slate-100 uppercase tracking-wider">{hrData.role}</p>
          </div>
        </div>

        <button className="absolute -bottom-8 right-10 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-xl shadow-slate-200/50 transition-all active:scale-95">
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        
        {/* 2. LEFT COLUMN - Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 shadow-inner shadow-blue-100/50"><Mail size={18} /></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Official Email</p><p className="text-sm font-bold text-slate-700">{hrData.email}</p></div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner shadow-emerald-100/50"><Phone size={18} /></div>
                <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Phone Number</p><p className="text-sm font-bold text-slate-700">{hrData.phone}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Organization Details</h3>
            <div className="flex items-center gap-5">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-inner shadow-indigo-100/50"><Award size={18} /></div>
              <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Employee ID</p><p className="text-sm font-bold text-slate-700">{hrData.empId}</p></div>
            </div>
          </div>
        </div>

        {/* 3. RIGHT COLUMN - Stats & Journey */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hrData.stats.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
                <div className={`p-4 rounded-[20px] ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-20"><User size={80} /></div>
            <h3 className="text-slate-800 font-black mb-4 text-base flex items-center gap-3">
              <User size={20} className="text-blue-500" /> Professional Journey
            </h3>
            <p className="text-slate-500 text-sm leading-[1.8] font-medium max-w-2xl">
              Leading the Talent Acquisition team at HireFlow AI. Focusing on engineering recruitment, culture building, and implementing AI-driven hiring workflows. Passionate about improving the candidate experience through tech-driven solutions.
            </p>
          </div>

          {/* Achievements */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-400 font-black mb-6 text-[10px] uppercase tracking-[0.2em]">Recent Career Highlights</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                "Successfully closed 15+ Senior Engineering roles in Q1",
                "Built AI Resume Screening automation flow using OpenAI",
                "Featured as Recruiter of the Year 2023"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={14} className="text-emerald-600" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HRProfile;


