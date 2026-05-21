

import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setIsSuccess(false);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsSuccess(false);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulating API Call
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      // alert logic replaced by UI state for better UX
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-700">
      {/* Header with AI Sparkle */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles size={14} /> AI-Powered Analysis
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Elevate Your <span className="text-blue-600">Career.</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Upload your resume and let our AI engine scan for ATS compatibility and hidden opportunities.
        </p>
      </div>

      {/* Upload Zone */}
      <div className={`relative group border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-300 overflow-hidden ${
        file 
          ? 'border-green-400 bg-green-50/50' 
          : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30'
      }`}>
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={handleFileChange}
          accept=".pdf"
        />
        
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {!file ? (
            <>
              <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">Drop your resume here</p>
                <p className="text-slate-400 mt-1">or click to browse from your device</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1"><ShieldCheck size={14}/> Secure</span>
                <span className="flex items-center gap-1">PDF Only</span>
                <span className="flex items-center gap-1">Max 5MB</span>
              </div>
            </>
          ) : (
            <div className="animate-in zoom-in duration-300 w-full max-w-md">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-200 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl text-green-600">
                    <FileText size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(2)} KB • Ready to analyze</p>
                  </div>
                </div>
                {!isUploading && (
                  <button 
                    onClick={removeFile} 
                    className="p-2 hover:bg-red-50 rounded-xl text-red-400 transition-colors z-20"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center flex-col items-center gap-4">
        {file && (
          <button 
            onClick={handleUpload}
            disabled={isUploading || isSuccess}
            className={`group relative px-10 py-4 rounded-2xl font-black text-white transition-all duration-300 active:scale-95 shadow-2xl ${
              isSuccess 
                ? 'bg-green-500 shadow-green-200' 
                : isUploading 
                  ? 'bg-slate-400' 
                  : 'bg-[#0f172a] hover:bg-blue-600 shadow-blue-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI Engine Processing...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle size={20} />
                  <span>Analysis Complete!</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:animate-pulse" />
                  <span>Start AI Analysis</span>
                </>
              )}
            </div>
          </button>
        )}
        {isSuccess && (
          <p className="text-green-600 font-bold text-sm animate-bounce">
            Redirecting to your insights...
          </p>
        )}
      </div>

      {/* Modern AI Tips - Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="group p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2rem] hover:border-blue-200 transition-all">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <AlertCircle size={20} />
          </div>
          <h4 className="font-bold text-slate-800 mb-2">ATS Optimization</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Include industry-specific keywords like <span className="text-slate-800 font-semibold">"React", "System Design"</span>, or <span className="text-slate-800 font-semibold">"Agile"</span> to bypass automated filters.
          </p>
        </div>

        <div className="group p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2rem] hover:border-blue-200 transition-all">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle size={20} />
          </div>
          <h4 className="font-bold text-slate-800 mb-2">Quantify Results</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Data-driven resumes get <span className="text-slate-800 font-semibold">40% more shortlists.</span> Use metrics (e.g., "Reduced latency by 15%") instead of just listing tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;