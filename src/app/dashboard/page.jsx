/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Search,
  BarChart3,
  Eye,
  Bell,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */

function MiniSparkline({ values, color }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 72;
  const h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const performanceData = [
  { date: 'Jan', value: 1240000 },
  { date: 'Feb', value: 1380000 },
  { date: 'Mar', value: 1310000 },
  { date: 'Apr', value: 1550000 },
  { date: 'May', value: 1720000 },
  { date: 'Jun', value: 1843620 },
];

const allocationData = [
  { name: 'Direct Equity', value: 65, color: '#1e3a8a' },
  { name: 'Mutual Funds', value: 20, color: '#2563eb' },
  { name: 'Digital Gold', value: 8, color: '#f59e0b' },
  { name: 'Liquid Cash', value: 5, color: '#94a3b8' },
  { name: 'Crypto', value: 2, color: '#64748b' },
];

const holdings = [
  { name: 'HDFC Bank', sector: 'Banking', alloc: 24, change: '+1.4%', up: true, spark: [14, 15, 13, 16, 16, 18, 17] },
  { name: 'Infosys', sector: 'Technology', alloc: 19, change: '-0.6%', up: false, spark: [18, 17, 16, 15, 15, 14, 14] },
  { name: 'Reliance Ind.', sector: 'Conglomerate', alloc: 17, change: '+0.9%', up: true, spark: [12, 13, 12, 14, 14, 15, 16] },
  { name: 'TCS', sector: 'Technology', alloc: 14, change: '+0.3%', up: true, spark: [10, 10, 11, 11, 12, 12, 13] },
  { name: 'Asian Paints', sector: 'Consumer', alloc: 11, change: '-1.1%', up: false, spark: [16, 15, 15, 14, 14, 13, 12] },
];

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { label: 'Portfolio', href: '/portfolio', icon: LayoutGrid },
  { label: 'Screener', href: '/screener', icon: Search },
  { label: 'Analysis', href: '/analysis', icon: BarChart3 },
  { label: 'Watchlist', href: '/watchlist', icon: Eye },
];

/* ─────────────────────────────────────────────
   CURSOR HALO
───────────────────────────────────────────── */

function CursorHalo() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (!ref.current) return;
      ref.current.style.left = e.clientX + 'px';
      ref.current.style.top = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className="cursor-halo" />;
}

/* ─────────────────────────────────────────────
   PROFILE MODAL
───────────────────────────────────────────── */

function ProfileModal({ open, onClose, userName }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)] p-6 fade-up">
        <h2 className="text-lg font-semibold text-[#0f172a] mb-4">
          Profile
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-500">Name</p>
            <p className="font-medium text-[#0f172a]">{userName || 'User'}</p>
          </div>

          <button className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            Change Password
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50">
            Add / Update Phone Number
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */

