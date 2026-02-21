/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${className}`}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// HERO BACKGROUND DOTS COMPONENT (Grid Displacement Field)
// ─────────────────────────────────────────────
function HeroBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    container.appendChild(renderer.domElement);

    const COUNT = 220;

    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);

    const palette = [
      new THREE.Color('#2563eb'),
      new THREE.Color('#60a5fa'),
      new THREE.Color('#22c55e'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f59e0b')
    ];

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 200; // depth

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      sizes[i] = 2 + Math.random() * 2;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouse = new THREE.Vector2(9999, 9999);

    function onMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    window.addEventListener('mousemove', onMove);

    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 20;

    function animate() {
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;

        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];

        let x = pos[ix];
        let y = pos[ix + 1];
        let z = pos[ix + 2];

        // project mouse into scene plane
        raycaster.setFromCamera(mouse, camera);
        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const target = new THREE.Vector3();
        raycaster.ray.intersectPlane(planeZ, target);

        const dx = x - target.x;
        const dy = y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 120;

        if (dist < radius) {
          const force = (1 - dist / radius) * 20;
          x += (dx / dist) * force;
          y += (dy / dist) * force;
          z += force * 0.6; // depth pop
        }

        // spring back to base
        x += (bx - x) * 0.08;
        y += (by - y) * 0.08;
        z += (bz - z) * 0.08;

        pos[ix] = x;
        pos[ix + 1] = y;
        pos[ix + 2] = z;
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 w-full h-full"
    />
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#cta' },
];

const FEATURES = [
  {
    title: 'AI Financial Summaries',
    description:
      'Earnings reports, annual filings, and analyst notes condensed into structured briefs. Get the signal without sifting through 80-page PDFs.',
    icon: '◈',
  },
  {
    title: 'Portfolio Intelligence',
    description:
      'Track allocation, sectoral concentration, and overlap across your full portfolio. Know exactly where your capital is deployed — and why.',
    icon: '◉',
  },
  {
    title: 'Risk Awareness Indicators',
    description:
      'Quantified risk scores derived from volatility, leverage, and macroeconomic signals. Not alerts — awareness. The difference matters.',
    icon: '◎',
  },
  {
    title: 'Fundamental Dashboards',
    description:
      'Revenue growth, operating margins, return on equity, and debt coverage — laid out cleanly, without the noise of trading terminals.',
    icon: '▣',
  },
  {
    title: 'Decision Support Signals',
    description:
      'Structured prompts that surface relevant context before you act. Not predictions — preparation. Make decisions with your reasoning intact.',
    icon: '◆',
  },
  {
    title: 'Long-Term Analytics',
    description:
      '10-year trend lines, compounding visualisations, and business cycle context. Built for investors who think in decades, not days.',
    icon: '◇',
  },
];

const INTEGRITY_CARDS = [
  {
    title: 'Verified Financial Data',
    description:
      'Every data point on Rupeexo is sourced directly from BSE, NSE, and official regulatory filings. We do not infer, estimate, or interpolate. If we cannot verify it, we do not display it.',
  },
  {
    title: 'Transparent Data Sources',
    description:
      'Each metric traces back to a specific filing, exchange record, or public document. You can see exactly where a number comes from — no black boxes, no opaque aggregations.',
  },
  {
    title: 'AI-Assisted Interpretation',
    description:
      'Our AI summarises and contextualises data. It does not recommend. It does not predict. It surfaces what the filings say, structured for a reader who thinks carefully before acting.',
  },
  {
    title: 'Analytical Ratio Engine',
    description:
      'P/E, ROE, D/E, ROCE, and over 40 additional ratios — calculated consistently using standardised definitions, applied uniformly across every company we cover.',
  },
  {
    title: 'Portfolio-Level Analytics',
    description:
      'Concentration, overlap, sector exposure, and XIRR computed across your entire portfolio — not stock by stock in isolation. Understand the whole, not just its parts.',
  },
  {
    title: 'Audit & Change Logs',
    description:
      'Every data revision is logged with a timestamp and source reference. If a company restates earnings or a filing is amended, you will know what changed, when, and why.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Connect & Organise',
    description:
      'Enter your holdings manually. Rupeexo maps your portfolio against fundamentals and risk metrics once your positions are added.',
  },
  {
    number: '02',
    title: 'Analyse with Clarity',
    description:
      'Review AI-generated summaries, risk scores, and fundamental dashboards — all contextualised to your specific positions.',
  },
  {
    number: '03',
    title: 'Decide with Structure',
    description:
      'Use decision support signals to frame your thesis. Document your reasoning. Act without noise clouding your judgement.',
  },
];

const STATS = [
  { value: '₹2,400 Cr+', label: 'Portfolio value tracked' },
  { value: '18,000+', label: 'Investors onboarded' },
  { value: '4,200+', label: 'Stocks analysed' },
  { value: '99.7%', label: 'Data accuracy rate' },
];

const FOOTER_LINKS = {
  Product: ['Dashboard', 'Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'],
};

/* ─────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────── */

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-xs font-medium text-blue-700 tracking-wide">
      {children}
    </span>
  );
}

function PrimaryButton({ children, href = '#', className = '' }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-150 ${className}`}
    >
      {children}
    </a>
  );
}

