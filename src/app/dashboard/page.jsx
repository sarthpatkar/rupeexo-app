'use client';

import { useState } from 'react';

/* ─────────────────────────────────────────────
   DUMMY DATA
───────────────────────────────────────────── */

const HOLDINGS = [
  { name: 'HDFC Bank', sector: 'Banking', qty: 120, avgPrice: 1420.5, currentPrice: 1614.8, allocation: 24.1 },
  { name: 'Infosys', sector: 'Technology', qty: 85, avgPrice: 1380.0, currentPrice: 1304.6, allocation: 13.8 },
  { name: 'Reliance Industries', sector: 'Energy', qty: 40, avgPrice: 2540.0, currentPrice: 2891.3, allocation: 14.4 },
  { name: 'TCS', sector: 'Technology', qty: 30, avgPrice: 3210.0, currentPrice: 3748.5, allocation: 13.9 },
  { name: 'Kotak Mahindra Bank', sector: 'Banking', qty: 95, avgPrice: 1720.0, currentPrice: 1823.4, allocation: 10.8 },
  { name: 'Asian Paints', sector: 'Consumer', qty: 60, avgPrice: 2890.0, currentPrice: 2714.2, allocation: 10.2 },
  { name: 'Bajaj Finance', sector: 'NBFC', qty: 18, avgPrice: 6410.0, currentPrice: 7124.6, allocation: 7.9 },
  { name: 'Pidilite Industries', sector: 'Consumer', qty: 45, avgPrice: 2210.0, currentPrice: 2538.9, allocation: 4.9 },
];

const SECTOR_ALLOCATION = [
  { label: 'Banking & NBFC', pct: 35, color: 'bg-[#1e3a8a]' },
  { label: 'Technology', pct: 28, color: 'bg-[#2563eb]' },
  { label: 'Energy', pct: 14, color: 'bg-slate-500' },
  { label: 'Consumer', pct: 15, color: 'bg-slate-400' },
  { label: 'Others', pct: 8, color: 'bg-slate-300' },
];

const RISK_INDICATORS = [
  { label: 'Concentration Risk', level: 'Medium', pct: 62, color: 'bg-amber-400' },
  { label: 'Sector Exposure', level: 'Medium', pct: 58, color: 'bg-amber-400' },
  { label: 'Volatility Risk', level: 'Low', pct: 31, color: 'bg-emerald-400' },
  { label: 'Leverage Exposure', level: 'Low', pct: 18, color: 'bg-emerald-400' },
  { label: 'Valuation Risk', level: 'High', pct: 76, color: 'bg-red-400' },
];

const AI_INSIGHTS = [
  'Portfolio concentration in the Banking & NBFC sector stands at 35%, which is moderately elevated relative to broad market index weights. No action implied — this is an informational observation.',
  'Technology holdings (Infosys, TCS) account for 28% of total portfolio. Infosys shows a negative unrealised P&L of ₹6,391. This is within normal variance for the holding period.',
  'Valuation risk is flagged as high based on current P/E multiples across top holdings relative to their 5-year average. This does not constitute a recommendation to exit or reduce positions.',
];

