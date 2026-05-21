

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginCandidate = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const savedUser = JSON.parse(localStorage.getItem('candidate_user'));
    
    if (savedUser && savedUser.email === data.email && savedUser.password === data.password) {
      localStorage.setItem('role', 'candidate');
      navigate('/dashboard');
    } else {
      alert("Invalid Credentials! Kya aapne Candidate account banaya hai?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      
      {/* --- Optimized Back to Home Button --- */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-slate-200 hover:text-white transition-all z-20 group"
      >
        <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all">
          <ChevronLeft size={20} />
        </div>
        <span className="font-bold text-sm tracking-widest uppercase">Back to Home</span>
      </Link>

      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-blue-600/20 text-blue-400 mb-4 shadow-inner">
            <User size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 font-medium">Candidate Login</p>
        </div>

        {/* Role Switcher Toggle */}
        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl mb-8 border border-slate-800 shadow-inner">
          <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg transition-all">
            Candidate
          </button>
          <Link 
            to="/login-hr" 
            className="flex-1 py-3 text-slate-400 text-sm font-bold text-center hover:text-white transition-colors"
          >
            HR / Recruiter
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              {...register("email")} 
              type="email" 
              placeholder="Email Address" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
              {...register("password")} 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 font-medium">
            New to SmartHire? {' '}
            <Link to="/register-candidate" className="text-blue-400 font-bold hover:text-blue-300 transition-colors underline underline-offset-4">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginCandidate;