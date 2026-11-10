import React from 'react';
import { Cpu } from 'lucide-react';

const categories = [
  {
    name: 'Frontend & UI',
    technologies: [
      { name: 'React', color: '#61DAFB' },
      { name: 'Next.js', color: '#FFFFFF' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Tailwind CSS', color: '#38BDF8' },
      { name: 'Vue.js', color: '#42B883' },
    ],
  },
  {
    name: 'Backend & APIs',
    technologies: [
      { name: 'FastAPI', color: '#009688' },
      { name: 'Python', color: '#3776AB' },
      { name: 'Node.js', color: '#5FA04E' },
      { name: 'Express', color: '#E2E8F0' },
      { name: 'GraphQL', color: '#E10098' },
    ],
  },
  {
    name: 'Databases & Storage',
    technologies: [
      { name: 'PostgreSQL', color: '#4169E1' },
      { name: 'Supabase', color: '#3ECF8E' },
      { name: 'SQLModel', color: '#009688' },
      { name: 'MongoDB', color: '#47A248' },
      { name: 'Redis', color: '#DC382D' },
    ],
  },
  {
    name: 'Mobile & Cloud',
    technologies: [
      { name: 'React Native', color: '#61DAFB' },
      { name: 'SwiftUI', color: '#FF2D55' },
      { name: 'Flutter', color: '#02569B' },
      { name: 'Render', color: '#46E3B7' },
      { name: 'Resend', color: '#FFFFFF' },
      { name: 'AWS & Vercel', color: '#FF9900' },
    ],
  },
];

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative py-20 sm:py-28 bg-[#090D18]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Stack</span>
          </div>
          <h2 className="section-title mb-4">
            Powered by modern,{' '}
            <span className="gradient-text">battle-tested tools</span>
          </h2>
          <p className="text-base text-slate-300/80">
            We pick industry-standard frameworks and platforms engineered for reliability, security, and velocity.
          </p>
        </div>

        {/* Categorized Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.technologies.map((t) => (
                    <div
                      key={t.name}
                      className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all duration-200"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TechStackSection);
