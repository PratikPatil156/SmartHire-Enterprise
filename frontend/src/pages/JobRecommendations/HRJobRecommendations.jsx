import React, { useState, useEffect } from 'react';
import { 
  Star, Search, Filter, Briefcase, User, 
  CheckCircle2, ArrowRight, Target, Award, Download,
  Loader2, X, AlertCircle
} from 'lucide-react';
import { appsService } from '../../services/api';

const HRJobRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("match"); // "match" | "name"
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await appsService.getAll();
      setRecommendations(data);
    } catch (error) {
      console.error("Error loading recommendation matrix:", error);
      showToast("Failed to load recommendation matrix.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const getMatchStatus = (score) => {
    if (score >= 85) return "Strong Match";
    if (score >= 50) return "Good Match";
    return "Potential";
  };

  const getStatusStyle = (status) => {
    const s = getMatchStatus(status);
    if (s === 'Strong Match') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (s === 'Good Match') return 'bg-blue-50 text-blue-700 border-blue-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

  // CSV Exporter
  const exportToCSV = () => {
    if (filteredRecs.length === 0) {
      showToast("No matrix data to export.", "error");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Candidate Email,Target Job Role,AI Compatibility,Match Level,Status\n";
    
    filteredRecs.forEach(rec => {
      const row = [
        `"${rec.candidate_name.replace(/"/g, '""')}"`,
        `"${rec.candidate_email.replace(/"/g, '""')}"`,
        `"${rec.job_title.replace(/"/g, '""')}"`,
        `${rec.ai_score}%`,
        `"${getMatchStatus(rec.ai_score)}"`,
        `"${rec.status}"`
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smarthire_ai_recommendation_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("AI Recommendations Matrix exported successfully!", "success");
  };

  const filteredRecs = recommendations
    .filter(rec => 
      rec.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === "match") {
        return (b.ai_score || 0) - (a.ai_score || 0);
      }
      return a.candidate_name?.localeCompare(b.candidate_name);
    });

  // Top level stats computed dynamically
  const totalCount = recommendations.length;
  const avgMatchScore = totalCount > 0 
    ? Math.round(recommendations.reduce((sum, c) => sum + (c.ai_score || 0), 0) / totalCount) 
    : 0;
  const topMatchesCount = recommendations.filter(c => (c.ai_score || 0) >= 85).length;
  // Unique job titles counting as active filters
  const uniqueJobsCount = new Set(recommendations.map(c => c.job_title)).size;

  const matchingStats = [
    { label: 'Avg. Match Score', value: `${avgMatchScore}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Top Matches', value: String(topMatchesCount).padStart(2, '0'), icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Roles', value: String(uniqueJobsCount).padStart(2, '0'), icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <Star className="text-amber-500" size={28} fill="currentColor" /> AI Recommendation Matrix
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Advanced skill-set mapping and candidate ranking system.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
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
            placeholder="Search candidates by name or tech skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-700 font-semibold"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Sort Matrix:</span>
          <button 
            onClick={() => setSortOrder("match")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sortOrder === "match" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 bg-slate-50 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            Match Score
          </button>
          <button 
            onClick={() => setSortOrder("name")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sortOrder === "name" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 bg-slate-50 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            Name A-Z
          </button>
        </div>
      </div>

      {/* 4. RECOMMENDATION TABLE */}
      <div className="bg-white rounded-b-[32px] border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-400 text-sm font-bold tracking-tight">Loading AI compatibility matrix...</p>
          </div>
        ) : (
          <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5">Candidate Profile</th>
                          <th className="px-8 py-5">Target Job Role</th>
                          <th className="px-8 py-5">AI Compatibility</th>
                          <th className="px-8 py-5">Matrix Status</th>
                          <th className="px-8 py-5 text-right">Pipeline Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredRecs.map((rec) => (
                          <tr key={rec.id} className="hover:bg-blue-50/30 transition-all group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                                  {rec.candidate_name ? rec.candidate_name.charAt(0) : "?"}
                                </div>
                                <div>
                                  <p className="text-slate-800 font-bold text-sm leading-tight">{rec.candidate_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                                <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                  <Briefcase size={12} className="text-slate-500" />
                                </div> 
                                {rec.job_title}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-2 min-w-[140px]">
                                <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-black text-blue-600">{rec.ai_score}% Match</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-[1px]">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 shadow-sm ${rec.ai_score > 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`} 
                                    style={{ width: `${rec.ai_score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(rec.ai_score)}`}>
                                {getMatchStatus(rec.ai_score)}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                                rec.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                                rec.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                                rec.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-blue-50 text-blue-700 border-blue-100'
                              }`}>
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {filteredRecs.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-16 text-slate-400 font-semibold text-sm">
                              No matching records found in recommendation matrix.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                    {filteredRecs.map((rec) => (
                      <div key={rec.id} className="bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/60 space-y-4 text-left">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm shrink-0">
                              {rec.candidate_name ? rec.candidate_name.charAt(0) : "?"}
                            </div>
                            <div>
                              <p className="text-slate-800 font-bold text-sm leading-tight">{rec.candidate_name}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 ${getStatusStyle(rec.ai_score)}`}>
                            {getMatchStatus(rec.ai_score)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Target Job Role</p>
                            <p className="font-bold text-slate-700 mt-0.5">{rec.job_title}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Pipeline Status</p>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                              rec.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                              rec.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                              rec.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {rec.status}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>AI Compatibility</span>
                            <span className="text-blue-600 font-black">{rec.ai_score}% Match</span>
                          </div>
                          <div className="w-full bg-white border border-slate-200 h-2 rounded-full overflow-hidden p-[1px]">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 shadow-sm ${rec.ai_score > 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'}`} 
                              style={{ width: `${rec.ai_score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredRecs.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs italic">
                        No matching records found in recommendation matrix.
                      </div>
                    )}
                  </div>
          </>
        )}
      </div>



      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-4 p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default HRJobRecommendations;