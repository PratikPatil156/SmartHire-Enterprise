import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Briefcase, Users, Clock, 
  Filter, ExternalLink, MoreVertical, ChevronRight,
  X, Loader2, CheckCircle2, AlertCircle, Trash2, MapPin, Building, Edit3
} from 'lucide-react';
import { jobsService, appsService } from '../../services/api';

const JobOpening = () => {
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("All");
  
  const userStr = localStorage.getItem('user');
  const loggedInUser = userStr ? JSON.parse(userStr) : null;
  const restrictedCompany = loggedInUser?.company || null;
  const isRestricted = !!restrictedCompany;

  // Custom Modals States
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    company: isRestricted ? restrictedCompany : "",
    location: "",
    requirements: "",
    description: ""
  });

  // Notification Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchJobsAndApps = async () => {
    try {
      setLoading(true);
      const [jobsData, appsData] = await Promise.all([
        jobsService.getAll(),
        appsService.getAll()
      ]);
      
      setJobs(jobsData);
      
      // Calculate real applicants counts per job dynamically
      const counts = {};
      appsData.forEach(app => {
        counts[app.job_id] = (counts[app.job_id] || 0) + 1;
      });
      setAppCounts(counts);
    } catch (error) {
      console.error("Error loading jobs data:", error);
      showToast("Failed to load active job openings.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndApps();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setEditingJob(null);
    setFormErrors({});
    setFormData({
      title: "",
      company: isRestricted ? restrictedCompany : "",
      location: "",
      requirements: "",
      description: ""
    });
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      company: isRestricted ? restrictedCompany : (job.company || ""),
      location: job.location || "",
      requirements: job.requirements || "",
      description: job.description || ""
    });
    setFormErrors({});
    setIsOpenModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title || formData.title.trim().length < 3) {
      errors.title = "Job title must be at least 3 characters long";
    }
    if (!formData.company || formData.company.trim().length < 2) {
      errors.company = "Company name must be at least 2 characters long";
    }
    if (!formData.location || formData.location.trim().length < 2) {
      errors.location = "Location must be at least 2 characters long";
    }
    if (!formData.requirements || formData.requirements.trim().length < 2) {
      errors.requirements = "Please enter requirements/skills";
    }
    if (!formData.description || formData.description.trim().length < 15) {
      errors.description = "Description must be at least 15 characters long";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingJob) {
        await jobsService.update(editingJob.id, formData);
        showToast("Job opening updated successfully!", "success");
      } else {
        await jobsService.create(formData);
        showToast("Job opening has been posted successfully!", "success");
      }
      handleCloseModal();
      fetchJobsAndApps();
    } catch (error) {
      showToast(error.message || error || "Failed to save job opening.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    try {
      await jobsService.delete(jobToDelete.id);
      showToast(`Job role "${jobToDelete.title}" deleted successfully!`, "success");
      setJobToDelete(null);
      fetchJobsAndApps();
    } catch (error) {
      showToast(error.message || error || "Failed to delete the job role.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      const diff = new Date() - d;
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) return "Just now";
      if (hours < 24) return `${hours}h ago`;
      
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return dateStr;
    }
  };

  const uniqueJobRoles = Array.from(
    new Set(
      jobs
        .filter(job => !isRestricted || job.company?.toLowerCase() === restrictedCompany.toLowerCase())
        .map(job => job.title)
    )
  ).filter(Boolean);

  const filteredJobs = jobs.filter(job => {
    if (isRestricted && job.company?.toLowerCase() !== restrictedCompany.toLowerCase()) {
      return false;
    }
    if (selectedJobRole !== "All" && job.title !== selectedJobRole) {
      return false;
    }
    return (
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Openings</h1>
          <p className="text-slate-500 text-sm">Post new jobs and track incoming applications dynamically.</p>
        </div>
        <button 
          onClick={() => {
            setEditingJob(null);
            setFormErrors({});
            setFormData({
              title: "",
              company: isRestricted ? restrictedCompany : "",
              location: "",
              requirements: "",
              description: ""
            });
            setIsOpenModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
        >
          <Plus size={20} /> Create New Job
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, location or requirements..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-semibold"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 w-full md:w-auto">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedJobRole}
              onChange={(e) => setSelectedJobRole(e.target.value)}
              className="bg-transparent text-slate-700 text-xs font-bold outline-none cursor-pointer w-full md:min-w-[180px] py-1"
            >
              <option value="All">All Job Roles</option>
              {uniqueJobRoles.map((role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-slate-500 text-sm font-semibold">Fetching active job listings...</p>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Job Role</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredJobs.map((job) => {
                  const applicantsCount = appCounts[job.id] || 0;
                  return (
                    <tr 
                      key={job.id} 
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedJobDetails(job)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{job.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                              {job.company} • {job.location} • Posted {formatDate(job.posted_at)}
                            </p>
                            {job.requirements && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {job.requirements.split(',').slice(0, 3).map((req, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-extrabold rounded-md uppercase tracking-tight">
                                    {req.trim()}
                                  </span>
                                ))}
                                {job.requirements.split(',').length > 3 && (
                                  <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-extrabold rounded-md uppercase tracking-tight">
                                    +{job.requirements.split(',').length - 3} More
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-slate-800">{applicantsCount}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Applied</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter bg-green-100 text-green-700 border border-green-200">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => handleEditClick(job)}
                            className="p-2 hover:bg-blue-50 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm transition-all"
                            title="Edit Job"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => setJobToDelete(job)}
                            className="p-2 hover:bg-red-50 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 shadow-sm transition-all"
                            title="Delete Job"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-semibold text-sm">
                      No active job openings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {filteredJobs.map((job) => {
              const applicantsCount = appCounts[job.id] || 0;
              return (
                <div 
                  key={job.id} 
                  className="bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/60 space-y-4 text-left cursor-pointer"
                  onClick={() => setSelectedJobDetails(job)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{job.company}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{job.location} • {formatDate(job.posted_at)}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wide bg-green-50 text-green-700 border border-green-200 shrink-0">
                      Active
                    </span>
                  </div>

                  {job.requirements && (
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.split(',').slice(0, 3).map((req, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-slate-150 text-slate-600 text-[9px] font-extrabold rounded-md uppercase tracking-tight">
                          {req.trim()}
                        </span>
                      ))}
                      {job.requirements.split(',').length > 3 && (
                        <span className="px-2 py-0.5 bg-white text-slate-400 text-[9px] font-extrabold rounded-md uppercase tracking-tight">
                          +{job.requirements.split(',').length - 3} More
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Applicants:</span>
                      <span className="text-xs font-bold text-slate-800 bg-slate-200/50 px-2 py-0.5 rounded-lg">{applicantsCount}</span>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleEditClick(job)}
                        className="p-1.5 bg-white hover:bg-blue-50 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 transition-all"
                        title="Edit Job"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => setJobToDelete(job)}
                        className="p-1.5 bg-white hover:bg-red-50 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 transition-all"
                        title="Delete Job"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs italic">
                No active job openings found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CREATE OR EDIT JOB MODAL --- */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  {editingJob ? <Edit3 size={22} /> : <Plus size={22} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {editingJob ? "Edit Job Listing" : "Post New Job Opening"}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Recruitment Pipeline</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              
              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-700 transition-all ${
                    formErrors.title ? "border-rose-400 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-200"
                  }`} 
                />
                {formErrors.title && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{formErrors.title}</p>}
              </div>

              {/* Company & Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</label>
                  <input 
                    type="text" 
                    name="company"
                    placeholder="e.g. SmartHire Inc."
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isRestricted}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-700 transition-all ${
                      formErrors.company ? "border-rose-400 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-200"
                    } ${isRestricted ? "opacity-70 bg-slate-100 cursor-not-allowed" : ""}`} 
                  />
                  {formErrors.company && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{formErrors.company}</p>}
                </div>
                
                {/* Job Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    placeholder="e.g. Pune, Maharashtra (Hybrid)"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-700 transition-all ${
                      formErrors.location ? "border-rose-400 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-200"
                    }`} 
                  />
                  {formErrors.location && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{formErrors.location}</p>}
                </div>
              </div>

              {/* Key Skills Requirements */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requirements (Skills taxonomy)</label>
                <input 
                  type="text" 
                  name="requirements"
                  placeholder="e.g. React, JavaScript, Tailwind CSS (comma-separated)"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-700 transition-all ${
                    formErrors.requirements ? "border-rose-400 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-200"
                  }`} 
                />
                {formErrors.requirements && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{formErrors.requirements}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Description</label>
                <textarea 
                  name="description"
                  placeholder="Provide detailed description of roles, responsibilities, and qualifications..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-xs text-slate-700 resize-none transition-all ${
                    formErrors.description ? "border-rose-400 bg-rose-50/10 focus:ring-rose-500/20" : "border-slate-200"
                  }`} 
                />
                {formErrors.description && <p className="text-rose-500 text-[10px] font-bold mt-1 px-1">{formErrors.description}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingJob ? (
                    "Save Changes"
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- JOB DETAILS DRAWER --- */}
      {selectedJobDetails && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[90] flex justify-end animate-in fade-in duration-200"
          onClick={() => setSelectedJobDetails(null)}
        >
          <div 
            className="bg-white w-full max-w-lg h-full p-8 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col justify-between border-l border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{selectedJobDetails.title}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">{selectedJobDetails.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJobDetails(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="space-y-6">
                
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                      <p className="text-xs font-bold">{selectedJobDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Posted At</p>
                      <p className="text-xs font-bold">{formatDate(selectedJobDetails.posted_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Key Requirements (Tags) */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobDetails.requirements ? (
                      selectedJobDetails.requirements.split(',').map((req, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold rounded-xl shadow-xs">
                          {req.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">No specific skills listed.</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Job Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {selectedJobDetails.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-4 pt-6 border-t border-slate-100 mt-8">
              <button 
                onClick={() => {
                  const job = selectedJobDetails;
                  setSelectedJobDetails(null);
                  handleEditClick(job);
                }}
                className="flex-1 py-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all text-center"
              >
                Edit Job Details
              </button>
              <button 
                onClick={() => {
                  const job = selectedJobDetails;
                  setSelectedJobDetails(null);
                  setJobToDelete(job);
                }}
                className="flex-1 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center"
              >
                Delete Listing
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {jobToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Delete Job Listing?</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Are you sure you want to permanently delete the job opening for <strong>{jobToDelete.title}</strong>? All candidate applications linked to this job will be lost.
            </p>
            
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => setJobToDelete(null)}
                className="flex-1 py-3.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3.5 bg-red-600 text-white hover:bg-red-700 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all flex items-center justify-center"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
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

export default JobOpening;
