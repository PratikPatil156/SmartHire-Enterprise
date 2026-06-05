import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, User, Mail, Download, Filter, Loader2, CheckCircle2, AlertCircle, RefreshCw, Plus, X,
  Calendar, Clock, Video, Link
} from 'lucide-react';
import { appsService, skillsTagsService } from '../../services/api';

export const getTagStyle = (tag) => {
  const t = tag?.toLowerCase().trim() || "";
  if (t.includes("joiner") || t.includes("immediate")) {
    return "bg-amber-50 text-amber-600 border-amber-100/50";
  }
  if (t.includes("high score") || t.includes("top") || t.includes("excellent")) {
    return "bg-emerald-50 text-emerald-600 border-emerald-100/50";
  }
  if (t.includes("verified") || t.includes("hired") || t.includes("select")) {
    return "bg-indigo-50 text-indigo-700 border-indigo-100/50";
  }
  if (t.includes("remote") || t.includes("wfh") || t.includes("only")) {
    return "bg-purple-50 text-purple-600 border-purple-100/50";
  }
  if (t.includes("english") || t.includes("comm") || t.includes("speak")) {
    return "bg-blue-50 text-blue-600 border-blue-100/50";
  }
  if (t.includes("weak") || t.includes("reject") || t.includes("gap") || t.includes("break")) {
    return "bg-rose-50 text-rose-600 border-rose-100/50";
  }
  
  const colors = [
    "bg-blue-50 text-blue-600 border-blue-100/50",
    "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    "bg-indigo-50 text-indigo-700 border-indigo-100/50",
    "bg-purple-50 text-purple-600 border-purple-100/50",
    "bg-amber-50 text-amber-600 border-amber-100/50",
    "bg-rose-50 text-rose-600 border-rose-100/50",
    "bg-violet-50 text-violet-600 border-violet-100/50"
  ];
  let hash = 0;
  for (let i = 0; i < t.length; i++) {
    hash = t.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const Candidates = () => {
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || "");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic Interview Scheduling Modal State
  const [scheduleModal, setScheduleModal] = useState({
    isOpen: false,
    appId: null,
    date: "",
    time: "",
    meetLink: ""
  });

  const submitSchedule = async () => {
    if (!scheduleModal.date || !scheduleModal.time) {
      showToast("Please select a date and time for the interview.", "error");
      return;
    }
    
    setUpdatingId(scheduleModal.appId);
    try {
      const res = await appsService.updateStatus(scheduleModal.appId, {
        status: "Shortlisted",
        interview_date: scheduleModal.date,
        interview_time: scheduleModal.time,
        interview_meet_link: scheduleModal.meetLink
      });
      
      showToast("Interview scheduled and candidate Shortlisted!", "success");
      
      setCandidates(prev => 
        prev.map(c => c.id === scheduleModal.appId ? { 
          ...c, 
          status: "Shortlisted",
          interview_date: scheduleModal.date,
          interview_time: scheduleModal.time,
          interview_meet_link: scheduleModal.meetLink,
          interview_code: res?.interview_code || c.interview_code
        } : c)
      );
      
      setScheduleModal({ isOpen: false, appId: null, date: "", time: "", meetLink: "" });
    } catch (error) {
      showToast(error.message || error || "Failed to schedule interview.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Tags states
  const [repoTags, setRepoTags] = useState([]);
  const [activePopoverId, setActivePopoverId] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await appsService.getAll();
      setCandidates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepoTags = async () => {
    try {
      const tags = await skillsTagsService.getTags();
      setRepoTags(tags);
    } catch (err) {
      console.error("Failed to load recruitment tags repository:", err);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchRepoTags();
  }, []);

  useEffect(() => {
    setSearchQuery(location.state?.searchQuery || "");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.state]);

  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Shortlisted") {
      const letters = "abcdefghijklmnopqrstuvwxyz";
      const randStr = (len) => Array.from({ length: len }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
      const meetCode = `${randStr(3)}-${randStr(4)}-${randStr(3)}`;
      const autoMeetLink = `https://meet.ffmuc.net/SmartHire-${meetCode}`;
      
      setScheduleModal({
        isOpen: true,
        appId: id,
        date: "",
        time: "",
        meetLink: autoMeetLink
      });
      return;
    }
    
    setUpdatingId(id);
    try {
      await appsService.updateStatus(id, newStatus);
      showToast(`Status updated to ${newStatus} successfully!`, "success");
      setCandidates(prev => 
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );
    } catch (error) {
      showToast(error.message || error || "Failed to update status.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignTag = async (appId, tagName) => {
    try {
      await skillsTagsService.assignTag(appId, tagName);
      setCandidates(prev => 
        prev.map(c => c.id === appId ? { ...c, tags: [...(c.tags || []), tagName] } : c)
      );
      setActivePopoverId(null);
      showToast(`Tag '${tagName}' assigned!`, "success");
    } catch (error) {
      showToast(error.message || error || "Failed to assign tag.", "error");
    }
  };

  const handleRemoveTag = async (appId, tagName) => {
    try {
      await skillsTagsService.removeTag(appId, tagName);
      setCandidates(prev => 
        prev.map(c => c.id === appId ? { ...c, tags: (c.tags || []).filter(t => t !== tagName) } : c)
      );
      showToast(`Tag '${tagName}' removed!`, "success");
    } catch (error) {
      showToast(error.message || error || "Failed to remove tag.", "error");
    }
  };

  const filteredCandidates = candidates.filter((person) => {
    const matchesSearch = 
      person.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      person.candidate_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      selectedStatus === "All" || 
      person.status?.toLowerCase() === selectedStatus.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidates</h1>
          <p className="text-slate-500 text-sm">Review and manage all job applications with real-time AI Matching scores.</p>
        </div>
        <button 
          onClick={fetchCandidates}
          className="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search candidates by name, email, role, or recruitment tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className={`px-5 py-3 rounded-2xl font-bold border transition-all active:scale-95 flex items-center gap-2 text-sm ${
              showStatusFilter || selectedStatus !== "All"
                ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Filter size={18} /> Status: {selectedStatus}
          </button>
          
          {showStatusFilter && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl z-30 p-2 animate-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border-b border-slate-50">Filter by Status</p>
              <div className="space-y-0.5 mt-1">
                {["All", "Applied", "Shortlisted", "Hired", "Rejected"].map((status, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedStatus === status
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-400 text-sm font-bold tracking-tight">Syncing application pipeline...</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Applied For</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">AI Score</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recruitment Tags</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((person) => {
                      const isUpdating = updatingId === person.id;
                      return (
                        <tr key={person.id} className="hover:bg-slate-50/50 transition-colors group animate-in fade-in duration-200">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase shadow-sm">
                                {person.candidate_name ? person.candidate_name[0] : "?"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-sm">{person.candidate_name}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1"><Mail size={12}/> {person.candidate_email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-sm text-slate-600 font-bold">{person.job_title}</span>
                            <p className="text-[10px] text-slate-400 font-medium">{person.job_company}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col items-center">
                              <span className={`text-sm font-black px-2.5 py-1 rounded-full border ${
                                person.ai_score > 75 
                                  ? 'text-green-600 bg-green-50 border-green-100' 
                                  : person.ai_score > 40
                                  ? 'text-amber-600 bg-amber-50 border-amber-100'
                                  : 'text-red-600 bg-red-50 border-red-100'
                              }`}>
                                {person.ai_score}%
                              </span>
                            </div>
                          </td>
                          
                          {/* Dynamic Recruitment Tags Assignment */}
                          <td className="px-6 py-5">
                            <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
                              {(person.tags || []).map((t, idx) => (
                                <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wide transition-all ${getTagStyle(t)}`}>
                                  {t}
                                  <X 
                                    size={10} 
                                    className="cursor-pointer hover:text-red-500 transition-colors ml-0.5" 
                                    onClick={() => handleRemoveTag(person.id, t)}
                                  />
                                </span>
                              ))}
                              
                              {/* Add Tag Popover */}
                              <div className="relative">
                                <button 
                                  onClick={() => setActivePopoverId(activePopoverId === person.id ? null : person.id)}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-slate-200 hover:border-blue-200 rounded-lg transition-all"
                                >
                                  <Plus size={12} />
                                </button>
                                
                                {activePopoverId === person.id && (
                                  <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 p-2 animate-in slide-in-from-top-1 duration-150">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Assign Tag</p>
                                    <div className="space-y-0.5 mt-1 max-h-[140px] overflow-y-auto pr-1">
                                      {repoTags.filter(tag => !(person.tags || []).includes(tag)).map((tag, idx) => (
                                        <button
                                          key={idx}
                                          onClick={() => handleAssignTag(person.id, tag)}
                                          className="w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all uppercase"
                                        >
                                          {tag}
                                        </button>
                                      ))}
                                      {repoTags.filter(tag => !(person.tags || []).includes(tag)).length === 0 && (
                                        <p className="text-[10px] text-slate-400 px-2 py-1">No tags available</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                              person.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                              person.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                              person.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              ['interviewing', 'shortlisted'].includes(person.status?.toLowerCase()) ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                              'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                              {person.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isUpdating ? (
                                <Loader2 className="animate-spin text-indigo-600 w-4 h-4 mr-2" />
                              ) : (
                                <select 
                                  value={person.status}
                                  onChange={(e) => handleStatusChange(person.id, e.target.value)}
                                  className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Shortlisted">Shortlist</option>
                                  <option value="Hired">Hire</option>
                                  <option value="Rejected">Reject</option>
                                </select>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-20 text-slate-400 text-sm">
                        No applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Candidate Cards Grid */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((person) => {
                  const isUpdating = updatingId === person.id;
                  return (
                    <div key={person.id} className="bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/60 space-y-4 text-left">
                      {/* Header: Avatar, Name, Email, AI Score */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 font-bold uppercase shadow-sm border border-slate-150">
                            {person.candidate_name ? person.candidate_name[0] : "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-sm truncate max-w-[140px]">{person.candidate_name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{person.candidate_email}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full border shrink-0 ${
                          person.ai_score > 75 
                            ? 'text-green-600 bg-green-50 border-green-100' 
                            : person.ai_score > 40
                            ? 'text-amber-600 bg-amber-50 border-amber-100'
                            : 'text-red-600 bg-red-50 border-red-100'
                        }`}>
                          {person.ai_score}% Match
                        </span>
                      </div>

                      {/* Applied For & Status */}
                      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">Role</p>
                          <p className="font-bold text-slate-700">{person.job_title}</p>
                          <p className="text-[9px] text-slate-400">{person.job_company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Status</p>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide border ${
                            person.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border-green-100' : 
                            person.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                            person.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            ['interviewing', 'shortlisted'].includes(person.status?.toLowerCase()) ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      </div>

                      {/* Recruitment Tags */}
                      {person.tags && person.tags.length > 0 && (
                        <div className="border-t border-slate-100 pt-3">
                          <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Recruitment Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {person.tags.map((t, idx) => (
                              <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black rounded-lg border uppercase tracking-wide ${getTagStyle(t)}`}>
                                {t}
                                <X 
                                  size={10} 
                                  className="cursor-pointer hover:text-red-500 transition-colors ml-0.5" 
                                  onClick={() => handleRemoveTag(person.id, t)}
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                        <div className="flex items-center gap-1.5 relative">
                          <span className="text-[10px] text-slate-400 font-bold">Assign Tag:</span>
                          <button 
                            onClick={() => setActivePopoverId(activePopoverId === person.id ? null : person.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-slate-250 hover:border-blue-200 rounded-lg transition-all"
                          >
                            <Plus size={10} />
                          </button>
                          {activePopoverId === person.id && (
                            <div className="absolute left-0 bottom-8 mt-1 w-44 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 p-2 animate-in slide-in-from-bottom-1 duration-150">
                              <div className="space-y-0.5 max-h-[120px] overflow-y-auto pr-1">
                                {repoTags.filter(tag => !(person.tags || []).includes(tag)).map((tag, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleAssignTag(person.id, tag)}
                                    className="w-full text-left px-2 py-1 rounded-lg text-[9px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all uppercase"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          {isUpdating ? (
                            <Loader2 className="animate-spin text-indigo-600 w-4 h-4" />
                          ) : (
                            <select 
                              value={person.status}
                              onChange={(e) => handleStatusChange(person.id, e.target.value)}
                              className="text-[10px] bg-white border border-slate-200 text-slate-700 font-bold rounded-lg px-2 py-1 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlist</option>
                              <option value="Hired">Hire</option>
                              <option value="Rejected">Reject</option>
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  No applications found.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Premium Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
            toast.type === 'info' ? 'bg-amber-500/20 text-amber-400' : 
            'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
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

      {/* --- PREMIUM INTERVIEW SCHEDULER MODAL --- */}
      {scheduleModal.isOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Schedule Interview</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Shortlist Pipeline</p>
                </div>
              </div>
              <button 
                onClick={() => setScheduleModal({ isOpen: false, appId: null, date: "", time: "", meetLink: "" })}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form fields */}
            <div className="space-y-5 mb-8">
              
              {/* Date field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interview Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    value={scheduleModal.date}
                    onChange={(e) => setScheduleModal(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-xs text-slate-700" 
                  />
                </div>
              </div>

              {/* Time field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interview Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="time" 
                    value={scheduleModal.time}
                    onChange={(e) => setScheduleModal(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-xs text-slate-700" 
                  />
                </div>
              </div>

              {/* Google Meet Link field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Google Meet Video Room</label>
                <div className="relative">
                  <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    value={scheduleModal.meetLink}
                    onChange={(e) => setScheduleModal(prev => ({ ...prev, meetLink: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 font-bold text-xs text-slate-700" 
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer / Actions */}
            <div className="flex gap-4">
              <button 
                onClick={() => setScheduleModal({ isOpen: false, appId: null, date: "", time: "", meetLink: "" })}
                className="flex-1 py-3.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={submitSchedule}
                className="flex-1 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                Schedule
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;