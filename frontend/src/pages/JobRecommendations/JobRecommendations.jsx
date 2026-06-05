import React, { useState, useEffect } from 'react';
import { 
  MapPin, Search, X, Loader2, CheckCircle2, AlertCircle, Sparkles, Bookmark
} from 'lucide-react';
import { resumeService, appsService, savedService } from '../../services/api';

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasResume, setHasResume] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
  // Notification Toast State
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
      
      // 1. Fetch saved jobs list
      try {
        const saved = await savedService.getAll();
        const savedIds = new Set(saved.map(job => job.id));
        setSavedJobIds(savedIds);
      } catch (saveErr) {
        console.error("Error loading saved jobs:", saveErr);
      }

      // 2. Fetch applied jobs list
      try {
        const apps = await appsService.getAll();
        const appliedIds = new Set(apps.map(app => app.job_id));
        setAppliedJobIds(appliedIds);
      } catch (appErr) {
        console.error("Error loading candidate applications:", appErr);
      }

      // 3. Fetch recommended jobs based on ATS compatibility
      const data = await resumeService.getMyScore();
      if (data.has_resume) {
        setHasResume(true);
        // Map backend jobs which contain id, title, company, requirements, location, description, match (e.g. "95%")
        const mappedJobs = (data.recommended_jobs || []).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location || "Remote",
          matchScore: parseInt(job.match?.replace("%", "")) || 46,
          tags: job.requirements ? job.requirements.split(',').map(s => s.trim()).filter(Boolean) : [],
          description: job.description
        }));
        setJobs(mappedJobs);
      } else {
        setHasResume(false);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error loading recommendations:", error);
      showToast("Failed to fetch matching job recommendations.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleApply = async (jobId) => {
    if (!hasResume) {
      showToast("Please upload your resume first before applying for jobs.", "error");
      return;
    }
    setApplyingId(jobId);
    try {
      await appsService.apply(jobId);
      showToast("Application submitted successfully!", "success");
      setAppliedJobIds(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
      });
    } catch (error) {
      showToast(error.message || error || "Already applied or submission failed.", "error");
    } finally {
      setApplyingId(null);
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
      showToast(response.message || "Saved status updated!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update saved status.", "error");
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

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-500" size={28} /> Recommended Jobs
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Top picks based on your AI resume analysis match index.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search roles, companies or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-slate-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-slate-500 text-sm font-semibold">Running AI compatibility matching...</p>
        </div>
      ) : !hasResume ? (
        /* Prompt to upload resume */
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-md max-w-2xl mx-auto text-center space-y-6 animate-in fade-in">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles size={40} className="animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Unlock AI Recommendations</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
            We couldn't find your parsed resume profile in the system. Go to your Candidate Dashboard to upload your resume and receive custom job recommendations!
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all active:scale-95 text-xs uppercase tracking-widest"
          >
            Upload Resume Now
          </button>
        </div>
      ) : (
        /* Jobs Grid using Premium Redesigned Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobIds.has(job.id);
            const isSaved = savedJobIds.has(job.id);
            const isApplying = applyingId === job.id;

            return (
              <div 
                key={job.id} 
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between min-h-[320px]"
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
                      {job.matchScore}% Match
                    </span>
                  </div>

                  {/* Location Pin row */}
                  <div className="flex items-center gap-2 mb-4 text-slate-500 text-sm font-semibold">
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <MapPin size={16} className="text-blue-500 shrink-0" />
                    </div>
                    <span>{job.location}</span>
                  </div>

                  {/* Dynamic skill tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-50 text-blue-600 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-100/10"
                      >
                        {tag}
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
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      Applied
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApply(job.id)}
                      disabled={isApplying}
                      className="flex-1 bg-[#1a56db] hover:bg-[#1e40af] text-white py-3.5 rounded-2xl font-bold text-xs shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      {isApplying ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleToggleSave(job.id)}
                    className={`p-3 rounded-2xl border transition-all ${
                      isSaved
                        ? 'bg-amber-100 border-amber-200 text-amber-500 hover:bg-amber-200/80 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                    title={isSaved ? "Remove Bookmark" : "Save Job"}
                  >
                    <Bookmark 
                      size={18} 
                      className={isSaved ? 'fill-current' : ''} 
                    />
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
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
              
              {/* Match Score & Location */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  {selectedJobForModal.matchScore || selectedJobForModal.match || "0%"} Match
                </span>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{selectedJobForModal.location}</span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedJobForModal.tags || (selectedJobForModal.requirements ? selectedJobForModal.requirements.split(',') : [])).map((tag, idx) => (
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
                }}
                className={`p-3 rounded-2xl border transition-all ${
                  savedJobIds.has(selectedJobForModal.id)
                    ? 'bg-amber-100 border-amber-200 text-amber-500 hover:bg-amber-200/80 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
                title={savedJobIds.has(selectedJobForModal.id) ? "Remove Bookmark" : "Save Job"}
              >
                <Bookmark size={18} className={savedJobIds.has(selectedJobForModal.id) ? 'fill-current' : ''} />
              </button>
              
              {appliedJobIds.has(selectedJobForModal.id) ? (
                <button 
                  disabled
                  className="bg-slate-100 border border-slate-200 text-slate-400 px-8 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} className="text-emerald-500" />
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

export default JobRecommendations;