const FUNDAMENTALS = [
  { name: 'HDFC Bank', pe: '19.2x', roe: '16.8%', de: '0.8', roce: '14.2%', rating: 'Stable' },
  { name: 'Infosys', pe: '24.1x', roe: '31.2%', de: '0.0', roce: '38.4%', rating: 'Stable' },
  { name: 'Reliance Ind.', pe: '27.3x', roe: '9.4%', de: '0.5', roce: '10.1%', rating: 'Watch' },
  { name: 'TCS', pe: '28.6x', roe: '46.1%', de: '0.0', roce: '54.2%', rating: 'Stable' },
  { name: 'Kotak Bank', pe: '21.4x', roe: '14.3%', de: '0.6', roce: '12.8%', rating: 'Stable' },
  { name: 'Asian Paints', pe: '52.1x', roe: '28.7%', de: '0.1', roce: '32.1%', rating: 'Elevated' },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function calcPL(qty, avg, current) {
  return (current - avg) * qty;
}

function calcPLPct(avg, current) {
  return ((current - avg) / avg) * 100;
}

function fmt(n) {
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function fmtPrice(n) {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ─────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────── */

function PrimaryButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-[#2563eb] uppercase tracking-[0.12em] mb-3">
      {children}
    </p>
  );
}

function Badge({ children, variant = 'neutral' }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const NAV = ['Dashboard', 'Portfolio', 'Analysis', 'Watchlist'];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 select-none">
          <div className="w-6 h-6 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-[#0f172a] font-semibold text-base tracking-tight">Rupeexo</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                i === 0
                  ? 'bg-slate-100 text-[#1e3a8a] font-medium'
                  : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-50'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-[#1e3a8a] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">A</span>
            </div>
            <span className="text-sm text-slate-600 font-medium">Arjun M.</span>
          </div>
          <OutlineButton className="text-xs px-4 py-2">Logout</OutlineButton>
        </div>

        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-3">
          {NAV.map((item) => (
            <a key={item} href="#" className="text-sm text-slate-700 hover:text-[#1e3a8a] py-1">
              {item}
            </a>
          ))}
          <OutlineButton className="mt-1 w-full text-xs">Logout</OutlineButton>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   PAGE HEADER
───────────────────────────────────────────── */

function PageHeader() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0f172a] tracking-tight">Portfolio Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fundamental and allocation summary across all tracked holdings. Last updated 6 min ago.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryButton className="text-sm">+ Add Holding</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUMMARY CARDS
───────────────────────────────────────────── */

function SummaryCard({ label, value, sub, subGreen }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5">
      <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-semibold text-[#0f172a] tabular-nums leading-tight">{value}</p>
      {sub && (
        <p className={`text-xs mt-1.5 ${subGreen === true ? 'text-emerald-600' : subGreen === false ? 'text-red-500' : 'text-slate-400'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function SummaryRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        label="Total Portfolio Value"
        value="₹18,43,620"
        sub="▲ +₹2,41,380 unrealised"
        subGreen={true}
      />
      <SummaryCard
        label="Portfolio XIRR"
        value="14.8%"
        sub="vs 12.1% Nifty 50 (1Y)"
        subGreen={true}
      />
      <SummaryCard
        label="Overall Risk Score"
        value="Moderate"
        sub="62 / 100 — review sector concentration"
        subGreen={null}
      />
      <SummaryCard
        label="Active Holdings"
        value="8"
        sub="Across 5 sectors"
        subGreen={null}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOLDINGS TABLE
───────────────────────────────────────────── */

function HoldingsTable() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
        <div>
          <SectionLabel>Holdings</SectionLabel>
          <p className="text-sm font-semibold text-[#0f172a] -mt-1">All Positions</p>
        </div>
        <Badge variant="neutral">8 stocks</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Stock', 'Sector', 'Qty', 'Avg Price', 'Current Price', 'Allocation', 'P&L'].map((h, i) => (
                <th
                  key={h}
                  className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3 ${
                    i === 0 ? 'text-left px-5' : i === 1 ? 'text-left px-3' : 'text-right px-4'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOLDINGS.map((h) => {
              const pl = calcPL(h.qty, h.avgPrice, h.currentPrice);
              const plPct = calcPLPct(h.avgPrice, h.currentPrice);
              const up = pl >= 0;
              return (
                <tr
                  key={h.name}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-100"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-600">{h.name[0]}</span>
                      </div>
                      <span className="font-medium text-[#0f172a] text-sm">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-xs text-slate-500">{h.sector}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">{h.qty}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">{fmtPrice(h.avgPrice)}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-700 font-medium">{fmtPrice(h.currentPrice)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${Math.min(h.allocation * 2.5, 100)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums w-8 text-right">{h.allocation}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div>
                      <p className={`text-sm font-medium tabular-nums ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                        {up ? '+' : ''}{fmt(pl)}
                      </p>
                      <p className={`text-[11px] tabular-nums ${up ? 'text-emerald-500' : 'text-red-400'}`}>
                        {up ? '▲' : '▼'} {Math.abs(plPct).toFixed(2)}%
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <p className="text-xs text-slate-400">Prices sourced from NSE. Last sync: 6 min ago.</p>
        <a href="#" className="text-xs text-[#2563eb] hover:underline font-medium">View full history →</a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTOR ALLOCATION CARD
───────────────────────────────────────────── */

function SectorAllocationCard() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5">
      <SectionLabel>Allocation</SectionLabel>
      <h3 className="text-base font-semibold text-[#0f172a] mb-5 -mt-1">Sector Breakdown</h3>

      {/* stacked bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px mb-5">
        {SECTOR_ALLOCATION.map((s) => (
          <div key={s.label} className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
        ))}
      </div>

      <div className="space-y-3">
        {SECTOR_ALLOCATION.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.color} shrink-0`} />
                <span className="text-sm text-slate-600">{s.label}</span>
              </div>
              <span className="text-sm font-medium text-slate-700 tabular-nums">{s.pct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed">
          Sector weights are calculated as a percentage of total current market value across all holdings.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RISK INDICATORS CARD
───────────────────────────────────────────── */

function RiskCard() {
  const levelVariant = (level) => {
    if (level === 'High') return 'red';
    if (level === 'Medium') return 'amber';
    return 'green';
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5">
      <SectionLabel>Risk Monitor</SectionLabel>
      <h3 className="text-base font-semibold text-[#0f172a] mb-5 -mt-1">Risk Indicators</h3>

      <div className="space-y-4">
        {RISK_INDICATORS.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-600">{r.label}</span>
              <Badge variant={levelVariant(r.level)}>{r.level}</Badge>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 text-right tabular-nums">{r.pct} / 100</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-[11px] text-[#2563eb] font-semibold uppercase tracking-wider mb-1.5">Methodology</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Risk scores are derived from volatility, leverage, sector concentration, and valuation multiples relative to historical norms. These are awareness metrics, not advisory signals.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI INSIGHTS PANEL
───────────────────────────────────────────── */

function AIInsightsPanel() {
  return (
    <div className="border border-blue-100 bg-blue-50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#2563eb] text-base">◈</span>
        <SectionLabel>AI Summaries</SectionLabel>
      </div>
      <h3 className="text-base font-semibold text-[#1e3a8a] mb-4">Portfolio Intelligence Summary</h3>

      <div className="space-y-3">
        {AI_INSIGHTS.map((insight, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
            <p className="text-sm text-blue-800 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-blue-600 leading-relaxed">
          AI summaries are generated from verified filing data. No advisory intent. Updated daily.
        </p>
        <a href="#" className="text-xs text-[#2563eb] font-semibold hover:underline whitespace-nowrap">
          Full report →
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FUNDAMENTALS TABLE
───────────────────────────────────────────── */

function FundamentalsTable() {
  const ratingVariant = (r) => {
    if (r === 'Elevated') return 'red';
    if (r === 'Watch') return 'amber';
    return 'green';
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5 flex items-center justify-between">
        <div>
          <SectionLabel>Fundamentals</SectionLabel>
          <p className="text-sm font-semibold text-[#0f172a] -mt-1">Key Ratios · FY24</p>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">NSE · Standardised</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Company', 'P/E', 'ROE', 'D/E', 'ROCE', 'Valuation'].map((h, i) => (
                <th
                  key={h}
                  className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-2.5 ${
                    i === 0 ? 'text-left px-5' : i === 5 ? 'text-center px-4' : 'text-right px-4'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FUNDAMENTALS.map((row) => (
              <tr key={row.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 text-sm font-medium text-[#0f172a]">{row.name}</td>
                <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{row.pe}</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-medium tabular-nums">{row.roe}</td>
                <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{row.de}</td>
                <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{row.roce}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant={ratingVariant(row.rating)}>{row.rating}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
        <p className="text-xs text-slate-400">
          Ratios calculated using standardised definitions from audited annual filings. Valuation flags are based on P/E relative to 5-year sector averages — not advisory signals.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">R</span>
          </div>
          <span className="text-sm font-semibold text-[#0f172a]">Rupeexo</span>
          <span className="text-slate-300 mx-1">·</span>
          <span className="text-xs text-slate-400">©️ {new Date().getFullYear()} Rupeexo Technologies Pvt. Ltd.</span>
        </div>
        <p className="text-xs text-slate-400 max-w-md text-left md:text-right leading-relaxed">
          All data is sourced from BSE, NSE, and public regulatory filings. Rupeexo does not provide investment advice. Consult a registered advisor before making investment decisions.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function DashboardPage() {
  return (
    <div className="font-sans antialiased text-[#0f172a] bg-[#f8fafc] min-h-screen">
      <Navbar />
      <PageHeader />

      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-6">
        <SummaryRow />
        <HoldingsTable />
        <div className="grid lg:grid-cols-2 gap-6">
          <SectorAllocationCard />
          <RiskCard />
        </div>
        <AIInsightsPanel />
        <FundamentalsTable />
      </main>

      <Footer />
    </div>
  );
}