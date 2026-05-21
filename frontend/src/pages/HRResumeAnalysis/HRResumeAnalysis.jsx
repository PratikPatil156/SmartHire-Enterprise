import React, { useState } from 'react';
import { 
  BarChart3, Search, Filter, ArrowUpRight, 
  CheckCircle2, Clock, AlertCircle, FileText,
  Download, MoreVertical, Star
} from 'lucide-react';

const HRResumeAnalysis = () => {
  // Dummy Data for Analysis Results
  const [candidates] = useState([
    { id: 1, name: "Aman Verma", score: 92, skills: ["React", "Node.js", "AWS"], exp: "5 Years", status: "Strong Match" },
    { id: 2, name: "Priya Singh", score: 85, skills: ["Python", "Django", "SQL"], exp: "3 Years", status: "Good Match" },
    { id: 3, name: "Rahul Kumar", score: 45, skills: ["Java", "C++"], exp: "1 Year", status: "Low Match" },
    { id: 4, name: "Sneha Reddy", score: 78, skills: ["UI/UX", "Figma", "Tailwind"], exp: "4 Years", status: "Good Match" },
  ]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50";
    if (score >= 50) return "text-blue-600 bg-blue-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            AI Resume Analysis
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 ml-11">
            Comparing uploaded resumes against job requirements using LLM.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Analyzed</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">128</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <ArrowUpRight size={14} /> +12% from last batch
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Avg. Match Score</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">74%</h2>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[74%]"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Top Candidates</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">12</h2>
          <p className="text-slate-400 text-xs font-medium mt-4">Scored above 85%</p>
        </div>
      </div>

      {/* --- FILTERS & TABLE --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by name or skill..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium" />
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-white transition-all"><Filter size={18} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Score</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Skills</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidates.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Applied 2h ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className={`inline-flex items-center px-3 py-1 rounded-lg font-black text-xs ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </div>
                  </td>
                  <td className="p-5 text-sm font-bold text-slate-600">{item.exp}</td>
                  <td className="p-5">
                    <div className="flex gap-1">
                      {item.skills.map((skill, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      {item.score > 80 ? <Star size={14} className="text-amber-400 fill-amber-400" /> : <Clock size={14} className="text-slate-400" />}
                      {item.status}
                    </div>
                  </td>
                  <td className="p-5">
                    <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                      View Profile <ArrowUpRight size={14} />
                    </button>
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

export default HRResumeAnalysis;