import React from 'react';
import { ShieldCheck, Zap, Users, Code, CheckCircle, Terminal, Layers } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="section-label">
              <Terminal className="w-3.5 h-3.5" />
              <span>Engineering Philosophy</span>
            </div>

            <h2 className="section-title">
              Software engineering without{' '}
              <span className="accent-text">agency bloat</span>.
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              SB Dev Studio is a bespoke software development studio. We work directly with founders, early-stage startups, and product teams to engineer production web platforms, native Apple applications, and resilient cloud infrastructure.
            </p>

            <p className="text-base sm:text-lg text-[#8891a1] leading-relaxed font-normal">
              We eliminate non-technical intermediaries. You collaborate directly with software engineers who write clean, tested code, architect scalable relational schemas, and ship on time.
            </p>

            {/* Core Values checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-[#5ab9fc] flex-shrink-0" />
                <span>Production-grade architecture</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-[#5ab9fc] flex-shrink-0" />
                <span>Clean API design & strict types</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-[#5ab9fc] flex-shrink-0" />
                <span>Direct engineer communication</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-[#5ab9fc] flex-shrink-0" />
                <span>Continuous testing & deployment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Bento Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="studio-card p-5 flex flex-col justify-between h-44">
              <div className="h-9 w-9 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-[#5ab9fc]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tracking-tight">Rapid Sprints</span>
                <p className="text-xs text-[#8891a1] mt-1 font-normal leading-normal">
                  Weekly working demos and quick feedback loops.
                </p>
              </div>
            </div>

            <div className="studio-card p-5 flex flex-col justify-between h-44">
              <div className="h-9 w-9 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-emerald-400">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tracking-tight">Full-Stack</span>
                <p className="text-xs text-[#8891a1] mt-1 font-normal leading-normal">
                  React, Next.js, Python, PostgreSQL & Apple Swift.
                </p>
              </div>
            </div>

            <div className="studio-card p-5 flex flex-col justify-between h-44">
              <div className="h-9 w-9 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tracking-tight">Secure</span>
                <p className="text-xs text-[#8891a1] mt-1 font-normal leading-normal">
                  Hardened auth, RBAC permissions & data protection.
                </p>
              </div>
            </div>

            <div className="studio-card p-5 flex flex-col justify-between h-44">
              <div className="h-9 w-9 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-white tracking-tight">Modular</span>
                <p className="text-xs text-[#8891a1] mt-1 font-normal leading-normal">
                  Extensible architectures built for long-term growth.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default React.memo(AboutSection);
