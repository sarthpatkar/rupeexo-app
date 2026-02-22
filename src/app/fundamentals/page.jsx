'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FundamentalsPage() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (path) => 
    pathname === path
      ? "block px-4 py-2.5 bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold rounded-lg text-[13px] transition-colors"
      : "block px-4 py-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium rounded-lg text-[13px] transition-colors";

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden">
      
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0 z-10">
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
            app.rupeexo.com/fundamentals
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg border border-slate-200 bg-white"
            aria-label="Toggle menu"
          >
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#f8fafc] border-r border-slate-200 flex-col pt-8 pb-4 shrink-0 overflow-y-auto">
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

        {/* Mobile Sidebar */}
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
          <div className="max-w-[1200px] mx-auto space-y-6">
            
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-2xl font-bold text-slate-800">Fundamentals Deep Dive</h1>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100 bg-slate-50">
                    <th className="p-5 font-semibold">Company</th>
                    <th className="p-5 font-semibold text-right">Market Cap</th>
                    <th className="p-5 font-semibold text-right">P/E Ratio</th>
                    <th className="p-5 font-semibold text-right">P/B Ratio</th>
                    <th className="p-5 font-semibold text-right">ROE</th>
                    <th className="p-5 font-semibold text-right">Debt/Equity</th>
                    <th className="p-5 font-semibold text-right">Div Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-semibold text-slate-700">HDFC Bank</td>
                    <td className="p-5 text-slate-600 text-right font-medium">₹12.8T</td>
                    <td className="p-5 text-slate-500 text-right">19.2x</td>
                    <td className="p-5 text-slate-500 text-right">2.8x</td>
                    <td className="p-5 text-emerald-600 font-semibold text-right">16.8%</td>
                    <td className="p-5 text-slate-500 text-right">0.8</td>
                    <td className="p-5 text-slate-500 text-right">1.2%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-semibold text-slate-700">Infosys</td>
                    <td className="p-5 text-slate-600 text-right font-medium">₹6.9T</td>
                    <td className="p-5 text-slate-500 text-right">24.1x</td>
                    <td className="p-5 text-slate-500 text-right">7.4x</td>
                    <td className="p-5 text-emerald-600 font-semibold text-right">31.2%</td>
                    <td className="p-5 text-slate-500 text-right">0.0</td>
                    <td className="p-5 text-slate-500 text-right">2.4%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="p-5 font-semibold text-slate-700">Reliance</td>
                    <td className="p-5 text-slate-600 text-right font-medium">₹19.2T</td>
                    <td className="p-5 text-slate-500 text-right">27.3x</td>
                    <td className="p-5 text-slate-500 text-right">2.1x</td>
                    <td className="p-5 text-emerald-600 font-semibold text-right">9.4%</td>
                    <td className="p-5 text-slate-500 text-right">0.5</td>
                    <td className="p-5 text-slate-500 text-right">0.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}