import React, { useState } from 'react';
import { 
  History, Search, Filter, UserPlus, FileText, 
  CheckCircle2, XCircle, Clock, Calendar, MoreHorizontal,
  ArrowUpRight, Download, Trash2, ShieldAlert, Zap
} from 'lucide-react';

const ActivityLog = () => {
  // Dummy Data for Audit Trail
  const [activities] = useState([
    {
      id: 1,
      type: "hiring",
      user: "Rajesh Malhotra",
      action: "Shortlisted",
      target: "Aman Verma",
      role: "Java Developer",
      time: "12 mins ago",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-50",
      details: "Candidate cleared the technical round with 85% score."
    },
    {
      id: 2,
      type: "ai",
      user: "AI Screening Bot",
      action: "Auto-Parsed",
      target: "Priya Singh",
      role: "React Architect",
      time: "1 hour ago",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      details: "Extracted 12 skills and 5 years of experience from PDF."
    },
    {
      id: 3,
      type: "status",
      user: "Sneha Reddy",
      action: "Rejected",
      target: "Rahul Kumar",
      role: "Backend Engineer",
      time: "3 hours ago",
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      details: "Not matching the required notice period criteria."
    },
    {
      id: 4,
      type: "system",
      user: "Admin",
      action: "System Update",
      target: "V1.2 Patch",
      role: "Infrastructure",
      time: "Yesterday",
      icon: ShieldAlert,
      color: "text-purple-600",
      bg: "bg-purple-50",
      details: "New security patches and resume parsing models updated."
    },
    {
      id: 5,
      type: "success",
      user: "Rajesh Malhotra",
      action: "Hired",
      target: "Neha Sharma",
      role: "Full Stack Dev",
      time: "Yesterday",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      details: "Onboarding scheduled for 1st of next month."
    }
  ]);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <History className="text-blue-600" size={24} />
            </div>
            Activity Log
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 ml-11">
            Live audit trail of every action taken in the screening system.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <Download size={14} /> Export CSV
          </button>
          <button className="bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <Trash2 size={14} /> Clear Logs
          </button>
        </div>
      </div>

      {/* --- FILTERS & SEARCH BAR --- */}
      <div className="bg-white p-4 rounded-[28px] border border-slate-100 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs by name, action or role..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:ring-4 focus:ring-blue-500/5 font-medium transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter By:</span>
          <button className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all">
            <Calendar size={14} /> All Time
          </button>
          <button className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all">
            <Filter size={14} /> Event Type
          </button>
        </div>
      </div>

      {/* --- TIMELINE SECTION --- */}
      <div className="max-w-5xl mx-auto relative px-4">
        
        {/* Main Vertical Line */}
        <div className="absolute left-[47px] md:left-[51px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-100 via-slate-100 to-transparent"></div>

        <div className="space-y-10">
          {activities.map((item) => (
            <div key={item.id} className="relative flex items-start gap-8 group">
              
              {/* Timeline Indicator */}
              <div className="relative z-10 shrink-0">
                <div className={`p-4 rounded-[22px] ${item.bg} ${item.color} shadow-md border-4 border-white group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={22} />
                </div>
                <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-white border border-slate-100 px-2 py-1 rounded-lg shadow-sm">
                    {item.time}
                  </span>
                </div>
              </div>

              {/* Activity Card */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex-1 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden group/card border-l-4 border-l-transparent hover:border-l-blue-500">
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-600 font-black text-sm">{item.user}</span>
                      <span className="text-slate-400 text-xs font-bold tracking-tight">{item.action}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-800 leading-tight">
                      {item.target} 
                      <span className="text-slate-400 font-medium text-xs ml-2">— {item.role}</span>
                    </h3>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Log Description */}
                <div className="bg-slate-50/50 p-3 rounded-2xl mb-4">
                  <p className="text-xs text-slate-500 font-medium italic leading-relaxed">
                    "{item.details}"
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">Ref: #ACT-{item.id}092</span>
                      </div>
                   </div>
                   <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-0 translate-x-2 transition-all">
                     Audit Report <ArrowUpRight size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PAGINATION / LOAD MORE --- */}
      <div className="mt-16 flex flex-col items-center gap-4">
        <div className="h-px w-24 bg-slate-200"></div>
        <button className="bg-white border border-slate-200 text-slate-500 px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm active:scale-95">
          Load Previous Logs
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;