import React from 'react';
import { Trophy, Medal, Star, Flame, Search, ArrowUp } from 'lucide-react';

const Leaderboard = () => {
  const topPerformers = [
    { rank: 1, name: "Rahul Sharma", score: 98.2, level: "Expert", interviews: 24, trend: "up" },
    { rank: 2, name: "Sneha Kapoor", score: 96.5, level: "Expert", interviews: 18, trend: "up" },
    { rank: 3, name: "Arjun Mehta", score: 94.8, level: "Pro", interviews: 31, trend: "down" },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Global Leaderboard</h1>
          <p className="text-slate-500 text-sm font-medium">See where you stand among top candidates worldwide.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-2xl border border-amber-100">
          <Flame size={18} fill="currentColor" />
          <span className="font-bold text-sm">Top 5% This Week</span>
        </div>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {topPerformers.map((user, i) => (
          <div key={i} className={`relative p-6 rounded-[32px] border flex flex-col items-center text-center ${
            i === 0 ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl' : 'bg-white text-slate-800 border-slate-100'
          }`}>
            {i === 0 && <Trophy size={40} className="text-amber-400 mb-4" />}
            <div className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center text-xl font-black ${
              i === 0 ? 'bg-indigo-500' : 'bg-slate-100 text-slate-400'
            }`}>
              {user.name[0]}
            </div>
            <h3 className="font-bold">{user.name}</h3>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${i === 0 ? 'text-indigo-200' : 'text-slate-400'}`}>
              Rank #{user.rank} • {user.level}
            </p>
            <div className={`text-2xl font-black ${i === 0 ? 'text-white' : 'text-indigo-600'}`}>{user.score}%</div>
          </div>
        ))}
      </div>

      {/* List Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Rank</th>
              <th className="px-8 py-4">Candidate</th>
              <th className="px-8 py-4">Avg. AI Score</th>
              <th className="px-8 py-4">Interviews</th>
              <th className="px-8 py-4 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[4, 5, 6, 7].map((r) => (
              <tr key={r} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 font-bold text-slate-400 group-hover:text-indigo-600">#{r}</td>
                <td className="px-8 py-5 font-bold text-slate-700">Candidate_{r}02</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">85.4%</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-500">12 Sessions</td>
                <td className="px-8 py-5 text-right"><ArrowUp size={16} className="ml-auto text-emerald-500" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;