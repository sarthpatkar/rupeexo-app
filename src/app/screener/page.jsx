"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/*
  Mock stock dataset sourced from uploaded NSE stock list, each with random ratios
  (so filtering works across every filter key)
*/
const random = (min, max) =>
  Number((Math.random() * (max - min) + min).toFixed(2));

const createStock = ({ symbol, name }) => ({
  symbol,
  name,
  sales: random(1000, 50000),
  opm: random(5, 60),
  pat: random(100, 10000),
  marketcap: random(5000, 500000),
  sales_q: random(200, 10000),
  pat_q: random(20, 2000),
  yoy_sales: random(-10, 40),
  yoy_profit: random(-10, 50),
  pe: random(5, 80),
  div_yield: random(0, 5),
  pb: random(0.5, 20),
  roce: random(5, 40),
  roa: random(2, 25),
  de_ratio: random(0, 2),
  roe: random(5, 45),
  eps: random(5, 200),
  debt: random(0, 20000),
  promoter: random(20, 80),
  promoter_change: random(-5, 5),
  earnings_yield: random(2, 15),
  pledged: random(0, 40),
  industry_pe: random(10, 60),
  sales_growth: random(-5, 30),
  profit_growth: random(-5, 35),
  current_price: random(50, 5000),
  price_sales: random(0.5, 15),
  pfcf: random(5, 50),
  ev_ebitda: random(5, 30),
  enterprise_value: random(5000, 400000),
  current_ratio: random(0.5, 5),
  interest_coverage: random(1, 20),
  peg: random(0.5, 5),
  return_3m: random(-20, 40),
  return_6m: random(-30, 60),
  sales_3y: random(0, 30),
  sales_5y: random(0, 30),
  profit_3y: random(0, 35),
  profit_5y: random(0, 35),
  roe_3y: random(8, 30),
  roe_5y: random(8, 30),
  return_1y: random(-20, 80),
  return_3y: random(-10, 150),
  return_5y: random(0, 300),
});

/*
  Available filters (ratios)
*/
const FILTERS = [
  { key: "sales", label: "Sales" },
  { key: "opm", label: "OPM %" },
  { key: "pat", label: "Profit After Tax" },
  { key: "marketcap", label: "Market Capitalization" },
  { key: "sales_q", label: "Sales Latest Quarter" },
  { key: "pat_q", label: "Profit After Tax Latest Quarter" },
  { key: "yoy_sales", label: "YOY Quarterly Sales Growth" },
  { key: "yoy_profit", label: "YOY Quarterly Profit Growth" },
  { key: "pe", label: "Price to Earning" },
  { key: "div_yield", label: "Dividend Yield" },
  { key: "pb", label: "Price to Book Value" },
  { key: "roce", label: "Return on Capital Employed" },
  { key: "roa", label: "Return on Assets" },
  { key: "de_ratio", label: "Debt to Equity" },
  { key: "roe", label: "Return on Equity" },
  { key: "eps", label: "EPS" },
  { key: "debt", label: "Debt" },
  { key: "promoter", label: "Promoter Holding" },
  { key: "promoter_change", label: "Change in Promoter Holding" },
  { key: "earnings_yield", label: "Earnings Yield" },
  { key: "pledged", label: "Pledged Percentage" },
  { key: "industry_pe", label: "Industry PE" },
  { key: "sales_growth", label: "Sales Growth" },
  { key: "profit_growth", label: "Profit Growth" },
  { key: "current_price", label: "Current Price" },
  { key: "price_sales", label: "Price to Sales" },
  { key: "pfcf", label: "Price to Free Cash Flow" },
  { key: "ev_ebitda", label: "EV/EBITDA" },
  { key: "enterprise_value", label: "Enterprise Value" },
  { key: "current_ratio", label: "Current Ratio" },
  { key: "interest_coverage", label: "Interest Coverage Ratio" },
  { key: "peg", label: "PEG Ratio" },
  { key: "return_3m", label: "Return over 3 Months" },
  { key: "return_6m", label: "Return over 6 Months" },
  { key: "sales_3y", label: "Sales Growth 3 Years" },
  { key: "sales_5y", label: "Sales Growth 5 Years" },
  { key: "profit_3y", label: "Profit Growth 3 Years" },
  { key: "profit_5y", label: "Profit Growth 5 Years" },
  { key: "roe_3y", label: "Average ROE 3 Years" },
  { key: "roe_5y", label: "Average ROE 5 Years" },
  { key: "return_1y", label: "Return over 1 Year" },
  { key: "return_3y", label: "Return over 3 Years" },
  { key: "return_5y", label: "Return over 5 Years" },
];

export default function ScreenerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const TOP_NAV_LINKS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Screener", href: "/screener" },
    { label: "Analysis", href: "/analysis" },
    { label: "Watchlist", href: "/watchlist" },
  ];

  const SIDEBAR_LINKS = [
    { label: "Overview", href: "/portfolio" },
    { label: "Holdings", href: "/holdings" },
    { label: "Fundamentals", href: "/fundamentals" },
    { label: "Risk Monitor", href: "/risk-monitor" },
    { label: "AI Summaries", href: "/ai-summaries" },
  ];

  const isActivePath = (href) => {
    if (href === "/portfolio") return pathname.startsWith("/portfolio");
    return pathname === href;
  };
  // per-filter config: operator + value
  const [filterConfig, setFilterConfig] = useState({});
  const [selectedFilters, setSelectedFilters] = useState(["pe", "pb"]);
  const [allStocks, setAllStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [watchlistModal, setWatchlistModal] = useState(false);
  const [watchlists, setWatchlists] = useState(["My Watchlist"]);
  const [newWatchlist, setNewWatchlist] = useState("");
  const [selectedWatchlist, setSelectedWatchlist] = useState("My Watchlist");
  const [stockToAdd, setStockToAdd] = useState(null);
  const [filterSearch, setFilterSearch] = useState("");
  // Mobile filters drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Saved screeners
  const [savedScreeners, setSavedScreeners] = useState([]);
  const [newScreenerName, setNewScreenerName] = useState("");

  useEffect(() => {
    let active = true;

    const loadStocks = async () => {
      try {
        const response = await fetch("/nseStocks.json");
        if (!response.ok) {
          throw new Error(`Failed to load stocks (${response.status})`);
        }

        const rawStocks = await response.json();
        if (!Array.isArray(rawStocks)) {
          throw new Error("Invalid stocks payload");
        }

        if (active) {
          setAllStocks(rawStocks.map((stock) => createStock(stock)));
        }
      } catch (error) {
        console.error("Failed to load screener stocks:", error);
        if (active) {
          setAllStocks([]);
        }
      } finally {
        if (active) {
          setStocksLoading(false);
        }
      }
    };

    loadStocks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("savedScreeners");
    if (stored) setSavedScreeners(JSON.parse(stored));
  }, []);

  const saveCurrentScreener = () => {
    if (!newScreenerName) return;
    const newItem = {
      name: newScreenerName,
      selectedFilters,
      filterConfig,
    };
    const updated = [...savedScreeners, newItem];
    setSavedScreeners(updated);
    localStorage.setItem("savedScreeners", JSON.stringify(updated));
    setNewScreenerName("");
  };

  const loadScreener = (item) => {
    setSelectedFilters(item.selectedFilters);
    setFilterConfig(item.filterConfig);
  };

  /*
    Toggle filter selection
  */
  const toggleFilter = (key) => {
    if (selectedFilters.includes(key)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== key));
    } else {
      setSelectedFilters([...selectedFilters, key]);
      if (!filterConfig[key]) {
        setFilterConfig({
          ...filterConfig,
          [key]: { op: "<", value: 50 },
        });
      }
    }
  };

  // Apply filters and sorting whenever selection/config/sort changes
  useEffect(() => {
    let result = allStocks.filter((stock) => {
      return selectedFilters.every((key) => {
        const cfg = filterConfig[key];
        if (!cfg) return true;
        const val = stock[key];
        if (cfg.op === "<") return val < Number(cfg.value);
        if (cfg.op === ">") return val > Number(cfg.value);
        if (cfg.op === "<=") return val <= Number(cfg.value);
        if (cfg.op === ">=") return val >= Number(cfg.value);
        return true;
      });
    });

    // Sorting
    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || bVal === undefined) return 0;

      if (sortConfig.direction === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredStocks(result);
  }, [allStocks, selectedFilters, filterConfig, sortConfig]);

  /*
    CSV Download
  */
  const downloadCSV = () => {
    if (filteredStocks.length === 0) return;

    const headers = ["Symbol", "Company", ...selectedFilters];
    const rows = filteredStocks.map((stock) => [
      stock.symbol,
      stock.name,
      ...selectedFilters.map((f) => stock[f]),
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "screener.csv";
    link.click();
  };

  /*
    Create Watchlist
  */
  const createWatchlist = () => {
    if (!newWatchlist) return;
    setWatchlists((prev) => [...prev, newWatchlist]);
    setSelectedWatchlist(newWatchlist);
    setNewWatchlist("");
  };

  const visibleFilters = FILTERS.filter((f) =>
    f.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  // Helper to clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
    setFilterConfig({});
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      {/* ── NAVBAR ── */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 rounded bg-[#1e3a8a] flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-[#0f172a] font-semibold text-lg tracking-tight">Rupeexo</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {TOP_NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`relative px-4 py-2 rounded-md text-sm transition-all duration-150 ${
                  active
                    ? "text-[#1e3a8a] bg-blue-50 font-medium"
                    : "text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-50"
                }`}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-[1.5px] bg-[#2563eb] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl border-r border-slate-200 p-6 flex flex-col">
            {/* Top Links */}
            <div className="space-y-2 mb-6">
              {TOP_NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all border ${
                      active
                        ? "bg-blue-50 border-blue-200 text-[#1e3a8a] font-semibold shadow-sm"
                        : "border-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          active ? "bg-[#2563eb]" : "bg-slate-300"
                        }`}
                      />
                      {label}
                    </div>
                    {active && (
                      <span className="text-[11px] font-semibold text-[#2563eb] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              {SIDEBAR_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm transition-all ${
                    isActivePath(href)
                      ? "bg-white shadow-sm border border-slate-200 text-[#1e3a8a] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar Filters */}
      <aside className="w-72 border-r border-slate-200 bg-white p-6 hidden md:block overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-[#0f172a]">
          Filters
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search ratio (e.g. PE, ROE)"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]"
        />

        <div className="space-y-4">
          {visibleFilters.map((f) => {
            const cfg = filterConfig[f.key] || { op: "<", value: 50 };
            return (
              <div key={f.key} className="border border-slate-200 bg-slate-50/40 hover:bg-slate-50 rounded-xl p-3 space-y-2 transition-all duration-200">
                <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(f.key)}
                    onChange={() => toggleFilter(f.key)}
                    className="accent-[#1e3a8a]"
                  />
                  <span className="font-medium">{f.label}</span>
                </label>

                {selectedFilters.includes(f.key) && (
                  <div className="space-y-2">
                    <div className="flex gap-2 w-full">
                      <select
                        value={cfg.op}
                        onChange={(e) =>
                          setFilterConfig({
                            ...filterConfig,
                            [f.key]: { ...cfg, op: e.target.value },
                          })
                        }
                        className="border rounded px-2 py-1 text-xs w-1/2 min-w-0"
                      >
                        <option value="<">Less than</option>
                        <option value=">">Greater than</option>
                        <option value="<=">≤</option>
                        <option value=">=">≥</option>
                      </select>

                      <input
                        type="number"
                        value={cfg.value}
                        onChange={(e) =>
                          setFilterConfig({
                            ...filterConfig,
                            [f.key]: { ...cfg, value: e.target.value },
                          })
                        }
                        className="border rounded px-2 py-1 text-xs w-1/2 min-w-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={downloadCSV}
          className="mt-6 w-full bg-[#1e3a8a] text-white py-2 rounded-lg text-sm hover:bg-[#1e40af] transition-all duration-200 shadow-sm"
        >
          Download CSV
        </button>
      </aside>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl p-6 overflow-y-auto border-r border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#0f172a]">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm text-slate-500"
              >
                Close
              </button>
            </div>
            {/* You can add filter UI here if desired */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto transition-all duration-200">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-800">
              Stock Screener
            </h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm shadow-sm"
            >
              Filters
            </button>
            <button
              onClick={() => router.push("/watchlist")}
              className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm shadow-sm hover:bg-[#1e40af] transition-all duration-200"
            >
              Manage Watchlists
            </button>
          </div>

          {/* Saved Screeners */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={newScreenerName}
                onChange={(e) => setNewScreenerName(e.target.value)}
                placeholder="Save current screener as..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={saveCurrentScreener}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm"
              >
                Save
              </button>
            </div>

            {savedScreeners.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedScreeners.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadScreener(s)}
                    className="px-3 py-1 text-xs border rounded-full bg-slate-50 hover:bg-slate-100"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result Count */}
          <div className="text-sm text-slate-500">
            {stocksLoading
              ? "Loading stocks..."
              : `${filteredStocks.length} stocks matched`}
          </div>

          {/* Active Filter Chips */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-blue-50 border border-blue-100 text-[#1e3a8a] text-xs rounded-full"
                >
                  {f.toUpperCase()}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 ml-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0 z-10 bg-slate-50">
                  <tr className="text-[10px] text-slate-400 tracking-wider uppercase border-b border-slate-100">
                    <th
                      onClick={() => handleSort("name")}
                      className="p-4 font-semibold cursor-pointer"
                    >
                      Company / Symbol {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                    </th>
                    {selectedFilters.map((f) => (
                      <th
                        key={f}
                        onClick={() => handleSort(f)}
                        className="p-4 font-semibold text-right cursor-pointer"
                      >
                        {f.toUpperCase()} {sortConfig.key === f ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                      </th>
                    ))}
                    <th className="p-4 text-right">Watchlist</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {stocksLoading ? (
                    <tr>
                      <td
                        colSpan={selectedFilters.length + 2}
                        className="p-6 text-center text-slate-500"
                      >
                        Loading screener data...
                      </td>
                    </tr>
                  ) : filteredStocks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={selectedFilters.length + 2}
                        className="p-6 text-center text-slate-500"
                      >
                        No stocks matched your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStocks.map((stock) => (
                      <tr
                        key={stock.symbol}
                        className="hover:bg-slate-50 transition-all duration-150"
                      >
                        <td className="p-4 font-semibold text-slate-700">
                          <div>{stock.name}</div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {stock.symbol}
                          </div>
                        </td>

                        {selectedFilters.map((f) => (
                          <td
                            key={f}
                            className="p-4 text-right text-slate-600"
                          >
                            {stock[f]}
                          </td>
                        ))}

                        {/* Add to Watchlist Button */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setStockToAdd(`${stock.name} (${stock.symbol})`);
                              setSelectedWatchlist(watchlists[0] || "My Watchlist");
                              setWatchlistModal(true);
                            }}
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Watchlist Modal */}
      {watchlistModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl animate-[scaleIn_0.2s_ease]">
            <h2 className="text-lg font-semibold mb-4">Add to Watchlist</h2>

            {/* Stock Name */}
            <div className="mb-3 text-sm text-slate-500">
              Stock: <span className="font-medium text-slate-800">{stockToAdd}</span>
            </div>

            {/* Existing Watchlists */}
            <div className="space-y-2 mb-4">
              {watchlists.map((w) => (
                <label
                  key={w}
                  className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm cursor-pointer transition ${
                    selectedWatchlist === w
                      ? "border-[#1e3a8a] bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <span>{w}</span>
                  <input
                    type="radio"
                    name="watchlist"
                    checked={selectedWatchlist === w}
                    onChange={() => setSelectedWatchlist(w)}
                    className="accent-[#1e3a8a]"
                  />
                </label>
              ))}
            </div>

            {/* Create New Watchlist */}
            <div className="flex gap-2 mb-4">
              <input
                value={newWatchlist}
                onChange={(e) => setNewWatchlist(e.target.value)}
                placeholder="New watchlist name"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={createWatchlist}
                className="bg-[#1e3a8a] text-white px-3 py-2 rounded-lg text-sm"
              >
                Create
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Here you would normally persist (e.g., Supabase). For now just close.
                  setWatchlistModal(false);
                }}
                className="flex-1 bg-[#1e3a8a] text-white py-2 rounded-lg text-sm"
              >
                Add to Selected
              </button>

              <button
                onClick={() => setWatchlistModal(false)}
                className="flex-1 py-2 border rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
  {/* Animation Styles */}
  <style jsx global>{`
    @keyframes scaleIn {
      from { transform: scale(0.96); opacity: 0 }
      to { transform: scale(1); opacity: 1 }
    }
  `}</style>
}
