import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AbilitiesSection from '../components/AbilitiesSection';
import ProjectsSection from '../components/ProjectsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import TechStackSection from '../components/TechStackSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative bg-[#0A1628] min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection scrollY={scrollY} />
      <AboutSection />
      <AbilitiesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <TechStackSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;