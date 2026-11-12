import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, FolderGit2 } from 'lucide-react';
import { fetchProjects } from '@/lib/api';
import { projects as fallbackProjects } from '@/data/mockData';

const ProjectsSection = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchProjects();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
          } else {
            setProjects(fallbackProjects);
          }
        }
      } catch (error) {
        if (isMounted) {
          setProjects(fallbackProjects);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="section-label mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="section-title">
              Featured <span className="accent-text">engineering work</span>.
            </h2>
            <p className="text-base text-slate-300 max-w-xl mt-2">
              Bespoke web applications, native macOS solutions, and mobile architectures shipped for our clients.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.08)] self-start md:self-auto">
            {categories.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`text-xs font-medium px-3.5 py-1.5 rounded-md transition-all duration-150 ${
                    active
                      ? 'bg-[#5ab9fc] text-[#0a0d14] font-semibold shadow-sm'
                      : 'text-[#8891a1] hover:text-[#e9edf3]'
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
              <div key={n} className="studio-card-static overflow-hidden animate-pulse h-96">
                <div className="h-48 bg-[#182030]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-[#182030] rounded w-2/3" />
                  <div className="h-4 bg-[#182030]/60 rounded w-full" />
                  <div className="h-4 bg-[#182030]/60 rounded w-4/5" />
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

              const hasRealLink = project.link && project.link !== '#';

              return (
                <div
                  key={project.id}
                  className="studio-card group overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Project Image Frame */}
                    <div className="relative overflow-hidden h-48 sm:h-52 bg-[#0e131f] border-b border-[rgba(233,237,243,0.06)]">
                      {hasRealLink ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block h-full w-full overflow-hidden"
                          aria-label={`Open ${project.title}`}
                        >
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </a>
                      ) : (
                        <div className="h-full w-full overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Category Badge overlay */}
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#0a0d14]/85 text-[#e9edf3] border border-[rgba(233,237,243,0.12)] backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-[#5ab9fc] transition-colors leading-snug">
                          {hasRealLink ? (
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
                        {hasRealLink && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8891a1] hover:text-[#5ab9fc] p-1 rounded transition-colors flex-shrink-0"
                            aria-label={`Visit ${project.title}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {hasRealLink && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#5ab9fc] hover:underline"
                        >
                          <span>{project.link.includes('apple.com') ? 'View on App Store' : 'Visit Live Platform'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Technology Pills bottom-aligned */}
                  <div className="px-5 sm:px-6 pb-5 pt-0">
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[rgba(233,237,243,0.06)]">
                      {techList.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-[#8891a1] bg-[#182030] border border-[rgba(233,237,243,0.06)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[11px] font-mono text-slate-400">
                          +{techList.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-16 text-center studio-card-static">
                <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-medium">No projects found in this category.</p>
                <p className="text-slate-400 text-sm mt-1">Select another filter or check back soon.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(ProjectsSection);
