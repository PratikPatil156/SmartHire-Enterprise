import React from 'react';
import { Search, User, Mail, FileText, Download, Filter, CheckCircle, XCircle } from 'lucide-react';

const Candidates = () => {
  const candidatesList = [
    { id: 1, name: "Rahul Sharma", email: "rahul@example.com", job: "Frontend Developer", score: "85%", status: "Shortlisted" },
    { id: 2, name: "Priya Patel", email: "priya@example.com", job: "UI/UX Designer", score: "92%", status: "Hired" },
    { id: 3, name: "Amit Kumar", email: "amit@example.com", job: "Python Developer", score: "45%", status: "Rejected" },
  ];

  return (
    <div className="p-2 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500 text-sm">Review and manage all job applications.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
          />
        </div>
        <button className="px-5 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-2xl font-medium hover:bg-slate-100 transition-all flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Applied For</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">AI Score</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {candidatesList.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{person.name}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1"><Mail size={12}/> {person.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm text-slate-600 font-medium">{person.job}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col items-center">
                    <span className={`text-sm font-bold ${parseInt(person.score) > 70 ? 'text-green-600' : 'text-orange-500'}`}>
                      {person.score}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                    person.status === 'Hired' ? 'bg-green-100 text-green-700' : 
                    person.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="p-2 hover:bg-blue-50 rounded-xl text-blue-600 transition-all">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Candidates;