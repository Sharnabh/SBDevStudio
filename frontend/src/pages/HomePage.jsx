import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import AbilitiesSection from '../components/AbilitiesSection';
import ProjectsSection from '../components/ProjectsSection';
import TechStackSection from '../components/TechStackSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="relative bg-[#0a0d14] min-h-screen overflow-x-hidden selection:bg-[#5ab9fc]/20 selection:text-[#5ab9fc]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <AbilitiesSection />
      <ProjectsSection />
      <TechStackSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;
