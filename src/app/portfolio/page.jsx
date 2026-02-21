"use client";
import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
      <div className="text-center">
        {/* Minimal working indicator */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse" />
          Status
        </div>
        
        <h1 className="text-4xl font-black text-[#1e1b4b] tracking-tighter">
          Working
        </h1>
        
        <p className="text-slate-400 text-xs mt-2 font-medium">
          Content reserved for future development
        </p>

        {/* Hint for you: The Logo in the top left is now your way back */}
      </div>
    </div>
  );
}