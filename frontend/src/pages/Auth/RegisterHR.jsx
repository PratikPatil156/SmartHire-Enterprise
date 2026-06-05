

import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import BackButton from "../../components/BackButton/BackButton";

import { authService } from '../../services/api';
import { useState } from 'react';

const RegisterHR = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const onSubmit = async (data) => {
    setErrorMsg("");
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const registerData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        role: 'hr',
        company: data.company
      };
      await authService.register(registerData);
      
      // Seed default local representation for fallback credentials checks
      localStorage.setItem('hr_user', JSON.stringify({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        company: data.company
      }));
      
      showToast("HR Account Created successfully! Redirecting to login...", "success");
      setTimeout(() => {
        navigate('/login-hr', { state: { message: "HR Account Created successfully!", type: "success" } });
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || error || "Registration failed. Server Error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
      
      <BackButton />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] py-8 px-10 border border-indigo-500/10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-3 shadow-inner">
            <Building2 size={30} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">HR Register</h2>
          <p className="text-slate-400 mt-1 text-xs font-medium">Create your recruiter profile</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl mb-6 border border-slate-800 shadow-inner">
          <Link 
            to="/register-candidate" 
            className="flex-1 py-3 text-slate-400 text-xs font-bold text-center hover:text-white transition-all"
          >
            Candidate
          </Link>
          <button className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg">
            HR / Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("fullName")} 
              placeholder="Full Name" 
              required 
              className="w-full pl-12 pr-4 py-3.5 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm" 
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("email")} 
              type="email" 
              placeholder="Work Email" 
              required 
              className="w-full pl-12 pr-4 py-3.5 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm" 
            />
          </div>

          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("company")} 
              placeholder="Company Name" 
              required 
              className="w-full pl-12 pr-4 py-3.5 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm" 
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              className="w-full pl-12 pr-12 py-3.5 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("confirmPassword")} 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm Password" 
              required 
              className="w-full pl-12 pr-12 py-3.5 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 text-sm" 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs font-bold text-center mt-2 bg-red-500/10 py-2.5 rounded-xl border border-red-500/20">
              {errorMsg}
            </p>
          )}

          {/* Updated Button Text */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : <>Create HR Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-xs font-medium">
          Already a recruiter? {' '}
          <Link to="/login-hr" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4">
            Log In
          </Link>
        </p>
      </motion.div>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
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

export default RegisterHR;