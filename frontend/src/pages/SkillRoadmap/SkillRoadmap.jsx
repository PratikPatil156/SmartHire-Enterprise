import React from 'react';
import { 
  MapIcon, 
  CheckCircleIcon, 
  LockClosedIcon, 
  SparklesIcon,
  AcademicCapIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';

const SkillRoadmap = () => {
  const steps = [
    { id: 1, title: "Frontend Fundamentals", topics: ["HTML5 Semantic Tags", "CSS3 Flexbox/Grid", "ES6+ JavaScript"], status: "completed" },
    { id: 2, title: "Modern Frameworks", topics: ["React Hooks", "State Management (Redux/Zustand)", "Tailwind CSS"], status: "current" },
    { id: 3, title: "Backend & APIs", topics: ["Node.js Express", "RESTful APIs", "MongoDB Basics"], status: "locked" },
    { id: 4, title: "System Design & DevOps", topics: ["Scalability", "Docker Basics", "AWS Deployment"], status: "locked" },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen w-full font-sans">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100">
          <SparklesIcon className="w-3.5 h-3.5" /> AI Generated Path
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Career Roadmap</h1>
        <p className="text-slate-500 font-medium mt-2 text-sm">
          AI has analyzed your profile and created this custom path to help you land a 
          <span className="text-indigo-600"> Full Stack Developer</span> role.
        </p>
      </div>

      {/* Roadmap Path */}
      <div className="max-w-4xl mx-auto relative">
        {/* Vertical Line Connector */}
        <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-slate-200 dashed-border" />

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex gap-10 group">
              
              {/* Step Icon Indicator */}
              <div className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                step.status === 'current' ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
                'bg-white border-2 border-slate-200 text-slate-300'
              }`}>
                {step.status === 'completed' ? <CheckCircleIcon className="w-7 h-7" /> : 
                 step.status === 'locked' ? <LockClosedIcon className="w-6 h-6" /> : 
                 <AcademicCapIcon className="w-7 h-7" />}
              </div>

              {/* Step Content Card */}
              <div className={`flex-1 bg-white p-6 rounded-[28px] border transition-all ${
                step.status === 'current' ? 'border-indigo-200 shadow-xl shadow-indigo-500/5' : 'border-slate-100 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-black ${step.status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {step.id}</p>
                  </div>
                  {step.status === 'current' && (
                    <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-tighter">
                      In Progress
                    </span>
                  )}
                </div>

                {/* Topics Grid */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {step.topics.map((topic, i) => (
                    <span key={i} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                      step.status === 'locked' ? 'bg-slate-50 border-slate-100 text-slate-300' : 'bg-white border-slate-200 text-slate-600 group-hover:border-indigo-100'
                    }`}>
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Call to Action */}
                {step.status === 'current' && (
                  <button className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-wider hover:gap-3 transition-all group/btn">
                    Start Learning <ArrowRightIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap;