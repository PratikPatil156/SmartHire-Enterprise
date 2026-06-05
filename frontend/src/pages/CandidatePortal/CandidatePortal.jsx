import React, { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  BriefcaseIcon, 
  CheckCircleIcon, 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  BookmarkIcon as BookmarkIconOutline,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { jobsService, resumeService, authService, appsService, savedService } from '../../services/api';

const CandidatePortal = () => {
  const [jobs, setJobs] = useState([]);
  const [overallScore, setOverallScore] = useState(0);
  const [hasResume, setHasResume] = useState(false);
  const [skills, setSkills] = useState([]);
  const [fileName, setFileName] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      // Fetch resume score & recommendations
      const scoreData = await resumeService.getMyScore();
      setHasResume(scoreData.has_resume);
      setOverallScore(scoreData.overall_ai_index || 0);
      setSkills(scoreData.skills || []);
      setFileName(scoreData.file_name || "");

      let loadedJobs = [];
      if (scoreData.has_resume && scoreData.recommended_jobs && scoreData.recommended_jobs.length > 0) {
        loadedJobs = scoreData.recommended_jobs;
      } else {
        // Fallback to fetch all active job openings from db if no resume is uploaded yet
        const dbJobs = await jobsService.getAll();
        loadedJobs = dbJobs.map(job => ({
          ...job,
          match: "0%" // Fallback match
        }));
      }
      setJobs(loadedJobs);

      // Fetch active applications to mark applied jobs
      try {
        const apps = await appsService.getAll();
        const appliedIds = new Set(apps.map(app => app.job_id));
        setAppliedJobIds(appliedIds);
      } catch (appErr) {
        console.error("Error loading candidate applications:", appErr);
      }

      // Fetch saved jobs to mark bookmarked jobs
      try {
        const saved = await savedService.getAll();
        const savedIds = new Set(saved.map(job => job.id));
        setSavedJobIds(savedIds);
      } catch (saveErr) {
        console.error("Error loading saved jobs:", saveErr);
      }

    } catch (err) {
      console.error("Error loading dashboard details:", err);
      setErrorMessage("Failed to sync dashboard pipelines.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      // Get logged in user details
      const userStr = localStorage.getItem('user');
      const loggedInUser = userStr ? JSON.parse(userStr) : null;
      if (!loggedInUser || !loggedInUser.id) {
        setErrorMessage("Please log in again to upload.");
        return;
      }

      await authService.uploadResume(loggedInUser.id, selectedFile);
      showToast("Resume uploaded and parsed successfully!", "success");
      // Reload everything to recalculate ATS scores dynamically
      await loadDashboardData();
    } catch (err) {
      console.error(err);
      showToast(err.message || err || "Failed to upload resume PDF.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyJob = async (jobId) => {
    if (!hasResume) {
      showToast("Please upload your resume first before applying for jobs.", "error");
      return;
    }
    try {
      await appsService.apply(jobId);
      showToast("Application submitted successfully!", "success");
      // Refresh applied job IDs
      setAppliedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
    } catch (err) {
      console.error(err);
      showToast(err.message || err || "Could not submit application.", "error");
    }
  };

  const handleToggleSave = async (jobId) => {
    try {
      const response = await savedService.toggle(jobId);
      const isSavedNow = response.saved;
      
      setSavedJobIds(prev => {
        const newSet = new Set(prev);
        if (isSavedNow) {
          newSet.add(jobId);
        } else {
          newSet.delete(jobId);
        }
        return newSet;
      });
      showToast(response.message || "Saved status updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update saved status.", "error");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#fbfcfd] min-h-screen text-slate-900 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-slate-500 font-medium text-sm mt-0.5">AI-driven insights for your career growth.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl shadow-sm border border-slate-200/60">
            <SparklesIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">AI Engine Active</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Message banners */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-rose-600 shrink-0" />
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 text-sm font-semibold">Syncing career dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* LEFT SIDE: Resume Section */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* THE UPLOAD CARD */}
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 text-center relative overflow-hidden group">
                <div className="relative z-10">
                  
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-50/70 w-20 h-20 aspect-square rounded-2xl flex items-center justify-center border border-indigo-100/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                      <CloudArrowUpIcon className="w-9 h-9 text-indigo-600 stroke-[1.5]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Upload Resume</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mt-2 mb-8 px-2 font-medium">
                    Scan your skills to find the <span className="text-indigo-600 font-bold">perfect match</span>.
                  </p>
                  
                  <input type="file" id="resume-upload" hidden accept=".pdf" onChange={handleFileUpload} />
                  
                  {!hasResume ? (
                    <label 
                      htmlFor="resume-upload"
                      className="inline-block w-full bg-indigo-600 text-white py-3.5 px-8 rounded-xl font-bold cursor-pointer hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-[0.98] tracking-tight text-sm"
                    >
                      {isUploading ? "Uploading..." : "Select Resume File"}
                    </label>
                  ) : (
                    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                          <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="text-left leading-tight">
                          <p className="text-xs font-bold text-slate-800 truncate w-32 md:w-40">{fileName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest italic">Analyzed</p>
                        </div>
                      </div>
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                      ) : (
                        <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  )}
                  
                  {hasResume && !isUploading && (
                    <label htmlFor="resume-upload" className="inline-block mt-4 text-indigo-600 font-bold text-xs hover:text-indigo-800 transition-colors cursor-pointer">
                      Replace file
                    </label>
                  )}
                </div>
                
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-30 blur-2xl"></div>
              </div>


            </div>

            {/* RIGHT SIDE: Jobs Section */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-slate-100/80 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    <div className="bg-slate-900 p-1.5 rounded-lg">
                      <BriefcaseIcon className="w-5 h-5 text-white" />
                    </div>
                    {hasResume ? "Recommended for you" : "All Job Openings"}
                  </h3>
                  <div className="relative w-full sm:w-56">
                    <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search roles..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-full font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => {
                    const isApplied = appliedJobIds.has(job.id);
                    return (
                      <div key={job.id} className="group p-5 rounded-[1.5rem] border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex gap-4">
                            <div className="bg-white w-14 h-14 min-w-[56px] rounded-xl border border-slate-100 flex items-center justify-center shadow-sm font-black text-indigo-600 text-xl shrink-0">
                              {job.company ? job.company[0] : "J"}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-base text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h4>
                              <p className="text-xs text-slate-500 font-bold tracking-tight">{job.company} • {job.location}</p>
                              {job.requirements && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {job.requirements.split(',').slice(0, 3).map((req, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md">
                                      {req.trim()}
                                    </span>
                                  ))}
                                  {job.requirements.split(',').length > 3 && (
                                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-md">
                                      +{job.requirements.split(',').length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col items-center md:items-end w-full md:w-auto justify-between gap-2.5 shrink-0">
                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-wider border border-emerald-100/50">
                              {job.match || "0%"} MATCH
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                              {isApplied ? (
                                <span className="px-6 py-2.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl text-center shrink-0">
                                  Applied
                                </span>
                              ) : (
                                <button 
                                  onClick={() => handleApplyJob(job.id)}
                                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold hover:bg-indigo-600 transition-all shadow-md active:scale-95 shrink-0"
                                >
                                  Apply Now
                                </button>
                              )}

                              <button 
                                onClick={() => handleToggleSave(job.id)}
                                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                                  savedJobIds.has(job.id)
                                    ? 'bg-amber-100 border-amber-200 text-amber-500 hover:bg-amber-200/80 shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                                title={savedJobIds.has(job.id) ? "Remove Bookmark" : "Save Job"}
                              >
                                {savedJobIds.has(job.id) ? (
                                  <BookmarkIconSolid className="w-4 h-4 fill-current" />
                                ) : (
                                  <BookmarkIconOutline className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredJobs.length === 0 && (
                    <p className="text-slate-400 text-sm font-bold text-center py-8">
                      No active job openings found.
                    </p>
                  )}
                </div>
                
              </div>
            </div>

          </div>
        )}
      </div>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <ExclamationCircleIcon className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-extrabold tracking-tight">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors ml-4 p-1 hover:bg-slate-800 rounded-lg"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidatePortal;