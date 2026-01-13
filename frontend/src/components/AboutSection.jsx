import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 bg-gradient-to-b from-[#0A1628] to-[#0f1e36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 fade-in-up">
            <h2 className="section-title">
              About <span className="gradient-text">SB Dev Studio</span>
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              We are a passionate team of developers and designers dedicated to creating exceptional digital experiences. 
              With expertise spanning web development, mobile applications, and UI/UX design, we bring your vision to life 
              with cutting-edge technology and creative innovation.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our mission is to empower businesses and startups with powerful, scalable, and beautiful digital solutions 
              that drive growth and engagement. From concept to deployment, we're with you every step of the way.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">100%</div>
                <div className="text-sm text-gray-400">Client Satisfaction</div>
              </div>
              <div className="px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">24/7</div>
                <div className="text-sm text-gray-400">Support Available</div>
              </div>
              <div className="px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">Fast</div>
                <div className="text-sm text-gray-400">Delivery Time</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-cyan-500/20">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;