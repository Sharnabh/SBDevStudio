import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
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
        setProjects(data);
      } catch (error) {
        toast({ title: 'Could not load projects', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const categories = useMemo(() => {
    const unique = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(unique)];
  }, [projects]);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((project) => project.category === filter);

  return (
    <section id="projects" className="relative py-24 bg-gradient-to-b from-[#0f1e36] to-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="section-title mb-4">
            Our <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Explore our portfolio of successful projects and digital solutions
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="project-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-t-xl h-64">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-cyan-500/90 text-white text-xs font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-[#0f1e36]/50 backdrop-blur-sm rounded-b-xl border border-cyan-500/10">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {project.title}
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-center text-gray-400 col-span-full">No projects to show.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;