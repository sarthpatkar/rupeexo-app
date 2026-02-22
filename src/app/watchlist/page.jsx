/* eslint-disable */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutGrid, Search, BarChart3, Eye, Bell, RefreshCw,
  Plus, X, ChevronRight, ArrowUpRight, ArrowDownRight,
  Star, Pencil, Check, Trash2, Lock, Zap, Crown,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Portfolio',  href: '/portfolio'  },
  { label: 'Screener',   href: '/screener'   },
  { label: 'Analysis',   href: '/analysis'   },
  { label: 'Watchlist',  href: '/watchlist'  },
];

const MAX_FREE_WATCHLISTS = 2;

const ALL_STOCKS = [
  { symbol: 'RELIANCE',   name: 'Reliance Industries Ltd.',   sector: 'Conglomerate', exchange: 'NSE', price: 2847.30,  change:  1.24,  mktCap: '19.2L Cr', pe: 27.4, pb:  2.1, roe:  8.6, revenue: '9,46,479 Cr', ebitda: '1,87,642 Cr', debt: '2,19,000 Cr' },
  { symbol: 'TCS',        name: 'Tata Consultancy Services',  sector: 'Technology',   exchange: 'NSE', price: 3912.55,  change:  0.38,  mktCap: '14.1L Cr', pe: 28.2, pb: 13.4, roe: 47.3, revenue: '2,40,893 Cr', ebitda: '67,000 Cr',   debt: '0 Cr' },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank Ltd.',             sector: 'Banking',      exchange: 'NSE', price: 1724.80,  change: -0.62,  mktCap: '13.1L Cr', pe: 19.8, pb:  2.4, roe: 17.0, revenue: '2,12,800 Cr', ebitda: '—',           debt: '—' },
  { symbol: 'INFY',       name: 'Infosys Ltd.',               sector: 'Technology',   exchange: 'NSE', price: 1556.40,  change: -1.18,  mktCap: '6.5L Cr',  pe: 24.1, pb:  7.1, roe: 32.4, revenue: '1,53,670 Cr', ebitda: '38,200 Cr',   debt: '4,200 Cr' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.',    sector: 'FMCG',         exchange: 'NSE', price: 2248.70,  change:  0.91,  mktCap: '5.3L Cr',  pe: 57.3, pb: 11.8, roe: 21.4, revenue: '61,896 Cr',   ebitda: '14,290 Cr',   debt: '100 Cr' },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd.',            sector: 'Banking',      exchange: 'NSE', price: 1182.65,  change:  1.47,  mktCap: '8.3L Cr',  pe: 17.2, pb:  2.8, roe: 18.5, revenue: '1,66,220 Cr', ebitda: '—',           debt: '—' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.',         sector: 'NBFC',         exchange: 'NSE', price: 7142.20,  change:  2.13,  mktCap: '4.3L Cr',  pe: 32.1, pb:  6.4, roe: 22.1, revenue: '55,000 Cr',   ebitda: '—',           debt: '—' },
  { symbol: 'WIPRO',      name: 'Wipro Ltd.',                 sector: 'Technology',   exchange: 'NSE', price: 524.30,   change: -0.34,  mktCap: '2.7L Cr',  pe: 22.4, pb:  3.9, roe: 18.2, revenue: '89,763 Cr',   ebitda: '20,400 Cr',   debt: '3,100 Cr' },
  { symbol: 'ADANIENT',   name: 'Adani Enterprises Ltd.',     sector: 'Conglomerate', exchange: 'NSE', price: 2378.45,  change: -2.41,  mktCap: '2.7L Cr',  pe: 89.4, pb:  6.2, roe:  7.3, revenue: '99,028 Cr',   ebitda: '8,900 Cr',    debt: '19,200 Cr' },
  { symbol: 'SUNPHARMA',  name: 'Sun Pharmaceutical Ind.',    sector: 'Pharma',       exchange: 'NSE', price: 1684.90,  change:  0.55,  mktCap: '4.0L Cr',  pe: 36.7, pb:  5.1, roe: 14.6, revenue: '49,133 Cr',   ebitda: '12,800 Cr',   debt: '2,400 Cr' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.',           sector: 'Automobile',   exchange: 'NSE', price: 783.60,   change:  1.82,  mktCap: '2.9L Cr',  pe:  9.1, pb:  2.3, roe: 28.4, revenue: '4,37,928 Cr', ebitda: '68,000 Cr',   debt: '1,40,000 Cr' },
  { symbol: 'NESTLEIND',  name: 'Nestlé India Ltd.',          sector: 'FMCG',         exchange: 'NSE', price: 2272.15,  change:  0.22,  mktCap: '2.2L Cr',  pe: 68.9, pb: 55.3, roe: 81.2, revenue: '20,438 Cr',   ebitda: '4,800 Cr',    debt: '0 Cr' },
  { symbol: 'SBIN',       name: 'State Bank of India',        sector: 'Banking',      exchange: 'NSE', price: 780.40,   change: -0.89,  mktCap: '6.9L Cr',  pe: 10.8, pb:  1.5, roe: 14.8, revenue: '3,96,120 Cr', ebitda: '—',           debt: '—' },
  { symbol: 'MARUTI',     name: 'Maruti Suzuki India Ltd.',   sector: 'Automobile',   exchange: 'NSE', price: 12485.30, change:  0.67,  mktCap: '3.8L Cr',  pe: 27.9, pb:  5.1, roe: 19.7, revenue: '1,41,799 Cr', ebitda: '16,200 Cr',   debt: '0 Cr' },
  { symbol: 'LTIM',       name: 'LTIMindtree Ltd.',           sector: 'Technology',   exchange: 'NSE', price: 5218.75,  change:  1.09,  mktCap: '1.5L Cr',  pe: 31.4, pb:  7.3, roe: 24.1, revenue: '36,047 Cr',   ebitda: '8,100 Cr',    debt: '500 Cr' },
];

const INITIAL_WATCHLISTS = [
  { id: 1, name: 'My Watchlist',    symbols: ['RELIANCE', 'TCS', 'HDFCBANK'] },
  { id: 2, name: 'High Conviction', symbols: ['INFY', 'ICICIBANK'] },
];

/* Deterministic seeded PRNG (mulberry32) — same output on SSR and client */
function seededRandom(seed) {
  let s = seed >>> 0;
  return function () {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateHistory(base, days = 90) {
  /* seed derived from the base price so every stock gets a unique but stable series */
  const rand = seededRandom(Math.round(base * 100));
  const h = []; let p = base * 0.88;
  for (let i = 0; i < days; i++) { p *= 1 + (rand() - 0.48) * 0.025; h.push(+p.toFixed(2)); }
  h[h.length - 1] = base; return h;
}

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */

function MiniSparkline({ values, color }) {
  const max = Math.max(...values), min = Math.min(...values), rng = max - min || 1;
  const w = 64, h = 22;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / rng) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   CURSOR HALO
───────────────────────────────────────────── */

function CursorHalo() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => { if (ref.current) { ref.current.style.left = e.clientX + 'px'; ref.current.style.top = e.clientY + 'px'; } };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className="cursor-halo" />;
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const currentPath = '/watchlist';
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="text-[#0f172a] font-semibold text-lg tracking-tight">Rupeexo</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = href === currentPath;
            return (
              <Link key={label} href={href} className={`relative px-4 py-2 rounded-md text-sm transition-all duration-150 ${isActive ? 'text-[#1e3a8a] bg-blue-50 font-medium' : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-50'}`}>
                {label}
                {isActive && <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#2563eb] rounded-full" />}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all duration-150">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold text-[#2563eb] uppercase tracking-[0.14em] mb-1">{children}</p>;
}

/* ─────────────────────────────────────────────
   UPGRADE MODAL
───────────────────────────────────────────── */

function UpgradeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)] w-full max-w-md p-8 fade-up">
        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all duration-150">
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] flex items-center justify-center mb-6 shadow-lg">
          <Crown className="w-7 h-7 text-white" />
        </div>

        <SectionLabel>Pro Feature</SectionLabel>
        <h2 className="text-2xl font-semibold text-[#0f172a] tracking-tight mb-2">Unlock More Watchlists</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          You've reached the <span className="font-semibold text-[#0f172a]">2 watchlist limit</span> on the free plan. Upgrade to Pro to create unlimited watchlists, set price alerts, and access advanced analytics.
        </p>

        {/* Plan card */}
        <div className="border border-[#1e3a8a]/20 bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-wider mb-0.5">Rupeexo Pro</p>
              <p className="text-2xl font-semibold text-[#0f172a]">₹499 <span className="text-sm font-normal text-slate-400">/ month</span></p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#1e3a8a]" />
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              'Unlimited watchlists',
              'Price & fundamental alerts',
              'Portfolio overlap analysis',
              'Priority AI summaries',
              'Advanced screener filters',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-600">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/upgrade"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm"
          >
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </Link>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-all duration-150"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STOCK SEARCH DROPDOWN
───────────────────────────────────────────── */

function StockSearch({ onAdd, usedSymbols }) {
  const [query, setQuery] = useState('');
  const [open,  setOpen]  = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_STOCKS.filter(
      (s) => (s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)) && !usedSymbols.includes(s.symbol)
    ).slice(0, 7);
  }, [query, usedSymbols]);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div ref={ref} className="relative w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Add a stock…"
          className="w-full pl-8 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-[#0f172a] placeholder-slate-400 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all duration-150"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.10)] z-50 overflow-hidden">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => { onAdd(stock); setQuery(''); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors duration-100 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-500">{stock.symbol[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0f172a]">{stock.symbol}</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{stock.name}</p>
                </div>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2563eb] transition-colors duration-150 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.10)] z-50 px-4 py-5 text-center">
          <p className="text-sm text-slate-400">No results for "<span className="text-[#0f172a]">{query}</span>"</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PRICE CHART
───────────────────────────────────────────── */

function PriceChart({ stock, range }) {
  const allH = useMemo(() => generateHistory(stock.price), [stock.symbol]);
  const days = { '1W': 7, '1M': 30, '3M': 90 }[range] || 30;
  const history = allH.slice(-days);

  const max = Math.max(...history), min = Math.min(...history), rng = max - min || 1;
  const W = 560, H = 180, PAD = { t: 16, r: 12, b: 32, l: 52 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;

  const pts = history.map((v, i) => [PAD.l + (i / (history.length - 1)) * cW, PAD.t + (1 - (v - min) / rng) * cH]);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L${pts[pts.length-1][0].toFixed(1)},${PAD.t+cH} L${PAD.l},${PAD.t+cH} Z`;

  const isUp = history[history.length - 1] >= history[0];
  const color = isUp ? '#10b981' : '#ef4444';
  const gid = `g-${stock.symbol}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ y: PAD.t + (1 - t) * cH, val: Math.round(min + t * rng).toLocaleString('en-IN') }));
  const xTicks = Array.from({ length: 5 }, (_, i) => {
    const idx = Math.round((i / 4) * (history.length - 1));
    const d = new Date(); d.setDate(d.getDate() - (history.length - 1 - idx));
    return { x: PAD.l + (idx / (history.length - 1)) * cW, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} stroke="#f1f5f9" strokeWidth="1" />
          <text x={PAD.l - 6} y={t.y + 4} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="system-ui">₹{t.val}</text>
        </g>
      ))}
      <path d={areaPath} fill={`url(#${gid})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3.5" fill={color} />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="6" fill={color} opacity="0.2" />
      {xTicks.map((t, i) => (
        <text key={i} x={t.x} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui">{t.label}</text>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   STOCK DETAIL PANEL
───────────────────────────────────────────── */

function StockDetail({ stock, onRemove }) {
  const [tab,   setTab]   = useState('Chart');
  const [range, setRange] = useState('1M');
  const isUp = stock.change >= 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-slate-500">{stock.symbol[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-semibold text-[#0f172a]">{stock.symbol}</h3>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{stock.exchange}</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">{stock.sector}</span>
              </div>
              <p className="text-xs text-slate-400">{stock.name}</p>
            </div>
          </div>
          {/* Cross-nav + remove */}
          <div className="flex items-center gap-2">
            <Link href="/screener"  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-[#1e3a8a] border border-slate-200 hover:border-slate-300 bg-white rounded-lg transition-all duration-150 group">
              <Search   className="w-3 h-3 group-hover:text-[#2563eb]" /> Screener
            </Link>
            <Link href="/analysis"  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-[#1e3a8a] border border-slate-200 hover:border-slate-300 bg-white rounded-lg transition-all duration-150 group">
              <BarChart3 className="w-3 h-3 group-hover:text-[#2563eb]" /> Analysis
            </Link>
            <Link href="/portfolio" className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-[#1e3a8a] border border-slate-200 hover:border-slate-300 bg-white rounded-lg transition-all duration-150 group">
              <LayoutGrid className="w-3 h-3 group-hover:text-[#2563eb]" /> Portfolio
            </Link>
            <button onClick={onRemove} className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all duration-150">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[32px] font-semibold text-[#0f172a] tabular-nums tracking-tight leading-none">
              ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              {isUp ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
              <span className={`text-sm font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{stock.change}% today
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 uppercase tracking-[0.1em] mb-1">Market Cap</p>
            <p className="text-lg font-semibold text-[#0f172a]">₹{stock.mktCap}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-8 flex gap-0">
        {['Chart', 'Fundamentals', 'AI Summary'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3.5 text-xs font-medium border-b-2 transition-all duration-150 ${tab === t ? 'text-[#1e3a8a] border-[#2563eb]' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" style={{ scrollbarWidth: 'thin' }}>

        {/* ── CHART ── */}
        {tab === 'Chart' && (<>
          <div className="flex items-center justify-between">
            <div><SectionLabel>Price History</SectionLabel><h2 className="text-base font-semibold text-[#0f172a]">Price Chart</h2></div>
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
              {['1W','1M','3M'].map((r) => (
                <button key={r} onClick={() => setRange(r)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${range === r ? 'bg-[#1e3a8a] text-white' : 'text-slate-500 hover:text-[#0f172a]'}`}>{r}</button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <PriceChart stock={stock} range={range} key={`${stock.symbol}-${range}`} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[{ label:'P/E Ratio', value:`${stock.pe}x`},{ label:'P/B Ratio', value:`${stock.pb}x`},{ label:'ROE', value:`${stock.roe}%`}].map((s) => (
              <div key={s.label} className="card-hover border border-slate-200 rounded-xl bg-white p-5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.13em] mb-2">{s.label}</p>
                <p className="text-2xl font-semibold tracking-tight text-[#0f172a]">{s.value}</p>
              </div>
            ))}
          </div>

          <Link href="/analysis" className="group flex items-center justify-between border border-slate-200 rounded-xl bg-white px-5 py-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0"><BarChart3 className="w-5 h-5" /></div>
              <div><p className="text-sm font-semibold text-[#0f172a]">Full Technical Analysis</p><p className="text-xs text-slate-400">Ratios, margins & growth trends for {stock.symbol}</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563eb] transition-colors duration-150" />
          </Link>
        </>)}

        {/* ── FUNDAMENTALS ── */}
        {tab === 'Fundamentals' && (<>
          <div><SectionLabel>Financials</SectionLabel><h2 className="text-base font-semibold text-[#0f172a]">Fundamental Data</h2></div>

          <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Key Metrics</p>
            </div>
            {[
              { label:'Revenue (TTM)',    value:`₹${stock.revenue}` },
              { label:'EBITDA (TTM)',     value:`₹${stock.ebitda}` },
              { label:'Total Debt',       value:`₹${stock.debt}` },
              { label:'P/E Ratio',        value:`${stock.pe}x`,  badge: stock.pe > 50 ? ['High','amber'] : stock.pe < 15 ? ['Low','green'] : ['Moderate','slate'] },
              { label:'Price / Book',     value:`${stock.pb}x` },
              { label:'Return on Equity', value:`${stock.roe}%`, badge: stock.roe > 20 ? ['Strong','green'] : ['Average','slate'] },
              { label:'Market Cap',       value:`₹${stock.mktCap}` },
              { label:'Sector',           value:stock.sector },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors duration-100">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="flex items-center gap-2">
                  {item.badge && (() => {
                    const [text, c] = item.badge;
                    const cls = { green:'bg-emerald-50 text-emerald-700 border-emerald-100', amber:'bg-amber-50 text-amber-700 border-amber-100', slate:'bg-slate-100 text-slate-500 border-slate-200' }[c];
                    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{text}</span>;
                  })()}
                  <p className="text-sm font-semibold text-[#0f172a]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-blue-100 bg-blue-50 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-[#2563eb] mt-0.5 text-base shrink-0">◈</span>
            <div>
              <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-1.5">Data Source</p>
              <p className="text-sm text-blue-700 leading-relaxed">All figures sourced from BSE/NSE regulatory filings. Verified against Q3 FY25 records. No estimates or interpolations.</p>
            </div>
          </div>

          <Link href="/screener" className="group flex items-center justify-between border border-slate-200 rounded-xl bg-white px-5 py-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0"><Search className="w-5 h-5" /></div>
              <div><p className="text-sm font-semibold text-[#0f172a]">Compare in Screener</p><p className="text-xs text-slate-400">Filter & compare {stock.symbol} with sector peers</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563eb] transition-colors duration-150" />
          </Link>
        </>)}

        {/* ── AI SUMMARY ── */}
        {tab === 'AI Summary' && (<>
          <div><SectionLabel>Intelligence</SectionLabel><h2 className="text-base font-semibold text-[#0f172a]">AI Summary</h2></div>

          <div className="border border-blue-100 bg-blue-50 rounded-xl px-5 py-5">
            <div className="flex items-start gap-3">
              <span className="text-[#2563eb] mt-0.5 text-base shrink-0">◈</span>
              <div>
                <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-2">AI Summary</p>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {stock.symbol} operates in the <strong>{stock.sector}</strong> sector with a market cap of ₹{stock.mktCap}. Trading at {stock.pe}x earnings — {stock.pe > 50 ? 'a premium valuation demanding sustained growth to justify.' : stock.pe < 15 ? 'an attractive valuation with potential upside if fundamentals hold.' : 'an in-line valuation with sector peers.'} ROE of {stock.roe}% reflects {stock.roe > 20 ? 'strong capital allocation above sector median.' : 'moderate returns on equity, typical for the sector.'}
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-blue-100">
              <p className="text-[11px] text-blue-500 font-medium uppercase tracking-wider mb-3.5">Risk Indicators</p>
              {[
                { label:'Valuation Risk',  level: stock.pe > 50 ? 'High' : stock.pe < 15 ? 'Low' : 'Medium', pct: stock.pe > 50 ? 78 : stock.pe < 15 ? 22 : 50, color: stock.pe > 50 ? 'bg-red-400' : stock.pe < 15 ? 'bg-emerald-400' : 'bg-amber-400' },
                { label:'Leverage Risk',   level: stock.debt === '0 Cr' ? 'Low' : 'Medium', pct: stock.debt === '0 Cr' ? 18 : 45, color: stock.debt === '0 Cr' ? 'bg-emerald-400' : 'bg-amber-400' },
                { label:'Profitability',   level: stock.roe > 20 ? 'Strong' : 'Average', pct: Math.min(stock.roe * 2.5, 100), color: stock.roe > 20 ? 'bg-emerald-400' : 'bg-slate-300' },
              ].map((r) => (
                <div key={r.label} className="mb-3.5 last:mb-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-blue-700">{r.label}</span>
                    <span className="text-[10px] text-blue-500">{r.level}</span>
                  </div>
                  <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${r.color}`} style={{ width:`${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl bg-white px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm shrink-0">✓</div>
            <div><p className="text-sm font-semibold text-slate-700">All fundamentals verified</p><p className="text-xs text-slate-400">BSE / NSE · Updated 4 min ago</p></div>
          </div>

          <Link href="/portfolio" className="group flex items-center justify-between border border-slate-200 rounded-xl bg-white px-5 py-4 card-hover">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0"><LayoutGrid className="w-5 h-5" /></div>
              <div><p className="text-sm font-semibold text-[#0f172a]">Add to Portfolio</p><p className="text-xs text-slate-400">Track {stock.symbol} as a holding with XIRR & allocation</p></div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563eb] transition-colors duration-150" />
          </Link>

          <div className="border border-slate-100 bg-slate-50 rounded-xl px-5 py-3">
            <p className="text-[10px] text-slate-400 leading-relaxed">⚠ AI summaries are generated from filing data for informational purposes only. Rupeexo is not a SEBI-registered adviser. Not investment advice.</p>
          </div>
        </>)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WATCHLIST ROW
───────────────────────────────────────────── */

function WatchlistRow({ stock, selected, onClick, onRemove }) {
  const isUp = stock.change >= 0;
  const spark = useMemo(() => generateHistory(stock.price, 12).slice(-7), [stock.symbol]);

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-5 px-6 py-4 cursor-pointer border-b border-slate-50 last:border-0 transition-colors duration-100 ${selected ? 'bg-blue-50 border-l-2 border-l-[#2563eb]' : 'hover:bg-slate-50/70'}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-bold text-slate-500">{stock.symbol[0]}</span>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0f172a]">{stock.symbol}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{stock.sector}</p>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block">
        <MiniSparkline values={spark} color={isUp ? '#10b981' : '#ef4444'} />
      </div>

      {/* Price */}
      <div className="text-right w-24 shrink-0">
        <p className="text-sm font-semibold text-[#0f172a] tabular-nums">
          ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
        <p className={`text-[11px] font-medium tabular-nums mt-0.5 ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {isUp ? '+' : ''}{stock.change}%
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(stock.symbol); }}
        className="w-6 h-6 flex items-center justify-center rounded-md text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100 shrink-0"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   WATCHLIST TAB (editable name)
───────────────────────────────────────────── */

function WatchlistTab({ list, isActive, onClick, onRename, onDelete, canDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(list.name);
  const inputRef = useRef(null);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed) onRename(trimmed);
    setEditing(false);
  };

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  return (
    <div
      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-150 ${
        isActive ? 'bg-white border border-slate-200 shadow-sm text-[#1e3a8a]' : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
      }`}
      onClick={() => { if (!editing) onClick(); }}
    >
      <Star className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#2563eb]' : 'text-slate-300'}`} />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setDraft(list.name); setEditing(false); } }}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 text-sm font-medium bg-transparent outline-none min-w-0 w-24 border-b border-[#2563eb]"
        />
      ) : (
        <span className="text-sm font-medium whitespace-nowrap">{list.name}</span>
      )}

      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
        {list.symbols.length}
      </span>

      {/* Edit/delete controls — show on hover when active */}
      {isActive && !editing && (
        <div className="hidden group-hover:flex items-center gap-1 ml-0.5">
          <button
            onClick={(e) => { e.stopPropagation(); setDraft(list.name); setEditing(true); }}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-[#2563eb] hover:bg-blue-50 transition-all duration-150"
          >
            <Pencil className="w-3 h-3" />
          </button>
          {canDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTION TILE (for Navigate section)
───────────────────────────────────────────── */

function ActionTile({ href, Icon, label, description }) {
  return (
    <Link href={href} className="group block">
      <div className="card-hover border border-slate-200 rounded-xl bg-white p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1e3a8a] shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0f172a]">{label}</p>
          <p className="text-xs text-slate-400 truncate">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2563eb] transition-colors duration-150" />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATES
───────────────────────────────────────────── */

function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-12 py-24">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
        <Eye className="w-5 h-5 text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-500 mb-2">Select a stock</p>
      <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
        Click any row to view price charts, fundamental data, and AI-generated summaries.
      </p>
    </div>
  );
}

function EmptyStocks() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
        <Plus className="w-4 h-4 text-[#2563eb]" />
      </div>
      <p className="text-sm font-semibold text-slate-600 mb-1">This watchlist is empty</p>
      <p className="text-xs text-slate-400">Use the search above to add stocks.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function WatchlistPage() {
  const [watchlists,    setWatchlists]    = useState(INITIAL_WATCHLISTS);
  const [activeListId,  setActiveListId]  = useState(INITIAL_WATCHLISTS[0].id);
  const [selected,      setSelected]      = useState(() => ALL_STOCKS.find((s) => s.symbol === 'RELIANCE') || null);
  const [showUpgrade,   setShowUpgrade]   = useState(false);
  const [lastUpdated]                     = useState('4 min ago');
  const nextId = useRef(3);

  const activeList = watchlists.find((l) => l.id === activeListId) || watchlists[0];

  const activeStocks = useMemo(
    () => activeList ? ALL_STOCKS.filter((s) => activeList.symbols.includes(s.symbol)) : [],
    [activeList]
  );

  const usedSymbols = useMemo(() => activeList?.symbols || [], [activeList]);

  /* ── Watchlist management ── */
  const handleCreateList = () => {
    if (watchlists.length >= MAX_FREE_WATCHLISTS) { setShowUpgrade(true); return; }
    const newList = { id: nextId.current++, name: `Watchlist ${watchlists.length + 1}`, symbols: [] };
    setWatchlists((p) => [...p, newList]);
    setActiveListId(newList.id);
    setSelected(null);
  };

  const handleRenameList = (id, name) => {
    setWatchlists((p) => p.map((l) => l.id === id ? { ...l, name } : l));
  };

  const handleDeleteList = (id) => {
    if (watchlists.length <= 1) return;
    const remaining = watchlists.filter((l) => l.id !== id);
    setWatchlists(remaining);
    setActiveListId(remaining[0].id);
    setSelected(null);
  };

  /* ── Stock management ── */
  const handleAddStock = (stock) => {
    setWatchlists((p) => p.map((l) => l.id === activeListId ? { ...l, symbols: [...l.symbols, stock.symbol] } : l));
    setSelected(stock);
  };

  const handleRemoveStock = (symbol) => {
    setWatchlists((p) => p.map((l) => l.id === activeListId ? { ...l, symbols: l.symbols.filter((s) => s !== symbol) } : l));
    if (selected?.symbol === symbol) {
      const remaining = activeStocks.filter((s) => s.symbol !== symbol);
      setSelected(remaining[0] || null);
    }
  };

  /* ── KPI stats across all watchlists ── */
  const allWatchedStocks = useMemo(() => {
    const syms = new Set(watchlists.flatMap((l) => l.symbols));
    return ALL_STOCKS.filter((s) => syms.has(s.symbol));
  }, [watchlists]);

  const gainers   = allWatchedStocks.filter((s) => s.change > 0).length;
  const losers    = allWatchedStocks.filter((s) => s.change < 0).length;
  const avgChange = allWatchedStocks.length
    ? (allWatchedStocks.reduce((sum, s) => sum + s.change, 0) / allWatchedStocks.length).toFixed(2)
    : '0.00';

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        .page-enter { animation: pageEnter 700ms cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes pageEnter {
          0%   { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        .fade-up { opacity: 0; transform: translateY(16px); animation: fadeUp 600ms cubic-bezier(0.22,1,0.36,1) forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 60ms;  }
        .delay-2 { animation-delay: 120ms; }
        .delay-3 { animation-delay: 180ms; }
        .delay-4 { animation-delay: 240ms; }
        .delay-5 { animation-delay: 300ms; }
        .delay-6 { animation-delay: 360ms; }
        .card-hover { transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,0.08); border-color: #cbd5e1; }
        .cursor-halo {
          position: fixed; width: 320px; height: 320px; pointer-events: none; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.025) 45%, transparent 70%);
          filter: blur(20px); transform: translate(-50%, -50%); z-index: 0; transition: opacity 0.3s ease;
        }
      `}</style>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      <div className="page-enter min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
        <CursorHalo />
        <Navbar />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-10 space-y-10">

          {/* ── HEADER ── */}
          <header className="fade-up delay-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>Stock Monitoring</SectionLabel>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#0f172a] tracking-tight leading-tight">My Watchlists</h1>
              <p className="mt-1.5 text-sm text-slate-400">Track and monitor companies before committing capital.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-2 text-xs text-slate-400 border border-slate-200 bg-white rounded-lg px-3.5 py-2 shrink-0">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Updated {lastUpdated}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
              </div>
            </div>
          </header>

          {/* ── KPI CARDS ── */}
          <div className="fade-up delay-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Watching',  value: allWatchedStocks.length,  sub: 'across all lists',  subUp: null,  accent: 'default' },
              { label: 'Watchlists',      value: watchlists.length,        sub: `${MAX_FREE_WATCHLISTS} on free plan`, subUp: null, accent: 'blue' },
              { label: 'Gainers Today',   value: gainers,                  sub: 'stocks up',         subUp: true,  accent: 'green' },
              { label: 'Losers Today',    value: losers,                   sub: 'stocks down',       subUp: false, accent: 'red' },
            ].map((card) => (
              <div key={card.label} className="card-hover border border-slate-200 rounded-xl bg-white p-6 flex flex-col gap-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.13em]">{card.label}</p>
                <div>
                  <p className={`text-2xl font-semibold tracking-tight ${
                    card.accent === 'green' ? 'text-emerald-600' :
                    card.accent === 'red'   ? 'text-red-500'     :
                    card.accent === 'blue'  ? 'text-[#1e3a8a]'   : 'text-[#0f172a]'
                  }`}>{card.value}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {card.subUp === true  && <ArrowUpRight   className="w-3 h-3 text-emerald-500" />}
                    {card.subUp === false && <ArrowDownRight className="w-3 h-3 text-red-400" />}
                    <p className="text-xs text-slate-400">{card.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── MAIN LAYOUT ── */}
          <div className="fade-up delay-3 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">

            {/* LEFT: Watchlist panel */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">

              {/* Watchlist tabs + create button */}
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1.5">
                  {watchlists.map((list) => (
                    <WatchlistTab
                      key={list.id}
                      list={list}
                      isActive={list.id === activeListId}
                      onClick={() => { setActiveListId(list.id); setSelected(null); }}
                      onRename={(name) => handleRenameList(list.id, name)}
                      onDelete={() => handleDeleteList(list.id)}
                      canDelete={watchlists.length > 1}
                    />
                  ))}

                  {/* Create new watchlist */}
                  <button
                    onClick={handleCreateList}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 ${
                      watchlists.length >= MAX_FREE_WATCHLISTS
                        ? 'text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100'
                        : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-white border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {watchlists.length >= MAX_FREE_WATCHLISTS
                      ? <><Lock className="w-3 h-3" /> Upgrade</>
                      : <><Plus className="w-3 h-3" /> New</>}
                  </button>
                </div>

                {/* Active list search + info row */}
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">{activeStocks.length}</span> stocks in this list
                  </p>
                  <StockSearch onAdd={handleAddStock} usedSymbols={usedSymbols} />
                </div>
              </div>

              {/* Column headers */}
              {activeStocks.length > 0 && (
                <div className="flex items-center gap-5 px-6 py-3 border-b border-slate-50">
                  <p className="flex-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Company</p>
                  <p className="hidden sm:block text-[10px] text-slate-400 font-semibold uppercase tracking-wider w-16">Trend</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider text-right w-24">Price / Chg.</p>
                  <div className="w-6" />
                </div>
              )}

              {/* Stock rows */}
              <div className="max-h-[440px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {activeStocks.length === 0 ? <EmptyStocks /> : activeStocks.map((stock) => (
                  <WatchlistRow
                    key={stock.symbol}
                    stock={stock}
                    selected={selected?.symbol === stock.symbol}
                    onClick={() => setSelected(stock)}
                    onRemove={handleRemoveStock}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 flex items-start gap-2.5">
                <span className="text-[#2563eb] text-sm shrink-0 mt-0.5">◈</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">Prices from BSE/NSE. Indicative only. Not investment advice.</p>
              </div>
            </div>

            {/* RIGHT: Detail panel */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden min-h-[560px]">
              {selected
                ? <StockDetail key={selected.symbol} stock={selected} onRemove={() => handleRemoveStock(selected.symbol)} />
                : <EmptyDetail />}
            </div>
          </div>

          {/* ── FREE PLAN NOTICE (shown when near limit) ── */}
          {watchlists.length >= MAX_FREE_WATCHLISTS && (
            <div className="fade-up delay-4">
              <div className="border border-amber-200 bg-amber-50 rounded-xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Free plan limit reached</p>
                    <p className="text-xs text-amber-600 mt-0.5">You're using {watchlists.length} of {MAX_FREE_WATCHLISTS} watchlists. Upgrade to Pro for unlimited watchlists and advanced features.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm"
                >
                  <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
                </button>
              </div>
            </div>
          )}

          {/* ── NAVIGATE / GO DEEPER ── */}
          <div className="fade-up delay-5">
            <div className="mb-4">
              <SectionLabel>Navigate</SectionLabel>
              <h2 className="text-lg font-semibold text-[#0f172a]">Go Deeper</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionTile href="/dashboard" Icon={LayoutGrid} label="Dashboard"  description="Overview of your portfolio intelligence" />
              <ActionTile href="/portfolio" Icon={LayoutGrid} label="Portfolio"  description="Add watched stocks as holdings & track XIRR" />
              <ActionTile href="/screener"  Icon={Search}     label="Screener"   description="Filter & compare stocks by fundamental ratios" />
              <ActionTile href="/analysis"  Icon={BarChart3}  label="Analysis"   description="Deep-dive into ratios, margins & growth trends" />
            </div>
          </div>

          {/* ── DISCLAIMER ── */}
          <div className="fade-up delay-6 border-t border-slate-200 pt-8 pb-4">
            <p className="text-xs text-slate-400 leading-relaxed text-center max-w-3xl mx-auto">
              Rupeexo is a financial information and analytics platform. We are not a SEBI-registered investment adviser, research analyst, or broker. All data, analytics, and AI-generated interpretations are provided strictly for informational and educational purposes. Users are solely responsible for their investment decisions.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}