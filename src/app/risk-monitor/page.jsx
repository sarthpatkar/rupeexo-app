'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RiskMonitorPage() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 bg-[#1d3570] text-white flex items-center justify-center font-bold text-lg rounded-md shadow-sm">R</div>
          <span className="text-[22px] font-bold text-[#1e293b] tracking-tight">Rupeexo</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm font-medium text-slate-500">app.rupeexo.com/risk-monitor</div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col pt-6 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            <Link href="/portfolio" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/portfolio') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>Overview</Link>
            <Link href="/holdings" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/holdings') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>Holdings</Link>
            <Link href="/fundamentals" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/fundamentals') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>Fundamentals</Link>
            <Link href="/risk-monitor" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/risk-monitor') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>Risk Monitor</Link>
            <Link href="/ai-summaries" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/ai-summaries') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>AI Summaries</Link>
            <Link href="/watchlist" className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/watchlist') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}>Watchlist</Link>
          </nav>
        </aside>

        {/* --- MAIN CONTENT AREA FOR RISK MONITOR --- */}
        <main className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Portfolio Risk Monitor</h1>
                <p className="text-sm text-slate-500 mt-1">Aggregated risk analysis across all holdings based on latest filings.</p>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200 px-4 py-2 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Score</div>
                <div className="text-xl font-bold text-slate-800">62<span className="text-sm text-slate-400 font-medium">/100</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Card 1 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Concentration Risk</h3>
                    <p className="text-xs text-slate-500 mt-1">Top 3 holdings make up 60% of portfolio.</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Medium</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Risk Card 2 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Sector Overlap</h3>
                    <p className="text-xs text-slate-500 mt-1">Well diversified across 5 major sectors.</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Low</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Risk Card 3 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Leverage Exposure</h3>
                    <p className="text-xs text-slate-500 mt-1">Underlying companies have low debt-to-equity.</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">Low</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Risk Card 4 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Valuation Risk</h3>
                    <p className="text-xs text-slate-500 mt-1">Portfolio avg P/E is significantly above historical mean.</p>
                  </div>
                  <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide">High</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}