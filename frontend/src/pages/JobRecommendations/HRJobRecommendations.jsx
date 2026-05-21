

import React from 'react';
import { 
  Star, Search, Filter, Briefcase, User, 
  CheckCircle2, ArrowRight, TrendingUp, Zap, 
  Target, Award, Download
} from 'lucide-react';

const HRJobRecommendations = () => {
  // Top level stats for HR overview
  const matchingStats = [
    { label: 'Avg. Match Score', value: '84%', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Top Matches', value: '12', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Urgent Fills', value: '05', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Dummy Data for AI matching matrix
  const recommendations = [
    { id: 1, candidate: "Aman Verma", jobRole: "Sr. Java Developer", match: 95, skills: ["Spring Boot", "AWS"], status: "Strong Match" },
    { id: 2, candidate: "Priya Singh", jobRole: "React Architect", match: 88, skills: ["Next.js", "Redux"], status: "Good Match" },
    { id: 3, candidate: "Rahul Kumar", jobRole: "Backend Engineer", match: 72, skills: ["Node.js", "Docker"], status: "Potential" },
    { id: 4, candidate: "Neha Sharma", jobRole: "Full Stack Developer", match: 91, skills: ["TypeScript", "NestJS"], status: "Strong Match" },
    { id: 5, candidate: "Vikram Shah", jobRole: "DevOps Engineer", match: 85, skills: ["Kubernetes", "Terraform"], status: "Good Match" },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <Star className="text-amber-500" size={28} fill="currentColor" /> AI Recommendation Matrix
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Advanced skill-set mapping and candidate ranking system.</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all">
             <Download size={14} /> Export Matrix
           </button>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {matchingStats.map((s, i) => (
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

      {/* 3. SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-t-[32px] border-x border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search candidate by name or tech stack..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-700 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Sort Matrix:</span>
          <button className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all">
            <Filter size={14} /> Match Score
          </button>
          <button className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white hover:shadow-sm transition-all">
             Department
          </button>
        </div>
      </div>

      {/* 4. RECOMMENDATION TABLE */}
      <div className="bg-white rounded-b-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Candidate Profile</th>
                <th className="px-8 py-5">Target Job Role</th>
                <th className="px-8 py-5">AI Compatibility</th>
                <th className="px-8 py-5">Matrix Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recommendations.map((rec) => (
                <tr key={rec.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                        {rec.candidate.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-800 font-bold text-sm leading-tight">{rec.candidate}</p>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tighter">ID: #RE-00{rec.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                      <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                        <Briefcase size={12} className="text-slate-500" />
                      </div> 
                      {rec.jobRole}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-blue-600">{rec.match}% Match</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 shadow-sm ${rec.match > 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`} 
                          style={{ width: `${rec.match}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border
                      ${rec.status === 'Strong Match' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        rec.status === 'Good Match' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                        'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="inline-flex items-center gap-2 bg-slate-800 text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group/btn shadow-md hover:shadow-blue-200">
                      Review <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. FOOTER INFO */}
      <div className="mt-6 flex items-center gap-3 bg-white w-fit px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={14} className="text-emerald-600" />
        </div>
        <p className="text-[11px] text-slate-500 font-bold">
          AI scores are synchronized with live skill proficiency tests and keyword density analysis.
        </p>
      </div>
    </div>
  );
};

export default HRJobRecommendations;