'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AiSummariesPage() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (path) => 
    pathname === path
      ? "block px-4 py-2.5 bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold rounded-lg text-[13px] transition-colors"
      : "block px-4 py-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium rounded-lg text-[13px] transition-colors";

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-6 md:px-8 shrink-0 z-10">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="text-[#0f172a] font-semibold text-lg tracking-tight">
            Rupeexo
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block text-sm font-medium text-slate-500">
            app.rupeexo.com/ai-summaries
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-150"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1.5px] bg-slate-600 transition-all duration-200 origin-center ${
                mobileOpen ? 'w-4 rotate-45 translate-y-[6.5px]' : 'w-5'
              }`}
            />
            <span
              className={`block h-[1.5px] bg-slate-600 transition-all duration-200 ${
                mobileOpen ? 'opacity-0 w-0' : 'w-5'
              }`}
            />
            <span
              className={`block h-[1.5px] bg-slate-600 transition-all duration-200 origin-center ${
                mobileOpen ? 'w-4 -rotate-45 -translate-y-[6.5px]' : 'w-5'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#f8fafc] border-r border-slate-200 flex flex-col pt-8 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            <Link href="/portfolio" className={navLinkClass('/portfolio')}>Overview</Link>
            <Link href="/holdings" className={navLinkClass('/holdings')}>Holdings</Link>
            <Link href="/fundamentals" className={navLinkClass('/fundamentals')}>Fundamentals</Link>
            <Link href="/risk-monitor" className={navLinkClass('/risk-monitor')}>Risk Monitor</Link>
            <Link href="/ai-summaries" className={navLinkClass('/ai-summaries')}>AI Summaries</Link>
            <Link href="/watchlist" className={navLinkClass('/watchlist')}>Watchlist</Link>
          </nav>

          {/* Watchlist Quick View */}
          <div className="px-4 pt-6 flex-1 border-t border-slate-200">
            <h3 className="text-[10px] font-semibold text-slate-400 tracking-widest mb-4 px-2 uppercase">Watchlist</h3>
            <ul className="space-y-3 px-2">
              {[
                { symbol: 'BAJFINANCE', status: 'up' },
                { symbol: 'PIDILITIND', status: 'up' },
                { symbol: 'DMART', status: 'up' },
                { symbol: 'ASIANPAINT', status: 'up' },
              ].map((stock) => (
                <li key={stock.symbol} className="flex justify-between items-center text-[12px] font-semibold text-slate-600">
                  <span>{stock.symbol}</span>
                  <span className="text-emerald-500 text-[10px]">▲</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6 overflow-y-auto">
              <nav className="space-y-2">
                <Link href="/portfolio" onClick={() => setMobileOpen(false)} className={navLinkClass('/portfolio')}>Overview</Link>
                <Link href="/holdings" onClick={() => setMobileOpen(false)} className={navLinkClass('/holdings')}>Holdings</Link>
                <Link href="/fundamentals" onClick={() => setMobileOpen(false)} className={navLinkClass('/fundamentals')}>Fundamentals</Link>
                <Link href="/risk-monitor" onClick={() => setMobileOpen(false)} className={navLinkClass('/risk-monitor')}>Risk Monitor</Link>
                <Link href="/ai-summaries" onClick={() => setMobileOpen(false)} className={navLinkClass('/ai-summaries')}>AI Summaries</Link>
                <Link href="/watchlist" onClick={() => setMobileOpen(false)} className={navLinkClass('/watchlist')}>Watchlist</Link>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-[800px] mx-auto space-y-6">
            
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-slate-800">Intelligence Briefing</h1>
              <p className="text-sm text-slate-500 mt-1">Automated structural insights based on your current portfolio data.</p>
            </div>

            {/* AI Insight Card 1 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">Portfolio Structure</span>
                <span className="text-[11px] text-slate-400 font-medium ml-auto">Generated 2 hours ago</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Technology Overweight Detected</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your portfolio is heavily weighted toward Technology (TCS, Infosys), comprising 33% of your total holdings. This is roughly 18% higher than the Nifty 50 benchmark allocation. While this increases potential upside, it heavily exposes your portfolio to US recessionary risks and currency fluctuations.
              </p>
            </div>

            {/* AI Insight Card 2 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-rose-600 tracking-widest uppercase">Earnings Alert</span>
                <span className="text-[11px] text-slate-400 font-medium ml-auto">Generated yesterday</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">HDFC Bank Q3 Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Recent filings indicate Net Interest Margin (NIM) compression for HDFC Bank due to higher cost of funds. As this represents 24% of your portfolio, consider reviewing management commentary in the upcoming earnings call to assess if this margin pressure is structural or transitory.
              </p>
            </div>

            {/* AI Insight Card 3 */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Dividend Update</span>
                <span className="text-[11px] text-slate-400 font-medium ml-auto">Generated 3 days ago</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Expected Yield Adjustment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Based on historical payout ratios and recent profitability metrics, your portfolio is on track to generate approximately ₹22,500 in dividends this quarter. Reliance Industries has maintained a steady payout structure supporting this baseline.
              </p>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}