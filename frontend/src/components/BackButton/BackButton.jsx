import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 left-6 md:top-10 md:left-10 z-20"
    >
      <Link 
        to="/" 
        className="flex items-center gap-2 text-slate-200 hover:text-white transition-all group"
      >
        <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all">
          <ChevronLeft size={20} />
        </div>
        <span className="font-bold text-sm tracking-widest uppercase">Back to Home</span>
      </Link>
    </motion.div>
  );
};

export default BackButton;       