
import React from 'react';
import { 
  Mic2, Video, FileText, BrainCircuit, 
  PlayCircle, Timer, BarChart, CheckCircle,
  MessageSquare, Sparkles, ChevronRight
} from 'lucide-react';

const InterviewPrep = () => {
  const prepStats = [
    { label: "Mock Interviews", value: "08", icon: Video, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Confidence Score", value: "78%", icon: BarChart, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Questions Solved", value: "124", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const upcomingInterviews = [
    { company: "Google", role: "Frontend Intern", date: "Oct 24, 10:00 AM", status: "Confirmed" },
    { company: "TCS", role: "Software Developer", date: "Oct 28, 02:30 PM", status: "Pending" }
  ];

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      
      {/* 1. Header Section - More Compact */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Interview Preparation</h1>
        <p className="text-slate-500 text-xs font-medium mt-0.5">Master your skills with AI-driven mock interviews.</p>
      </div>

      {/* 2. AI Hero Section - RE-DESIGNED TO BE SLIM */}
      <div className="relative overflow-hidden bg-[#0f172a] rounded-[24px] p-7 text-white mb-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 border border-blue-500/30">
              <Sparkles size={12} /> AI Powered
            </div>
            <h2 className="text-2xl font-bold mb-2 leading-tight">Ready for a <span className="text-blue-400">Mock Interview?</span></h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-0 max-w-md">
              Our AI analyzes facial expressions, tone, and technical accuracy for real-time feedback.
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
              <PlayCircle size={18} /> Start Session
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all border border-white/10">
              Syllabus
            </button>
          </div>
        </div>
        
        {/* Background Decoration - Scaled Down */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent flex items-center justify-end pr-10">
            <BrainCircuit size={180} className="text-blue-500/10 rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. Left Column - Stats & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Grid - Balanced Padding */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prepStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                <div className={`p-3 rounded-[15px] ${stat.bg} ${stat.color} group-hover:scale-105 transition-transform`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Topics to Master */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-800 font-black text-base mb-5 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" /> Topics to Master
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "System Design", level: "Advanced", progress: 40, color: "bg-purple-500" },
                { title: "React Hooks & Lifecycle", level: "Intermediate", progress: 85, color: "bg-blue-500" },
                { title: "Data Structures", level: "Expert", progress: 60, color: "bg-emerald-500" },
                { title: "Behavioral Questions", level: "Beginner", progress: 95, color: "bg-amber-500" },
              ].map((topic, i) => (
                <div key={i} className="p-4 rounded-[18px] border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-200/40 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-bold text-slate-700 text-xs group-hover:text-blue-600 transition-colors">{topic.title}</h4>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{topic.level}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${topic.color} rounded-full`} style={{ width: `${topic.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Right Column - Reminders & Resources */}
        <div className="space-y-6">
            
            {/* Upcoming Interviews */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                <h3 className="text-slate-300 font-black mb-4 text-[9px] uppercase tracking-[0.2em]">Upcoming Schedule</h3>
                <div className="space-y-3">
                    {upcomingInterviews.map((interview, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all">
                            <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                                <Video size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-700">{interview.company}</h4>
                                <p className="text-[10px] text-slate-400 font-medium mb-1.5">{interview.role}</p>
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{interview.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Resources */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-[24px] text-white shadow-lg relative overflow-hidden group">
                <div className="relative z-10">
                    <h3 className="text-base font-bold mb-1">Question Bank</h3>
                    <p className="text-blue-100 text-[10px] mb-4 leading-relaxed">500+ questions from Top Tech companies.</p>
                    <button className="w-full bg-white text-blue-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-50 transition-colors">
                        Explore Now
                    </button>
                </div>
                <MessageSquare size={80} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform duration-500" />
            </div>

        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;