function OutlineButton({ children, href = '#', className = '' }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-medium transition-all duration-150 ${className}`}
    >
      {children}
    </a>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold text-[#2563eb] uppercase tracking-[0.14em] mb-4">
      {children}
    </p>
  );
}

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */

function MiniSparkline({ values, color }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
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
   HERO DASHBOARD
───────────────────────────────────────────── */

function DashboardPreview() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto lg:mx-0 lg:ml-auto animate-float">
      <div className="border border-slate-200 rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden">
        {/* chrome */}
        <div className="border-b border-slate-100 px-5 py-3.5 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-medium">Rupeexo · Portfolio Overview</span>
          <div className="w-16" />
        </div>

        <div className="p-5 space-y-4">
          {/* header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Total Portfolio</p>
              <p className="text-2xl font-semibold text-slate-900 tabular-nums">₹18,43,620</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-emerald-600 font-medium">▲ +3.2%</span>
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-1">Risk Score</p>
              <p className="text-xl font-semibold text-[#1e3a8a]">Moderate</p>
              <p className="text-xs text-slate-400 mt-0.5">62 / 100</p>
            </div>
          </div>

          {/* stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'XIRR', value: '14.8%', green: true },
              { label: 'Unrealised P&L', value: '+₹2.4L', green: true },
              { label: 'Holdings', value: '11', green: false },
            ].map((s) => (
              <div key={s.label} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`text-sm font-semibold ${s.green ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* holdings */}
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2.5">Top Holdings</p>
            <div className="space-y-2">
              {[
                { name: 'HDFC Bank', sector: 'Banking', alloc: 24, change: '+1.4%', up: true, spark: [14,15,13,16,16,18,17] },
                { name: 'Infosys', sector: 'Technology', alloc: 19, change: '-0.6%', up: false, spark: [18,17,16,15,15,14,14] },
                { name: 'Reliance Ind.', sector: 'Conglomerate', alloc: 17, change: '+0.9%', up: true, spark: [12,13,12,14,14,15,16] },
                { name: 'TCS', sector: 'Technology', alloc: 14, change: '+0.3%', up: true, spark: [10,10,11,11,12,12,13] },
              ].map((h) => (
                <div key={h.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-600">{h.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-800">{h.name}</p>
                      <p className="text-[10px] text-slate-400">{h.sector}</p>
                    </div>
                  </div>
                  <MiniSparkline values={h.spark} color={h.up ? '#10b981' : '#ef4444'} />
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{h.alloc}%</p>
                    <p className={`text-xs font-medium ${h.up ? 'text-emerald-600' : 'text-red-500'}`}>{h.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI strip */}
          <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3">
            <div className="flex items-start gap-2.5">
              <span className="text-blue-500 mt-0.5 text-sm">◈</span>
              <div>
                <p className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider mb-1">AI Summary</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Portfolio is overweight technology relative to index. Suggest reviewing HDFC Bank Q3 results — NIM compression flagged in latest filing.
                </p>
              </div>
            </div>
          </div>

          {/* alloc bar */}
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mb-2">Sector Allocation</p>
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
              <div className="h-full bg-[#1e3a8a]" style={{ width: '43%' }} />
              <div className="h-full bg-[#2563eb]" style={{ width: '24%' }} />
              <div className="h-full bg-slate-400" style={{ width: '17%' }} />
              <div className="h-full bg-slate-200" style={{ width: '16%' }} />
            </div>
            <div className="flex gap-4 mt-1.5">
              {[
                { label: 'Technology', color: 'bg-[#1e3a8a]' },
                { label: 'Banking', color: 'bg-[#2563eb]' },
                { label: 'Energy', color: 'bg-slate-400' },
                { label: 'Others', color: 'bg-slate-200' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                  <span className="text-[10px] text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating badge */}
      <div className="absolute -bottom-4 -left-4 hidden lg:flex border border-slate-200 bg-white shadow-sm rounded-xl px-4 py-3 items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm">✓</div>
        <div>
          <p className="text-xs font-semibold text-slate-800">All fundamentals verified</p>
          <p className="text-[11px] text-slate-400">Updated 4 min ago</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 10);

      // Active section detection
      const ids = NAV_LINKS.map(l => l.href.replace('#', '')).filter(Boolean);
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        if (y + 120 >= offsetTop) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-6 h-6 rounded bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-[#0f172a] font-semibold text-base tracking-tight">Rupeexo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => {
            const id = l.href.replace('#', '');
            const isActive = active === id;
            return (
              <a
                key={l.label}
                href={l.href}
                className={`relative text-sm transition-colors duration-150 ${isActive ? 'text-[#1e3a8a]' : 'text-slate-500 hover:text-[#1e3a8a]'} group`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#2563eb] transition-all duration-200 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </a>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-slate-500 hover:text-[#1e3a8a] px-3 py-1.5 rounded-md hover:bg-slate-100 transition-all duration-150"
          >
            Log in
          </Link>

          <PrimaryButton href="/login" className="px-5 py-2.5 hover:shadow-sm hover:-translate-y-[1px] transition-all duration-150">
            Create Account →
          </PrimaryButton>
        </div>

        <button className="md:hidden p-2 text-slate-600 transition-colors duration-150" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-sm text-slate-700 hover:text-[#1e3a8a]">{l.label}</a>
          ))}
          <PrimaryButton href="/login" className="mt-1 w-full">Create Account →</PrimaryButton>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative bg-[#f8fafc] border-b border-slate-200 overflow-hidden">
      <HeroBackground />
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-6 md:pt-10 pb-20 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center justify-items-center lg:justify-items-stretch">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left hero-animate">
            <Badge>Now in Public Beta</Badge>
            <h1 className="mt-7 md:mt-8 text-4xl md:text-5xl font-semibold text-[#0f172a] leading-[1.15] tracking-tight">
              <span className="type-line type-line-1">Clarity Over Noise.</span>
              <br />
              <span className="type-line type-line-2 text-[#2563eb]">Intelligence Over Impulse.</span>
            </h1>
            <p className="mt-4 md:mt-5 text-lg text-slate-500 leading-relaxed">
              Rupeexo is a trust-first financial intelligence platform for disciplined, long-term investors. We surface what matters — fundamentals, risk, and structure — so every decision you make is grounded in understanding, not noise.
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Built for investors who read balance sheets, think in decades, and refuse to act on speculation. If that's you, you're in the right place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 items-center justify-center lg:justify-start">
              <PrimaryButton href="#platform" className="px-6 py-3 text-base">Explore the Platform →</PrimaryButton>
              <OutlineButton href="/auth/signup" className="px-6 py-3 text-base">Sign Up</OutlineButton>
            </div>
            <p className="mt-5 text-xs text-slate-400">No noise. No hype. No unsolicited recommendations. Ever.</p>
          </div>
          <DashboardPreview />
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TRUST STRIP
───────────────────────────────────────────── */

function TrustStrip() {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <p className="text-sm text-slate-500 text-center max-w-2xl mx-auto">
          Built for individual investors who prefer structured analysis over noise. Rupeexo focuses on clarity, fundamentals, and disciplined decision-making — without social signals or hype.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */

function FeatureCard({ title, description, icon }) {
  return (
    <div className="group border border-slate-200 rounded-xl bg-white p-6 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-default">
      <div className="w-9 h-9 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center text-[#1e3a8a] text-base mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-[#0f172a] mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="bg-[#f8fafc] border-b border-slate-200">
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0f172a] mb-4">Everything you need to invest with intention.</h2>
          <p className="text-[15px] md:text-base text-slate-500 leading-relaxed">
            Rupeexo is not a trading tool. It's a thinking tool. Every feature is designed to help you understand your portfolio more deeply and act on analysis, not anxiety.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PLATFORM INTEGRITY  ← NEW SECTION
───────────────────────────────────────────── */

function IntegrityCard({ title, description }) {
  return (
    <div className="group border border-slate-200 rounded-xl bg-white p-6 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-default">
      <h3 className="text-base font-semibold text-[#0f172a] mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function PlatformIntegrity() {
  return (
    <section id="integrity" className="bg-white border-b border-slate-200">
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Platform Integrity</SectionLabel>
          <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0f172a] mb-4">
            Financial data you can trust.
          </h2>
          <p className="text-[15px] md:text-base text-slate-500 leading-relaxed">
            Rupeexo is built on a single principle: accuracy without agenda. Every number we display is sourced from verified regulatory filings and official exchange data. We do not offer investment advice, generate buy or sell signals, or make recommendations of any kind. Our role is to surface factual, structured financial intelligence — transparently, consistently, and without bias — so that your decisions remain entirely your own.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEGRITY_CARDS.map((card) => (
            <IntegrityCard key={card.title} title={card.title} description={card.description} />
          ))}
        </div>
        <div className="mt-10 border border-slate-100 rounded-xl bg-slate-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-sm">✓</div>
            <p className="text-sm font-semibold text-slate-700">No investment advice. Ever.</p>
          </div>
          <div className="h-px sm:h-8 sm:w-px bg-slate-200 shrink-0" />
          <p className="text-[15px] md:text-base text-slate-500 leading-relaxed">
            Rupeexo is a financial information and analytics platform. We are not a SEBI-registered investment adviser, research analyst, or broker. We do not provide investment advice, recommendations, or buy/sell signals of any kind. All data, analytics, and AI-generated interpretations are provided strictly for informational and educational purposes. Users are solely responsible for their investment decisions. Please consult a SEBI-registered financial adviser before making any investment decisions.
          </p>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#f8fafc] border-b border-slate-200">
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-xl mb-14">
          <SectionLabel>The Process</SectionLabel>
          <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0f172a] mb-4">From data to disciplined action.</h2>
          <p className="text-[15px] md:text-base text-slate-500 leading-relaxed">
            Most platforms give you data and leave you to figure out the rest. Rupeexo structures your analysis into a repeatable process — so good investing becomes a habit.
          </p>
        </div>
        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          <div className="hidden md:block absolute top-7 left-[22%] right-[22%] h-px bg-slate-200" />
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="flex items-center gap-4 mb-5">
                <div className="relative z-10 w-14 h-14 rounded-full border-2 border-slate-200 bg-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Step</span>
                  <span className="text-sm font-semibold text-[#1e3a8a]">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && <div className="md:hidden flex-1 h-px bg-slate-200" />}
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">{step.title}</h3>
              <p className="text-[15px] md:text-base text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PLATFORM PREVIEW
───────────────────────────────────────────── */

function PlatformPreview() {
  return (
    <section id="platform" className="bg-[#f8fafc] border-b border-slate-200">
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <SectionLabel>Platform Preview</SectionLabel>
          <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0f172a] mb-4">What structured financial intelligence looks like.</h2>
          <p className="text-[15px] md:text-base text-slate-500">No jargon panels. No flashing tickers. Just clean, structured information laid out for a thinking investor.</p>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          {/* chrome */}
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 w-56">app.rupeexo.com/portfolio</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] min-h-[480px]">
            {/* sidebar */}
            <div className="border-r border-slate-100 bg-slate-50 p-4 hidden lg:block">
              <div className="space-y-0.5">
                {['Overview','Holdings','Fundamentals','Risk Monitor','AI Summaries','Watchlist'].map((item, i) => (
                  <div key={item} className={`px-3 py-2 rounded-md text-sm cursor-default ${i === 0 ? 'bg-white border border-slate-200 text-[#1e3a8a] font-medium shadow-sm' : 'text-slate-500 hover:bg-white'}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Watchlist</p>
                {['BAJFINANCE','PIDILITIND','DMART','ASIANPAINT'].map((t) => (
                  <div key={t} className="flex items-center justify-between py-1.5 text-xs text-slate-600">
                    <span>{t}</span>
                    <span className="text-emerald-600 text-[11px]">▲</span>
                  </div>
                ))}
              </div>
            </div>

            {/* main */}
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Net Worth Tracked', value: '₹18.4L', sub: '+₹56K this month' },
                  { label: 'Portfolio XIRR', value: '14.8%', sub: 'vs 12.1% Nifty 50' },
                  { label: 'Risk Score', value: '62/100', sub: 'Moderate — stable' },
                  { label: 'Last Analysed', value: '4 min ago', sub: 'Auto-synced daily' },
                ].map((m) => (
                  <div key={m.label} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1.5">{m.label}</p>
                    <p className="text-lg font-semibold text-[#0f172a]">{m.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-5 gap-4">
                {/* fundamentals table */}
                <div className="lg:col-span-3 border border-slate-100 rounded-xl overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Fundamental Snapshot</p>
                    <span className="text-[10px] text-slate-400">NSE · FY24</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-50">
                        {['Company','P/E','ROE','D/E'].map((h, i) => (
                          <th key={h} className={`text-[11px] text-slate-400 font-medium py-2 uppercase tracking-wider ${i === 0 ? 'text-left px-4' : 'text-right px-3'}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'HDFC Bank', pe: '19.2x', roe: '16.8%', de: '0.8' },
                        { name: 'Infosys', pe: '24.1x', roe: '31.2%', de: '0.0' },
                        { name: 'Reliance', pe: '27.3x', roe: '9.4%', de: '0.5' },
                        { name: 'TCS', pe: '28.6x', roe: '46.1%', de: '0.0' },
                      ].map((row) => (
                        <tr key={row.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-slate-700 font-medium">{row.name}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-600 text-right">{row.pe}</td>
                          <td className="px-3 py-2.5 text-sm text-emerald-600 text-right font-medium">{row.roe}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600 text-right">{row.de}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* risk panel */}
                <div className="lg:col-span-2 border border-slate-100 rounded-xl p-4 space-y-4">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk Indicators</p>
                  {[
                    { label: 'Concentration Risk', level: 'Medium', pct: 62, color: 'bg-amber-400' },
                    { label: 'Sector Overlap', level: 'Low', pct: 28, color: 'bg-emerald-400' },
                    { label: 'Leverage Exposure', level: 'Low', pct: 22, color: 'bg-emerald-400' },
                    { label: 'Valuation Risk', level: 'High', pct: 78, color: 'bg-red-400' },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-600">{r.label}</span>
                        <span className="text-[11px] text-slate-400">{r.level}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-[11px] text-[#2563eb] font-medium uppercase tracking-wider mb-1.5">Insight</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Valuation risk is elevated. Consider averaging into defensive positions before Q4 earnings cycle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PHILOSOPHY
───────────────────────────────────────────── */

function Philosophy() {
  return (
    <section id="philosophy" className="bg-white border-b border-slate-200">
      <Reveal>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-24 md:py-32 text-center">
        <SectionLabel>Our Belief</SectionLabel>
        <h2 className="text-2xl md:text-[30px] font-semibold tracking-tight text-[#0f172a] mb-10 leading-snug">Built for Long-Term Discipline</h2>
        <p className="text-[15px] md:text-base text-slate-500 leading-relaxed mb-7">
          Most financial products are designed to keep you active — clicking, reacting, trading. Rupeexo is designed for the opposite. We believe the best investing decisions come from deep understanding, not rapid response. From structure, not stimulation.
        </p>
        <p className="text-[15px] md:text-base text-slate-500 leading-relaxed mb-7">
          We will never surface trending stocks. We will never send you "buy now" alerts. We will never optimise for engagement at the cost of your clarity. Every design choice on this platform exists to help you think more carefully — and act less impulsively.
        </p>
        <p className="text-[15px] md:text-base text-slate-500 leading-relaxed mb-7">
          If you believe investing is a craft that rewards patience, rigour, and intellectual honesty, Rupeexo is built for you.
        </p>
        <div className="mt-14 inline-flex items-center gap-3 border border-slate-200 rounded-full px-5 py-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-sm text-slate-600">No investment advice. No bias.</span>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CTA + PRICING
───────────────────────────────────────────── */

function CTA() {
  return (
    <section id="cta" className="bg-[#f8fafc] border-b border-slate-200">
      <Reveal>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <SectionLabel>Get Started</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-[#0f172a] mb-5 leading-tight">
            Invest with Confidence.<br />Decide with Clarity.
          </h2>
          <p className="text-[15px] md:text-base text-slate-500 leading-relaxed mb-8">
            Join thousands of disciplined investors who use Rupeexo to cut through the noise and build portfolios grounded in fundamentals.
          </p>
          
          <p className="text-xs text-slate-400">Free plan available · No credit card required · Cancel anytime</p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <p className="text-xs text-slate-500">
            No investment advice · No broker integration · Cancel anytime
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-0">
          {[
            {
              title: 'Free',
              price: '₹0',
              period: 'forever',
              features: ['Up to 10 holdings', 'Basic AI summaries', 'Risk overview', 'Weekly digest'],
              highlight: false,
            },
            {
              title: 'Pro',
              price: '₹499',
              period: 'per month',
              features: ['Unlimited holdings', 'Full AI summaries', 'Decision support signals', 'Long-term analytics', 'Priority support'],
              highlight: true,
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className={`border rounded-xl p-6 bg-white flex flex-col shadow-sm hover:shadow-md transition-all duration-150 ${plan.highlight ? 'border-[#2563eb]' : 'border-slate-200'}`}
            >
              {plan.highlight && (
                <span className="inline-flex mb-3 text-[11px] font-semibold text-[#2563eb] uppercase tracking-wider border border-blue-200 bg-blue-50 px-2.5 py-0.5 rounded-full">Most Popular</span>
              )}
              <h3 className="text-base font-semibold text-[#0f172a] mb-1">{plan.title}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-semibold text-[#0f172a]">{plan.price}</span>
                <span className="text-sm text-slate-400">/ {plan.period}</span>
              </div>
              <div className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 text-xs">✓</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="/auth/signup" className={`mt-auto block text-center w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${plan.highlight ? 'bg-[#1e3a8a] hover:bg-[#1e40af] text-white' : 'border border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                {plan.price === '₹0' ? 'Get Started Free' : 'Start Free Trial'}
              </a>
            </div>
          ))}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-10 gap-y-12 items-start">
          <div className="col-span-2 md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4 select-none">
              <div className="w-6 h-6 rounded bg-[#1e3a8a] flex items-center justify-center">
                <span className="text-white text-xs font-bold">R</span>
              </div>
              <span className="text-[#0f172a] font-semibold text-base">Rupeexo</span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 max-w-sm">
              Trust-first financial intelligence for disciplined, long-term investors. No noise. No hype. No unsolicited advice.
            </p>
            <p className="text-xs text-slate-400">Data sourced from BSE, NSE, and publicly available regulatory filings.</p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">{col}</p>
              <div className="space-y-2.5">
                {links.map((link) => (
                  <a
                    key={link}
                    href={
                      link === 'Privacy Policy'
                        ? '/legal/privacy'
                        : link === 'Terms of Service'
                        ? '/legal/terms'
                        : link === 'Security'
                        ? '/legal/disclaimer'
                        : '#'
                    }
                    className="block text-sm text-slate-400 hover:text-[#1e3a8a] transition-colors duration-150"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Rupeexo Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed mx-auto md:mx-0 text-center md:text-right">
            Rupeexo is a financial information and analytics platform. We are not a SEBI-registered investment adviser, research analyst, or broker. We do not provide investment advice, recommendations, or buy/sell signals of any kind. All data, analytics, and AI-generated interpretations are provided strictly for informational and educational purposes. Users are solely responsible for their investment decisions. Please consult a SEBI-registered financial adviser before making any investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function Page() {
  return (
    <>
      <style>{`html { scroll-behavior: smooth; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.hero-animate > * {
  opacity: 0;
  transform: translateY(20px);
  animation: heroReveal 0.6s ease forwards;
}

.hero-animate > *:nth-child(1) { animation-delay: 0.1s; }
.hero-animate > *:nth-child(2) { animation-delay: 0.2s; }
.hero-animate > *:nth-child(3) { animation-delay: 0.3s; }
.hero-animate > *:nth-child(4) { animation-delay: 0.4s; }
.hero-animate > *:nth-child(5) { animation-delay: 0.5s; }
.hero-animate > *:nth-child(6) { animation-delay: 0.6s; }

@keyframes heroReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* Typing animation (no blinking cursor after finish) */

.type-line {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: none !important; /* ensure no cursor line */
}
.type-line::after {
  content: none !important;
}

.type-line-1 {
  width: 0;
  animation: typing1 1.6s steps(22, end) 0.2s forwards;
}

.type-line-2 {
  width: 0;
  animation: typing2 1.8s steps(26, end) 1.9s forwards;
}

@keyframes typing1 {
  from { width: 0 }
  to { width: 22ch }
}

@keyframes typing2 {
  from { width: 0 }
  to { width: 26ch }
}
`}</style>
      <div className="font-sans antialiased text-[#0f172a] bg-[#f8fafc] transition-all duration-150">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <Features />
          <PlatformIntegrity />
          <HowItWorks />
          <PlatformPreview />
          <Philosophy />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}