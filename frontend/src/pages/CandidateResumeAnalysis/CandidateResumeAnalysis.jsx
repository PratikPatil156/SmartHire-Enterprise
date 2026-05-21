import React, { useState } from 'react';
import { 
  SparklesIcon, 
  ArrowUpTrayIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const CandidateResumeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // AI Processing Simulation
    setTimeout(() => {
      setReport({
        score: 82,
        status: "Good",
        missingKeywords: ["Docker", "Kubernetes", "AWS Cloud", "Unit Testing"],
        suggestions: [
          "Apne projects mein 'Quantifiable Achievements' add karein (e.g., 'Reduced loading time by 30%').",
          "Summary section ko thoda aur professional aur short karein.",
          "Latest tech stack (React 18, Next.js) mention karna faydemand rahega."
        ],
        atsCompatibility: "High"
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen w-full">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3 italic">
            <SparklesIcon className="w-9 h-9 text-indigo-600" />
            AI RESUME INSIGHTS
          </h1>
          <p className="text-slate-500 font-medium ml-12">Beat the ATS and get more interview calls with AI-powered feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Action Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 sticky top-8">
              <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-dashed border-indigo-200 text-center mb-6">
                <ArrowUpTrayIcon className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-indigo-600 uppercase">Upload New Version</p>
              </div>
              
              <button 
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                {isAnalyzing ? (
                  <><ArrowPathIcon className="w-5 h-5 animate-spin" /> Analyzing...</>
                ) : (
                  "RE-ANALYZE NOW"
                )}
              </button>
              
              <p className="text-[10px] text-slate-400 text-center mt-4 italic font-medium">
                AI scans for 50+ parameters including formatting and keywords.
              </p>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="lg:col-span-2 space-y-6">
            {report ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                
                {/* Score Card */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Resume Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-slate-900">{report.score}</span>
                      <span className="text-xl font-bold text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase border border-emerald-200">
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
                      {report.missingKeywords.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[11px] font-bold border border-slate-100">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <LightBulbIcon className="w-5 h-5 text-indigo-500" /> Quick Fixes
                    </h3>
                    <ul className="space-y-3">
                      {report.suggestions.map((tip, i) => (
                        <li key={i} className="text-[13px] text-slate-600 font-medium leading-relaxed flex gap-2">
                          <span className="text-indigo-600 font-black">›</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white h-[400px] rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <SparklesIcon className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Ready to level up?</h3>
                <p className="text-slate-400 text-sm max-w-xs mt-2 font-medium">
                  Click on 'Re-Analyze' to let our AI scan your resume for potential improvements.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateResumeAnalysis;