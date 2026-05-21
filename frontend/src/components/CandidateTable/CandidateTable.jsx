import React from 'react';
import { User, FileText, CheckCircle, XCircle } from 'lucide-react';

const CandidateTable = () => {
  // Mock data for candidates
  const candidates = [
    { id: 1, name: "Aman Verma", role: "React Developer", score: "92%", status: "Shortlisted" },
    { id: 2, name: "Sneha Rao", role: "UI Designer", score: "85%", status: "Pending" },
    { id: 3, name: "Rahul Singh", role: "Java Developer", score: "45%", status: "Rejected" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Role</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Score</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {candidates.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {c.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{c.name}</span>
                </div>
              </td>
              <td className="p-4 text-sm text-slate-600">{c.role}</td>
              <td className="p-4">
                <span className={`text-sm font-bold ${parseInt(c.score) > 70 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {c.score}
                </span>
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  c.status === "Shortlisted" ? "bg-emerald-50 text-emerald-600" : 
                  c.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {c.status}
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 text-xs font-bold hover:underline">View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// YEH LINE MISSING HOGI, ISE ZAROOR DAALEIN:
export default CandidateTable;