import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Us', href: '#about' },
      { name: 'Services', href: '#abilities' },
      { name: 'Projects', href: '#projects' },
      { name: 'Contact', href: '#contact' }
    ],
    Services: [
      { name: 'Web Development', href: '#abilities' },
      { name: 'Mobile Apps', href: '#abilities' },
      { name: 'UI/UX Design', href: '#abilities' },
      { name: 'API Integration', href: '#abilities' }
    ],
    Connect: [
      { name: 'GitHub', href: 'https://github.com/Sharnabh', icon: Github },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sharnabh/', icon: Linkedin },
      { name: 'Twitter', href: 'https://x.com/Sharnabh1', icon: Twitter },
      { name: 'Email', href: 'mailto:banerjeesharnabh@gmail.com', icon: Mail }
    ]
  };

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0f1e36] to-[#0A1628] border-t border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/SB_DevStudio_Logo.svg"
                alt="SB Dev Studio"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-white">SB Dev Studio</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transforming ideas into exceptional digital experiences through innovative development and design.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.icon ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <link.icon className="w-4 h-4" />
                        {link.name}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cyan-500/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              © {currentYear} SB Dev Studio. Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for amazing clients.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
};

export default Footer;