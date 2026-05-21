import React, { useState } from 'react';
import { Tag, Search, Plus, Filter, X, CheckCircle2, TrendingUp } from 'lucide-react';

const SkillsAndTags = () => {
  // Dummy Data for Skills
  const [topSkills] = useState([
    { name: 'Java', count: 450, trend: '+12%', color: 'bg-blue-500' },
    { name: 'React.js', count: 320, trend: '+8%', color: 'bg-cyan-500' },
    { name: 'Python', count: 280, trend: '+15%', color: 'bg-indigo-500' },
    { name: 'Spring Boot', count: 190, trend: '+5%', color: 'bg-emerald-500' },
  ]);

  // HR Custom Tags
  const [hrTags, setHrTags] = useState([
    'Immediate Joiner', 'High Score', 'Under Review', 'Verified', 'Remote Only'
  ]);

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Tag className="text-blue-600" /> Skills & Tags Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage AI-extracted skills and your custom recruitment tags.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200">
          <Plus size={18} /> Create New Tag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: TOP SKILLS ANALYTICS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> Most Frequent Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topSkills.map((skill, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-lg text-white text-[10px] font-bold ${skill.color}`}>
                      {skill.name}
                    </span>
                    <span className="text-emerald-500 text-[10px] font-bold">{skill.trend}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-slate-800">{skill.count}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Resumes Found</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SKILL SEARCH & FILTER TABLE */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter skills..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100"><Filter size={18}/></button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Node.js', 'SQL', 'AWS', 'Docker', 'Angular', 'Next.js', 'PostgreSQL', 'Tailwind'].map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
                  <CheckCircle2 size={14} className="text-blue-500" />
                  <span className="text-xs font-bold text-slate-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: HR CUSTOM TAGS MANAGEMENT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recruitment Tags</h3>
            <p className="text-xs text-slate-400 mb-4 uppercase font-bold tracking-widest">Active Tags</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {hrTags.map((tag, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl group cursor-default transition-all hover:bg-blue-100">
                  <span className="text-xs font-bold">{tag}</span>
                  <X size={14} className="cursor-pointer hover:text-red-500" />
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Tags help HR categorize candidates beyond their skills. Use them for process tracking.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[24px] text-white shadow-xl">
            <h4 className="font-bold mb-2">AI Smart Tagging</h4>
            <p className="text-[11px] opacity-80 mb-4 leading-relaxed">
              Our AI automatically tags candidates based on their career gaps, experience level, and tech-stack match.
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/20">
              Configure AI Tags
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillsAndTags;