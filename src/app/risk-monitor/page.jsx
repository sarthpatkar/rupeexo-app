'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, TrendingUp, BarChart3, PieChart, AlertCircle } from 'lucide-react';

export default function RiskMonitorPage() {
  const pathname = usePathname();

  // Helper for active sidebar links
  const navLinkClass = (path) => 
    pathname === path
      ? "block px-4 py-2.5 bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold rounded-lg text-[13px] transition-colors"
      : "block px-4 py-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium rounded-lg text-[13px] transition-colors";

  // Dummy Risk Data for the Table
  const stockRisks = [
    { id: 1, asset: 'HDFC Bank', beta: '1.10', volatility: '18%', riskLevel: 'Low', status: 'Healthy' },
    { id: 2, asset: 'Infosys', beta: '0.85', volatility: '22%', riskLevel: 'Medium', status: 'Watch' },
    { id: 3, asset: 'Reliance', beta: '1.25', volatility: '25%', riskLevel: 'High', status: 'High PE' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Navbar - Matched to Holdings */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0 z-10">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg rounded-md">R</div>
          <span className="text-[22px] font-bold text-[#0f172a] tracking-tight">Rupeexo</span>
        </Link>
        <div className="ml-auto flex items-center gap-5">
          <div className="text-sm font-medium text-slate-400 hidden sm:block">app.rupeexo.com/risk-monitor</div>
          <Link href="/dashboard" className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#1d3570] border border-slate-200 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm">
            <span className="text-lg leading-none mb-0.5">←</span> Dashboard
          </Link>
        </div>
      </nav>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - Matched to Holdings (w-64) */}
        <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col pt-8 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            <Link href="/portfolio" className={navLinkClass('/portfolio')}>Overview</Link>
            <Link href="/holdings" className={navLinkClass('/holdings')}>Holdings</Link>
            <Link href="/fundamentals" className={navLinkClass('/fundamentals')}>Fundamentals</Link>
            <Link href="/risk-monitor" className={navLinkClass('/risk-monitor')}>Risk Monitor</Link>
            <Link href="/ai-summaries" className={navLinkClass('/ai-summaries')}>AI Summaries</Link>
            <Link href="/watchlist" className={navLinkClass('/watchlist')}>Watchlist</Link>
          </nav>

          <div className="px-4 pt-6 flex-1 border-t border-slate-200">
            <h3 className="text-[10px] font-semibold text-slate-400 tracking-widest mb-4 px-2 uppercase tracking-wider">Market Stress</h3>
            <div className="px-2 space-y-4">
               <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 font-medium">India VIX</span>
                  <span className="text-sm font-bold text-rose-500">14.22 (+2.1%)</span>
               </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Risk Monitor</h1>
                <p className="text-sm text-slate-500">Real-time threat detection and portfolio stability metrics.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Beta</div>
                    <div className="text-lg font-bold text-slate-800">1.04</div>
                </div>
                <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Risk Score</div>
                    <div className="text-lg font-bold text-amber-500">62/100</div>
                </div>
              </div>
            </div>

            {/* Risk Grid Cards */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Concentration', sub: '60% in Top 3', level: 'Medium', color: 'bg-amber-400', val: '60%' },
                { title: 'Sector Overlap', sub: 'Diversified', level: 'Low', color: 'bg-emerald-400', val: '25%' },
                { title: 'Leverage', sub: 'Low Debt/Equity', level: 'Low', color: 'bg-emerald-400', val: '20%' },
                { title: 'Valuation', sub: 'High P/E Ratio', level: 'High', color: 'bg-rose-500', val: '85%' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-[#1e3a8a]/30 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      card.level === 'High' ? 'bg-rose-50 text-rose-600' : 
                      card.level === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {card.level}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 mb-4">{card.sub}</p>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${card.color} rounded-full`} style={{ width: card.val }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown Table - Mirroring Holdings Table Style */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Individual Asset Risk Breakdown</h3>
              </div>
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100 bg-slate-50">
                    <th className="p-5 font-semibold">Asset</th>
                    <th className="p-5 font-semibold text-right">Beta (Sensitivity)</th>
                    <th className="p-5 font-semibold text-right">Volatility (Ann.)</th>
                    <th className="p-5 font-semibold text-right">Risk Rating</th>
                    <th className="p-5 font-semibold text-right">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockRisks.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-semibold text-slate-700">{h.asset}</td>
                      <td className="p-5 text-slate-600 text-right font-medium">{h.beta}</td>
                      <td className="p-5 text-slate-500 text-right">{h.volatility}</td>
                      <td className="p-5 text-right font-medium">
                        <span className={`px-2 py-1 rounded text-[11px] ${
                          h.riskLevel === 'High' ? 'text-rose-600 bg-rose-50' : 
                          h.riskLevel === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
                        }`}>
                          {h.riskLevel}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <span className="flex items-center justify-end gap-1.5 text-slate-500 font-medium">
                          <AlertCircle size={14} className={h.status === 'Healthy' ? 'text-emerald-500' : 'text-amber-400'} />
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}