import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tag, Search, Plus, Filter, X, CheckCircle2, TrendingUp, Cpu, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { skillsTagsService, appsService } from '../../services/api';

const SkillsAndTags = () => {
  const navigate = useNavigate();
  
  // Data States
  const [topSkills, setTopSkills] = useState([]);
  const [hrTags, setHrTags] = useState([]);
  const [candidates, setCandidates] = useState([]);
  
  // Interactive UI States
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [skillSearch, setSkillSearch] = useState("");
  const [sortBy, setSortBy] = useState("count"); // 'count' (Popular) or 'alpha' (A-Z)
  const [activeCategory, setActiveCategory] = useState("All");
  const [newTagInput, setNewTagInput] = useState("");
  
  // Custom Toast state
  const [toast, setToast] = useState(null);

  // Custom Modal States
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null
  });
  const [tagModal, setTagModal] = useState({
    isOpen: false,
    inputValue: ""
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const data = await skillsTagsService.getSkills();
      setTopSkills(data || []);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchTags = async () => {
    setLoadingTags(true);
    try {
      const data = await skillsTagsService.getTags();
      setHrTags(data || []);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const data = await appsService.getAll();
      setCandidates(data || []);
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchTags();
    fetchCandidates();
  }, []);

  const handleAddTag = () => {
    setTagModal({ isOpen: true, inputValue: "" });
  };

  const submitAddTagModal = async (e) => {
    if (e) e.preventDefault();
    const tagName = tagModal.inputValue.trim();
    if (!tagName) return;

    try {
      await skillsTagsService.addTag(tagName);
      setTagModal({ isOpen: false, inputValue: "" });
      fetchTags();
      showToast(`Tag "${tagName}" created successfully!`, "success");
    } catch (error) {
      showToast(error || "Failed to create recruitment tag.", "error");
    }
  };

  const handleDeleteTag = (tagName) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Recruitment Tag",
      message: `Are you sure you want to delete the tag "${tagName}"? It will be removed from all candidate profiles.`,
      onConfirm: async () => {
        try {
          await skillsTagsService.deleteTag(tagName);
          fetchTags();
          fetchCandidates();
          showToast(`Tag "${tagName}" deleted successfully!`, "success");
        } catch (error) {
          showToast(error || "Failed to delete recruitment tag.", "error");
        } finally {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleInlineAddTag = async (e) => {
    if (e) e.preventDefault();
    const tagName = newTagInput.trim();
    if (!tagName) return;

    try {
      await skillsTagsService.addTag(tagName);
      setNewTagInput("");
      fetchTags();
      showToast(`Tag "${tagName}" created successfully!`, "success");
    } catch (error) {
      showToast(error || "Failed to add tag.", "error");
    }
  };

  // Categorize standard developer skills for category filtering
  const skillCategories = {
    "React": "Frontend", "React.js": "Frontend", "Vue": "Frontend", "Angular": "Frontend", "Svelte": "Frontend",
    "Next.js": "Frontend", "HTML": "Frontend", "CSS": "Frontend", "JavaScript": "Frontend", "TypeScript": "Frontend",
    "Tailwind CSS": "Frontend", "Tailwind": "Frontend", "Bootstrap": "Frontend", "Redux": "Frontend", "Sass": "Frontend",
    "Python": "Backend", "Django": "Backend", "Flask": "Backend", "FastAPI": "Backend", "Java": "Backend",
    "Spring Boot": "Backend", "Node.js": "Backend", "Express": "Backend", "Express.js": "Backend", "C++": "Backend",
    "C#": "Backend", "Ruby": "Backend", "Rails": "Backend", "PHP": "Backend", "Go": "Backend", "Golang": "Backend",
    "SQL": "Database", "MySQL": "Database", "PostgreSQL": "Database", "Postgres": "Database", "MongoDB": "Database",
    "Redis": "Database", "SQLite": "Database", "Oracle": "Database", "AWS": "DevOps", "Docker": "DevOps",
    "Kubernetes": "DevOps", "Azure": "DevOps", "GCP": "DevOps", "Git": "DevOps", "CI/CD": "DevOps",
    "Jenkins": "DevOps", "Terraform": "DevOps", "PyTorch": "AI / Data", "TensorFlow": "AI / Data",
    "Pandas": "AI / Data", "NumPy": "AI / Data", "Scikit-Learn": "AI / Data", "AI": "AI / Data",
    "Machine Learning": "AI / Data", "Data Science": "AI / Data", "Keras": "AI / Data"
  };

  const getSkillCategory = (name) => {
    return skillCategories[name] || "Other";
  };

  // Tag distribution calculations
  const totalCandidates = candidates.length;
  
  // Color coding helper for premium aesthetic look
  const getTagStyle = (tagName) => {
    const name = tagName.toLowerCase();
    if (name.includes("hired") || name.includes("verified")) {
      return "bg-emerald-50 text-emerald-600 border-emerald-100/50";
    }
    if (name.includes("joiner") || name.includes("urgent")) {
      return "bg-amber-50 text-amber-600 border-amber-100/50";
    }
    if (name.includes("review") || name.includes("pending")) {
      return "bg-blue-50 text-blue-600 border-blue-100/50";
    }
    if (name.includes("reject") || name.includes("blacklist")) {
      return "bg-rose-50 text-rose-600 border-rose-100/50";
    }
    return "bg-slate-50 text-slate-600 border-slate-200/50";
  };

  // Filter skills by search query and category
  const filteredSkills = topSkills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(skillSearch.toLowerCase());
      if (activeCategory === "All") return matchesSearch;
      const cat = getSkillCategory(skill.name);
      return matchesSearch && cat.toLowerCase().includes(activeCategory.split(" ")[0].toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "alpha") {
        return a.name.localeCompare(b.name);
      }
      return b.count - a.count;
    });

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen font-sans animate-fade-in relative pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Tag className="text-blue-600 animate-pulse" /> Skills & Tags Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage AI-extracted skills and your custom recruitment tags.</p>
        </div>
        <button 
          onClick={handleAddTag}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={18} /> Create New Tag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: TOP SKILLS ANALYTICS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-500" /> Most Frequent Skills
            </h3>
            
            {loadingSkills ? (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
                <p className="text-xs text-slate-400">Loading skill analytics...</p>
              </div>
            ) : topSkills.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl border-dashed">
                <Cpu className="text-slate-300 mx-auto mb-3" size={28} />
                <p className="text-xs font-bold text-slate-500">No active candidate skills found</p>
                <p className="text-[10px] text-slate-400 mt-1 px-4 leading-relaxed">
                  Upload resumes under Candidates or Candidate Portals to dynamically view live skill analytics here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topSkills.slice(0, 6).map((skill, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate('/candidates', { state: { searchQuery: skill.name } })}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-slate-100/50 hover:shadow-md transition-all group shadow-sm cursor-pointer"
                    title={`Click to filter candidates by ${skill.name}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 rounded-lg text-white text-[10px] font-bold" style={{ backgroundColor: skill.color || '#3b82f6' }}>
                        {skill.name}
                      </span>
                      <span className="text-emerald-500 text-[10px] font-bold">{skill.trend || '+5%'}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-black text-slate-800">{skill.count}</p>
                      <p className="text-[11px] text-slate-400 font-medium">Resumes Found</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SKILL SEARCH & FILTER TABLE */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter skills..." 
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSortBy(prev => prev === "count" ? "alpha" : "count")}
                  className={`px-3 py-2 rounded-xl transition-all font-black uppercase text-[10px] tracking-wider border flex items-center gap-1.5 active:scale-95 ${
                    sortBy === "alpha" 
                      ? "bg-blue-50 text-blue-600 border-blue-200/60 shadow-sm" 
                      : "bg-slate-50 text-slate-500 border-slate-200/50 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  title={sortBy === "alpha" ? "Sorting Alphabetically. Click to sort by Candidate Popularity." : "Sorting by Popularity. Click to sort Alphabetically."}
                >
                  <Filter size={14}/>
                  <span>{sortBy === "alpha" ? "A - Z" : "Popular"}</span>
                </button>
              </div>
            </div>

            {/* Category selection pills */}
            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex flex-wrap gap-2">
              {["All", "Frontend", "Backend", "Database", "DevOps", "AI / Data"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeCategory === cat 
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-white text-slate-500 border border-slate-150 hover:bg-slate-100"
                  }`}
                >
                  {cat === "AI / Data" ? "AI & Data Science" : cat === "DevOps" ? "Cloud & DevOps" : cat}
                </button>
              ))}
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3 min-h-[120px]">
              {loadingSkills ? (
                <div className="col-span-full text-center py-6">
                  <Loader2 className="animate-spin text-blue-600 mx-auto" size={20} />
                </div>
              ) : filteredSkills.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-xs font-bold text-slate-400">No active skills matching the filter.</p>
                </div>
              ) : (
                filteredSkills.map((s, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate('/candidates', { state: { searchQuery: s.name } })}
                    className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    title={`Click to filter candidates by ${s.name}`}
                  >
                    <CheckCircle2 size={14} className="text-blue-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-600 truncate">{s.name}</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded group-hover:bg-blue-50 group-hover:text-blue-600">{s.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: HR CUSTOM TAGS MANAGEMENT & ANALYTICS */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recruitment Tags</h3>
            <p className="text-xs text-slate-400 mb-4 uppercase font-bold tracking-widest">Active Tags</p>
            
            {loadingTags ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-blue-600" size={20} />
              </div>
            ) : hrTags.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No tags created yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-8">
                {hrTags.map((tag, i) => (
                  <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border group cursor-default transition-all uppercase tracking-wider font-bold text-[10px] ${getTagStyle(tag)}`}>
                    <span>{tag}</span>
                    <X 
                      onClick={() => handleDeleteTag(tag)}
                      size={14} 
                      className="cursor-pointer hover:text-red-500 transition-colors ml-0.5" 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Inline Quick Tag Creation */}
            <form onSubmit={handleInlineAddTag} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Quick add tag..." 
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-700"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95"
              >
                <Plus size={16} />
              </button>
            </form>

            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Tags help HR categorize candidates beyond their skills. Use them for process tracking.
              </p>
            </div>
          </div>

          {/* Dynamic Tag Distribution Panel */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <h3 className="text-[15px] font-black text-slate-800 mb-2 flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" /> Distribution Analytics
            </h3>
            <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
              Percentage allocation based on active candidate applications
            </p>

            <div className="space-y-4">
              {hrTags.map((tag, i) => {
                const count = candidates.filter(c => c.tags && c.tags.includes(tag)).length;
                const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
                
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                      <span className="text-slate-600">{tag}</span>
                      <span className="text-slate-400">{count} Candidates ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {hrTags.length === 0 && (
                <p className="text-[11px] text-slate-400 italic text-center py-4">No tags created yet</p>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-2.5">
              <Sparkles className="text-blue-600 shrink-0 mt-0.5" size={14} />
              <div>
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Recruiter Tip</p>
                <p className="text-[10px] text-blue-700/80 mt-1 leading-relaxed">
                  Assign tags like 'Immediate Joiner' or 'Verified' inside candidate rows on the pipeline screen to automatically see live updates.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Premium Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-black text-slate-800 mb-2">{confirmModal.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Delete tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Add Tag Creator Modal */}
      {tagModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 w-full max-w-md p-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-black text-slate-800 mb-2">Create Recruitment Tag</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Enter a custom name for your new tag (e.g. "Immediate Joiner", "Strong Communication").
            </p>
            <form onSubmit={submitAddTagModal} className="space-y-4">
              <input 
                type="text" 
                autoFocus
                placeholder="Tag name..." 
                value={tagModal.inputValue}
                onChange={(e) => setTagModal(prev => ({ ...prev, inputValue: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-700"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setTagModal({ isOpen: false, inputValue: "" })}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Create tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Toast Notification Overlay */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`p-1.5 rounded-lg ${
            toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
            'bg-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          </div>
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
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

export default SkillsAndTags;