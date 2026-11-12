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
import SEOHead from '../components/SEOHead';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.sbdevstudio.in/#organization",
      "name": "SB Dev Studio",
      "url": "https://www.sbdevstudio.in/",
      "logo": "https://www.sbdevstudio.in/assets/SB_DevStudio_Logo.jpeg",
      "sameAs": [
        "https://github.com/sbdevstudio",
        "https://linkedin.com/company/sbdevstudio"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "contact@sbdevstudio.in",
        "contactType": "Customer Support"
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.sbdevstudio.in/#service",
      "name": "SB Dev Studio Software Engineering",
      "url": "https://www.sbdevstudio.in/",
      "description": "Full-stack web applications, native iOS/macOS apps, and high-performance cloud backends.",
      "priceRange": "$$",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software Engineering Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Full-Stack Web Engineering"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile & Native App Development"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Cloud Backend & API Architecture"
            }
          }
        ]
      }
    }
  ]
};

const HomePage = () => {
  return (
    <div className="relative bg-[#0a0d14] min-h-screen overflow-x-hidden selection:bg-[#5ab9fc]/20 selection:text-[#5ab9fc]">
      <SEOHead
        title="SB Dev Studio | Full-Stack Web, Mobile & Cloud Engineering"
        description="Bespoke software development studio. We build production web applications, native mobile apps, and resilient cloud architectures with clean code and zero slop."
        canonical="https://www.sbdevstudio.in/"
        jsonLd={structuredData}
      />
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
