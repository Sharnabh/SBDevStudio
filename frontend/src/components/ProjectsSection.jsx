import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { fetchProjects } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ProjectsSection = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({ title: 'Could not load projects', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const categories = useMemo(() => {
    const unique = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" className="relative py-20 sm:py-28 bg-[#070B14]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="section-title">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-base text-slate-400 max-w-xl mt-2">
              A curated collection of web applications, mobile products, and scalable backends built for our clients.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 backdrop-blur-md self-start md:self-auto">
            {categories.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card-static rounded-2xl overflow-hidden animate-pulse h-96">
                <div className="h-48 bg-slate-800/60" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-800/60 rounded w-2/3" />
                  <div className="h-4 bg-slate-800/40 rounded w-full" />
                  <div className="h-4 bg-slate-800/40 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const techList = Array.isArray(project.technologies)
                ? project.technologies
                : (typeof project.technologies === 'string' ? JSON.parse(project.technologies || '[]') : []);

              return (
                <div
                  key={project.id}
                  className="glass-panel group rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image */}
                    <div className="relative overflow-hidden h-52 bg-slate-950">
                      {project.link && project.link !== '#' ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full"
                          aria-label={`View ${project.title}`}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
                            }}
                          />
                        </a>
                      ) : (
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-80 pointer-events-none" />
                      
                      {/* Category Chip */}
                      <div className="absolute top-3.5 right-3.5 pointer-events-none">
                        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900/85 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {project.link && project.link !== '#' ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {project.title}
                            </a>
                          ) : (
                            project.title
                          )}
                        </h3>
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-cyan-300 p-1.5 rounded-md hover:bg-slate-800/80 transition-colors flex-shrink-0"
                            aria-label={`Visit ${project.title}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <p className="text-sm text-slate-300/80 line-clamp-3 leading-relaxed mb-3">
                        {project.description}
                      </p>

                      {project.link && project.link !== '#' && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <span>{project.link.includes('apps.apple.com') ? 'View on App Store' : 'Visit Live Platform'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Technology Pills */}
                  <div className="px-6 pb-6 pt-0">
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60">
                      {techList.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/50 text-slate-300 border border-slate-700/40"
                        >
                          {tech}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400">
                          +{techList.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 text-center glass-card-static rounded-2xl">
                <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No projects found in this category.</p>
                <p className="text-slate-500 text-sm mt-1">Select another filter or check back soon.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ProjectsSection);
