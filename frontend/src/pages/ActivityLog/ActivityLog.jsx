import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, UserPlus, FileText, 
  CheckCircle2, XCircle, Clock, Calendar, MoreHorizontal,
  ArrowUpRight, Download, Trash2, ShieldAlert, Zap,
  X, Loader2, AlertCircle
} from 'lucide-react';
import { logsService } from '../../services/api';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  
  // Custom Clear Confirmation Modal state
  const [isOpenClearModal, setIsOpenClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await logsService.getAll();
      setActivities(data);
    } catch (error) {
      console.error("Error loading activity logs:", error);
      showToast("Failed to load activity audit trail.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    setIsClearing(true);
    try {
      await logsService.clear();
      showToast("All activity audit logs cleared successfully!", "success");
      setActivities([]);
      setIsOpenClearModal(false);
    } catch (error) {
      showToast(error.message || error || "Failed to clear audit trail.", "error");
    } finally {
      setIsClearing(false);
    }
  };

  // CSV Compiler
  const exportToCSV = () => {
    if (filteredActivities.length === 0) {
      showToast("No logs available to export.", "error");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Relative Time,User,Role,Action,Target,Type,Details\n";
    
    filteredActivities.forEach(item => {
      const row = [
        item.id,
        item.time,
        `"${item.user.replace(/"/g, '""')}"`,
        `"${item.role.replace(/"/g, '""')}"`,
        `"${item.action.replace(/"/g, '""')}"`,
        `"${item.target.replace(/"/g, '""')}"`,
        `"${item.type.replace(/"/g, '""')}"`,
        `"${item.details.replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smarthire_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Audit logs exported to CSV successfully!", "success");
  };

  // Helper mapping event types to premium UI styles and icons
  const getLogMeta = (type, action) => {
    const t = type?.toLowerCase() || "";
    const act = action?.toLowerCase() || "";
    
    if (t === "hiring" || act.includes("job") || act.includes("post")) {
      return {
        icon: UserPlus,
        color: "text-blue-600",
        bg: "bg-blue-50"
      };
    }
    if (t === "ai" || act.includes("score") || act.includes("ats") || act.includes("parse")) {
      return {
        icon: Zap,
        color: "text-amber-600",
        bg: "bg-amber-50"
      };
    }
    if (act.includes("reject") || act.includes("fail") || act.includes("delete")) {
      return {
        icon: XCircle,
        color: "text-rose-600",
        bg: "bg-rose-50"
      };
    }
    if (act.includes("shortlist") || act.includes("interview") || act.includes("schedule")) {
      return {
        icon: Calendar,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
      };
    }
    if (t === "success" || act.includes("hire") || act.includes("accept")) {
      return {
        icon: CheckCircle2,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
      };
    }
    if (t === "system" || act.includes("clear") || act.includes("patch")) {
      return {
        icon: ShieldAlert,
        color: "text-purple-600",
        bg: "bg-purple-50"
      };
    }
    return {
      icon: FileText,
      color: "text-slate-600",
      bg: "bg-slate-50"
    };
  };

  const filteredActivities = activities.filter(item => {
    const matchesSearch = 
      item.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      selectedType === "All" || 
      item.type?.toLowerCase() === selectedType.toLowerCase();
      
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
              <History className="text-blue-600" size={24} />
            </div>
            Activity Log
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 ml-11">
            Live audit trail of every action taken in the screening system.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={() => setIsOpenClearModal(true)}
            className="bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 px-5 py-2.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Trash2 size={14} /> Clear Logs
          </button>
        </div>
      </div>

      {/* --- FILTERS & SEARCH BAR --- */}
      <div className="bg-white p-4 rounded-[28px] border border-slate-100 mb-10 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs by name, action or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none focus:ring-4 focus:ring-blue-500/5 font-semibold text-slate-700 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filter By Event Type:</span>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 font-bold text-slate-600 outline-none cursor-pointer hover:bg-white hover:shadow-sm transition-all"
          >
            {["All", "Hiring", "AI", "Status", "Success", "System"].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-slate-400 text-sm font-bold tracking-tight">Loading audit trails...</p>
        </div>
      ) : (
        /* --- TIMELINE SECTION --- */
        <div className="max-w-5xl mx-auto relative px-4">
          
          {/* Main Vertical Line */}
          <div className="absolute left-[47px] md:left-[51px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-100 via-slate-100 to-transparent"></div>

          <div className="space-y-10">
            {filteredActivities.map((item) => {
              const meta = getLogMeta(item.type, item.action);
              const LogIcon = meta.icon;
              return (
                <div key={item.id} className="relative flex items-start gap-8 group">
                  
                  {/* Timeline Indicator */}
                  <div className="relative z-10 shrink-0">
                    <div className={`p-4 rounded-[22px] ${meta.bg} ${meta.color} shadow-md border-4 border-white group-hover:scale-110 transition-transform duration-300`}>
                      <LogIcon size={22} />
                    </div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-white border border-slate-100 px-2 py-1 rounded-lg shadow-sm">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  {/* Activity Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex-1 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden group/card border-l-4 border-l-transparent hover:border-l-blue-500">
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue-600 font-black text-sm">{item.user}</span>
                          <span className="text-slate-400 text-xs font-bold tracking-tight">{item.action}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800 leading-tight">
                          {item.target} 
                          <span className="text-slate-400 font-medium text-xs ml-2">— {item.role}</span>
                        </h3>
                      </div>
                    </div>

                    {/* Log Description */}
                    <div className="bg-slate-50/50 p-3 rounded-2xl mb-4">
                      <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">
                        "{item.details}"
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase">Ref: #ACT-{item.id}092</span>
                          </div>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-1 rounded-md">
                         Event: {item.type}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredActivities.length === 0 && (
              <div className="bg-white rounded-[2rem] border border-slate-150 p-12 text-center text-slate-400 font-semibold text-xs shadow-sm">
                No activity logs match your search and filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONFIRM CLEAR AUDIT LOGS MODAL --- */}
      {isOpenClearModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Clear Audit Logs?</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Are you sure you want to permanently clear the audit logs from the database? This action is irreversible and will remove all recruiter histories.
            </p>
            
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => setIsOpenClearModal(false)}
                className="flex-1 py-3.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleClearLogs}
                disabled={isClearing}
                className="flex-1 py-3.5 bg-red-600 text-white hover:bg-red-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all flex items-center justify-center"
              >
                {isClearing ? <Loader2 size={16} className="animate-spin" /> : "Clear All"}
              </button>
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

export default ActivityLog;