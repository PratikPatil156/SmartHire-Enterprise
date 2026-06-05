import React, { useState, useEffect } from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  SparklesIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { appsService } from '../../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const data = await appsService.getAll();
      setApplications(data || []);
    } catch (err) {
      console.error("Error loading candidate applications:", err);
      setErrorMessage("Failed to load your applications.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const totalApplied = Array.isArray(applications) ? applications.length : 0;
  const activeInterviews = Array.isArray(applications) 
    ? applications.filter(app => app.status === 'Shortlisted' || app.status === 'Interviewing').length 
    : 0;
  const pendingDecisions = Array.isArray(applications) 
    ? applications.filter(app => app.status?.toLowerCase() === 'applied' || app.status?.toLowerCase() === 'under review').length 
    : 0;

  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'shortlisted':
      case 'interviewing':
        return {
          colorClass: "text-blue-600 bg-blue-50 border border-blue-100/50",
          icon: <ClockIcon className="w-4 h-4 text-blue-600" />
        };
      case 'hired':
        return {
          colorClass: "text-emerald-600 bg-emerald-50 border border-emerald-100/50",
          icon: <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
        };
      case 'rejected':
        return {
          colorClass: "text-rose-600 bg-rose-50 border border-rose-100/50",
          icon: <XCircleIcon className="w-4 h-4 text-rose-600" />
        };
      case 'applied':
      default:
        return {
          colorClass: "text-slate-600 bg-slate-50 border border-slate-200/60",
          icon: <CheckCircleIcon className="w-4 h-4 text-slate-500" />
        };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return "Recently";
    }
  };

  // Helper to color logo square dynamically based on company name
  const getCompanyColor = (company) => {
    if (!company) return 'bg-blue-600';
    const name = company.trim().toLowerCase();
    if (name.includes('google')) return 'bg-blue-600';
    if (name.includes('tcs') || name.includes('tata')) return 'bg-emerald-600';
    if (name.includes('wipro')) return 'bg-violet-600';
    if (name.includes('infosys')) return 'bg-indigo-600';
    if (name.includes('netflix')) return 'bg-rose-600';
    
    // Hash-based color mapping for consistent company styling
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'bg-blue-600',
      'bg-indigo-600',
      'bg-violet-600',
      'bg-purple-600',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-cyan-600'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
          </div>
          My Applications
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-2">Track your job journey and AI match status.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 text-sm font-semibold">Loading applications...</p>
        </div>
      ) : errorMessage ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
          <XCircleIcon className="w-5 h-5 text-rose-600 shrink-0" />
          {errorMessage}
        </div>
      ) : (
        <>
          {/* Stats Cards for Applications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Applied</p>
              <h3 className="text-3xl font-black text-slate-800">{totalApplied}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-blue-50 text-[10px] font-black uppercase tracking-widest mb-1">Active Interviews</p>
              <h3 className="text-3xl font-black text-blue-600">{activeInterviews < 10 ? `0${activeInterviews}` : activeInterviews}</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-purple-500 text-[10px] font-black uppercase tracking-widest mb-1">Pending Decisions</p>
              <h3 className="text-3xl font-black text-purple-600">{pendingDecisions < 10 ? `0${pendingDecisions}` : pendingDecisions}</h3>
            </div>
          </div>

          {/* Applications Table/List */}
          {!Array.isArray(applications) || applications.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 shadow-sm text-center">
              <div className="bg-blue-50 p-4 rounded-full">
                <ClipboardDocumentCheckIcon className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Applications Yet</h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                You haven't submitted any job applications yet. Go to your dashboard or recommendations to find jobs and apply!
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-bold text-slate-700">Recent Applications</h3>
              </div>

              <div className="divide-y divide-slate-50">
                {Array.isArray(applications) && applications.map((app) => {
                  const { colorClass, icon } = getStatusDetails(app.status);
                  return (
                    <div key={app.id} className="p-6 hover:bg-slate-50/50 transition-all flex flex-col gap-4 min-h-[6rem] group">
                      
                      {/* Desktop Row Layout */}
                      <div className="hidden md:flex items-center justify-between gap-4 w-full">
                        {/* Left: Company & Role Info */}
                        <div className="flex items-center gap-5 w-[450px] shrink-0">
                          {/* Company Logo container */}
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm font-black text-white text-lg shrink-0 ${getCompanyColor(app.job_company)}`}>
                            {app.job_company ? app.job_company[0].toUpperCase() : 'J'}
                          </div>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{app.job_company}</h4>
                            <p className="text-xs text-slate-500 font-medium truncate">{app.job_title}</p>
                          </div>
                        </div>

                        {/* Middle Left: Applied On Date */}
                        <div className="w-36 shrink-0">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Applied On</p>
                          <p className="text-xs font-bold text-slate-700">{formatDate(app.applied_at)}</p>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Middle Right: AI Match Score */}
                        <div className="w-28 shrink-0 text-right">
                          <div className="flex items-center gap-1 justify-end text-indigo-600 mb-1">
                            <SparklesIcon className="w-3 h-3" />
                            <span className="text-[10px] font-black">AI MATCH</span>
                          </div>
                          <p className="text-sm font-black text-slate-800">{app.ai_score}%</p>
                        </div>

                        {/* Right Middle: Fixed Status Badge Area */}
                        <div className="w-32 shrink-0 flex items-center justify-end">
                          <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] whitespace-nowrap ${colorClass}`}>
                            {icon}
                            {app.status}
                          </div>
                        </div>

                        {/* Right: Chevron */}
                        <div className="w-6 shrink-0 flex justify-end">
                          <ChevronRightIcon className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>

                      {/* Mobile Row Layout */}
                      <div className="flex md:hidden flex-col gap-4 w-full">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm font-black text-white text-base shrink-0 ${getCompanyColor(app.job_company)}`}>
                              {app.job_company ? app.job_company[0].toUpperCase() : 'J'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{app.job_company}</h4>
                              <p className="text-xs text-slate-500 font-medium">{app.job_title}</p>
                            </div>
                          </div>
                          
                          <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] ${colorClass}`}>
                            {icon}
                            {app.status}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100/50 pt-3 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Applied On</span>
                            <span className="font-bold text-slate-700">{formatDate(app.applied_at)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider block">AI Match</span>
                            <span className="font-black text-indigo-600">{app.ai_score}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Interview Details Panel for Shortlisted Candidates */}
                      {(app.status?.toLowerCase() === 'shortlisted' || app.status?.toLowerCase() === 'interviewing') && app.interview_date && (
                        <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top duration-300 w-full">
                          <div className="flex flex-wrap items-center gap-6">
                            {/* Date & Time info */}
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Interview Schedule</p>
                              <p className="text-xs font-extrabold text-slate-700 mt-1">
                                📅 {app.interview_date} at ⏰ <span className="text-blue-600">{app.interview_time}</span>
                              </p>
                            </div>
                            {/* Passcode display */}
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Access Passcode</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="font-mono bg-slate-200/80 px-2 py-0.5 rounded text-xs font-black text-slate-800 border border-slate-300/40">
                                  {app.interview_code || '------'}
                                </span>
                                {app.interview_code && (
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(app.interview_code);
                                      showToast("Passcode copied to clipboard!", "success");
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
                                    title="Copy Passcode"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.03a1.208 1.208 0 00-1.66-1.66l-3 3a1.208 1.208 0 001.66 1.66l3-3zM21 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 4.5h-1.5m1.5 0v1.5m0-1.5L13.5 6m-9 0h1.5m-1.5 0v1.5m0-1.5L6 4.5M6 16.5H4.5m1.5 0v1.5m0-1.5l-1.5-1.5m15 0h1.5m-1.5 0v1.5m0-1.5l1.5-1.5" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Join Link Button */}
                          {app.interview_meet_link && (
                            <a 
                              href={app.interview_meet_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/10 flex items-center gap-1.5 self-start md:self-auto"
                            >
                              <span>Join Interview Call</span>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-4 p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <XCircleIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MyApplications;