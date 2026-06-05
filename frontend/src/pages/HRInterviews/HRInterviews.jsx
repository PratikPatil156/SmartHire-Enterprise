import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Search, CheckCircle2, Timer, 
  ExternalLink, Loader2, ChevronLeft, ChevronRight, X, 
  Copy, Check, Briefcase, Mail, SlidersHorizontal, Sparkles, 
  UserCheck, UserX, CalendarDays
} from 'lucide-react';
import { hrService, appsService } from '../../services/api';

const HRInterviews = () => {
  // --- STATE MANAGEMENT ---
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // "list" | "agenda"
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Upcoming" | "In Progress" | "Completed"
  const [sortOrder, setSortOrder] = useState("soonest"); // "soonest" | "latest" | "rating" | "name"
  
  // Custom Calendar state
  const [selectedDate, setSelectedDate] = useState(null); // Date object or null
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Date Range state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Slide-over Drawer state
  const [activeDrawerCandidate, setActiveDrawerCandidate] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLink, setRescheduleLink] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [updatingDecision, setUpdatingDecision] = useState(false);

  // General Notification Toast
  const [toast, setToast] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [decisionModal, setDecisionModal] = useState({ isOpen: false, status: "" });

  // --- FETCHING DATA ---
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const data = await hrService.getInterviews();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching scheduled interviews:", error);
      showToast("Failed to load interview schedules.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // --- TOAST NOTIFICATION ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // --- HELPER FUNCTIONS ---
  const formatDateToISO = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const normalizeDateStr = (dateStr) => {
    if (!dateStr) return "";
    const clean = dateStr.trim();
    if (clean.toLowerCase() === "today") {
      return formatDateToISO(new Date());
    }
    if (clean.toLowerCase() === "tomorrow") {
      const tom = new Date();
      tom.setDate(tom.getDate() + 1);
      return formatDateToISO(tom);
    }
    if (clean.toLowerCase() === "upcoming") {
      const up = new Date();
      up.setDate(up.getDate() + 2);
      return formatDateToISO(up);
    }
    return clean; // YYYY-MM-DD assumed
  };

  const formatDisplayDate = (dateStr) => {
    const norm = normalizeDateStr(dateStr);
    if (!norm) return dateStr;
    try {
      const d = new Date(norm);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // --- INTERMEDIATE FILTERING & SORTING (FOR 150+ PIPELINE SCALABILITY) ---
  const getFilteredInterviews = () => {
    return interviews.filter((int) => {
      // 1. Search filter
      const matchesSearch = 
        int.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        int.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        int.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // 2. Status filter
      if (statusFilter !== "All" && int.status !== statusFilter) return false;

      // 3. Calendar Selected Date filter
      const normalizedIntDate = normalizeDateStr(int.date);
      if (selectedDate) {
        const selDateStr = formatDateToISO(selectedDate);
        if (normalizedIntDate !== selDateStr) return false;
      }

      // 4. Custom Date Range filter
      if (startDate) {
        if (normalizedIntDate < startDate) return false;
      }
      if (endDate) {
        if (normalizedIntDate > endDate) return false;
      }

      return true;
    }).sort((a, b) => {
      // 5. Sorting engine
      if (sortOrder === "soonest") {
        const dA = new Date(normalizeDateStr(a.date) + " " + a.time);
        const dB = new Date(normalizeDateStr(b.date) + " " + b.time);
        return dA - dB;
      }
      if (sortOrder === "latest") {
        const dA = new Date(normalizeDateStr(a.date) + " " + a.time);
        const dB = new Date(normalizeDateStr(b.date) + " " + b.time);
        return dB - dA;
      }
      if (sortOrder === "rating") {
        return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      }
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };

  const filteredInterviews = getFilteredInterviews();

  // --- PAGINATION MATH ---
  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedInterviews = filteredInterviews.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    // Reset pagination to page 1 whenever filters change to prevent out of bounds
    setCurrentPage(1);
  }, [searchQuery, statusFilter, selectedDate, startDate, endDate, sortOrder]);

  // --- STATS LOGIC ---
  const totalScheduled = interviews.length;
  const completedCount = interviews.filter(i => i.status === 'Completed').length;
  const inProgressCount = interviews.filter(i => i.status === 'In Progress').length;
  const upcomingCount = interviews.filter(i => i.status === 'Upcoming').length;

  const stats = [
    { label: 'Total Scheduled', value: String(totalScheduled).padStart(2, '0'), icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Live Interviews', value: String(inProgressCount).padStart(2, '0'), icon: Timer, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Review', value: String(completedCount).padStart(2, '0'), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // --- CUSTOM MONTH PICKER CALENDAR GENERATION ---
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const dayCells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      dayCells.push(new Date(year, month, i));
    }
    return dayCells;
  };

  const handleMonthPrev = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleMonthNext = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = getDaysInMonth();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Check if calendar day contains any interviews
  const hasInterviewsOnDate = (date) => {
    if (!date) return false;
    const dateStr = formatDateToISO(date);
    return interviews.some(int => normalizeDateStr(int.date) === dateStr);
  };

  // --- ACTIONS ---
  const handleOpenDrawer = (int) => {
    setActiveDrawerCandidate(int);
    setRescheduleDate(normalizeDateStr(int.date));
    setRescheduleTime(int.time);
    setRescheduleLink(int.meet_link || "https://meet.ffmuc.net/SmartHire-abc-defg-hij");
  };

  const handleStartCall = (int) => {
    const link = int.meet_link || "https://meet.ffmuc.net/SmartHire-abc-defg-hij";
    window.open(link, "_blank");
    
    const subject = encodeURIComponent(`SmartHire Video Interview Invitation - ${int.role}`);
    const body = encodeURIComponent(`Hi ${int.name},\n\nYour video interview for the ${int.role} position is about to begin. Please join the video interview room using this link:\n${link}\n\nLooking forward to speaking with you!\n\nBest regards,\nHR Recruiter (SmartHire)`);
    window.location.href = `mailto:${int.email}?subject=${subject}&body=${body}`;
  };

  const copyCalendarInvite = (int) => {
    const meetUrl = int.meet_link || "https://meet.ffmuc.net/SmartHire-abc-defg-hij";
    const inviteMessage = `Subject: Interview Invitation - ${int.role} (SmartHire)

Hi ${int.name},

You are invited to join the video interview scheduled for:
Date: ${formatDisplayDate(int.date)}
Time: ${int.time}

Please join the Jitsi Meet video link below at the scheduled time:
Link: ${meetUrl}

If you have any questions or need to reschedule, please reply directly.

Best regards,
HR Recruitment Team`;
    
    navigator.clipboard.writeText(inviteMessage)
      .then(() => {
        setCopiedId(int.id);
        showToast("Calendar invitation template copied to clipboard!", "success");
        setTimeout(() => setCopiedId(null), 3000);
      })
      .catch(() => showToast("Failed to copy invitation.", "error"));
  };

  const submitReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      showToast("Please fill in both Date and Time.", "error");
      return;
    }
    
    try {
      setRescheduling(true);
      const res = await appsService.updateStatus(activeDrawerCandidate.id, {
        status: "Shortlisted",
        interview_date: rescheduleDate,
        interview_time: rescheduleTime,
        interview_meet_link: rescheduleLink
      });

      const newPasscode = res?.interview_code || activeDrawerCandidate.interview_code;

      showToast("Interview rescheduled successfully!", "success");

      // Update local listing state dynamically
      setInterviews(prev => prev.map(item => 
        item.id === activeDrawerCandidate.id 
          ? { ...item, date: rescheduleDate, time: rescheduleTime, meet_link: rescheduleLink, interview_code: newPasscode }
          : item
      ));

      // Refresh drawer state
      setActiveDrawerCandidate(prev => ({
        ...prev,
        date: rescheduleDate,
        time: rescheduleTime,
        meet_link: rescheduleLink,
        interview_code: newPasscode
      }));
    } catch (err) {
      showToast(err.message || err || "Rescheduling failed.", "error");
    } finally {
      setRescheduling(false);
    }
  };

  const submitHiringDecision = async (status) => {
    if (!decisionModal.isOpen) {
      setDecisionModal({ isOpen: true, status });
      return;
    }

    try {
      setUpdatingDecision(true);
      await appsService.updateStatus(activeDrawerCandidate.id, { status: decisionModal.status });
      showToast(`Hiring pipeline updated: Candidate marked as ${decisionModal.status}!`, "success");
      
      // Remove candidate from interviews view
      setInterviews(prev => prev.filter(item => item.id !== activeDrawerCandidate.id));
      setActiveDrawerCandidate(null);
      setDecisionModal({ isOpen: false, status: "" });
    } catch (err) {
      showToast(err.message || err || "Failed to submit recruiter decision.", "error");
    } finally {
      setUpdatingDecision(false);
    }
  };

  // --- GROUPING FOR AGENDA VIEW ---
  const getGroupedAgenda = () => {
    const groups = {};
    filteredInterviews.forEach(int => {
      const dateKey = normalizeDateStr(int.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(int);
    });

    return Object.keys(groups).sort((a, b) => {
      const dA = new Date(a);
      const dB = new Date(b);
      return sortOrder === "latest" ? dB - dA : dA - dB;
    }).map(key => ({
      date: key,
      list: groups[key].sort((x, y) => x.time.localeCompare(y.time))
    }));
  };

  const groupedAgenda = getGroupedAgenda();

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#f8fafc] min-h-screen text-slate-600 w-full font-sans relative overflow-x-hidden">
      
      {/* --- FLOATING TOAST NOTIFICATION --- */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] p-4 rounded-2xl flex items-center gap-3 shadow-xl transition-all duration-300 transform translate-y-0 ${
          toast.type === "error" 
            ? "bg-rose-50 border border-rose-200 text-rose-800" 
            : "bg-emerald-50 border border-emerald-200 text-emerald-800"
        }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-ping"}`} />
          <span className="text-xs font-bold leading-tight">{toast.message}</span>
        </div>
      )}

      {/* --- DASHBOARD HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <Calendar className="text-blue-600" size={28} /> Interview Command Board
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            Production-grade pipeline manager scaling effortlessly up to 150+ interactive candidate schedules.
          </p>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all group">
            <div className={`p-4 rounded-2xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{s.label}</p>
              <h3 className="text-2xl font-black text-slate-800 leading-none">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- SPLIT SCALABILITY WORKSPACE --- */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* === LEFT COLUMN: PERSISTENT MONTHLY CALENDAR SIDEBAR === */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
          
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            {/* Calendar Paging Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={handleMonthPrev}
                  className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleMonthNext}
                  className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of Week label */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              {weekDays.map(day => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            {/* Calendar Day Grid Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const isSelected = selectedDate && formatDateToISO(day) === formatDateToISO(selectedDate);
                const hasInterviews = hasInterviewsOnDate(day);
                
                return (
                  <button
                    key={`day-${idx}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDate(null); // Toggle filter off
                      } else {
                        setSelectedDate(day);
                      }
                    }}
                    className={`h-9 w-full rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center ${
                      isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                        : hasInterviews 
                          ? 'bg-blue-50 text-blue-800 hover:bg-blue-100 font-extrabold border border-blue-200/50' 
                          : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{day.getDate()}</span>
                    {hasInterviews && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-blue-500 absolute bottom-1.5 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Filter Indicator */}
            {selectedDate && (
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Date Filter</span>
                  <span className="text-[11px] font-black text-blue-600">{formatDisplayDate(formatDateToISO(selectedDate))}</span>
                </div>
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="text-[10px] font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-all"
                >
                  Clear Date
                </button>
              </div>
            )}
          </div>

          {/* Quick Filter Info Panel */}
          <div className="bg-slate-800/90 text-white p-5 rounded-[2rem] border border-slate-800 relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
              <Sparkles size={140} />
            </div>
            <h4 className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5 text-blue-400">
              <Sparkles size={14} /> Recruiter Tip
            </h4>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Use the sidebar calendar dots to quickly jump to days containing interviews. The dynamic engine calculates real-time statuses like <span className="text-amber-400 font-black">In Progress</span> based on active system clocks!
            </p>
          </div>

        </div>

        {/* === RIGHT COLUMN: MAIN SCALABLE VIEWSPACE === */}
        <div className="flex-1 w-full space-y-6">

          {/* 1. FILTER BAR & WORKSPACE TABS */}
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Tab Selector */}
              <div className="bg-slate-50 p-1 rounded-2xl flex gap-1 self-start">
                <button
                  onClick={() => setActiveTab("list")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    activeTab === "list" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setActiveTab("agenda")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    activeTab === "agenda" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Weekly Agenda
                </button>
              </div>

              {/* Status Pill Filters */}
              <div className="flex flex-wrap gap-1">
                {["All", "Upcoming", "In Progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === status 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

            </div>

            {/* Divider */}
            <div className="h-px bg-slate-50" />

            {/* Inputs & Advanced Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              
              {/* Search Candidate */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search candidate name, email, role..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-700"
                />
              </div>

              {/* Date Ranges */}
              <div className="md:col-span-4 flex items-center gap-1.5">
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2 px-3 text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                  title="Filter Start Date"
                />
                <span className="text-[10px] font-bold text-slate-400">to</span>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2 px-3 text-[10px] font-black text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                  title="Filter End Date"
                />
                {(startDate || endDate) && (
                  <button 
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    title="Clear Date Filters"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sorting Engine */}
              <div className="md:col-span-3 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-slate-400 flex-shrink-0" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs font-bold text-slate-600 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/10 transition-all"
                >
                  <option value="soonest">Soonest First</option>
                  <option value="latest">Latest First</option>
                  <option value="rating">ATS Star Rating</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

            </div>

          </div>

          {/* 2. LOADER OR CONTENT AREA */}
          {loading ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
              <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
              <p className="text-slate-500 text-sm font-semibold">Syncing real-time database calendars...</p>
            </div>
          ) : (
            <>
              
              {/* TAB 1: LIST VIEW (PAGINATED & SCALE PROTECTED) */}
              {activeTab === "list" && (
                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] border-b border-slate-100">
                        <tr>
                          <th className="px-8 py-5">Candidate</th>
                          <th className="px-8 py-5">Date & Time</th>
                          <th className="px-8 py-5">Access Passcode</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5">ATS Score</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {paginatedInterviews.map((int) => (
                          <tr 
                            key={int.id} 
                            onClick={() => handleOpenDrawer(int)}
                            className="hover:bg-blue-50/30 transition-all group cursor-pointer"
                          >
                            {/* Candidate info */}
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                                  {int.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-slate-800 font-bold text-sm leading-tight">{int.name}</p>
                                  <p className="text-slate-400 text-[9px] font-black mt-1 uppercase tracking-wider">{int.role}</p>
                                </div>
                              </div>
                            </td>

                            {/* Date Time */}
                            <td className="px-8 py-5">
                              <div className="text-slate-700 text-xs font-extrabold">{formatDisplayDate(int.date)}</div>
                              <div className="text-blue-500 text-[10px] font-bold mt-0.5">{int.time}</div>
                            </td>

                            {/* Access Passcode */}
                            <td className="px-8 py-5">
                              <span className="font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs font-black text-slate-700">
                                {int.interview_code || '------'}
                              </span>
                            </td>

                            {/* Real Status */}
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                                ${int.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                  int.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                  'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                {int.status}
                              </span>
                            </td>

                            {/* ATS Star Rating */}
                            <td className="px-8 py-5">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-black text-slate-700 border border-slate-100">
                                <span>⭐</span> {int.rating}
                              </div>
                            </td>

                            {/* Row Action Trigger */}
                            <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleStartCall(int)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100 flex items-center gap-1.5 px-3 py-2 text-xs font-bold" 
                                  title="Launch Call"
                                >
                                  <ExternalLink size={13} />
                                  <span>Join Call</span>
                                </button>
                                <button 
                                  onClick={() => copyCalendarInvite(int)}
                                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border border-slate-100 bg-white transition-all"
                                  title="Copy Invite Text"
                                >
                                  {copiedId === int.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}

                        {/* EMPTY STATE */}
                        {filteredInterviews.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-12 text-center text-slate-400 font-semibold text-xs">
                              No scheduled interviews match active filters. Try adjusting calendar dates or search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                    {paginatedInterviews.map((int) => (
                      <div 
                        key={int.id} 
                        onClick={() => handleOpenDrawer(int)}
                        className="bg-slate-50/50 p-5 rounded-[20px] border border-slate-100/60 space-y-4 text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm shrink-0">
                              {int.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-slate-800 font-bold text-sm leading-tight">{int.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{int.role}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shrink-0 
                            ${int.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                              int.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                              'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                            {int.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Scheduled slot</p>
                            <p className="font-bold text-slate-700 mt-0.5">{formatDisplayDate(int.date)}</p>
                            <p className="text-[10px] text-blue-500 font-semibold">{int.time}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Passcode</p>
                            <p className="font-mono font-black text-slate-800 mt-1 bg-white border border-slate-200 px-2 py-0.5 rounded w-fit text-[11px]">
                              {int.interview_code || '------'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg text-[10px] font-black text-slate-700 border border-slate-100">
                            <span>⭐</span> {int.rating} Rating
                          </div>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleStartCall(int)}
                              className="p-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1 px-2 py-1 text-[10px] font-bold" 
                            >
                              <ExternalLink size={11} />
                              <span>Join</span>
                            </button>
                            <button 
                              onClick={() => copyCalendarInvite(int)}
                              className="p-1.5 bg-white text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200"
                            >
                              {copiedId === int.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredInterviews.length === 0 && (
                      <div className="text-center py-10 text-slate-400 text-xs italic">
                        No scheduled interviews match active filters.
                      </div>
                    )}
                  </div>

                  {/* PREMIUM SCALABILITY PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredInterviews.length)} of {filteredInterviews.length} Schedules
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                        >
                          <ChevronLeft size={14} /> Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(num => (
                          <button
                            key={num}
                            onClick={() => setCurrentPage(num)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                              currentPage === num 
                                ? "bg-blue-600 text-white shadow-sm" 
                                : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-150"
                            }`}
                          >
                            {num}
                          </button>
                        ))}

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-150 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                        >
                          Next <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: WEEKLY TIMELINE / GROUPED AGENDA VIEW */}
              {activeTab === "agenda" && (
                <div className="space-y-6">
                  {groupedAgenda.map((group) => (
                    <div key={group.date} className="space-y-3">
                      {/* Date Indicator Card */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                        <CalendarDays size={12} className="text-blue-400" />
                        <span>{formatDisplayDate(group.date)}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span className="text-blue-300">{group.list.length} Candidate{group.list.length > 1 ? 's' : ''}</span>
                      </div>

                      {/* Timeline Candidate cards */}
                      <div className="border-l-2 border-slate-200 ml-4 pl-6 space-y-4 pt-1">
                        {group.list.map((int) => (
                          <div 
                            key={int.id}
                            onClick={() => handleOpenDrawer(int)}
                            className="bg-white p-5 rounded-[1.8rem] border border-slate-100 hover:border-blue-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md cursor-pointer transition-all relative group"
                          >
                            {/* Connected Bullet Pin */}
                            <div className="absolute left-0 top-1/2 -translate-x-[31px] -translate-y-1/2 w-4 h-4 rounded-full bg-white border-4 border-slate-200 group-hover:border-blue-500 transition-colors" />

                            {/* Candidate & Role */}
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-250 text-blue-600 flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-105 transition-transform">
                                {int.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-slate-800 font-bold text-sm leading-none">{int.name}</h4>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-1.5 block">{int.role}</span>
                              </div>
                            </div>

                             {/* Time and Status Pill */}
                             <div className="flex items-center gap-6">
                               <div>
                                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Scheduled</p>
                                 <p className="text-slate-800 font-extrabold text-xs mt-0.5 flex items-center gap-1">
                                   <Clock size={12} className="text-blue-500" /> {int.time}
                                 </p>
                               </div>

                               <div>
                                 <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Passcode</p>
                                 <p className="font-mono text-slate-800 font-extrabold text-xs mt-0.5">
                                   {int.interview_code || '------'}
                                 </p>
                               </div>  
                               
                               <div>
                                <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border 
                                  ${int.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                    int.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                    'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                  {int.status}
                                </span>
                              </div>

                              <div className="hidden md:block">
                                <span className="text-[10px] font-bold text-slate-400">ATS Rating</span>
                                <p className="text-xs font-black mt-0.5">⭐ {int.rating}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end md:self-auto" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => handleStartCall(int)}
                                className="px-3.5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                              >
                                <ExternalLink size={13} />
                                <span>Join Room</span>
                              </button>
                              <button 
                                onClick={() => copyCalendarInvite(int)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 border border-slate-100 bg-white rounded-xl transition-all"
                                title="Copy Invite template"
                              >
                                {copiedId === int.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {groupedAgenda.length === 0 && (
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center text-slate-400 font-semibold text-xs shadow-sm">
                      No scheduled interviews found matching these calendar parameters.
                    </div>
                  )}
                </div>
              )}

            </>
          )}

        </div>

      </div>

      {/* === SLIDE-OVER RECRUITER GLASSMORPHIC DRAWER === */}
      {activeDrawerCandidate && (
        <div 
          onClick={() => setActiveDrawerCandidate(null)}
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[140] animate-in fade-in duration-200"
        />
      )}

      <div className={`fixed inset-y-0 right-0 w-full md:w-[460px] bg-white border-l border-slate-100 shadow-2xl z-[150] transform transition-transform duration-300 ease-out flex flex-col ${
        activeDrawerCandidate ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {activeDrawerCandidate && (
          <>
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-md">
                  {activeDrawerCandidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 leading-tight">{activeDrawerCandidate.name}</h3>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 block">Candidate Workspace</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveDrawerCandidate(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Workspace Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Card 1: Key Profile Metrics */}
              <div className="bg-slate-50/60 p-5 rounded-[1.8rem] border border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase size={12} className="text-blue-500" /> Candidate Profile & Score
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Job Applied</span>
                    <span className="text-xs font-extrabold text-slate-700 leading-tight mt-0.5 block">{activeDrawerCandidate.role}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ATS Match Rating</span>
                    <span className="text-xs font-black text-slate-700 leading-tight mt-0.5 block">⭐ {activeDrawerCandidate.rating} / 5.0</span>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Mail size={12} className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{activeDrawerCandidate.email}</span>
                </div>
              </div>

              {/* Card 2: Live Meeting Workspace */}
              <div className="bg-blue-50/20 p-5 rounded-[1.8rem] border border-blue-200/20 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Video size={12} /> Live Jitsi Meet Room
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled Slot</span>
                    <span className="text-xs font-black text-slate-800 leading-tight block">
                      {formatDisplayDate(activeDrawerCandidate.date)} at <span className="text-blue-600">{activeDrawerCandidate.time}</span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Access Passcode</span>
                    <span className="text-xs font-mono font-black text-slate-800 leading-none block bg-slate-200/50 px-2.5 py-1 rounded w-fit border border-slate-300/30">
                      {activeDrawerCandidate.interview_code || '------'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStartCall(activeDrawerCandidate)}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <ExternalLink size={13} />
                    <span>Launch Meet Call</span>
                  </button>
                  <button 
                    onClick={() => copyCalendarInvite(activeDrawerCandidate)}
                    className="px-3.5 py-2.5 bg-white text-slate-600 border border-slate-150 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    {copiedId === activeDrawerCandidate.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Card 3: In-Place Rescheduler Form */}
              <div className="bg-white p-5 rounded-[1.8rem] border border-slate-150/70 space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" /> Reschedule Interview Time
                </h4>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">New Date</label>
                    <input 
                      type="date" 
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">New Time</label>
                    <input 
                      type="time" 
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Video Call Link</label>
                    <input 
                      type="text" 
                      value={rescheduleLink}
                      onChange={(e) => setRescheduleLink(e.target.value)}
                      placeholder="https://meet.ffmuc.net/SmartHire-..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/10 text-slate-700"
                    />
                  </div>

                  <button
                    disabled={rescheduling}
                    onClick={submitReschedule}
                    className="w-full py-2.5 bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-400 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    {rescheduling ? <Loader2 className="animate-spin" size={13} /> : null}
                    <span>Save Schedule Changes</span>
                  </button>
                </div>
              </div>

              {/* Card 4: Quick Recruiter Pipeline Decision */}
              <div className="bg-rose-50/10 p-5 rounded-[1.8rem] border border-rose-100/40 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                  <UserCheck size={12} /> Log Recruiter Final Decision
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={updatingDecision}
                    onClick={() => submitHiringDecision("Hired")}
                    className="px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-400 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    {updatingDecision ? <Loader2 className="animate-spin" size={12} /> : <UserCheck size={13} />}
                    <span>Hire</span>
                  </button>
                  <button
                    disabled={updatingDecision}
                    onClick={() => submitHiringDecision("Rejected")}
                    className="px-4 py-3 bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-400 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    {updatingDecision ? <Loader2 className="animate-spin" size={12} /> : <UserX size={13} />}
                    <span>Reject</span>
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      {/* --- DECISION CONFIRMATION MODAL --- */}
      {decisionModal.isOpen && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              decisionModal.status === 'Hired' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {decisionModal.status === 'Hired' ? <UserCheck size={28} /> : <UserX size={28} />}
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {decisionModal.status === 'Hired' ? "Confirm Hiring?" : "Confirm Rejection?"}
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Are you sure you want to mark <strong>{activeDrawerCandidate?.name}</strong> as <strong className={decisionModal.status === 'Hired' ? 'text-emerald-600' : 'text-rose-600'}>{decisionModal.status}</strong>? This decision will update their active screening pipeline status.
            </p>
            
            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => setDecisionModal({ isOpen: false, status: "" })}
                className="flex-1 py-3.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => submitHiringDecision(decisionModal.status)}
                disabled={updatingDecision}
                className={`flex-1 py-3.5 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center ${
                  decisionModal.status === 'Hired' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                }`}
              >
                {updatingDecision ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HRInterviews;