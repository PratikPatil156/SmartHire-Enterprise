import React from 'react';
import { 
  BookmarkIcon, 
  SparklesIcon, 
  TrashIcon, 
  BriefcaseIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const SavedJobs = () => {
  const savedJobs = [
    {
      id: 1,
      company: "Microsoft",
      role: "Full Stack Developer",
      location: "Bangalore (Remote)",
      salary: "₹18L - ₹25L",
      matchScore: 95,
      deadline: "2 days left",
      posted: "3 days ago"
    },
    {
      id: 2,
      company: "Netflix",
      role: "UI/UX Designer",
      location: "Mumbai",
      salary: "₹12L - ₹18L",
      matchScore: 82,
      deadline: "5 days left",
      posted: "1 week ago"
    },
    {
      id: 3,
      company: "Adobe",
      role: "React Engineer",
      location: "Noida",
      salary: "₹15L - ₹22L",
      matchScore: 68,
      deadline: "Starts Soon",
      posted: "Just now"
    }
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <BookmarkIcon className="w-6 h-6 text-indigo-600" />
            </div>
            Saved Opportunities
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Jobs you liked. Apply before the deadline for the best AI match.
          </p>
        </div>
        <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
          <TrashIcon className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {savedJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
            
            {/* AI Match Badge (Top Right) */}
            <div className="absolute top-0 right-0 bg-indigo-600 text-white px-6 py-2 rounded-bl-[24px] flex items-center gap-2 shadow-lg">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-xs font-black">{job.matchScore}% Match</span>
            </div>

            <div className="flex gap-5 mb-6">
              {/* Company Logo Placeholder */}
              <div className="w-16 h-16 bg-slate-50 rounded-[22px] border border-slate-100 flex items-center justify-center text-xl font-black text-slate-300 group-hover:scale-105 transition-transform">
                {job.company[0]}
              </div>
              
              <div className="pt-1">
                <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {job.role}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <span className="flex items-center gap-1"><BriefcaseIcon className="w-3 h-3" /> {job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>

            {/* Job Details Bar */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Salary</p>
                <p className="text-sm font-bold text-slate-700">{job.salary}</p>
              </div>
              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100/50">
                <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1 text-right">Deadline</p>
                <p className="text-sm font-bold text-rose-600 text-right flex items-center justify-end gap-1">
                  <ClockIcon className="w-3.5 h-3.5" /> {job.deadline}
                </p>
              </div>
            </div>

            {/* Match Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">AI Profile Match</span>
                <span className="text-[10px] font-black text-indigo-600">{job.matchScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                  style={{ width: `${job.matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-indigo-200 transition-all active:scale-95">
                Apply Now
              </button>
              <button className="p-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;