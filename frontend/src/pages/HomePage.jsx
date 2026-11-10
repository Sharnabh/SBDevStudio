import React from 'react';
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
  return (
    <div className="relative bg-[#070B14] min-h-screen overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <HeroSection />
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
