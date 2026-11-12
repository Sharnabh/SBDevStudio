import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let isScrolled = window.scrollY > 20;

    const updateNavClass = (scrolled) => {
      if (scrolled) {
        nav.classList.add('bg-[#0a0d14]/90', 'backdrop-blur-xl', 'border-[rgba(233,237,243,0.12)]', 'shadow-2xl', 'shadow-black/60');
        nav.classList.remove('bg-[#0a0d14]/60', 'backdrop-blur-md', 'border-[rgba(233,237,243,0.06)]');
      } else {
        nav.classList.remove('bg-[#0a0d14]/90', 'backdrop-blur-xl', 'border-[rgba(233,237,243,0.12)]', 'shadow-2xl', 'shadow-black/60');
        nav.classList.add('bg-[#0a0d14]/60', 'backdrop-blur-md', 'border-[rgba(233,237,243,0.06)]');
      }
    };

    updateNavClass(isScrolled);

    const handleScroll = () => {
      const over = window.scrollY > 20;
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
        className="max-w-6xl mx-auto rounded-xl transition-all duration-300 px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border bg-[#0a0d14]/60 backdrop-blur-md border-[rgba(233,237,243,0.06)]"
      >
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => scrollToSection('home')}
        >
          <img
            src="/assets/SB_DevStudio_Logo.svg"
            alt="SB Dev Studio Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-white tracking-tight leading-none group-hover:text-[#5ab9fc] transition-colors">
              SB Dev Studio
            </span>
            <span className="text-[10px] text-[#8891a1] font-mono tracking-wider uppercase mt-0.5">
              Software Engineering
            </span>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center space-x-7">
          <button
            onClick={() => scrollToSection('about')}
            className="text-xs sm:text-sm font-medium text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('abilities')}
            className="text-xs sm:text-sm font-medium text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="text-xs sm:text-sm font-medium text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            Work
          </button>
          <button
            onClick={() => scrollToSection('tech-stack')}
            className="text-xs sm:text-sm font-medium text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            Stack
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="text-xs sm:text-sm font-medium text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            Reviews
          </button>
        </div>

        {/* Status Badge & CTA */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#131824] border border-[rgba(233,237,243,0.08)] text-[11px] text-[#e9edf3] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[#8891a1]">Status:</span>
            <span className="text-emerald-400 font-medium">Available</span>
          </div>

          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center space-x-1.5"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-primary text-xs px-3 py-1.5"
          >
            Contact
          </button>
          <button
            className="text-[#8891a1] hover:text-white p-2 rounded-lg bg-[#131824] border border-[rgba(233,237,243,0.08)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden mt-2 max-w-6xl mx-auto rounded-xl bg-[#0a0d14]/98 backdrop-blur-2xl border border-[rgba(233,237,243,0.12)] p-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#131824] border border-[rgba(233,237,243,0.08)] text-xs text-[#8891a1] font-mono w-fit mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>Available for new client work</span>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-sm font-medium text-[#e9edf3] hover:text-[#5ab9fc] py-2.5 transition-colors"
            >
              About Studio
            </button>
            <button
              onClick={() => scrollToSection('abilities')}
              className="block w-full text-left text-sm font-medium text-[#e9edf3] hover:text-[#5ab9fc] py-2.5 transition-colors"
            >
              Services & Capabilities
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="block w-full text-left text-sm font-medium text-[#e9edf3] hover:text-[#5ab9fc] py-2.5 transition-colors"
            >
              Featured Portfolio
            </button>
            <button
              onClick={() => scrollToSection('tech-stack')}
              className="block w-full text-left text-sm font-medium text-[#e9edf3] hover:text-[#5ab9fc] py-2.5 transition-colors"
            >
              Technology Stack
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left text-sm font-medium text-[#e9edf3] hover:text-[#5ab9fc] py-2.5 transition-colors"
            >
              Client Reviews
            </button>
            <div className="pt-3 border-t border-[rgba(233,237,243,0.08)]">
              <button
                onClick={() => scrollToSection('contact')}
                className="w-full btn-primary text-sm py-2.5 flex items-center justify-center space-x-2"
              >
                <span>Discuss Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default React.memo(Navbar);
