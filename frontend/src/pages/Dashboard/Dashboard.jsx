

import React from 'react';
import { 
  Eye, Plus, UserCheck, Calendar, X, Menu, Search, Bell, ChevronDown, 
  Users, FileText, Clock, ChevronRight, BriefcaseBusiness
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// --- DATA ---
const graphData = [
  { name: '1 May', uploaded: 110, shortlisted: 25 },
  { name: '4 May', uploaded: 165, shortlisted: 50 },
  { name: '8 May', uploaded: 145, shortlisted: 45 },
  { name: '12 May', uploaded: 210, shortlisted: 90 },
  { name: '15 May', uploaded: 185, shortlisted: 80 },
  { name: '19 May', uploaded: 145, shortlisted: 55 },
  { name: '22 May', uploaded: 235, shortlisted: 95 },
  { name: '26 May', uploaded: 198, shortlisted: 75 },
  { name: '29 May', uploaded: 225, shortlisted: 92 },
];

const pieData = [
  { name: 'Java', value: 28, color: '#2563eb' },
  { name: 'Spring Boot', value: 20, color: '#10b981' },
  { name: 'SQL', value: 15, color: '#8b5cf6' },
  { name: 'React.js', value: 12, color: '#f43f5e' },
  { name: 'Python', value: 10, color: '#fbbf24' },
  { name: 'Others', value: 15, color: '#94a3b8' },
];

const stats = [
  { title: 'Total Candidates', value: '1,248', growth: '+18%', icon: <Users size={20} />, bg: 'bg-blue-50 text-blue-600' },
  { title: 'Screened Resumes', value: '842', growth: '+24%', icon: <FileText size={20} />, bg: 'bg-emerald-50 text-emerald-600' },
  { title: 'Shortlisted', value: '153', growth: '+15%', icon: <UserCheck size={20} />, bg: 'bg-purple-50 text-purple-600' },
  { title: 'Interview Scheduled', value: '45', growth: '+10%', icon: <Calendar size={20} />, bg: 'bg-orange-50 text-orange-600' },
];

const candidates = [
  { name: 'Aman Verma', email: 'amanverma@email.com', role: 'Java Developer', score: '92%', status: 'Shortlisted', statusClass: 'bg-emerald-50 text-emerald-600', scoreClass: 'text-emerald-500', skills: ['☕', '🍃', '🛢️'] },
  { name: 'Priya Singh', email: 'priyasingh@email.com', role: 'Backend Developer', score: '85%', status: 'Shortlisted', statusClass: 'bg-emerald-50 text-emerald-600', scoreClass: 'text-emerald-500', skills: ['☕', '🍃', '🛢️'] },
  { name: 'Rahul Kumar', email: 'rahulkumar@email.com', role: 'Software Engineer', score: '72%', status: 'Under Review', statusClass: 'bg-amber-50 text-amber-600', scoreClass: 'text-amber-500', skills: ['☕', '🛢️', '⚛️'] },
  { name: 'Neha Sharma', email: 'nehasharma@email.com', role: 'Full Stack Developer', score: '68%', status: 'Under Review', statusClass: 'bg-amber-50 text-amber-600', scoreClass: 'text-amber-500', skills: ['⚛️', '🍃', '🛢️'] },
  { name: 'Vikram Patel', email: 'vikrampatel@email.com', role: 'Java Developer', score: '45%', status: 'Rejected', statusClass: 'bg-rose-50 text-rose-600', scoreClass: 'text-rose-500', skills: ['☕', '🍃', '🛢️'] },
];

const activities = [
  { icon: <Plus size={16} />, title: 'New resume uploaded', sub: 'Aman Verma applied for Java Developer', time: '2 min ago', color: 'bg-blue-50 text-blue-600' },
  { icon: <UserCheck size={16} />, title: 'Resume shortlisted', sub: 'Priya Singh shortlisted for Backend Developer', time: '15 min ago', color: 'bg-emerald-50 text-emerald-600' },
  { icon: <Calendar size={16} />, title: 'Interview scheduled', sub: 'Rahul Kumar interview scheduled', time: '1 hour ago', color: 'bg-purple-50 text-purple-600' },
  { icon: <X size={16} />, title: 'Candidate rejected', sub: 'Vikram Patel not matched for Java Developer', time: '2 hours ago', color: 'bg-rose-50 text-rose-600' },
];

const Dashboard = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pb-10">
      
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between ">
        <div className="flex items-center gap-8 flex-1">
          <Menu className="text-slate-400 cursor-pointer hover:text-slate-600" size={20} />
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates, skills..." 
              className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full">
            <Bell className="text-slate-500" size={22} />
            <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">3</span>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all">
            <img src="https://ui-avatars.com/api/?name=HR+Admin&background=0D8ABC&color=fff" className="w-9 h-9 rounded-full object-cover" alt="Profile" />
            <div className="hidden md:block">
              <p className="text-[13px] font-bold text-slate-800 leading-tight">HR Admin</p>
              <p className="text-[11px] text-slate-400">Admin</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto">
        
        {/* STATS CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className={`${item.bg} p-3 rounded-[15px]`}>{item.icon}</div>
                <p className="text-slate-500 text-[13px] font-medium">{item.title}</p>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold text-slate-800">{item.value}</h2>
                <span className="text-emerald-500 text-[12px] font-bold pb-1">{item.growth} <span className="text-slate-400 font-normal ml-1">from last month</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 1: GRAPH & PIE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column: Area Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-6 text-[16px]">Resume Screening Analytics</h3>
            <div className="flex gap-6 mb-6 text-[12px] font-medium">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span> Resumes Uploaded
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Shortlisted
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData}>
                  <defs>
                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="uploaded" stroke="#2563eb" strokeWidth={3} fill="url(#colorUp)" dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
                  <Area type="monotone" dataKey="shortlisted" stroke="#10b981" strokeWidth={3} fill="url(#colorShort)" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Perfect Circular Pie Chart (Fix as per image_fcd483.png) */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
            <h3 className="font-bold text-slate-800 mb-6 text-[16px]">Top Skills In Demand</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 flex-1">
              {/* Chart Wrapper - Fixed Square size for perfect circle */}
              <div className="w-[200px] h-[200px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      innerRadius={65} 
                      outerRadius={90} 
                      paddingAngle={4} 
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Side Legends */}
              <div className="flex-1 w-full flex flex-col gap-3">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[12px] font-bold">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-slate-500">{item.name}</span>
                    </div>
                    <span className="text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: RECENT CANDIDATES & ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <h3 className="font-bold text-slate-800 mb-6">Recent Candidates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-50">
                      <th className="pb-4 pl-2">Candidate</th>
                      <th className="pb-4">Job Role</th>
                      <th className="pb-4 text-center">Match Score</th>
                      <th className="pb-4 text-center">Skills</th>
                      <th className="pb-4 text-center">Status</th>
                      <th className="pb-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {candidates.map((c, i) => (
                      <tr key={i} className="group hover:bg-slate-50 transition-all duration-200">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} className="w-9 h-9 rounded-full" alt="" />
                            <div>
                              <div className="text-[13px] font-bold text-slate-800 leading-none mb-1">{c.name}</div>
                              <div className="text-[11px] text-slate-400">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-[13px] text-slate-600 font-medium">{c.role}</td>
                        <td className={`py-4 text-center text-[13px] font-bold ${c.scoreClass}`}>{c.score}</td>
                        <td className="py-4">
                          <div className="flex justify-center gap-2">
                            {c.skills.map((s, idx) => (
                              <div key={idx} className="w-7 h-7 bg-slate-50 rounded-full flex items-center justify-center text-[14px] shadow-sm border border-white">
                                {s}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block w-24 ${c.statusClass}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button className="w-full py-4 bg-slate-50 text-blue-600 text-[13px] font-bold hover:bg-blue-100 transition-colors border-t border-slate-100 flex items-center justify-center gap-2 group">
              View all candidates <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-6 flex-1">
              <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {activities.map((a, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    {i !== activities.length - 1 && (
                      <div className="absolute left-[19px] top-10 w-[2px] h-[calc(100%-10px)] bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
                    )}
                    <div className={`${a.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border-4 border-white`}>
                      {a.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-[13px] font-bold text-slate-800">{a.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{a.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{a.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-4 bg-slate-50 text-blue-600 text-[13px] font-bold hover:bg-blue-100 transition-colors border-t border-slate-100 flex items-center justify-center gap-2 group">
              View all activity <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