function Navbar({ userName }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = pathname;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.assign('/login');
    }
  };

  const setTheme = (mode) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const initial = userName ? userName.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const fn = (e) => {
      if (!e.target.closest('#mobile-menu') && !e.target.closest('#hamburger-btn')) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [mobileOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <span className="text-[#0f172a] font-semibold text-lg tracking-tight">Rupeexo</span>
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === currentPath;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? 'text-[#1e3a8a] bg-blue-50 font-medium'
                    : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-50'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#2563eb] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 relative">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-all duration-150">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-lg bg-[#1e3a8a] flex items-center justify-center"
          >
            <span className="text-white text-sm font-semibold">{initial}</span>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
              {/* Profile */}
              <button
                onClick={() => {
                  setProfileOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
              >
                Profile
              </button>

              {/* Refer & Earn */}
              <button
                onClick={() => {
                  alert("Coming soon 🚀");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
              >
                Refer & Earn
              </button>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
                >
                  Settings
                </button>

                {settingsOpen && (
                  <div className="ml-2 mt-1 border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setTheme('light')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      Light Mode
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      Dark Mode
                    </button>
                  </div>
                )}
              </div>

              <hr className="my-2" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            id="hamburger-btn"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-150 ml-1"
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? 'w-4 rotate-45 translate-y-[6.5px]' : 'w-5'}`} />
            <span className={`block h-[1.5px] bg-slate-600 transition-all duration-200 ${mobileOpen ? 'opacity-0 w-0' : 'w-5'}`} />
            <span className={`block h-[1.5px] bg-slate-600 transition-all duration-200 origin-center ${mobileOpen ? 'w-4 -rotate-45 -translate-y-[6.5px]' : 'w-5'}`} />
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute left-0 right-0 top-full border-t border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.10)] z-50"
        >
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === currentPath;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-[#1e3a8a] border border-blue-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#1e3a8a]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-[#2563eb]' : 'bg-slate-200'}`} />
                  {link.label}
                  {isActive && (
                    <span className="ml-auto text-[10px] font-semibold text-[#2563eb] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User row */}
          <div className="px-8 py-3 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">{initial}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0f172a]">{userName || 'User'}</p>
              <p className="text-[11px] text-slate-400">Account</p>
            </div>
          </div>
        </div>
      )}
      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userName={userName}
      />
    </nav>
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */

function KPICard({ label, value, sub, subUp, trend, accent }) {
  return (
    <div className="card-hover border border-slate-200 rounded-xl bg-white p-6 flex flex-col gap-3">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.13em]">{label}</p>
      <div>
        <p
          className={`text-2xl font-semibold tracking-tight ${
            accent === 'green'
              ? 'text-emerald-600'
              : accent === 'blue'
              ? 'text-[#1e3a8a]'
              : accent === 'red'
              ? 'text-red-500'
              : 'text-[#0f172a]'
          }`}
        >
          {value}
        </p>
        {sub && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {subUp === true && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
            {subUp === false && <ArrowDownRight className="w-3 h-3 text-red-400" />}
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="border border-slate-200 bg-white rounded-xl px-4 py-3 shadow-md text-sm">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="font-semibold text-[#0f172a]">
        ₹{val?.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTIVE PIE SHAPE
───────────────────────────────────────────── */

function ActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={6}
      />
    </g>
  );
}

/* ─────────────────────────────────────────────
   QUICK ACTION TILE
───────────────────────────────────────────── */

function ActionTile({ href, Icon, label, description }) {
  return (
    <Link href={href} className="group block">
      <div className="card-hover border border-slate-200 rounded-xl bg-white p-5 flex items-center gap-4 transition-all duration-200">
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
   SECTION LABEL
───────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold text-[#2563eb] uppercase tracking-[0.14em] mb-1">
      {children}
    </p>
  );
}

/* ─────────────────────────────────────────────
   MAIN DASHBOARD PAGE
───────────────────────────────────────────── */

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [lastUpdated] = useState('4 min ago');
  const [userName, setUserName] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) {
          window.location.assign("/login");
          return;
        }

        const data = await res.json();
        const user = data?.user;
        if (!user) {
          window.location.assign("/login");
          return;
        }

        const name =
          user.full_name ||
          user.metadata_full_name ||
          (user.email ? user.email.split("@")[0] : "User");

        setUserName(name);
      } catch (error) {
        window.location.assign("/login");
      } finally {
        setAuthChecked(true);
      }
    };

    checkSession();
  }, []);

  const fmt = (val) =>
    mounted ? `₹${Number(val).toLocaleString('en-IN')}` : '';

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }

        .page-enter {
          animation: pageEnter 700ms cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes pageEnter {
          0% { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .fade-up {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 600ms cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .delay-1 { animation-delay: 60ms; }
        .delay-2 { animation-delay: 120ms; }
        .delay-3 { animation-delay: 180ms; }
        .delay-4 { animation-delay: 240ms; }
        .delay-5 { animation-delay: 300ms; }
        .delay-6 { animation-delay: 360ms; }

        .card-hover {
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,23,42,0.08);
          border-color: #cbd5e1;
        }

        .cursor-halo {
          position: fixed;
          width: 320px;
          height: 320px;
          pointer-events: none;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(37,99,235,0.025) 45%, transparent 70%);
          filter: blur(20px);
          transform: translate(-50%, -50%);
          z-index: 0;
          transition: opacity 0.3s ease;
        }

        .recharts-cartesian-axis-tick text {
          fill: #94a3b8;
          font-size: 11px;
        }
      `}</style>

      <div className="page-enter min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans antialiased">
        <CursorHalo />
        <Navbar userName={userName} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-10 space-y-10">

          {/* ── WELCOME HEADER ── */}
          <header className="fade-up delay-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <SectionLabel>Portfolio Intelligence</SectionLabel>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#0f172a] tracking-tight leading-tight">
                Welcome back, {userName}
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Your portfolio intelligence overview for today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 border border-slate-200 bg-white rounded-lg px-3.5 py-2 shrink-0 self-start sm:self-auto">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Updated {lastUpdated}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
            </div>
          </header>

          {/* ── KPI CARDS ── */}
          <div className="fade-up delay-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              label="Total Portfolio Value"
              value={fmt(1843620)}
              sub="+₹6.03L growth (YTD)"
              subUp={true}
              accent="default"
            />
            <KPICard
              label="Portfolio XIRR"
              value="14.82%"
              sub="vs 12.1% Nifty 50"
              subUp={true}
              accent="blue"
            />
            <KPICard
              label="Unrealised P&L"
              value="+48.62%"
              sub="Lifetime unrealised"
              subUp={true}
              accent="green"
            />
            <KPICard
              label="Risk Score"
              value="Moderate"
              sub="62 / 100 — stable"
              accent="default"
            />
          </div>

          {/* ── CHARTS ROW ── */}
          <div className="fade-up delay-3 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Performance Chart */}
            <div className="lg:col-span-2 border border-slate-200 rounded-xl bg-white p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <SectionLabel>Performance</SectionLabel>
                  <h2 className="text-lg font-semibold text-[#0f172a]">Portfolio Growth</h2>
                </div>
                <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">+48.6%</span>
                </div>
              </div>
              <div className="h-[260px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={performanceData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} dy={8} />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        fill="url(#areaGrad)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="border border-slate-200 rounded-xl bg-white p-6">
              <div className="mb-4">
                <SectionLabel>Allocation</SectionLabel>
                <h2 className="text-lg font-semibold text-[#0f172a]">Asset Split</h2>
              </div>
              <div className="h-[160px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        innerRadius={52}
                        outerRadius={70}
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={ActiveShape}
                        onMouseEnter={(_, i) => setActiveIndex(i)}
                        onMouseLeave={() => setActiveIndex(null)}
                        strokeWidth={0}
                      >
                        {allocationData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {allocationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-700">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HOLDINGS + AI INSIGHT ── */}
          <div className="fade-up delay-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Top Holdings */}
            <div className="lg:col-span-2 border border-slate-200 rounded-xl bg-white overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Top Holdings</p>
                </div>
                <Link href="/portfolio" className="text-xs text-[#2563eb] hover:underline font-medium">
                  View all →
                </Link>
              </div>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-2.5 border-b border-slate-50">
                {['Company', 'Trend', 'Alloc.', 'Change'].map((h, i) => (
                  <p key={h} className={`text-[10px] text-slate-400 font-semibold uppercase tracking-wider ${i > 0 ? 'text-right' : ''}`}>{h}</p>
                ))}
              </div>
              {holdings.map((h, i) => (
                <div
                  key={h.name}
                  className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3.5 ${
                    i < holdings.length - 1 ? 'border-b border-slate-50' : ''
                  } hover:bg-slate-50 transition-colors duration-100`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-slate-500">{h.name[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0f172a] truncate">{h.name}</p>
                      <p className="text-[11px] text-slate-400">{h.sector}</p>
                    </div>
                  </div>
                  <MiniSparkline values={h.spark} color={h.up ? '#10b981' : '#ef4444'} />
                  <p className="text-sm text-slate-500 text-right">{h.alloc}%</p>
                  <p className={`text-sm font-medium text-right ${h.up ? 'text-emerald-600' : 'text-red-500'}`}>
                    {h.change}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Insight + Risk */}
            <div className="flex flex-col gap-4">
              {/* AI Strip */}
              <div className="border border-blue-100 bg-blue-50 rounded-xl px-5 py-4 flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-[#2563eb] mt-0.5 text-base shrink-0">◈</span>
                  <div>
                    <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-2">AI Summary</p>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Portfolio is overweight technology relative to Nifty 50. HDFC Bank NIM compression flagged in Q3 filing — suggest reviewing allocation before Q4 earnings cycle.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-100">
                  <p className="text-[11px] text-blue-500 font-medium uppercase tracking-wider mb-2">Risk Indicators</p>
                  {[
                    { label: 'Concentration Risk', level: 'Medium', pct: 62, color: 'bg-amber-400' },
                    { label: 'Valuation Risk', level: 'High', pct: 78, color: 'bg-red-400' },
                    { label: 'Sector Overlap', level: 'Low', pct: 28, color: 'bg-emerald-400' },
                  ].map((r) => (
                    <div key={r.label} className="mb-2.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] text-blue-700">{r.label}</span>
                        <span className="text-[10px] text-blue-500">{r.level}</span>
                      </div>
                      <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified badge */}
              <div className="border border-slate-200 rounded-xl bg-white px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm shrink-0">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">All fundamentals verified</p>
                  <p className="text-[11px] text-slate-400">BSE / NSE · Updated {lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div className="fade-up delay-5">
            <div className="mb-4">
              <SectionLabel>Navigate</SectionLabel>
              <h2 className="text-lg font-semibold text-[#0f172a]">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  href: '/portfolio',
                  Icon: LayoutGrid,
                  label: 'Portfolio',
                  description: 'Holdings, allocation & XIRR',
                },
                {
                  href: '/screener',
                  Icon: Search,
                  label: 'Screener',
                  description: 'Filter stocks by fundamentals',
                },
                {
                  href: '/analysis',
                  Icon: BarChart3,
                  label: 'Analysis',
                  description: 'Ratios, margins & growth trends',
                },
                {
                  href: '/watchlist',
                  Icon: Eye,
                  label: 'Watchlist',
                  description: 'Track companies of interest',
                },
              ].map((tile) => (
                <ActionTile key={tile.label} {...tile} />
              ))}
            </div>
          </div>

          {/* ── FOOTER DISCLAIMER ── */}
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
