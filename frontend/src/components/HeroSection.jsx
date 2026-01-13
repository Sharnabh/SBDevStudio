import React, { useEffect, useRef } from 'react';
import { ArrowRight, Code, Smartphone, Globe } from 'lucide-react';

const HeroSection = ({ scrollY }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A1628]/50 to-[#0A1628]"></div>

      <div
        className="absolute top-20 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      ></div>
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="floating-icons flex justify-center gap-8 mb-12">
          <div className="icon-wrapper" style={{ animationDelay: '0s' }}>
            <Code className="w-12 h-12 text-cyan-400" />
          </div>
          <div className="icon-wrapper" style={{ animationDelay: '0.2s' }}>
            <Smartphone className="w-12 h-12 text-blue-400" />
          </div>
          <div className="icon-wrapper" style={{ animationDelay: '0.4s' }}>
            <Globe className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <h1 className="hero-title mb-6">
          Crafting Digital
          <br />
          <span className="gradient-text">Experiences</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          We build stunning websites and powerful mobile applications that transform your ideas into reality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={scrollToContact}
            className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToProjects}
            className="px-8 py-4 border-2 border-cyan-500 text-cyan-400 rounded-full font-semibold text-lg hover:bg-cyan-500/10 transition-all duration-300 hover:scale-105"
          >
            View Our Work
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="stat-card">
            <div className="text-4xl font-bold gradient-text mb-2">10+</div>
            <div className="text-gray-400">Projects Delivered</div>
          </div>
          <div className="stat-card">
            <div className="text-4xl font-bold gradient-text mb-2">5+</div>
            <div className="text-gray-400">Happy Clients</div>
          </div>
          <div className="stat-card">
            <div className="text-4xl font-bold gradient-text mb-2">1+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-500 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-cyan-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;