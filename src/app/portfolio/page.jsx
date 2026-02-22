'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function PortfolioPage() {
  const pathname = usePathname();

  const TOP_NAV_LINKS = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Screener',  href: '/screener'  },
    { label: 'Analysis',  href: '/analysis'  },
    { label: 'Watchlist', href: '/watchlist' },
  ];

  const SIDEBAR_LINKS = [
    { label: 'Overview',     href: '/portfolio'    },
    { label: 'Holdings',     href: '/holdings'     },
    { label: 'Fundamentals', href: '/fundamentals' },
    { label: 'Risk Monitor', href: '/risk-monitor' },
    { label: 'AI Summaries', href: '/ai-summaries' },
    { label: 'Watchlist',    href: '/watchlist'    },
  ];

  const WATCHLIST_STOCKS = [
    { symbol: 'BAJFINANCE', up: true  },
    { symbol: 'PIDILITIND', up: true  },
    { symbol: 'DMART',      up: true  },
    { symbol: 'ASIANPAINT', up: false },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f8] font-sans text-slate-800 overflow-hidden">

      {/* ── NAVBAR ── */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center shrink-0 z-10">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-[#0f172a] font-semibold text-lg tracking-tight">Rupeexo</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {TOP_NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative px-4 py-2 rounded-md text-sm transition-all duration-150 ${
                    active ? 'text-[#1e3a8a] bg-blue-50 font-medium' : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white text-sm font-semibold">A</div>
          </div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">

        <aside className="w-52 bg-transparent flex flex-col pt-7 pb-4 shrink-0 overflow-hidden">
          <nav className="pl-6 md:pl-8 pr-4 space-y-1 mb-6">
            {SIDEBAR_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`block px-3 py-2 rounded-lg text-[13px] transition-colors ${
                    active ? 'bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="pl-6 md:pl-8 pr-4">
            <div className="border-t border-slate-200 pt-5">
              <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mb-3 px-1">Watchlist</p>
              <ul className="space-y-3 px-1">
                {WATCHLIST_STOCKS.map(({ symbol, up }) => (
                  <li key={symbol} className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-600 font-medium">{symbol}</span>
                    <span className={up ? 'text-emerald-500' : 'text-red-400'}>{up ? '▲' : '▼'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden py-7 pr-6 md:pr-8">
          <div className="flex flex-col h-full space-y-5">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              {[
                { label: 'Net Worth Tracked', value: '₹18.4L', sub: '+₹56K this month', subColor: 'text-emerald-500' },
                { label: 'Portfolio XIRR', value: '14.8%', sub: 'vs 12.1% Nifty 50', subColor: 'text-emerald-500' },
                { label: 'Risk Score', value: '62/100', sub: 'Moderate — stable', subColor: 'text-slate-400' },
                { label: 'Last Analysed', value: '4 min ago', sub: 'Auto-synced daily', subColor: 'text-slate-400' },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
                  <p className="text-[10px] font-semibold text-slate-400 tracking-[0.12em] uppercase mb-2">{card.label}</p>
                  <p className="text-[22px] font-bold text-slate-800 leading-tight mb-1.5">{card.value}</p>
                  <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Bottom Section - SHRUNK HEIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 shrink-0">
              
              {/* Fundamental Snapshot - Shorter Height */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Fundamental Snapshot</p>
                  <span className="text-[9px] text-slate-400 font-medium">NSE · FY24</span>
                </div>
                <div className="px-5 py-3">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['Company', 'P/E', 'ROE', 'D/E'].map((h, i) => (
                          <th key={h} className={`pb-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider ${i > 0 ? 'text-right' : ''}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { name: 'HDFC Bank', pe: '19.2x', roe: '16.8%', de: '0.8' },
                        { name: 'Infosys', pe: '24.1x', roe: '31.2%', de: '0.0' },
                        { name: 'Reliance', pe: '27.3x', roe: '9.4%', de: '0.5' },
                      ].map((row) => (
                        <tr key={row.name}>
                          <td className="py-2.5 text-[12px] font-semibold text-slate-700">{row.name}</td>
                          <td className="py-2.5 text-[12px] text-slate-500 text-right">{row.pe}</td>
                          <td className="py-2.5 text-[12px] font-semibold text-emerald-600 text-right">{row.roe}</td>
                          <td className="py-2.5 text-[12px] text-slate-500 text-right">{row.de}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Risk Indicators - Shorter Height */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-3 flex flex-col">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">Risk Indicators</p>
                <div className="space-y-3.5">
                  {[
                    { label: 'Concentration Risk', pct: 60, color: 'bg-amber-400' },
                    { label: 'Sector Overlap', pct: 25, color: 'bg-emerald-400' },
                    { label: 'Valuation Risk', pct: 85, color: 'bg-rose-500' },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-slate-600 font-medium">{r.label}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{r.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}