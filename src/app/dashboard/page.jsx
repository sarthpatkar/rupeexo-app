"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Search, Eye, ShieldCheck, TrendingUp, Zap, ChevronRight, LayoutGrid
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ComposedChart, Area, PieChart, Pie, Cell, Sector
} from 'recharts';

// --- DATA ---
const performanceData = [
  { date: 'Jan', value: 1240000, profit: 0 },
  { date: 'Feb', value: 1380000, profit: 140000 },
  { date: 'Mar', value: 1310000, profit: 70000 },
  { date: 'Apr', value: 1550000, profit: 310000 },
  { date: 'May', value: 1720000, profit: 480000 },
  { date: 'Jun', value: 1843620, profit: 603620 },
];

const allocationData = [
  { name: 'Direct Equity', value: 1198353, percentage: 65, color: '#4f46e5' }, // Matching Indigo
  { name: 'Mutual Funds', value: 368724, percentage: 20, color: '#10b981' },
  { name: 'Digital Gold', value: 147489, percentage: 8, color: '#f59e0b' },
  { name: 'Liquid Cash', value: 92181, percentage: 5, color: '#64748b' },
  { name: 'Crypto Assets', value: 36873, percentage: 2, color: '#ec4899' },
];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 12} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={16} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.3} />
    </g>
  );
};

