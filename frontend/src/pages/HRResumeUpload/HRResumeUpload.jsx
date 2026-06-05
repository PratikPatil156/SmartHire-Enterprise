import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2, Files } from 'lucide-react';

const ResumeUpload = () => {
  // HR ke liye hum multiple files support karenge (Array state)
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Sirf PDF filter kar rahe hain
    const validFiles = selectedFiles.filter(file => file.type === "application/pdf");
    
    if (validFiles.length < selectedFiles.length) {
      showToast("Some files were skipped. Please upload PDF files only.", "error");
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulating Backend API call
    setTimeout(() => {
      setIsUploading(false);
      showToast(`${files.length} Resumes processed and added to Database!`, "success");
      setFiles([]);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bulk Resume Upload</h1>
          <p className="text-slate-500 mt-1 font-medium">Add new candidates to your talent pool using AI parsing.</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Storage Status</span>
          <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="w-2/3 h-full bg-blue-500"></div>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div className={`relative border-2 border-dashed rounded-[32px] p-16 transition-all duration-300 ${
        files.length > 0 ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 bg-white hover:border-blue-500'
      }`}>
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileChange}
          accept=".pdf"
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Drop resumes here to start parsing</h3>
          <p className="text-slate-400 mt-2 font-medium">Select multiple PDF files from your computer</p>
        </div>
      </div>

      {/* Selected Files List (HR Style Grid) */}
      {files.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Files size={16} /> Selected Resumes ({files.length})
            </h2>
            <button onClick={() => setFiles([])} className="text-xs font-bold text-red-500 hover:underline">Clear All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {files.map((f, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-500 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="truncate max-w-[180px] lg:max-w-[250px]">
                    <p className="text-sm font-bold text-slate-700 truncate">{f.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-6">
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className={`min-w-[280px] py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 ${
                isUploading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'
              }`}
            >
              {isUploading ? (
                <> <Loader2 className="animate-spin" /> AI is Parsing... </>
              ) : (
                'Process Resumes into Talent Pool'
              )}
            </button>
          </div>
        </div>
      )}

      {/* HR Stats/Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <CheckCircle size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Smart De-duplication</h4>
            <p className="text-xs text-slate-500 mt-1">Our AI automatically detects if a candidate already exists in the system.</p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
                <AlertCircle size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Quality Check</h4>
            <p className="text-xs text-slate-500 mt-1">Resumes with low-resolution images or missing contact info will be flagged.</p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Upload size={20} />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Auto-Tagging</h4>
            <p className="text-xs text-slate-500 mt-1">AI will automatically assign skills and seniority tags upon upload.</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
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

export default ResumeUpload;

