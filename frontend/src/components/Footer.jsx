import React from 'react';
import { Github, Linkedin, Twitter, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: 'About Studio', href: '#about' },
      { name: 'Services', href: '#abilities' },
      { name: 'Portfolio', href: '#projects' },
      { name: 'Client Reviews', href: '#testimonials' },
      { name: 'Contact', href: '#contact' },
    ],
    Services: [
      { name: 'Full-Stack Web Apps', href: '#abilities' },
      { name: 'Mobile App Development', href: '#abilities' },
      { name: 'FastAPI & Backend APIs', href: '#abilities' },
      { name: 'UI/UX Product Design', href: '#abilities' },
      { name: 'Cloud & Database Tuning', href: '#abilities' },
    ],
    Connect: [
      { name: 'GitHub', href: 'https://github.com/Sharnabh', icon: Github },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sharnabh/', icon: Linkedin },
      { name: 'Twitter / X', href: 'https://x.com/Sharnabh1', icon: Twitter },
      { name: 'Email', href: 'mailto:support@sbdevstudio.in', icon: Mail },
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
    <footer className="relative bg-[#050810] border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={scrollToTop}>
              <img
                src="/assets/SB_DevStudio_Logo.svg"
                alt="SB Dev Studio Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-white tracking-tight">SB Dev Studio</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Engineering high-performance web applications, mobile products, and cloud backends designed for durability and growth.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational • Supabase & Resend Active</span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.icon ? (
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <link.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>{link.name}</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors text-left"
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
        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1 text-center sm:text-left">
            © {currentYear} SB Dev Studio. Engineered with precision & care.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
