import React from 'react';
import { Globe, Smartphone, Server, Palette, Zap, Shield } from 'lucide-react';

const iconMap = {
  Globe,
  Smartphone,
  Server,
  Palette,
  Zap,
  Shield
};

const abilities = [
  {
    id: 1,
    icon: 'Globe',
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern frameworks like React, Vue, and Next.js.'
  },
  {
    id: 2,
    icon: 'Smartphone',
    title: 'Mobile Development',
    description: 'Native iOS and Android apps, plus cross-platform solutions using React Native and Flutter.'
  },
  {
    id: 3,
    icon: 'Server',
    title: 'Backend Development',
    description: 'Robust server-side solutions with Node.js, Python, and scalable database architecture.'
  },
  {
    id: 4,
    icon: 'Palette',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces that provide exceptional user experiences across all devices.'
  },
  {
    id: 5,
    icon: 'Zap',
    title: 'API Integration',
    description: 'Seamless third-party integrations including payment gateways, social media, and cloud services.'
  },
  {
    id: 6,
    icon: 'Shield',
    title: 'Security & Testing',
    description: 'Comprehensive security measures and thorough testing to ensure reliable, secure applications.'
  }
];

const AbilitiesSection = () => {
  return (
    <section id="abilities" className="relative py-24 bg-[#0f1e36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="section-title mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive development solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {abilities.map((ability, index) => {
            const IconComponent = iconMap[ability.icon];
            return (
              <div
                key={ability.id}
                className="ability-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {ability.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {ability.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AbilitiesSection;