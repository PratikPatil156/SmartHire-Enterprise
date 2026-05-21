   

import React from 'react';
import { 
  Calendar, Clock, Video, MoreVertical, Search, Plus, 
  CheckCircle2, Timer, Filter, ExternalLink, User 
} from 'lucide-react';

const HRInterviews = () => {
  const stats = [
    { label: 'Scheduled Today', value: '08', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Feedback', value: '14', icon: Timer, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Hired This Month', value: '24', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const interviews = [
    { id: 1, name: "Aman Verma", role: "Java Developer", time: "10:30 AM", date: "Today", type: "Google Meet", status: "Upcoming", rating: "4.5" },
    { id: 2, name: "Priya Singh", role: "React Architect", time: "01:00 PM", date: "Today", type: "Zoom", status: "In Progress", rating: "-" },
    { id: 3, name: "Rahul Kumar", role: "Backend Engineer", time: "04:30 PM", date: "Tomorrow", type: "In-Person", status: "Upcoming", rating: "3.8" },
    { id: 4, name: "Neha Sharma", role: "Full Stack", time: "11:00 AM", date: "25 Oct", type: "Microsoft Teams", status: "Completed", rating: "4.2" },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* 1. COMPACT HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <Calendar className="text-blue-600" size={28} /> Interview Dashboard
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Efficiently track and manage your recruitment pipeline.</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95">
          <Plus size={16} /> Schedule Interview
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
            <div className={`p-4 rounded-2xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-800">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-t-[32px] border-x border-t border-slate-100 flex items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search candidates or job roles..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 font-medium transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all">
          <Filter size={14} /> Filter Agenda
        </button>
      </div>

      {/* 4. COMPACT DATA TABLE */}
      <div className="bg-white rounded-b-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Candidate Details</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Platform</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5">AI Score</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {interviews.map((int) => (
                <tr key={int.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                        {int.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold text-sm leading-tight">{int.name}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">{int.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-slate-700 text-xs font-black">{int.date}</div>
                    <div className="text-blue-500 text-[10px] font-bold mt-0.5">{int.time}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                        <Video size={14} className="text-slate-400" />
                      </div>
                      {int.type}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                      ${int.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        int.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                        'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                      {int.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-black text-slate-700 border border-slate-100">
                      <StarRating score={int.rating} />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100" title="Join Meeting">
                         <ExternalLink size={16} />
                       </button>
                       <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all bg-white border border-slate-100">
                         <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper component for star icons
const StarRating = ({ score }) => (
  <span className="flex items-center gap-1 text-amber-500">
    <span className="text-slate-700">⭐</span> {score}
  </span>
);

export default HRInterviews;