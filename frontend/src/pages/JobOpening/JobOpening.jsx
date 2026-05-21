import React from 'react';
import { 
  Plus, Search, Briefcase, Users, Clock, 
  Filter, ExternalLink, MoreVertical, ChevronRight 
} from 'lucide-react';

const JobOpening = () => {
  // Mock data jo table mein dikhega
  const jobs = [
    { id: 1, title: "Frontend Developer", dept: "Engineering", type: "Full-time", applicants: 45, status: "Active", date: "2h ago" },
    { id: 2, title: "Node.js Backend", dept: "Engineering", type: "Full-time", applicants: 12, status: "Active", date: "5h ago" },
    { id: 3, title: "UI/UX Designer", dept: "Design", type: "Contract", applicants: 28, status: "Closed", date: "2d ago" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Openings</h1>
          <p className="text-slate-500 text-sm">Post new jobs and track incoming applications.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
          <Plus size={20} /> Create New Job
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl text-sm font-medium hover:bg-slate-100 transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Job Role</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{job.dept} • {job.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-800">{job.applicants}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Applied</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      job.status === 'Active' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm">
                        <ExternalLink size={16} />
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

export default JobOpening;