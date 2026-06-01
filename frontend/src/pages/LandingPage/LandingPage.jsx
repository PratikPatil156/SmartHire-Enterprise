import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Zap, Shield, BarChart3, Users2, 
  ArrowRight, Sparkles, BrainCircuit, 
  Search, FileText, Target, Award, Check, Building2, Laptop, PlayCircle
} from 'lucide-react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('candidate');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const candidateFeatures = [
    { 
      icon: <FileText />, 
      title: "Live AI ATS Resume Scoring", 
      desc: "Upload your resume in-place and get graded instantly. Know your ATS match score against key skills and structural criteria before applying." 
    },
    { 
      icon: <Award />, 
      title: "Interactive Mock Interviews", 
      desc: "Simulate speech & text interviews with our smart AI interviewer. Receive localized breakdown scores, detailed feedback, and key improvement suggestions." 
    },
    { 
      icon: <Target />, 
      title: "Dynamic Skill Roadmaps", 
      desc: "Generate personalized technical skill roadmaps. Follow visual milestone guides to master complex software, coding, or domain expertise." 
    }
  ];

  const hrFeatures = [
    { 
      icon: <Users2 />, 
      title: "Neural Candidate Ranking", 
      desc: "Stop manual resume scanning. Our intelligent ranking system sorts candidates by their semantic match, skills depth, and direct profile relevance." 
    },
    { 
      icon: <Zap />, 
      title: "Smart Recruiter Tags", 
      desc: "Dynamically tag applicants, manage tag color codes, and customize skill directories in a fully state-managed, fluid HR control panel." 
    },
    { 
      icon: <BarChart3 />, 
      title: "Growth Metrics & Audit Trails", 
      desc: "Track candidate pipeline trends with Month-over-Month volume analytics and browse secure, privacy-filtered activity audit logs." 
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden scroll-smooth relative">
      
      {/* Decorative Ambient Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* --- PREMIUM NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        isScrolled 
        ? "bg-[#070b13]/85 backdrop-blur-xl py-4 border-b border-slate-800 shadow-2xl shadow-slate-950/50" 
        : "bg-transparent py-7"
      }`}>
        <div className="max-w-[1400px] mx-auto px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <BrainCircuit className="text-white" size={26} />
            </div>
            <span className="text-2xl font-[1000] tracking-tighter text-white">
              SmartHire<span className="text-blue-500">.</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[12px] font-black uppercase tracking-[0.15em] text-slate-400">
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/login-candidate" className="text-xs font-black uppercase tracking-widest text-slate-300 hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link to="/register-candidate" className="relative overflow-hidden bg-slate-900 border border-slate-800 text-white px-8 py-3.5 rounded-full text-[12px] font-black uppercase tracking-widest group shadow-xl active:scale-95 transition-all">
              <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-56 pb-24 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
            
            <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/40 text-blue-400 px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-[0.15em] mb-10 shadow-inner">
              <Sparkles size={14} className="animate-pulse text-indigo-400" /> Production-Ready AI Recruitment Suite
            </div>
            
            <h1 className="text-5xl md:text-8xl font-[1000] leading-[1.05] tracking-[-0.04em] text-white mb-8">
              AI ATS & Intelligent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Recruitment Evolved.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-medium leading-relaxed mb-12">
              Bridging the loop between top-tier candidates and enterprise recruiters. Simulate interactive mock interviews, analyze ATS resumes, and build dynamic tag workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/login-candidate" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-9 py-5 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95">
                <Laptop size={20} /> Candidate Portal <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/login-hr" className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-200 px-9 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                <Building2 size={20} className="text-indigo-400" /> HR/Recruiter Portal <ArrowRight className="group-hover:translate-x-1.5 transition-transform text-indigo-400" />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* --- ABOUT & STATISTICS SECTION --- */}
      <section id="about" className="py-24 bg-slate-950/40 border-y border-slate-900 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div {...fadeInUp}>
              <h4 className="text-blue-500 font-black tracking-[0.2em] uppercase text-sm mb-4">Core Ecosystem</h4>
              <h2 className="text-4xl md:text-6xl font-[1000] text-white leading-[0.95] tracking-tighter mb-6">
                Engineered for <br />Precision Hiring.
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed max-w-lg mb-4">
                SmartHire integrates deep semantic parsing, responsive skill maps, and audio-text simulated mock interview evaluations to optimize technical workflows.
              </p>
              <div className="flex items-center gap-3 text-slate-300 font-bold text-sm bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 max-w-sm">
                <Shield className="text-blue-500 flex-shrink-0" size={20} />
                <span>Privacy-gated activity logging standard.</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Resumes Evaluated", val: "10,000+" },
                { label: "Interview Sessions", val: "25,000+" },
                { label: "Pipeline Tags Made", val: "99.8%" },
                { label: "Recruiter Efficiency", val: "10x Faster" }
              ].map((s, i) => (
                <div key={i} className="p-8 bg-slate-900/30 backdrop-blur-md rounded-2xl border border-slate-800/80 hover:border-slate-700/60 transition-all group">
                  <div className="text-3xl font-[1000] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1 group-hover:scale-105 transition-transform origin-left">{s.val}</div>
                  <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- INTERACTIVE FEATURES SECTION --- */}
      <section id="features" className="py-28 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto text-center">
          
          <h2 className="text-4xl md:text-6xl font-[1000] tracking-tight mb-8 text-white">
            Tailored Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Dashboards.</span>
          </h2>
          <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto mb-14">
            Toggle between candidate and HR perspectives to explore the exact layout-level capabilities configured inside our portals.
          </p>

          <div className="inline-flex p-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl mb-16 shadow-2xl">
            <button 
              onClick={() => setActiveTab('candidate')} 
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-black transition-all duration-300 ${
                activeTab === 'candidate' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Laptop size={18} /> Candidate Workspace
            </button>
            <button 
              onClick={() => setActiveTab('hr')} 
              className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-black transition-all duration-300 ${
                activeTab === 'hr' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 size={18} /> HR / Recruiter Workspace
            </button>
          </div>

          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }} 
                transition={{ duration: 0.3 }} 
                className="grid md:grid-cols-3 gap-6"
              >
                {(activeTab === 'candidate' ? candidateFeatures : hrFeatures).map((feat, i) => (
                  <div 
                    key={i} 
                    className="p-8 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-2 bg-slate-900/20 border-slate-800/80 hover:border-slate-700/60 shadow-lg"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md ${
                      activeTab === 'candidate' 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-800/30' 
                      : 'bg-indigo-600/10 text-indigo-400 border border-indigo-800/30'
                    }`}>
                      {React.cloneElement(feat.icon, { size: 22 })}
                    </div>
                    <h3 className="text-xl font-black mb-3 text-white tracking-tight">{feat.title}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 bg-slate-950/40 border-t border-slate-900 px-6 relative z-10">
        <div className="max-w-[1200px] mx-auto text-center">
          
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-[1000] mb-4 text-white tracking-tight">
              Flexible Plans, <span className="text-blue-400">Zero Friction.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-16 font-medium">
              Start building your profile or evaluating applicants today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Candidate Plan */}
            <div className="p-10 rounded-2xl bg-slate-900/30 border border-slate-800 text-left hover:border-blue-800/60 transition-all flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black mb-1 uppercase tracking-widest text-slate-500">Candidate Access</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-[1000] text-white">$0</span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Free Tier</span>
                </div>
                <div className="space-y-3.5 mb-10">
                  {['In-Place Resume Uploading', 'Instant ATS Resume Scoring', 'AI Speech/Text Mock Prep', 'Custom Milestone Roadmaps'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-bold text-sm text-slate-300">
                      <Check size={16} className="text-blue-500 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <Link 
                to="/register-candidate" 
                className="block w-full py-4 bg-slate-900 border border-slate-800 hover:border-blue-600 text-slate-200 text-center rounded-xl font-black uppercase tracking-widest hover:text-white transition-all text-xs"
              >
                Create Candidate Account
              </Link>
            </div>

            {/* HR/Recruiter Plan */}
            <div className="p-10 rounded-2xl bg-slate-950/80 border border-slate-800 text-left hover:border-indigo-800/60 transition-all flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-500/5">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-lg">Enterprise</div>
              <div>
                <h3 className="text-xs font-black mb-1 uppercase tracking-widest text-slate-500">Recruiter License</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-[1000] text-white">$99</span>
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
                </div>
                <div className="space-y-3.5 mb-10">
                  {['Semantic Candidate Ranking', 'Smart Recruitment Tag Directories', 'MoM Growth Analytics', 'Privacy-Gated Audit Logs'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 font-bold text-sm text-slate-300">
                      <Check size={16} className="text-indigo-500 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
              <Link 
                to="/register-hr" 
                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-xl font-black uppercase tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all text-xs shadow-lg shadow-indigo-500/10"
              >
                Register Recruiter Portal
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- SLIDING MARQUEE --- */}
      <div className="py-14 overflow-hidden border-y border-slate-900 bg-slate-950/60 pointer-events-none">
        <motion.div 
          animate={{ x: [0, -1200] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }} 
          className="flex gap-16 whitespace-nowrap"
        >
          {[1, 2, 3].map((i) => (
            <span key={i} className="text-5xl font-black text-slate-800 uppercase tracking-tighter italic">
               SmartHire AI Ecosystem • Next Gen Talent • Ethical Intelligence • Seamless Matching • Custom Recruiter Tags • Live ATS Resume Grading • Real-time Mock Interviews •
            </span>
          ))}
        </motion.div>
      </div>

      {/* --- FOOTER --- */}
      <footer id="contact" className="py-20 text-center border-t border-slate-900 bg-[#070b13] px-6 relative z-10">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <BrainCircuit className="text-blue-500" size={28} />
          <span className="text-2xl font-[1000] tracking-tighter text-white">SmartHire<span className="text-blue-500">.</span></span>
        </div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mb-10">The Future of Intelligent Recruitment</p>
        <div className="flex justify-center gap-10 text-slate-500 font-black text-xs uppercase tracking-widest">
          <a href="#" className="hover:text-blue-400 transition-all">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400 transition-all">Terms of Service</a>
          <a href="#" className="hover:text-blue-400 transition-all">Security</a>
          <a href="#" className="hover:text-blue-400 transition-all">Support Desk</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;