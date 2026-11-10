import React from 'react';
import { ShieldCheck, Zap, Users, Code, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-20 sm:py-28 bg-[#070B14]">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
              <span>About SB Dev Studio</span>
            </div>

            <h2 className="section-title">
              We turn complex challenges into{' '}
              <span className="gradient-text">elegant software</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
              SB Dev Studio is an agile product development and engineering studio. We partner with founders, growth-stage startups, and enterprises to build high-grade web applications, native iOS & Android solutions, and cloud architectures.
            </p>

            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
              We eliminate technical debt before it starts: our approach integrates modern clean code, automated testing, relational & NoSQL databases, and optimized cloud deployments that ensure your software remains lightning fast as you scale.
            </p>

            {/* Core Values checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Production-grade architecture</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>Clean API design & security</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Transparent communication</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-200 text-sm">
                <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>Ongoing support & scaling</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Bento Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">Fast</span>
                <p className="text-xs text-slate-400 mt-1 font-medium">Rapid iteration and sprint delivery</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">Full-Stack</span>
                <p className="text-xs text-slate-400 mt-1 font-medium">React, Python, Postgres & Cloud</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">Secure</span>
                <p className="text-xs text-slate-400 mt-1 font-medium">Enterprise JWT, RBAC & encryption</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-3xl font-extrabold text-white tracking-tight">24/7</span>
                <p className="text-xs text-slate-400 mt-1 font-medium">Continuous monitoring & care</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
