'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FAMOUS_COMPANIES = [
  "Reliance Industries", "TCS", "HDFC Bank", "ICICI Bank", "Infosys", 
  "Bharti Airtel", "State Bank of India", "Larsen & Toubro", "ITC", "Hindustan Unilever",
  "Bajaj Finance", "Adani Enterprises", "HCL Technologies", "Kotak Mahindra Bank", "Sun Pharma",
  "Titan Company", "Maruti Suzuki", "Asian Paints", "Tata Motors", "UltraTech Cement",
  "Axis Bank", "NTPC", "ONGC", "Power Grid", "Adani Ports", 
  "Bajaj Finserv", "Nestle India", "JSW Steel", "Mahindra & Mahindra", "Coal India"
];

export default function PortfolioPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  // --- 1. STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({ asset: '', qty: '', avgPrice: '', ltp: '' });

  const [holdings, setHoldings] = useState([
    { id: 1, asset: 'HDFC Bank', qty: 250, avgPrice: 1540.20, ltp: 1680.45 },
    { id: 2, asset: 'Infosys', qty: 120, avgPrice: 1420.00, ltp: 1650.10 },
    { id: 3, asset: 'Reliance', qty: 100, avgPrice: 2950.00, ltp: 2910.50 },
  ]);

  // --- 2. LOGIC & HANDLERS ---
  const filteredCompanies = FAMOUS_COMPANIES.filter(c => 
    c.toLowerCase().includes(formData.asset.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddHolding = (e) => {
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

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const navLinkClass = (path) => 
    pathname === path
      ? "block px-4 py-2.5 bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold rounded-lg text-[13px] transition-colors"
      : "block px-4 py-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium rounded-lg text-[13px] transition-colors";

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0 z-10">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg rounded-md">
            R
          </div>
          <span className="text-[22px] font-bold text-[#0f172a] tracking-tight">
            Rupeexo
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg border border-slate-200 bg-white"
            aria-label="Toggle menu"
          >
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-5 bg-slate-600 transition ${mobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#f8fafc] border-r border-slate-200 flex-col pt-8 pb-4 shrink-0 overflow-y-auto">
          <nav className="px-4 space-y-1.5 mb-8">
            <Link href="/portfolio" className={navLinkClass('/portfolio')}>Overview</Link>
            <Link href="/holdings" className={navLinkClass('/holdings')}>Holdings</Link>
            <Link href="/fundamentals" className={navLinkClass('/fundamentals')}>Fundamentals</Link>
            <Link href="/risk-monitor" className={navLinkClass('/risk-monitor')}>Risk Monitor</Link>
            <Link href="/ai-summaries" className={navLinkClass('/ai-summaries')}>AI Summaries</Link>
            <Link href="/watchlist" className={navLinkClass('/watchlist')}>Watchlist</Link>
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6 overflow-y-auto">
              <nav className="space-y-2">
                <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/portfolio')}>Overview</Link>
                <Link href="/holdings" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/holdings')}>Holdings</Link>
                <Link href="/fundamentals" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/fundamentals')}>Fundamentals</Link>
                <Link href="/risk-monitor" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/risk-monitor')}>Risk Monitor</Link>
                <Link href="/ai-summaries" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/ai-summaries')}>AI Summaries</Link>
                <Link href="/watchlist" onClick={() => setMobileMenuOpen(false)} className={navLinkClass('/watchlist')}>Watchlist</Link>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2">
              <h1 className="text-2xl font-bold text-slate-800">Your Portfolio</h1>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#152754] transition-colors shadow-sm"
              >
                + Add New Holding
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100 bg-slate-50">
                    <th className="p-5 font-semibold">Asset</th>
                    <th className="p-5 font-semibold text-right">Qty</th>
                    <th className="p-5 font-semibold text-right">Avg Price</th>
                    <th className="p-5 font-semibold text-right">LTP</th>
                    <th className="p-5 font-semibold text-right">Overall P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((h) => {
                    const currentValue = h.qty * h.ltp;
                    const investedValue = h.qty * h.avgPrice;
                    const pnl = currentValue - investedValue;
                    const isProfit = pnl >= 0;

                    return (
                      <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-semibold text-slate-700">{h.asset}</td>
                        <td className="p-5 text-slate-600 text-right font-medium">{h.qty}</td>
                        <td className="p-5 text-slate-500 text-right">{formatCurrency(h.avgPrice)}</td>
                        <td className="p-5 text-slate-800 font-medium text-right">{formatCurrency(h.ltp)}</td>
                        <td className={`p-5 font-semibold text-right ${isProfit ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {isProfit ? '+' : ''}{formatCurrency(pnl)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL WITH AUTOCOMPLETE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-5">Add New Holding</h2>
            
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Asset Name</label>
                <input 
                  type="text" required placeholder="Search company (e.g. Reliance)"
                  value={formData.asset} 
                  onChange={(e) => {
                    setFormData({...formData, asset: e.target.value});
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
                />
                
                {/* Dropbox / Autocomplete Suggestions */}
                {showDropdown && filteredCompanies.length > 0 && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCompanies.map((company) => (
                      <li 
                        key={company}
                        onClick={() => {
                          setFormData({...formData, asset: company});
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        {company}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                  <input 
                    type="number" required min="1" placeholder="0"
                    value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Avg Price (₹)</label>
                  <input 
                    type="number" required step="any" min="0" placeholder="0.00"
                    value={formData.avgPrice} onChange={(e) => setFormData({...formData, avgPrice: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Price (LTP) (₹)</label>
                <input 
                  type="number" required step="any" min="0" placeholder="0.00"
                  value={formData.ltp} onChange={(e) => setFormData({...formData, ltp: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-sm font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 text-sm font-semibold text-white bg-[#1e3a8a] hover:bg-[#152754] rounded-lg transition-colors shadow-sm">Save Holding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}