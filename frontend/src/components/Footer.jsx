import React from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Studio: [
      { name: 'About Studio', href: '#about' },
      { name: 'Core Services', href: '#abilities' },
      { name: 'Selected Work', href: '#projects' },
      { name: 'Tech Stack', href: '#tech-stack' },
      { name: 'Client Feedback', href: '#testimonials' },
    ],
    Capabilities: [
      { name: 'MVP Engineering (3–5 Wks)', href: '#abilities' },
      { name: 'Full-Stack Web Apps', href: '#abilities' },
      { name: 'macOS & iOS Native', href: '#abilities' },
      { name: 'FastAPI & Supabase APIs', href: '#abilities' },
      { name: 'Platform Bug Remediation', href: '#abilities' },
    ],
    Connect: [
      { name: 'GitHub', href: 'https://github.com/Sharnabh', icon: Github },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sharnabh/', icon: Linkedin },
      { name: 'Twitter / X', href: 'https://x.com/Sharnabh1', icon: Twitter },
      { name: 'support@sbdevstudio.in', href: 'mailto:support@sbdevstudio.in', icon: Mail },
    ],
  };

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070a10] border-t border-[rgba(233,237,243,0.06)] pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={scrollToTop}>
              <img
                src="/assets/SB_DevStudio_Logo.svg"
                alt="SB Dev Studio Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-base font-semibold text-white tracking-tight">SB Dev Studio</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8891a1] leading-relaxed max-w-sm">
              Engineering high-performance web applications, native Apple ecosystem software, and resilient cloud systems for ambitious startups and businesses.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Available for new client sprints</span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-300 mb-3.5">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.icon ? (
                      <a
                        href={link.href}
                        className="text-xs text-[#8891a1] hover:text-[#5ab9fc] transition-colors flex items-center gap-2 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <link.icon className="w-3.5 h-3.5 group-hover:scale-105 transition-transform" />
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-xs text-[#8891a1] hover:text-[#5ab9fc] transition-colors text-left"
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

        {/* Bottom Bar */}
        <div className="border-t border-[rgba(233,237,243,0.06)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8891a1] text-center sm:text-left">
            © {currentYear} SB Dev Studio. All rights reserved. Codebase and project imagery property of their respective owners.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-xs text-[#8891a1] hover:text-white px-3 py-1.5 rounded-md bg-[#131824] border border-[rgba(233,237,243,0.08)] hover:border-[rgba(90,185,252,0.3)] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
