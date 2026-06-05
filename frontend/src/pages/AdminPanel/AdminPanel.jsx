import React, { useState, useEffect } from 'react';
import { 
  Users, UserCheck, FileText, AlertCircle, 
  Search, Filter, ExternalLink, Download, 
  Trash2, ShieldCheck, Activity, X, Loader2, CheckCircle2
} from 'lucide-react';
import { appsService } from '../../services/api';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const data = await appsService.getAll();
      setApplications(data);
    } catch (error) {
      console.error("Error loading admin pipeline:", error);
      showToast("Failed to load recruitment health stats.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Exporter for candidates report
  const exportReport = () => {
    if (filteredApps.length === 0) {
      showToast("No pipeline records to export.", "error");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Candidate Email,Applied For,AI Match Score,Pipeline Status,Applied Date\n";
    
    filteredApps.forEach(app => {
      const row = [
        `"${app.candidate_name.replace(/"/g, '""')}"`,
        `"${app.candidate_email.replace(/"/g, '""')}"`,
        `"${app.job_title.replace(/"/g, '""')}"`,
        `${app.ai_score}%`,
        `"${app.status}"`,
        `"${app.applied_at || "Recently"}"`
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smarthire_recruitment_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Recruitment report exported successfully!", "success");
  };

  const filteredApps = applications.filter(app => 
    app.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Statistics Calculations
  const totalCandidates = applications.length;
  const hiredCount = applications.filter(a => a.status?.toLowerCase() === 'hired').length;
  const parsedCount = applications.length; // Active resume pipelines
  const pendingCount = applications.filter(a => a.status?.toLowerCase() === 'applied').length;
  
  // Precise database usage percentage (limit: 10,000)
  const dbUsagePct = ((applications.length / 10000) * 100).toFixed(2);
  const dbBarWidth = Math.max(1, (applications.length / 10000) * 100);

  const stats = [
    { label: "Total Candidates", value: String(totalCandidates), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Hired / Placed", value: String(hiredCount), icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Resumes Parsed", value: String(parsedCount), icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Reviews", value: String(pendingCount), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  // AI Parsing Speed metrics (average processing speed per PDF)
  const parseSpeed = 1.1;
  const parseSpeedPct = 92; // Peak engine capacity representation

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            Admin Management <ShieldCheck size={24} className="text-blue-600" />
          </h1>
          <p className="text-sm text-slate-500 font-medium">Control system settings and monitor recruitment health.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportReport}
            className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Download size={14} /> Export Report
          </button>
          <button 
            onClick={() => window.location.href = '/jobopening'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95 animate-in fade-in"
          >
            + Create New Job
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${item.bg} ${item.color} shrink-0`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className="text-2xl font-black text-slate-800 leading-none">{item.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-slate-500 text-sm font-semibold">Aggregating platform pipelines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 3. Recent Candidates Table */}
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-slate-800 font-bold text-base">Candidate Pipeline</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Quick search pipeline..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-blue-500/10 w-40 md:w-64 font-semibold text-slate-700 transition-all"
                  />
                </div>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
                      <th className="px-8 py-5">Candidate</th>
                      <th className="px-8 py-5">Role</th>
                      <th className="px-8 py-5 text-center">Match</th>
                      <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredApps.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-700">{user.candidate_name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{user.candidate_email}</p>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500">{user.job_title}</td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100/50">{user.ai_score}%</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide border ${
                            user.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' :
                            user.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                            user.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-slate-400 font-semibold text-sm">
                          No candidates found in pipeline.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                {filteredApps.map((user) => (
                  <div key={user.id} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 space-y-3 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{user.candidate_name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{user.candidate_email}</p>
                      </div>
                      <span className="text-xs font-black text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-slate-150 shrink-0">{user.ai_score}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Target Role</p>
                        <p className="font-bold text-slate-700">{user.job_title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Status</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                          user.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' :
                          user.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                          user.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredApps.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs italic">
                    No candidates found in pipeline.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. System Health & Notes */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-slate-800 font-bold mb-6 text-sm flex items-center gap-2">
                 <Activity size={18} className="text-blue-500" /> System Health
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wider">
                    <span className="text-slate-400">AI Resume Parsing Speed</span>
                    <span className="text-blue-600">{parseSpeed}s</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${parseSpeedPct}%` }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase tracking-wider">
                    <span className="text-slate-400">MySQL Database usage</span>
                    <span className="text-emerald-600">{dbUsagePct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${dbBarWidth}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

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

export default AdminPanel;