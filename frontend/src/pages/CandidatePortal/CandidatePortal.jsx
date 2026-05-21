
import React, { useState } from 'react';
import { 
  CloudArrowUpIcon, 
  BriefcaseIcon, 
  CheckCircleIcon, 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CandidatePortal = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'Tech Corp', location: 'Remote', match: '95%', salary: '8-12 LPA' },
    { id: 2, title: 'Python Intern', company: 'AI Solutions', location: 'Mumbai', match: '82%', salary: '25k/month' },
    { id: 3, title: 'React Developer', company: 'Web Studio', location: 'Bangalore', match: '75%', salary: '10-15 LPA' },
  ];

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setIsUploading(true);
      setFile(selectedFile);
      setTimeout(() => setIsUploading(false), 2000);
    }
  };

  return (
    <div className="p-5 md:p-8 bg-[#fbfcfd] min-h-screen text-slate-900 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section - More Compact */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* LEFT SIDE: Resume Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* THE UPLOAD CARD - Balanced Size */}
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100 text-center relative overflow-hidden group">
              <div className="relative z-10">
                
                {/* Perfect Square Icon Container - Scaled to 20 */}
                <div className="flex justify-center mb-6">
                  <div className="bg-indigo-50/70 w-20 h-20 aspect-square rounded-2xl flex items-center justify-center border border-indigo-100/50 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                    <CloudArrowUpIcon className="w-9 h-9 text-indigo-600 stroke-[1.5]" />
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Upload Resume</h3>
                <p className="text-slate-400 text-sm leading-relaxed mt-2 mb-8 px-2 font-medium">
                  Scan your skills to find the <span className="text-indigo-600 font-bold">perfect match</span>.
                </p>
                
                <input type="file" id="resume-upload" hidden accept=".pdf,.docx" onChange={handleFileUpload} />
                
                {!file ? (
                  <label 
                    htmlFor="resume-upload"
                    className="inline-block w-full bg-indigo-600 text-white py-3.5 px-8 rounded-xl font-bold cursor-pointer hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-[0.98] tracking-tight text-sm"
                  >
                    Select Resume File
                  </label>
                ) : (
                  <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                        <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="text-left leading-tight">
                        <p className="text-xs font-bold text-slate-800 truncate w-32 md:w-40">{file.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest italic">Ready</p>
                      </div>
                    </div>
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                    ) : (
                      <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                )}
                
                {file && !isUploading && (
                  <button className="mt-4 text-indigo-600 font-bold text-xs hover:text-indigo-800 transition-colors" onClick={() => setFile(null)}>
                    Replace file
                  </button>
                )}
              </div>
              
              {/* Soft Decor */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-30 blur-2xl"></div>
            </div>

            {/* AI Insights Card - Compact Height */}
            <div className="bg-[#1e293b] p-7 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300 mb-1">AI Match Index</h4>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black tracking-tighter">{file ? "85" : "00"}</span>
                  <span className="text-xl font-bold text-indigo-400 mb-1.5">%</span>
                </div>
                <p className="mt-4 text-slate-400 text-xs leading-relaxed font-medium">
                  {file 
                    ? "Your 'Project Leadership' skills are trending. Profile visibility increased by 15%."
                    : "Upload a file to see your industry compatibility score."}
                </p>
              </div>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <SparklesIcon className="w-24 h-24 text-white" />
              </div>
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
                  Recommended for you
                </h3>
                <div className="relative w-full sm:w-56">
                  <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search roles..." 
                    className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 w-full font-medium"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="group p-5 rounded-[1.5rem] border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4">
                        <div className="bg-white w-14 h-14 min-w-[56px] rounded-xl border border-slate-100 flex items-center justify-center shadow-sm font-black text-indigo-600 text-xl">
                          {job.company[0]}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-extrabold text-base text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{job.title}</h4>
                          <p className="text-xs text-slate-500 font-bold tracking-tight">{job.company} • {job.location}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">₹{job.salary}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end w-full md:w-auto justify-between gap-2.5">
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black tracking-wider border border-emerald-100/50">
                          {job.match} MATCH
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-extrabold hover:bg-indigo-600 transition-all shadow-md">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-400 font-extrabold hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all uppercase tracking-widest text-[10px]">
                Explore 240+ More Jobs
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;