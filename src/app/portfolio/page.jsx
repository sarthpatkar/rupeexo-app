'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ArrowUpRight, ArrowDownRight, Menu, X, Plus } from 'lucide-react';

export default function PortfolioPage() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- 1. STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ asset: '', qty: '', avgPrice: '', ltp: '' });

  const [holdings, setHoldings] = useState([
    { id: 1, asset: 'HDFC Bank', qty: 250, avgPrice: 1540.20, ltp: 1680.45 },
    { id: 2, asset: 'Infosys', qty: 120, avgPrice: 1420.00, ltp: 1650.10 },
    { id: 3, asset: 'Reliance', qty: 100, avgPrice: 2950.00, ltp: 2910.50 },
  ]);

  // --- 2. CONSTANTS & HELPERS ---
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
  ];

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(val);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!formData.asset || !formData.qty || !formData.avgPrice || !formData.ltp) return;

    const newHolding = {
      id: Date.now(),
      asset: formData.asset,
      qty: Number(formData.qty),
      avgPrice: Number(formData.avgPrice),
      ltp: Number(formData.ltp),
    };

    setHoldings([...holdings, newHolding]);
    setFormData({ asset: '', qty: '', avgPrice: '', ltp: '' });
    setIsModalOpen(false);
  };

  // Calculations for summary cards
  const totalInvested = holdings.reduce((acc, h) => acc + (h.qty * h.avgPrice), 0);
  const currentValue = holdings.reduce((acc, h) => acc + (h.qty * h.ltp), 0);
  const totalPnL = currentValue - totalInvested;

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f8] font-sans text-slate-800 overflow-hidden relative">

      {/* ── NAVBAR ── */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-[#0f172a] font-semibold text-lg tracking-tight">Rupeexo</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {TOP_NAV_LINKS.map(({ label, href }) => (
            <Link 
              key={label} 
              href={href} 
              className={`px-4 py-2 text-sm transition-colors ${pathname === href ? 'text-[#1e3a8a] font-bold' : 'text-slate-500 hover:text-[#1e3a8a]'}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white">
            <Bell className="w-4 h-4 text-slate-500" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white text-sm font-semibold">A</div>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar - Match width w-64 */}
        <aside className="w-64 bg-[#f0f4f8] border-r border-slate-200 flex flex-col pt-8 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            {SIDEBAR_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`block px-4 py-2.5 rounded-lg text-[13px] transition-colors ${
                  pathname === href
                    ? 'bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold'
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 font-medium'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="px-4 pt-6 flex-1 border-t border-slate-200">
            <h3 className="text-[10px] font-semibold text-slate-400 tracking-widest mb-4 px-2 uppercase">Top Gainers</h3>
            <ul className="space-y-3 px-2">
              {holdings.slice(0, 4).map((h) => (
                <li key={h.id} className="flex justify-between items-center text-[12px] font-semibold text-slate-600">
                  <span>{h.asset.split(' ')[0]}</span>
                  <span className="text-emerald-500 text-[10px]">▲</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f0f4f8] px-8 py-7">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-2xl font-bold text-slate-800">Portfolio Overview</h1>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152754] transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Add Transaction
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Current Value', value: formatCurrency(currentValue), sub: `+${formatCurrency(totalPnL)} Profit`, color: 'text-emerald-500' },
                { label: 'Total Invested', value: formatCurrency(totalInvested), sub: 'Capital', color: 'text-slate-400' },
                { label: "Day's P&L", value: '+₹8,420', sub: '1.24% Up', color: 'text-emerald-500' },
                { label: 'Realized P&L', value: '₹12,400', sub: 'Booked', color: 'text-slate-400' },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-200 px-5 py-4 shadow-sm">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2 tracking-wider">{card.label}</p>
                  <p className="text-[22px] font-bold text-slate-800 mb-1.5">{card.value}</p>
                  <p className={`text-xs ${card.color} font-medium`}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Active Holdings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100 bg-slate-50/30">
                      <th className="p-5 font-bold">Asset</th>
                      <th className="p-5 font-bold text-right">Qty</th>
                      <th className="p-5 font-bold text-right">Avg Price</th>
                      <th className="p-5 font-bold text-right">LTP</th>
                      <th className="p-5 font-bold text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {holdings.map((h) => {
                      const pnl = (h.ltp - h.avgPrice) * h.qty;
                      const isProfit = pnl >= 0;
                      return (
                        <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-5 font-semibold text-slate-700">{h.asset}</td>
                          <td className="p-5 text-slate-600 text-right font-medium">{h.qty}</td>
                          <td className="p-5 text-slate-500 text-right">{formatCurrency(h.avgPrice)}</td>
                          <td className="p-5 text-slate-800 font-bold text-right">{formatCurrency(h.ltp)}</td>
                          <td className={`p-5 font-bold text-right flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {isProfit ? '+' : ''}{formatCurrency(pnl)}
                            {isProfit ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── MODAL OVERLAY ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-5">Add New Holding</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asset Name</label>
                <input 
                  type="text" required placeholder="e.g. ITC Ltd"
                  value={formData.asset} onChange={(e) => setFormData({...formData, asset: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                  <input 
                    type="number" required placeholder="0"
                    value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Avg Price (₹)</label>
                  <input 
                    type="number" required placeholder="0.00"
                    value={formData.avgPrice} onChange={(e) => setFormData({...formData, avgPrice: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Price (LTP) (₹)</label>
                <input 
                  type="number" required placeholder="0.00"
                  value={formData.ltp} onChange={(e) => setFormData({...formData, ltp: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#1e3a8a] hover:bg-[#152754] rounded-xl transition-colors shadow-sm"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}