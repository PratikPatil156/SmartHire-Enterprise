import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Search, Filter, ArrowUpRight, 
  CheckCircle2, Clock, AlertCircle, FileText,
  Download, MoreVertical, Star, X, Loader2, RefreshCw
} from 'lucide-react';
import { appsService } from '../../services/api';

const HRResumeAnalysis = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await appsService.getAll();
      setCandidates(data);
    } catch (error) {
      console.error("Error loading candidate resume analyses:", error);
      showToast("Failed to load candidate resume analyses.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border border-emerald-100";
    if (score >= 50) return "text-blue-600 bg-blue-50 border border-blue-100";
    return "text-red-600 bg-red-50 border border-red-100";
  };

  const getMatchStatus = (score) => {
    if (score >= 85) return "Strong Match";
    if (score >= 50) return "Good Match";
    return "Low Match";
  };

  // CSV Report Exporter
  const exportToCSV = () => {
    if (filteredCandidates.length === 0) {
      showToast("No analysis reports to export.", "error");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Candidate Email,Applied For,AI Match Score,Match Fit,Skills Extracted,Status\n";
    
    filteredCandidates.forEach(item => {
      const row = [
        `"${item.candidate_name.replace(/"/g, '""')}"`,
        `"${item.candidate_email.replace(/"/g, '""')}"`,
        `"${item.job_title.replace(/"/g, '""')}"`,
        `${item.ai_score}%`,
        `"${getMatchStatus(item.ai_score)}"`,
        `"${item.skills ? item.skills.join(", ").replace(/"/g, '""') : ""}"`,
        `"${item.status}"`
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smarthire_resume_analysis_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Resume analysis report exported successfully!", "success");
  };

  const uniqueRoles = Array.from(new Set(candidates.map(c => c.job_title).filter(Boolean))).sort();

  const filteredCandidates = candidates.filter((person) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      person.candidate_name?.toLowerCase().includes(query) || 
      person.job_title?.toLowerCase().includes(query) ||
      (person.skills || []).some(s => s.toLowerCase().includes(query));
      
    const matchesRole = selectedRole === "All" || person.job_title === selectedRole;
    
    const matchesScore = 
      scoreFilter === "All" ||
      (scoreFilter === "Top" && (person.ai_score || 0) >= 85) ||
      (scoreFilter === "Second" && (person.ai_score || 0) < 85);
      
    return matchesSearch && matchesRole && matchesScore;
  });

  // Dynamic Statistics Math based on filtered candidate list
  const totalAnalyzed = filteredCandidates.length;
  const avgMatchScore = totalAnalyzed > 0 
    ? Math.round(filteredCandidates.reduce((sum, c) => sum + (c.ai_score || 0), 0) / totalAnalyzed) 
    : 0;
  const topCandidatesCount = filteredCandidates.filter(c => (c.ai_score || 0) >= 85).length;
  const secondCandidatesCount = filteredCandidates.filter(c => (c.ai_score || 0) < 85).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      
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
            Comparing uploaded resumes against job requirements using LLM parsing.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchCandidates}
            className="bg-white text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95 animate-in fade-in"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Analyzed</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">{String(totalAnalyzed).padStart(2, '0')}</h2>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <ArrowUpRight size={14} /> Live database records
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Avg. Match Score</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">{avgMatchScore}%</h2>
          <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${avgMatchScore}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Top Candidates</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">{String(topCandidatesCount).padStart(2, '0')}</h2>
          <p className="text-slate-400 text-xs font-medium mt-4">Scored above 85%</p>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Potential Matches</p>
          <h2 className="text-3xl font-black text-slate-800 mt-2">{String(secondCandidatesCount).padStart(2, '0')}</h2>
          <p className="text-slate-400 text-xs font-medium mt-4">Scored below 85%</p>
        </div>
      </div>

      {/* --- FILTERS & TABLE --- */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, role or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500/40 focus:bg-white focus:ring-4 focus:ring-blue-500/5 shadow-sm transition-all duration-300" 
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            >
              <option value="All">All Applied Roles</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold text-xs outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            >
              <option value="All">All Fit Levels</option>
              <option value="Top">Top Match (≥ 85%)</option>
              <option value="Second">Potential Matches (&lt; 85%)</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-400 text-sm font-bold tracking-tight">Recalculating ATS screening scores...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Score</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied Role</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Skills</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Fit</th>
                    <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Application</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCandidates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold uppercase shadow-sm">
                            {item.candidate_name ? item.candidate_name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.candidate_name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Applied {formatDate(item.applied_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className={`inline-flex items-center px-3 py-1 rounded-lg font-black text-xs ${getScoreColor(item.ai_score)}`}>
                          {item.ai_score}%
                        </div>
                      </td>
                      <td className="p-5 text-sm font-bold text-slate-600">{item.job_title}</td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-1 max-w-[280px]">
                          {(item.skills || []).slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold uppercase tracking-tight">
                              {skill}
                            </span>
                          ))}
                          {(!item.skills || item.skills.length === 0) && (
                            <span className="text-[10px] text-slate-400 italic">No skills listed</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          {item.ai_score >= 85 ? (
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                          ) : (
                            <Clock size={14} className="text-slate-400" />
                          )}
                          {getMatchStatus(item.ai_score)}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                          item.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                          item.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                          item.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-16 text-slate-400 font-semibold text-sm">
                        No candidate resume analysis reports found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {filteredCandidates.map((item) => (
                <div key={item.id} className="bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/60 space-y-4 text-left">
                  {/* Header: Candidate details & AI Score */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 font-bold uppercase shadow-sm border border-slate-150">
                        {item.candidate_name ? item.candidate_name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.candidate_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Applied {formatDate(item.applied_at)}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg font-black text-xs shrink-0 ${getScoreColor(item.ai_score)}`}>
                      {item.ai_score}%
                    </div>
                  </div>

                  {/* Applied Role & Match Status */}
                  <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Applied Role</p>
                      <p className="font-bold text-slate-700 mt-0.5">{item.job_title}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Status Fit</p>
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 mt-0.5">
                        {item.ai_score >= 85 ? (
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                        ) : (
                          <Clock size={12} className="text-slate-400" />
                        )}
                        <span>{getMatchStatus(item.ai_score)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Skills */}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-1.5">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {(item.skills || []).slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[9px] bg-white border border-slate-150 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">
                          {skill}
                        </span>
                      ))}
                      {(!item.skills || item.skills.length === 0) && (
                        <span className="text-[10px] text-slate-400 italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Application Status Badge */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Application Status</span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                      item.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                      item.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                      item.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
              {filteredCandidates.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No candidate resume analysis reports found.
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

export default HRResumeAnalysis;