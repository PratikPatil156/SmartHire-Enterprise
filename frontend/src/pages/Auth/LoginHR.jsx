


import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';
// Sahi path: Auth se bahar (../) -> Pages se bahar (../) -> components/BackButton/BackButton
import BackButton from "../../components/BackButton/BackButton"; 

import { authService } from '../../services/api';
import { useState } from 'react';

const LoginHR = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setToast({ message: location.state.message, type: location.state.type || "success" });
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const onSubmit = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await authService.login({
        email: data.email,
        password: data.password
      });

      if (res.user.role !== 'hr') {
        setErrorMsg("This email is registered as Candidate. Please login as Candidate.");
        setLoading(false);
        return;
      }

      localStorage.setItem('role', res.user.role);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || error || "Invalid Email or Password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 relative overflow-hidden">
      
      {/* --- Reusable Back Button Add Kiya --- */}
      <BackButton />

      {/* Background Glow Effect (Optional: Consistency ke liye) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-indigo-500/10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 text-indigo-500 mb-4 shadow-inner">
            <Briefcase size={32} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">HR Login</h2>
          <p className="text-slate-400 mt-2 font-medium">Recruiter Portal</p>
        </div>

        {/* Role Switcher Toggle */}
        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl mb-8 border border-slate-800 shadow-inner">
          <Link 
            to="/login-candidate" 
            className="flex-1 py-3 text-slate-400 text-sm font-bold text-center hover:text-white transition-all"
          >
            Candidate
          </Link>
          <button className="flex-1 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg transition-all">
            HR / Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("email")} 
              type="email" 
              placeholder="Work Email" 
              required 
              className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              {...register("password")} 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              className="w-full pl-12 pr-12 py-4 bg-[#0f172a] border border-slate-700 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-xs font-bold text-center mt-2 bg-red-500/10 py-2.5 rounded-xl border border-red-500/20">
              {errorMsg}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Signing In..." : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 font-medium">
            New recruiter? {' '}
            <Link to="/register-hr" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4">
              Create HR Account
            </Link>
          </p>
        </div>
      </div>

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

export default LoginHR;