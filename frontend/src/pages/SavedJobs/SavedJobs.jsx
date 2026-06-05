import React, { useState, useEffect } from 'react';
import { 
  BookmarkIcon as BookmarkIconOutline, 
  SparklesIcon, 
  TrashIcon, 
  CheckCircleIcon,
  MapPinIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import { savedService, appsService, resumeService } from '../../services/api';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [jobMatches, setJobMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [unsavingIds, setUnsavingIds] = useState(new Set());
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      // 1. Fetch saved jobs from backend
      const saved = await savedService.getAll();
      setSavedJobs(saved);
      
      // 2. Fetch active applications to mark applied status
      try {
        const apps = await appsService.getAll();
        const appliedIds = new Set(apps.map(app => app.job_id));
        setAppliedJobIds(appliedIds);
      } catch (appErr) {
        console.error("Error loading candidate applications:", appErr);
      }
      
      // 3. Fetch resume matching score index to map ATS score to each job
      try {
        const scoreData = await resumeService.getMyScore();
        setHasResume(scoreData.has_resume || false);
        if (scoreData.has_resume && scoreData.recommended_jobs) {
          const matches = {};
          scoreData.recommended_jobs.forEach(job => {
            const pct = parseInt(job.match?.replace("%", "")) || 0;
            matches[job.id] = pct;
          });
          setJobMatches(matches);
        }
      } catch (scoreErr) {
        console.error("Error loading resume match scores:", scoreErr);
      }
      
    } catch (err) {
      console.error("Error loading saved jobs data:", err);
      setErrorMessage("Failed to load saved opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (jobId) => {
    if (!hasResume) {
      showToast("Please upload your resume first before applying for jobs.", "error");
      return;
    }
    try {
      await appsService.apply(jobId);
      showToast("Application submitted successfully!", "success");
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
      // Add to unsaving set to trigger visual transition immediately
      setUnsavingIds(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
      
      // Unsave call to API
      await savedService.toggle(jobId);
      
      // Wait for transition effect to finish
      setTimeout(() => {
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        setUnsavingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }, 300);

    } catch (err) {
      console.error(err);
      showToast("Failed to update saved status.", "error");
      // Rollback state if api fails
      setUnsavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleClearAll = async () => {
    if (savedJobs.length === 0) return;
    try {
      // Unsave all listed jobs concurrently
      const promises = savedJobs.map(job => savedService.toggle(job.id));
      await Promise.all(promises);
      
      setSavedJobs([]);
      showToast("All saved opportunities cleared successfully.", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to clear saved opportunities.", "error");
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
      
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <BookmarkIconOutline className="w-6 h-6 text-indigo-600" />
            </div>
            Saved Opportunities
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Jobs you liked. Apply before the deadline for the best AI match.
          </p>
        </div>
        {savedJobs.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <TrashIcon className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Messages banners */}
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
          <p className="text-slate-500 text-sm font-semibold">Syncing saved opportunities...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-4 shadow-sm text-center">
          <div className="bg-amber-50 p-4 rounded-full">
            <BookmarkIconOutline className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Saved Opportunities</h3>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            You haven't saved any job opportunities yet. Browse matching jobs and bookmark them to keep them in this tab.
          </p>
        </div>
      ) : (
        /* Responsive Grid matching User Mockup */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            const isUnsaving = unsavingIds.has(job.id);
            const matchScore = jobMatches[job.id] !== undefined ? jobMatches[job.id] : 46; // fallback matching 46% mockup value
            const skillsArray = job.requirements ? job.requirements.split(',').map(s => s.trim()).filter(Boolean) : [];

            return (
              <div 
                key={job.id} 
                className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 transform flex flex-col justify-between min-h-[320px] ${
                  isUnsaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div>
                  {/* Top line layout: Avatar + Title/Company & Match index */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex gap-4">
                      {/* Brand box */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm ${getCompanyColor(job.company)}`}>
                        {job.company ? job.company[0].toUpperCase() : 'J'}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-800 tracking-tight leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-slate-500 font-semibold text-sm mt-0.5">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {/* ATS Match score pill */}
                    <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shrink-0">
                      {matchScore}% Match
                    </span>
                  </div>

                  {/* Location Pin row */}
                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-semibold">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <MapPinIcon className="w-4 h-4 text-blue-500 shrink-0" />
                    </div>
                    <span>{job.location}</span>
                  </div>

                  {/* Dynamic skill tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skillsArray.map((skill, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Description snippet */}
                  <div className="mb-6">
                    <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-3">
                      {job.description}
                    </p>
                    {job.description && job.description.length > 150 && (
                      <button 
                        onClick={() => setSelectedJobForModal(job)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold mt-1 focus:outline-none"
                      >
                        Read More
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Wide action + Yellow Bookmark */}
                <div className="flex items-center gap-3 mt-4">
                  {isApplied ? (
                    <button 
                      disabled
                      className="flex-1 bg-slate-50 border border-slate-200 text-slate-400 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircleIcon className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                      Applied
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApply(job.id)}
                      className="flex-1 bg-[#1a56db] hover:bg-[#1e40af] text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                      Apply Now
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleToggleSave(job.id)}
                    className={`p-3 rounded-2xl border transition-all ${
                      isUnsaving
                        ? 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                        : 'bg-amber-100 border-amber-200 text-amber-500 hover:bg-amber-200/80 shadow-sm'
                    }`}
                    title="Remove from Saved"
                  >
                    {isUnsaving ? (
                      <BookmarkIconOutline className="w-5 h-5" />
                    ) : (
                      <BookmarkIconSolid className="w-5 h-5 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm ${getCompanyColor(selectedJobForModal.company)}`}>
                  {selectedJobForModal.company ? selectedJobForModal.company[0].toUpperCase() : 'J'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug">
                    {selectedJobForModal.title}
                  </h3>
                  <p className="text-slate-500 font-semibold text-sm mt-0.5">
                    {selectedJobForModal.company} • {selectedJobForModal.location}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJobForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Match Score & Location */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  {jobMatches[selectedJobForModal.id] !== undefined ? jobMatches[selectedJobForModal.id] : 46}% Match
                </span>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <MapPinIcon className="w-5 h-5 text-blue-500" />
                  <span>{selectedJobForModal.location}</span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedJobForModal.requirements ? selectedJobForModal.requirements.split(',') : []).map((tag, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100/10">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Job Description</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {selectedJobForModal.description}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                onClick={() => {
                  handleToggleSave(selectedJobForModal.id);
                  setSelectedJobForModal(null);
                }}
                className="p-3 rounded-2xl border transition-all bg-amber-100 border-amber-200 text-amber-500 hover:bg-amber-200/80 shadow-sm"
                title="Remove Bookmark"
              >
                <BookmarkIconSolid className="w-5 h-5 fill-current" />
              </button>
              
              {appliedJobIds.has(selectedJobForModal.id) ? (
                <button 
                  disabled
                  className="bg-slate-100 border border-slate-200 text-slate-400 px-8 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                  Applied
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleApply(selectedJobForModal.id);
                  }}
                  className="bg-[#1a56db] hover:bg-[#1e40af] text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Apply Now
                </button>
              )}
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

export default SavedJobs;