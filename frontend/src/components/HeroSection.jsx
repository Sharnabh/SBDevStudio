import React from 'react';
import { ArrowRight, Terminal, Check, Layers, Code2 } from 'lucide-react';

const HeroSection = () => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden studio-grid-bg">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Section Label */}
        <div className="section-label mb-6">
          <Code2 className="w-3.5 h-3.5" />
          <span>Full-Stack Engineering & Product Studio</span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title max-w-4xl mx-auto mb-6">
          We engineer web platforms, native mobile apps, and{' '}
          <span className="accent-text">cloud backends</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Direct engineering partnerships for founders and product teams. From rapid 3–5 week MVP releases to high-throughput FastAPI services and native Apple ecosystems.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={() => scrollTo('projects')}
            className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2"
          >
            <span>Explore Selected Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto btn-secondary flex items-center justify-center space-x-2"
          >
            <span>Discuss Your Project</span>
          </button>
        </div>

        {/* Visual Workbench: Terminal & Architecture Contract Card */}
        <div className="w-full max-w-3xl text-left studio-card overflow-hidden shadow-2xl mb-12">
          {/* Terminal Window Header */}
          <div className="px-4 py-2.5 bg-[#0e131f] border-b border-[rgba(233,237,243,0.08)] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">sbdevstudio ~ engineering-spec.ts</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
              <Terminal className="w-3.5 h-3.5 text-[#5ab9fc]" />
              <span>production-v2.5</span>
            </div>
          </div>

          {/* Terminal Code Body */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-300 bg-[#0a0d14]/90">
            <div className="text-slate-500">// 1. Client Architecture Contract</div>
            <div>
              <span className="text-[#5ab9fc]">export const</span> <span className="text-emerald-400">ProductionSpec</span> = &#123;
            </div>
            <div className="pl-4 text-slate-300">
              studio: <span className="text-amber-300">"SB Dev Studio"</span>,
            </div>
            <div className="pl-4 text-slate-300">
              stack: [<span className="text-amber-300">"React"</span>, <span className="text-amber-300">"FastAPI"</span>, <span className="text-amber-300">"PostgreSQL"</span>, <span className="text-amber-300">"SwiftUI"</span>],
            </div>
            <div className="pl-4 text-slate-300">
              deliverySprint: <span className="text-[#5ab9fc]">"3-5 weeks to release"</span>,
            </div>
            <div className="pl-4 text-slate-300">
              codebaseGuarantee: &#123; <span className="text-slate-400">typeSafe:</span> <span className="text-emerald-400">true</span>, <span className="text-slate-400">zeroLockIn:</span> <span className="text-emerald-400">true</span>, <span className="text-slate-400">automatedTests:</span> <span className="text-emerald-400">true</span> &#125;,
            </div>
            <div>&#125;;</div>
          </div>
        </div>

        {/* Studio Proof Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[rgba(233,237,243,0.08)]">
          <div className="p-3.5 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.06)] flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-white tracking-tight">3–5 Wks</span>
            <span className="text-xs text-[#8891a1] mt-0.5 font-medium">MVP Sprint to Market</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.06)] flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-[#5ab9fc] tracking-tight">React & Python</span>
            <span className="text-xs text-[#8891a1] mt-0.5 font-medium">Production Architecture</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.06)] flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-emerald-400 tracking-tight">macOS & iOS</span>
            <span className="text-xs text-[#8891a1] mt-0.5 font-medium">Native Apple Apps</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.06)] flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-semibold font-mono text-white tracking-tight">100% IP</span>
            <span className="text-xs text-[#8891a1] mt-0.5 font-medium">Full Codebase Handover</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(HeroSection);
