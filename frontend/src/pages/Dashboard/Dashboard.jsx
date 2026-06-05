import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Plus, UserCheck, Calendar, X, Clock, Users, FileText, ChevronRight, BriefcaseBusiness, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { hrService } from '../../services/api';

const fallbackGraphData = [];


const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await hrService.getDashboard();
        setData(res);
      } catch (err) {
        console.error("Error loading HR dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Compute stats list based on live database data
  const statsList = [
    {
      title: 'Total Candidates',
      value: data?.stats?.total_candidates || '0',
      growth: data?.stats?.total_candidates_growth || '+0%',
      icon: <Users size={20} />,
      bg: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Screened Resumes',
      value: data?.stats?.screened_resumes || '0',
      growth: data?.stats?.screened_resumes_growth || '+0%',
      icon: <FileText size={20} />,
      bg: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Shortlisted',
      value: data?.stats?.shortlisted || '0',
      growth: data?.stats?.shortlisted_growth || '+0%',
      icon: <UserCheck size={20} />,
      bg: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Interview Scheduled',
      value: data?.stats?.interviews_scheduled || '0',
      growth: data?.stats?.interviews_scheduled_growth || '+0%',
      icon: <Calendar size={20} />,
      bg: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Hired',
      value: data?.stats?.hired || '0',
      growth: data?.stats?.hired_growth || '+0%',
      icon: <Award size={20} />,
      bg: 'bg-green-50 text-green-700'
    },
  ];

  // Candidates list mapping from recent candidates with robust fallbacks
  const recentCandidates = (data?.recent_candidates && data.recent_candidates.length > 0)
    ? data.recent_candidates.map((c) => {
        if (!c) return null;
        const scoreVal = parseInt(c.ai_score || 0);
        const scoreClass = scoreVal >= 80 ? 'text-emerald-500' : (scoreVal >= 50 ? 'text-blue-500' : 'text-rose-500');
        const statusClass = c.status?.toLowerCase() === 'hired' ? 'bg-green-50 text-green-700 border border-green-100' : (c.status?.toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' : (c.status?.toLowerCase() === 'applied' ? 'bg-amber-50 text-amber-700 border border-amber-100' : (['interviewing', 'shortlisted'].includes(c.status?.toLowerCase()) ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-50 text-slate-600 border border-slate-100')));
        return {
          id: c.candidate_id || c.id,
          name: c.candidate_name || "Unknown Candidate",
          email: c.candidate_email || "no-email@smarthire.com",
          role: c.job_title || "Unknown Role",
          score: `${scoreVal}%`,
          status: c.status || "Applied",
          statusClass,
          scoreClass,
          skills: c.skills && c.skills.length > 0 ? c.skills : ["General"]
        };
      }).filter(Boolean)
    : [];

  const graphData = data?.graph_data || fallbackGraphData;

  // Pie chart data loading
  const pieChartData = (data?.pie_data && data.pie_data.length > 0)
    ? data.pie_data.map(item => ({
        name: item.name || "Skill",
        value: item.value || 0,
        color: item.color || "#3b82f6"
      }))
    : [];

  // Activities list loading
  const activitiesList = (data?.activities && data.activities.length > 0)
    ? data.activities.map((act) => {
        if (!act) return null;
        let iconEl = <Clock size={16} />;
        let colorClass = 'bg-blue-50 text-blue-600';
        if (act.icon === 'plus') {
          iconEl = <Plus size={16} />;
          colorClass = 'bg-blue-50 text-blue-600';
        } else if (act.icon === 'check') {
          iconEl = <UserCheck size={16} />;
          colorClass = 'bg-emerald-50 text-emerald-600';
        } else if (act.icon === 'close') {
          iconEl = <X size={16} />;
          colorClass = 'bg-rose-50 text-rose-600';
        } else if (act.icon === 'hired') {
          iconEl = <Award size={16} />;
          colorClass = 'bg-green-50 text-green-700';
        }
        return {
          title: act.title || "Activity",
          time: act.time || "Just now",
          sub: act.sub || "",
          icon: iconEl,
          color: colorClass
        };
      }).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900 pb-10 w-full">
      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-8 w-full">

        {/* STATS CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {statsList.map((item, index) => {
            const isNegative = item.growth.startsWith('-');
            const growthColor = isNegative ? 'text-rose-500' : 'text-emerald-500';
            return (
              <div key={index} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`${item.bg} p-3 rounded-[15px]`}>{item.icon}</div>
                  <p className="text-slate-500 text-[13px] font-medium">{item.title}</p>
                </div>
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-black text-slate-800">{item.value}</h2>
                  <span className={`${growthColor} text-[12px] font-bold pb-1`}>
                    {item.growth} <span className="text-slate-400 font-normal ml-1">this month</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 1: GRAPH & PIE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Left Column: Area Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-6 text-[16px]">Resume Screening Analytics</h3>
            <div className="flex gap-6 mb-6 text-[12px] font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <span className="text-slate-500">Resumes Uploaded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                <span className="text-slate-500">Shortlisted Candidates</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={graphData} margin={{ top: 10, right: 10, left: -25, bottom: 15 }}>
                  <defs>
                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                    dx={-5}
                  />
                  <Tooltip />
                  <Area type="monotone" dataKey="uploaded" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUp)" />
                  <Area type="monotone" dataKey="shortlisted" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorShort)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Pie Chart (Required Skills) */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col min-h-[350px]">
            <h3 className="font-bold text-slate-800 mb-2 text-[16px]">Required Skills</h3>
            <p className="text-slate-400 text-[12px] mb-6">Distribution based on job openings requirements</p>

            <div className="flex flex-col items-center gap-6 w-full flex-1 justify-center">
              {pieChartData.length === 0 ? (
                <div className="text-slate-400 text-xs italic text-center py-6">No required skills data.</div>
              ) : (
                <>
                  <div className="w-36 h-36 relative flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={65}
                          paddingAngle={1.5}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legends Below the Pie Chart (Spacious 2-Column Grid) */}
                  <div className="w-full grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
                    {pieChartData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] font-bold border-b border-slate-50 pb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor: item.color}}></div>
                          <span className="text-slate-500 whitespace-nowrap">{item.name}</span>
                        </div>
                        <span className="text-slate-800 flex-shrink-0 ml-2">{item.value} {item.value === 1 ? 'opening' : 'openings'}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: RECENT CANDIDATES & ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Table Section */}
          <div className="lg:col-span-2 bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <h3 className="font-bold text-slate-800 mb-6">Recent Candidates</h3>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-50">
                      <th className="pb-4 pl-2">Candidate</th>
                      <th className="pb-4">Job Role</th>
                      <th className="pb-4 text-center">Match Score</th>
                      <th className="pb-4 text-center">Status</th>
                      <th className="pb-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentCandidates.map((c, i) => (
                      <tr key={i} className="group hover:bg-slate-50 transition-all duration-200">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} className="w-9 h-9 rounded-full" alt="" />
                            <div>
                              <div className="text-[13px] font-bold text-slate-800 leading-none mb-1">{c.name}</div>
                              <div className="text-[11px] text-slate-400">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-[13px] text-slate-600 font-medium">{c.role}</td>
                        <td className={`py-4 text-center text-[13px] font-bold ${c.scoreClass}`}>{c.score}</td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-block w-24 ${c.statusClass}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => navigate('/candidates', { state: { highlightCandidateId: c.id } })}
                            className="p-2 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {recentCandidates.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-slate-400 text-xs italic">
                          No recent candidates.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="grid grid-cols-1 gap-4 p-2 md:hidden">
                {recentCandidates.map((c, i) => (
                  <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 space-y-3 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${c.name}&background=random`} className="w-9 h-9 rounded-full" alt="" />
                        <div>
                          <div className="text-[13px] font-bold text-slate-800 leading-none mb-1 truncate max-w-[120px]">{c.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{c.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/candidates', { state: { highlightCandidateId: c.id } })}
                        className="p-2 text-blue-500 bg-white border border-slate-200 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shrink-0"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-2.5">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Role</p>
                        <p className="font-bold text-slate-700">{c.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5">Match</p>
                        <span className={`text-xs font-bold ${c.scoreClass}`}>{c.score}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Status</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${c.statusClass}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentCandidates.length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-xs italic">
                    No recent candidates.
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/candidates')}
              className="w-full py-4 bg-slate-50 text-blue-600 text-[13px] font-bold hover:bg-blue-100 transition-colors border-t border-slate-100 flex items-center justify-center gap-2 group"
            >
              View all candidates <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Activity Section */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-6 flex-1">
              <h3 className="font-bold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {activitiesList.map((a, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    {i !== activitiesList.length - 1 && (
                      <div className="absolute left-[19px] top-10 w-[2px] h-[calc(100%-10px)] bg-slate-100 group-hover:bg-slate-200 transition-colors"></div>
                    )}
                    <div className={`${a.color} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm border-4 border-white`}>
                      {a.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-[13px] font-bold text-slate-800">{a.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">{a.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{a.sub}</p>
                    </div>
                  </div>
                ))}
                {activitiesList.length === 0 && (
                  <p className="text-slate-400 text-xs italic text-center py-6">No recent activities logged.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
