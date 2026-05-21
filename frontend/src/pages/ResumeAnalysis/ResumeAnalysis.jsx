import React from 'react';
import { Target, Zap, BookOpen } from 'lucide-react';

const ResumeAnalysis = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Resume Analysis</h1>
      <p className="text-slate-500 mb-8">AI insights to improve your career chances</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Overall ATS Score</h3>
          <p className="text-3xl font-bold text-slate-800">85/100</p>
        </div>

        {/* Skill Gap */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Critical Skill Gaps</h3>
          <p className="text-xl font-bold text-slate-800">Docker, AWS</p>
        </div>

        {/* Suggestions */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-slate-500 text-sm font-medium">Quick Suggestion</h3>
          <p className="text-[13px] text-slate-600 leading-relaxed">Add quantifiable achievements in your Java projects to increase score by 10%.</p>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;