export default function Dashboard() {
  const [isIntro, setIsIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const userName = "Abhishek"; 

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsIntro(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val) => mounted ? `₹${val.toLocaleString('en-IN')}` : "";

  return (
    <div className="min-h-screen bg-[#F8F9FF] text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-100">
      
      {/* --- AMBIENT LIQUID BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-indigo-200/30 blur-[140px] rounded-full transition-all duration-1000 ${isIntro ? 'scale-150' : 'scale-100'}`} />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto p-6 md:p-12 lg:p-16">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="relative z-50">
          
          {/* --- BRAND LOGO (MATCHED COLOR) --- */}
          <div className="absolute top-0 left-0 flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-11 w-11 bg-indigo-600 rounded-xl flex items-center justify-center transform group-hover:rotate-[10deg] transition-transform duration-500 shadow-lg shadow-indigo-200">
                <span className="text-white font-black text-xl">R</span>
              </div>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#1e1b4b]">Rupeexo</span>
          </div>

          <div className={`transition-all duration-[1200ms] cubic-bezier(0.19, 1, 0.22, 1) flex flex-col 
            ${isIntro ? 'items-center justify-center min-h-[80vh] text-center' : 'items-start justify-start min-h-0 mb-20 mt-20'}`}>
            
            <div className={`flex items-center gap-3 mb-8 transition-all duration-700 ${isIntro ? 'opacity-100' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
              <div className="p-3 bg-white shadow-xl rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Grade Security</p>
            </div>

            <h1 className={`tracking-tighter transition-all duration-1000 leading-[0.85]
                ${isIntro ? 'text-7xl md:text-[9rem]' : 'text-5xl md:text-7xl'}`}>
                <span className="font-light text-slate-300 italic">Welcome,</span>
                <br />
                <span className="font-black text-[#1e1b4b] relative">
                  {userName}
                  {!isIntro && <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full ml-4 animate-ping" />}
                </span>
            </h1>
          </div>

          {!isIntro && (
            <div className="absolute top-0 right-0 flex items-center gap-6 animate-in fade-in slide-in-from-right-10 duration-1000 mt-2">
               <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">Insights</span>
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">Taxation</span>
                  <span className="text-[#1e1b4b] border-b-2 border-indigo-600 pb-1">Overview</span>
               </div>
               <div className="h-12 w-12 bg-[#1e1b4b] text-white rounded-2xl flex items-center justify-center font-black shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                 {userName[0]}
               </div>
            </div>
          )}
        </header>

        {/* --- MAIN DASHBOARD --- */}
        <main className={`transition-all duration-[1500ms] ${isIntro ? 'opacity-0 translate-y-20 blur-xl pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          
          {/* STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="md:col-span-2 bg-[#4f46e5] p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
               <Zap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
               <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-4">Total Wealth Portfolio</p>
               <h2 className="text-5xl font-black tracking-tighter mb-6">{formatCurrency(1843620)}</h2>
               <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl inline-flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-300" />
                 <span className="text-sm font-bold">+₹6.03L Growth</span>
               </div>
            </div>
            
            {[
              { label: "Profit & Loss", val: "+48.62%", sub: "Lifetime Unrealized", color: "text-emerald-600" },
              { label: "Growth Velocity", val: "14.82%", sub: "CAGR Real-time", color: "text-indigo-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex flex-col justify-center hover:shadow-xl transition-shadow group">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <h3 className={`text-4xl font-black tracking-tighter ${stat.color} group-hover:scale-105 transition-transform`}>{stat.val}</h3>
                <p className="text-slate-400 text-xs mt-2 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 items-stretch">
            {/* PERFORMANCE AREA */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-[#1e1b4b]">Portfolio Trajectory</h3>
                  <p className="text-slate-400 text-sm">Value progression over the last 6 months</p>
                </div>
                <button className="text-xs font-black text-indigo-600 flex items-center gap-1 group">
                  Detailed Analytics <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="flex-1 w-full bg-white border border-slate-50 p-8 rounded-[3rem] shadow-sm min-h-[500px]">
                {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <defs>
                      <linearGradient id="mainVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '20px' }} 
                        formatter={(value) => [formatCurrency(value), "Net Portfolio"]}
                    />
                    <Area type="natural" dataKey="value" stroke="#4f46e5" strokeWidth={6} fill="url(#mainVal)" />
                    <Area type="natural" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.03} />
                  </ComposedChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ASSET DISTRIBUTION */}
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm flex flex-col h-full">
              <h3 className="text-xl font-black tracking-tight mb-8 text-[#1e1b4b]">Asset Diversification</h3>
              <div className="w-full h-[240px] relative mb-10">
                {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      activeIndex={activeIndex} activeShape={renderActiveShape}
                      data={allocationData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} 
                      dataKey="percentage" onMouseEnter={(_, i) => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}
                      stroke="none"
                    >
                      {allocationData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-[#1e1b4b] leading-none">
                      {activeIndex !== null ? `${allocationData[activeIndex].percentage}%` : 'Mix'}
                    </span>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2">
                       {activeIndex !== null ? allocationData[activeIndex].name : 'Assets'}
                    </span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {allocationData.map((asset, i) => (
                  <div key={i} onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeIndex === i ? 'bg-indigo-50/50 translate-x-2' : 'bg-transparent opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: asset.color}} />
                      <span className="text-xs font-black text-[#1e1b4b]">{asset.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{formatCurrency(asset.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UTILITY TILES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { id: "portfolio", t: "Portfolio", i: LayoutGrid, c: "bg-indigo-50 text-indigo-600" },
          { id: "screener", t: "Screener", i: Search, c: "bg-emerald-50 text-emerald-600" },
          { id: "analysis", t: "Analysis", i: BarChart3, c: "bg-orange-50 text-orange-600" },
          { id: "watchlist", t: "Watchlist", i: Eye, c: "bg-indigo-50 text-indigo-600" },
        ].map((item, idx) => (
          /* This Link tag makes the whole tile clickable to a new URL */
          <Link href={`/${item.id}`} key={idx} className="group block">
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col gap-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl shadow-sm h-full cursor-pointer">
              <div className={`w-14 h-14 ${item.c} rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6`}>
                  <item.i className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                  <span className="text-lg font-black text-[#1e1b4b] tracking-tight">{item.t}</span>
                  <div className="flex items-center gap-2 opacity-60">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">View Section</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
              </div>
              {/* Subtle indigo accent at bottom on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 group-hover:w-full transition-all duration-700 opacity-20" />
            </div>
          </Link>
        ))}
      </div>
        </main>
      </div>
    </div>
  );
}