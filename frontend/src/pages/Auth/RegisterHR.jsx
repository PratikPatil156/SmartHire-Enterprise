

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from "../../components/BackButton/BackButton";

const RegisterHR = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Dashboard logic ke liye role save karna acha hota hai
    const hrData = { ...data, role: 'hr' };
    localStorage.setItem('hr_user', JSON.stringify(hrData));
    alert("HR Account Created! Ab aap Login karke Dashboard access kar sakte hain.");
    navigate('/login-hr');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      
      <BackButton />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-indigo-500/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-500/20 text-indigo-400 mb-4 shadow-inner">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">HR Register</h2>
          <p className="text-slate-400 mt-2 font-medium">Create your recruiter profile</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl mb-8 border border-slate-800 shadow-inner">
          <Link 
            to="/register-candidate" 
            className="flex-1 py-3 text-slate-400 text-sm font-bold text-center hover:text-white transition-all"
          >
            Candidate
          </Link>
          <button className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg">
            HR / Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("fullName")} 
              placeholder="Full Name" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600" 
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("email")} 
              type="email" 
              placeholder="Work Email" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600" 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("password")} 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600" 
            />
          </div>

          {/* Updated Button Text */}
          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Create HR Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 font-medium">
          Already a recruiter? {' '}
          <Link to="/login-hr" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4">
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterHR;