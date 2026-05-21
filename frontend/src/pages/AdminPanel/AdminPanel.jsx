


import React from 'react';
import { 
  Users, UserCheck, FileText, AlertCircle, 
  Search, Filter, MoreVertical, ExternalLink,
  Settings, Download, Trash2, ShieldCheck, Activity
} from 'lucide-react';

const AdminPanel = () => {
  // Stats Data with Professional White Theme Colors
  const stats = [
    { label: "Total Candidates", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Selected", value: "156", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Resumes Parsed", value: "3,420", icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Reviews", value: "42", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentUsers = [
    { id: 1, name: "Amit Sharma", role: "Frontend Dev", score: "92%", status: "Selected" },
    { id: 2, name: "Sneha Reddy", role: "Python Developer", score: "78%", status: "Pending" },
    { id: 3, name: "Rahul Verma", role: "UI/UX Designer", score: "85%", status: "Interviewing" },
    { id: 4, name: "Priya Das", role: "Data Scientist", score: "64%", status: "Rejected" },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            Admin Management <ShieldCheck size={24} className="text-blue-600" />
          </h1>
          <p className="text-sm text-slate-500 font-medium">Control system settings and monitor recruitment health.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all shadow-sm">
            <Download size={14} /> Export Report
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
            + Create New Job
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className="text-2xl font-black text-slate-800">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Recent Candidates Table */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-slate-800 font-bold text-base">Candidate Pipeline</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 w-40 md:w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-5">Candidate</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-center">Match</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-700">{user.name}</p>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-500">{user.role}</td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{user.score}</span>
                    </td>
                    <td className="px-8 py-5 text-xs">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        user.status === 'Selected' ? 'bg-emerald-100 text-emerald-700' :
                        user.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-slate-300 group-hover:text-blue-500 transition-colors p-1 rounded-lg hover:bg-blue-50">
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. System Health & Notes */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-slate-800 font-bold mb-6 text-sm flex items-center gap-2">
               <Activity size={18} className="text-blue-500" /> System Health
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wider">
                  <span className="text-slate-400">AI Efficiency</span>
                  <span className="text-blue-600">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[88%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wider">
                  <span className="text-slate-400">Database usage</span>
                  <span className="text-emerald-600">24%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[24%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-bold mb-3 text-base flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-200" /> Maintenance
            </h3>
            <p className="text-xs text-blue-50 leading-relaxed mb-6 font-medium">
              Server maintenance is scheduled for Sunday at 02:00 AM. System might be slow.
            </p>
            <button className="w-full bg-white text-blue-700 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-blue-50 active:scale-95 shadow-md">
              Acknowledge
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;