

import React from 'react';
import { Briefcase, Star, MapPin, DollarSign, Clock, Search } from 'lucide-react';

const JobRecommendations = () => {
  // Sample Data (Baad mein ise API se replace kar sakte ho)
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Bangalore, India",
      salary: "15L - 25L LPA",
      type: "Full-time",
      matchScore: 95,
      posted: "2 days ago",
      tags: ["React", "Tailwind", "TypeScript"]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "Microsoft",
      location: "Remote",
      salary: "12L - 20L LPA",
      type: "Remote",
      matchScore: 88,
      posted: "1 week ago",
      tags: ["Node.js", "MongoDB", "React"]
    },
    {
      id: 3,
      title: "UI/UX Designer",
      company: "Adobe",
      location: "Noida, India",
      salary: "10L - 18L LPA",
      type: "Full-time",
      matchScore: 82,
      posted: "3 days ago",
      tags: ["Figma", "Adobe XD", "Prototyping"]
    }
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Openings</h1>
          <p className="text-slate-500 mt-1 font-medium">Top picks based on your AI resume analysis</p>
        </div>
        
        {/* Search Bar - Just for UI */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
            
            {/* Top Row */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/20">
                  {job.company[0]}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 font-semibold text-sm mt-1">{job.company}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  {job.matchScore}% Match
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> {job.posted}
                </span>
              </div>
            </div>

            {/* Details Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><MapPin size={16} className="text-blue-500" /></div>
                <span className="text-sm font-medium">{job.location}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><DollarSign size={16} className="text-green-500" /></div>
                <span className="text-sm font-medium">{job.salary}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><Briefcase size={16} className="text-purple-500" /></div>
                <span className="text-sm font-medium">{job.type}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {job.tags.map(tag => (
                <span key={tag} className="bg-blue-50/50 text-blue-700 px-4 py-1.5 rounded-xl text-xs font-bold border border-blue-100/50">
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button className="w-full bg-[#0f172a] hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2">
              View Details & Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;