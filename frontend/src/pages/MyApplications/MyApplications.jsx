import React from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const MyApplications = () => {
  const applications = [
    {
      id: 1,
      company: "Google",
      role: "Frontend Intern",
      date: "Oct 20, 2023",
      status: "Interviewing",
      aiScore: "92%",
      statusColor: "text-blue-600 bg-blue-50",
      icon: <ClockIcon className="w-5 h-5 text-blue-600" />
    },
    {
      id: 2,
      company: "TCS",
      role: "Software Developer",
      date: "Oct 15, 2023",
      status: "Applied",
      aiScore: "78%",
      statusColor: "text-slate-600 bg-slate-50",
      icon: <CheckCircleIcon className="w-5 h-5 text-slate-500" />
    },
    {
      id: 3,
      company: "Zomato",
      role: "React Developer",
      date: "Oct 10, 2023",
      status: "Rejected",
      aiScore: "65%",
      statusColor: "text-red-600 bg-red-50",
      icon: <XCircleIcon className="w-5 h-5 text-red-600" />
    }
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600" />
          My Applications
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Track your job journey and AI match status.</p>
      </div>

      {/* Stats Cards for Applications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Applied</p>
          <h3 className="text-3xl font-black text-slate-800">12</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Interviews</p>
          <h3 className="text-3xl font-black text-blue-600">03</h3>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white">
          <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Avg. AI Match</p>
          <h3 className="text-3xl font-black">84%</h3>
        </div>
      </div>

      {/* Applications Table/List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-bold text-slate-700">Recent Applications</h3>
          <button className="text-xs font-bold text-blue-600 hover:underline">Download Report</button>
        </div>

        <div className="divide-y divide-slate-50">
          {applications.map((app) => (
            <div key={app.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm font-bold text-slate-400">
                  {app.company[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{app.company}</h4>
                  <p className="text-xs text-slate-500 font-medium">{app.role}</p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Applied On</p>
                <p className="text-xs font-bold text-slate-700">{app.date}</p>
              </div>

              <div className="flex items-center gap-8">
                {/* AI Match Score Badge */}
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-indigo-600 mb-1">
                    <SparklesIcon className="w-3 h-3" />
                    <span className="text-[10px] font-black">AI MATCH</span>
                  </div>
                  <p className="text-sm font-black text-slate-800">{app.aiScore}</p>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] ${app.statusColor}`}>
                  {app.icon}
                  {app.status}
                </div>

                <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;