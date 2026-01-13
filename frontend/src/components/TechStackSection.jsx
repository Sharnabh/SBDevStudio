import React from 'react';

const techStack = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Vue.js', color: '#42B883' },
  { name: 'Next.js', color: '#FFFFFF' },
  { name: 'React Native', color: '#61DAFB' },
  { name: 'SwiftUI', color: '#ff2d55' },
  { name: 'UIKit', color: '#0a84ff' },
  { name: 'Kotlin', color: '#a97bff' },
  { name: 'Flutter', color: '#02569b' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Python', color: '#3776AB' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'Supabase', color: '#3ecf8e' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Git', color: '#F05032' }
];

const TechStackSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0A1628] to-[#0f1e36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="section-title mb-4">
            Tech <span className="gradient-text">Stack</span>
          </h2>
          <p className="text-xl text-gray-400">
            Cutting-edge technologies we use to build amazing products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {techStack.map((tech, index) => (
            <div
              key={index}
              className="tech-badge group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="w-3 h-3 rounded-full mb-3"
                style={{ backgroundColor: tech.color }}
              ></div>
              <span className="text-white font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;