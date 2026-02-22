'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PortfolioPage() {
  const pathname = usePathname();

  // Helper function to check if a link is the active page
  const isActive = (path) => pathname === path;

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* Top Application Navigation Bar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 bg-[#1d3570] text-white flex items-center justify-center font-bold text-lg rounded-md shadow-sm">
            R
          </div>
          <span className="text-[22px] font-bold text-[#1e293b] tracking-tight">
            Rupeexo
          </span>
        </Link>
        
        {/* URL Indicator & Return to Dashboard Button */}
        <div className="ml-auto flex items-center gap-5">
          <div className="text-sm font-medium text-slate-400 hidden sm:block">app.rupeexo.com/portfolio</div>
          
          {/* NEW: Return to Dashboard Button */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#1d3570] border border-slate-200 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <span className="text-lg leading-none mb-0.5">←</span> Dashboard
          </Link>
        </div>
      </nav>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col pt-6 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            
            {/* Navigates to /portfolio (Current Page) */}
            <Link 
              href="/portfolio"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/portfolio') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Overview
            </Link>
            
            {/* Navigates to /holdings */}
            <Link 
              href="/holdings"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/holdings') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Holdings
            </Link>

            {/* Navigates to /fundamentals */}
            <Link 
              href="/fundamentals"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/fundamentals') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Fundamentals
            </Link>

            {/* Navigates to /risk-monitor */}
            <Link 
              href="/risk-monitor"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/risk-monitor') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Risk Monitor
            </Link>

            {/* Navigates to /ai-summaries */}
            <Link 
              href="/ai-summaries"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/ai-summaries') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              AI Summaries
            </Link>

            {/* Navigates to /watchlist */}
            <Link 
              href="/watchlist"
              className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${isActive('/watchlist') ? 'bg-white shadow-sm border border-slate-200 text-[#1d3570] font-semibold' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Watchlist
            </Link>
          </nav>

          {/* Watchlist Quick View Section */}
          <div className="px-4 pt-6 flex-1 border-t border-slate-200">
            <h3 className="text-[10px] font-semibold text-slate-400 tracking-wider mb-4 px-2 uppercase">Watchlist</h3>
            <ul className="space-y-3 px-2">
              {[
                { symbol: 'BAJFINANCE', status: 'up' },
                { symbol: 'PIDILITIND', status: 'up' },
                { symbol: 'DMART', status: 'up' },
                { symbol: 'ASIANPAINT', status: 'up' },
              ].map((stock) => (
                <li key={stock.symbol} className="flex justify-between items-center text-[13px]">
                  <span className="text-slate-600 font-medium">{stock.symbol}</span>
                  <span className="text-emerald-500 text-[10px]">▲</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Dashboard Content Area */}
        <main className="flex-1 p-8 overflow-y-auto bg-white">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* OVERVIEW CONTENT */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-100">
                  <h2 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">Net Worth Tracked</h2>
                  <div className="text-[24px] font-bold text-slate-800 mb-1 leading-tight">₹18.4L</div>
                  <div className="text-xs text-slate-400">+₹56K this month</div>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-100">
                  <h2 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">Portfolio XIRR</h2>
                  <div className="text-[24px] font-bold text-slate-800 mb-1 leading-tight">14.8%</div>
                  <div className="text-xs text-slate-400">vs 12.1% Nifty 50</div>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-100">
                  <h2 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">Risk Score</h2>
                  <div className="flex items-baseline gap-1 mb-1 leading-tight">
                    <span className="text-[24px] font-bold text-slate-800">62/100</span>
                  </div>
                  <div className="text-xs text-slate-400">Moderate — stable</div>
                </div>
                <div className="bg-[#f8fafc] rounded-xl p-5 border border-slate-100">
                  <h2 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-2">Last Analysed</h2>
                  <div className="text-[24px] font-bold text-slate-800 mb-1 leading-tight">4 min ago</div>
                  <div className="text-xs text-slate-400">Auto-synced daily</div>
                </div>
              </div>
            </div>

            {/* BOTTOM SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* FUNDAMENTALS SUMMARY */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6 bg-slate-50 -mt-6 -mx-6 p-4 px-6 border-b border-slate-100 rounded-t-xl">
                  <h3 className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">Fundamental Snapshot</h3>
                  <span className="text-[10px] text-slate-400 font-medium">NSE · FY24</span>
                </div>
                
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100">
                      <th className="pb-3 font-semibold">Company</th>
                      <th className="pb-3 font-semibold text-right">P/E</th>
                      <th className="pb-3 font-semibold text-right">ROE</th>
                      <th className="pb-3 font-semibold text-right">D/E</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-4 font-semibold text-slate-700">HDFC Bank</td>
                      <td className="py-4 text-slate-500 text-right">19.2x</td>
                      <td className="py-4 text-emerald-600 font-semibold text-right">16.8%</td>
                      <td className="py-4 text-slate-500 text-right">0.8</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-semibold text-slate-700">Infosys</td>
                      <td className="py-4 text-slate-500 text-right">24.1x</td>
                      <td className="py-4 text-emerald-600 font-semibold text-right">31.2%</td>
                      <td className="py-4 text-slate-500 text-right">0.0</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-semibold text-slate-700">Reliance</td>
                      <td className="py-4 text-slate-500 text-right">27.3x</td>
                      <td className="py-4 text-emerald-600 font-semibold text-right">9.4%</td>
                      <td className="py-4 text-slate-500 text-right">0.5</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-semibold text-slate-700">TCS</td>
                      <td className="py-4 text-slate-500 text-right">28.6x</td>
                      <td className="py-4 text-emerald-600 font-semibold text-right">46.1%</td>
                      <td className="py-4 text-slate-500 text-right">0.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RISK SUMMARY */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
                <h3 className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase mb-6">Risk Indicators</h3>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-slate-600 font-medium">Concentration Risk</span>
                      <span className="text-slate-400">Medium</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-slate-600 font-medium">Sector Overlap</span>
                      <span className="text-slate-400">Low</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-slate-600 font-medium">Leverage Exposure</span>
                      <span className="text-slate-400">Low</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-slate-600 font-medium">Valuation Risk</span>
                      <span className="text-slate-400">High</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase mb-2">Insight (AI Summary)</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Valuation risk is elevated. Consider averaging into defensive positions before Q4 earnings cycle.
                  </p>
                </div>

              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}