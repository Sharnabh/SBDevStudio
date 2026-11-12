import React from 'react';
import { Cpu, Terminal, Layers, Database, Smartphone, Cloud } from 'lucide-react';

const categories = [
  {
    name: 'Frontend & UI Engineering',
    icon: Layers,
    description: 'Component architecture, state management, and high-velocity rendering.',
    technologies: [
      { name: 'React', type: 'Library', highlight: 'Hooks & Concurrent Mode' },
      { name: 'Next.js', type: 'Framework', highlight: 'App Router & SSR' },
      { name: 'TypeScript', type: 'Language', highlight: 'Strict Type Safety' },
      { name: 'Tailwind CSS', type: 'Styling', highlight: 'Atomic Design Systems' },
      { name: 'Vue.js', type: 'Framework', highlight: 'Reactive SPAs' },
    ],
  },
  {
    name: 'Backend & Cloud Services',
    icon: Terminal,
    description: 'High-throughput APIs, asynchronous worker tasks, and microservices.',
    technologies: [
      { name: 'FastAPI', type: 'Framework', highlight: 'Async Python 3.11+' },
      { name: 'Python', type: 'Language', highlight: 'Data & Systems' },
      { name: 'Node.js', type: 'Runtime', highlight: 'Event-Driven Services' },
      { name: 'Express', type: 'Framework', highlight: 'Microservices & REST' },
      { name: 'GraphQL', type: 'API Spec', highlight: 'Schema Contracts' },
    ],
  },
  {
    name: 'Databases & State Engines',
    icon: Database,
    description: 'ACID relational data models, connection pooling, and sub-millisecond caching.',
    technologies: [
      { name: 'PostgreSQL', type: 'RDBMS', highlight: 'Relational Schemas' },
      { name: 'Supabase', type: 'Platform', highlight: 'Auth & Realtime' },
      { name: 'SQLModel', type: 'ORM', highlight: 'Pydantic Integration' },
      { name: 'Redis', type: 'Cache', highlight: 'In-Memory Sessions' },
      { name: 'MongoDB', type: 'NoSQL', highlight: 'Document Stores' },
    ],
  },
  {
    name: 'Mobile & Apple Native',
    icon: Smartphone,
    description: 'Hardware-accelerated native Apple applications and mobile deployments.',
    technologies: [
      { name: 'Swift & SwiftUI', type: 'Apple Native', highlight: 'macOS & iOS' },
      { name: 'Metal Shaders', type: 'Graphics', highlight: 'GPU Acceleration' },
      { name: 'React Native', type: 'Mobile', highlight: 'Cross-Platform' },
      { name: 'Docker', type: 'Containers', highlight: 'Reproducible Builds' },
      { name: 'Render & AWS', type: 'Cloud', highlight: 'Continuous CI/CD' },
    ],
  },
];

const TechStackSection = () => {
  return (
    <section id="tech-stack" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-label mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Tooling</span>
          </div>
          <h2 className="section-title mb-4">
            Built on <span className="accent-text">proven engineering</span>.
          </h2>
          <p className="text-base text-slate-300">
            We build exclusively with industry-standard, performant technologies that guarantee maintainability, high speed, and clean documentation.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="studio-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-8 w-8 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-[#5ab9fc]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                      {cat.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8891a1] mb-5">
                    {cat.description}
                  </p>

                  <div className="space-y-2.5">
                    {cat.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center justify-between p-2.5 rounded-md bg-[#0e131f] border border-[rgba(233,237,243,0.04)] hover:border-[rgba(90,185,252,0.2)] transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5ab9fc]"></span>
                          <span className="text-sm font-medium text-white">{tech.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono text-[#8891a1]">{tech.highlight}</span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#182030] text-[#5ab9fc] border border-[rgba(90,185,252,0.15)]">
                            {tech.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TechStackSection);
