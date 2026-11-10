import React, { useEffect, useRef } from 'react';
import { ArrowRight, Code2, Smartphone, Cloud, Sparkles, CheckCircle2 } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create subtle, soothing ambient particles
    const particles = [];
    const count = Math.min(35, Math.floor(window.innerWidth / 35));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Interactive Ambient Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Eyesoothing Ambient Mesh Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Subtle Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #94A3B8 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 shadow-inner mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            Full-Stack Engineering & Product Design Studio
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title max-w-4xl mx-auto mb-6">
          Crafting Scalable Apps &{' '}
          <span className="gradient-text">Digital Experiences</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300/90 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          We architect and build high-performance web platforms, cross-platform mobile apps, and resilient cloud systems for ambitious startups and businesses.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-14">
          <button
            onClick={() => scrollTo('projects')}
            className="w-full sm:w-auto btn-primary px-8 py-3.5 text-sm sm:text-base flex items-center justify-center space-x-2"
          >
            <span>Explore Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-sm sm:text-base flex items-center justify-center space-x-2"
          >
            <span>Discuss a Project</span>
          </button>
        </div>

        {/* Trust & Proof Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-800/60">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">100%</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Client Satisfaction</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-tight">FastAPI & React</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Modern Architecture</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-indigo-400 tracking-tight">PostgreSQL</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Supabase Powered</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/40 backdrop-blur-sm flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">99.9%</span>
            <span className="text-xs text-slate-400 font-medium mt-0.5">Reliable Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
