import React, { useEffect, useRef } from "react";

const ORBS = [
  { left: 6, size: 220, delay: 0, duration: 40, opacity: 0.08, color: "#0b5cff" },
  { left: 20, size: 120, delay: 4, duration: 28, opacity: 0.06, color: "#6aa8ff" },
  { left: 38, size: 180, delay: 2, duration: 36, opacity: 0.05, color: "#2b6df6" },
  { left: 56, size: 260, delay: 6, duration: 48, opacity: 0.06, color: "#1e6eff" },
  { left: 74, size: 140, delay: 1, duration: 30, opacity: 0.05, color: "#7fb0ff" },
  { left: 88, size: 200, delay: 8, duration: 44, opacity: 0.07, color: "#2f7bff" },
  { left: 12, size: 90, delay: 12, duration: 34, opacity: 0.045, color: "#6fb4ff" },
  { left: 48, size: 70, delay: 10, duration: 26, opacity: 0.04, color: "#9cc8ff" },
  { left: 30, size: 320, delay: 3, duration: 56, opacity: 0.03, color: "#133f9a" },
  { left: 82, size: 100, delay: 5, duration: 32, opacity: 0.045, color: "#5fa0ff" },
  { left: 64, size: 60, delay: 7, duration: 22, opacity: 0.035, color: "#bcdcff" },
  { left: 42, size: 150, delay: 9, duration: 38, opacity: 0.05, color: "#3f83ff" },
];

export default function BackgroundAnimation() {
  const ref = useRef(null);

  // small parallax on mouse move for anti-gravity feel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
      const dy = (e.clientY - cy) / rect.height;

      el.style.setProperty("--px", (dx * 12).toFixed(2) + "px");
      el.style.setProperty("--py", (dy * 8).toFixed(2) + "px");
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="bg-anti container-anim absolute inset-x-0 top-0 pointer-events-none"
      style={{ zIndex: 0, transform: "translateZ(0)", "--px": "0px", "--py": "0px" }}
    >
      <div className="anim-wrap absolute left-0 right-0 overflow-hidden" style={{ height: "72vh" }}>
        {ORBS.map((o, i) => (
          <div
            key={i}
            className="orb absolute rounded-full blur-3xl transform"
            style={{
              left: `${o.left}%`,
              bottom: `-12%`,
              width: `${o.size}px`,
              height: `${o.size}px`,
              background: `radial-gradient(circle at 30% 30%, ${o.color}, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0) 70%)`,
              opacity: Math.max(o.opacity, 0.04),
              animationDelay: `${o.delay}s`,
              animationDuration: `${o.duration}s`,
              transform: `translate(var(--px), calc(var(--py) * ${0.6 + i % 3 * 0.2}))`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
