import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { resumeService, authService, appsService } from '../../services/api';

const CandidateResumeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const fetchAnalysis = async (jobId = null, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const data = await resumeService.getAnalysis(jobId);
      if (data && data.has_resume !== false) {
        setReport(data);
      } else {
        setReport(null);
      }
    } catch (err) {
      console.error("Error fetching resume analysis:", err);
      setError(err.message || err || "Failed to load resume analysis.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const loadAppliedJobs = async () => {
    try {
      const apps = await appsService.getAll();
      setAppliedJobs(apps || []);
    } catch (err) {
      console.error("Error loading applied jobs:", err);
    }
  };

  useEffect(() => {
    loadAppliedJobs();
    fetchAnalysis(null, true);
  }, []);

  const handleJobFilterChange = async (jobId) => {
    setSelectedJobId(jobId);
    await fetchAnalysis(jobId ? Number(jobId) : null, true);
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setSuccessMessage("");
    setError("");
    try {
      await fetchAnalysis(selectedJobId ? Number(selectedJobId) : null, false);
      setSuccessMessage("Resume re-analysis completed!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError("Failed to run analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");
    setSuccessMessage("");
    try {
      const userStr = localStorage.getItem('user');
      const loggedInUser = userStr ? JSON.parse(userStr) : null;
      if (!loggedInUser || !loggedInUser.id) {
        setError("Please log in again to upload.");
        return;
      }

      await authService.uploadResume(loggedInUser.id, selectedFile);
      setSuccessMessage("Resume uploaded and parsed successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      
      // Fetch new analysis report
      await fetchAnalysis(selectedJobId ? Number(selectedJobId) : null, true);
    } catch (err) {
      console.error(err);
      setError(err.message || err || "Failed to upload resume PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic">
              <SparklesIcon className="w-9 h-9 text-indigo-600 animate-pulse" />
              AI RESUME INSIGHTS
            </h1>
            <p className="text-slate-500 font-medium ml-12">Beat the ATS and get more interview calls with AI-powered feedback.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 px-5 rounded-2xl shadow-sm border border-slate-150">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Target Job Match:</span>
            <select 
              value={selectedJobId} 
              onChange={(e) => handleJobFilterChange(e.target.value)}
              disabled={appliedJobs.length === 0}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {appliedJobs.length === 0 ? (
                <option value="">No Applied Jobs Found</option>
              ) : (
                <>
                  <option value="">General (All Applied Jobs)</option>
                  {appliedJobs.map((app) => (
                    <option key={app.id} value={app.job_id}>
                      {app.job_title} ({app.job_company})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        {/* Message banners */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 shadow-sm">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2 shadow-sm">
            <ExclamationTriangleIcon className="w-5 h-5 text-rose-600 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 text-sm font-semibold">Generating ATS score card...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Side: Action Card */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Action Card - Scaled Up Size */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <input 
                  type="file" 
                  id="resume-analysis-upload" 
                  hidden 
                  accept=".pdf" 
                  onChange={handleFileUpload} 
                />
                
                <label 
                  htmlFor="resume-analysis-upload"
                  className="block bg-indigo-50/50 p-10 rounded-[24px] border-2 border-dashed border-indigo-200 text-center mb-8 cursor-pointer hover:bg-indigo-50 transition-colors"
                >
                  <ArrowUpTrayIcon className="w-14 h-14 text-indigo-500 mx-auto mb-4" />
                  <p className="text-sm font-black text-indigo-600 uppercase tracking-wide">
                    {isUploading ? "Uploading..." : "Upload New Version"}
                  </p>
                </label>
                
                {report && (
                  <button 
                    onClick={handleStartAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-100 disabled:opacity-75"
                  >
                    {isAnalyzing ? (
                      <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Analyzing...</>
                    ) : (
                      "RE-ANALYZE NOW"
                    )}
                  </button>
                )}
                
                <p className="text-xs text-slate-400 text-center mt-5 italic font-semibold leading-relaxed">
                  AI scans for 50+ parameters including formatting and keywords.
                </p>
              </div>

            </div>

            {/* Right Side: Results */}
            <div className="lg:col-span-8 space-y-6">
              {report ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Score Card - Bold, left-aligned, and thicker styling */}
                  <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                    <div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Current Resume Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-slate-900 leading-none">{report.score}</span>
                        <span className="text-2xl font-bold text-slate-400">/100</span>
                      </div>
                    </div>
                    
                    <div className="hidden sm:block h-20 w-[1.5px] bg-slate-200 shrink-0"></div>
                    
                    <div>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2.5">ATS Matching Status</p>
                      <span className={`inline-block px-5 py-2.5 rounded-xl text-sm font-black uppercase border ${
                        report.score >= 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        report.score >= 45 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {report.status} Matching
                      </span>
                    </div>
                  </div>

                  {/* Detailed Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Skill Gaps */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" /> Missing Keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {report.missingKeywords && report.missingKeywords.length > 0 ? (
                          report.missingKeywords.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-100">
                              + {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-400 text-xs font-semibold italic">No missing critical keywords!</p>
                        )}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <LightBulbIcon className="w-5 h-5 text-indigo-500" /> Quick Fixes
                      </h3>
                      <ul className="space-y-3">
                        {report.suggestions && report.suggestions.length > 0 ? (
                          report.suggestions.map((tip, i) => (
                            <li key={i} className="text-[13px] text-slate-600 font-medium leading-relaxed flex gap-2">
                              <span className="text-indigo-600 font-black">›</span> {tip}
                            </li>
                          ))
                        ) : (
                          <li className="text-slate-400 text-xs font-semibold italic">No suggestions needed. Your resume is optimized!</li>
                        )}
                      </ul>
                    </div>

                  </div>
                </div>
              ) : (
                /* Empty State / No Resume Uploaded */
                <div className="bg-white h-[400px] rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <SparklesIcon className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700">No Resume Found</h3>
                  <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">
                    Upload your resume on the left to start analyzing your skills and get personalized AI recommendations.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateResumeAnalysis;