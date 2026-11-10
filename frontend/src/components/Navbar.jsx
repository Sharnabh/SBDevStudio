import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let isScrolled = window.scrollY > 30;

    const updateNavClass = (scrolled) => {
      if (scrolled) {
        nav.classList.add('bg-[#0B1120]/90', 'backdrop-blur-xl', 'border-slate-800/80', 'shadow-2xl', 'shadow-black/50');
        nav.classList.remove('bg-[#0B1120]/50', 'backdrop-blur-md', 'border-slate-800/40');
      } else {
        nav.classList.remove('bg-[#0B1120]/90', 'backdrop-blur-xl', 'border-slate-800/80', 'shadow-2xl', 'shadow-black/50');
        nav.classList.add('bg-[#0B1120]/50', 'backdrop-blur-md', 'border-slate-800/40');
      }
    };

    updateNavClass(isScrolled);

    const handleScroll = () => {
      const over = window.scrollY > 30;
      if (over !== isScrolled) {
        isScrolled = over;
        updateNavClass(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6">
      <nav
        ref={navRef}
        className="max-w-6xl mx-auto rounded-full transition-all duration-300 px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border bg-[#0B1120]/50 backdrop-blur-md border-slate-800/40"
      >
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => scrollToSection('home')}
        >
          <div className="relative">
            <img
              src="/assets/SB_DevStudio_Logo.svg"
              alt="SB Dev Studio Logo"
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
              SB Dev Studio
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Product Engineering
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-7">
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('abilities')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('tech-stack')}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Tech Stack
          </button>
        </div>

        {/* CTA & Status Badge */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Available for projects</span>
          </div>

          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary text-xs sm:text-sm px-5 py-2 flex items-center space-x-1.5"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary text-xs px-3.5 py-1.5"
          >
            Contact
          </button>
          <button
            className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-2xl bg-[#0B1120]/95 backdrop-blur-2xl border border-slate-800/80 p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium w-fit mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Available for new client work</span>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-sm font-medium text-slate-200 hover:text-cyan-400 py-1.5 transition-colors"
            >
              About Studio
            </button>
            <button
              onClick={() => scrollToSection('abilities')}
              className="block w-full text-left text-sm font-medium text-slate-200 hover:text-cyan-400 py-1.5 transition-colors"
            >
              Services & Capabilities
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left text-sm font-medium text-slate-200 hover:text-cyan-400 py-1.5 transition-colors"
            >
              Featured Portfolio
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left text-sm font-medium text-slate-200 hover:text-cyan-400 py-1.5 transition-colors"
            >
              Client Reviews
            </button>
            <button
              onClick={() => scrollToSection('tech-stack')}
              className="block w-full text-left text-sm font-medium text-slate-200 hover:text-cyan-400 py-1.5 transition-colors"
            >
              Technology Stack
            </button>
            <div className="pt-3 border-t border-slate-800/60">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full btn-primary text-sm py-2.5 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Start a Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default React.memo(Navbar);
