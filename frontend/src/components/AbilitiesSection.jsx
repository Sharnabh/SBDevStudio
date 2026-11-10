import React from 'react';
import { Globe, Smartphone, Server, Palette, Zap, ShieldCheck, Rocket, Wrench, ArrowUpRight, CircleDollarSign } from 'lucide-react';

const services = [
  {
    icon: Rocket,
    title: 'MVP Building & Launch',
    tag: 'Idea to Market in 3–5 Weeks',
    color: 'from-rose-500/20 to-orange-500/10 text-rose-400 border-rose-500/30',
    description: 'Transform your concept into a market-ready, investor-grade MVP with lean architecture, rapid prototyping, and high-velocity sprint cycles.',
    deliverables: ['Rapid Prototyping & Scope Planning', 'Core Feature Development & Launch', 'Investor-Ready Scalable Foundation'],
  },
  {
    icon: Wrench,
    title: 'Bug Fixing for All Platforms',
    tag: 'Web • iOS • Android • Backend',
    color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    description: 'Urgent defect remediation, crash diagnostics, memory leaks, broken third-party dependencies, and performance bottlenecks across any platform.',
    deliverables: ['Cross-Platform Diagnostics & Hotfixes', 'Crash Logs & Memory Leak Remediation', 'Speed, SEO & Core Web Vitals Audits'],
  },
  {
    icon: Globe,
    title: 'Web Engineering',
    tag: 'React • Next.js • SPAs',
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    description: 'High-speed web applications, SaaS dashboards, and eCommerce portals built with modern React, Next.js, and clean CSS architecture.',
    deliverables: ['Custom React & Next.js Platforms', 'Responsive & Accessible Interfaces', 'SEO & Core Web Vitals Optimization'],
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    tag: 'iOS & Android Native / Hybrid',
    color: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30',
    description: 'Native and cross-platform mobile apps using React Native and Flutter with 60fps animations, local caching, and offline support.',
    deliverables: ['App Store & Play Store Submissions', 'Push Notifications & Deep Linking', 'Offline Sync & Real-Time Sync'],
  },
  {
    icon: Server,
    title: 'Backend & Cloud APIs',
    tag: 'FastAPI • Node.js • Supabase',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Resilient, ultra-low latency REST & GraphQL APIs powered by FastAPI, Node.js, PostgreSQL connection poolers, and microservices.',
    deliverables: ['FastAPI & Express REST Backends', 'Supabase & PostgreSQL Pooling', 'JWT Bearer Auth & Role-Based Access'],
  },
  {
    icon: Palette,
    title: 'UI/UX Product Design',
    tag: 'Figma • Design Systems',
    color: 'from-pink-500/20 to-purple-500/10 text-pink-400 border-pink-500/30',
    description: 'Modern, user-centric interfaces. Interactive Figma prototypes, scalable design systems, and conversion-focused customer journeys.',
    deliverables: ['Design Systems & Component Kits', 'Interactive Prototypes in Figma', 'Conversion Rate & UX Optimization'],
  },
  {
    icon: Zap,
    title: 'Cloud DevOps & Hosting',
    tag: 'Render • Vercel • AWS',
    color: 'from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30',
    description: 'Automated CI/CD deployment pipelines, containerization, custom domain DNS routing, and 24/7 uptime monitoring with zero downtime.',
    deliverables: ['Render & Vercel Deployments', 'Custom Domains & SSL Certificates', 'UptimeRobot 24/7 Health Monitoring'],
  },
  {
    icon: ShieldCheck,
    title: 'API Integrations & Payments',
    tag: 'Stripe • Razorpay • Resend',
    color: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30',
    description: 'Secure payment gateway integrations (Stripe, Razorpay), transactional email workflows via Resend, and webhooks.',
    deliverables: ['Resend Transactional Emailing', 'Stripe & Razorpay Checkouts', 'Webhook & Background Task Handling'],
  },
];

const AbilitiesSection = () => {
  const handleInquireService = (serviceTitle) => {
    const subjectInput = document.querySelector('input[name="subject"]');
    if (subjectInput) {
      subjectInput.value = `Inquiry: ${serviceTitle} - Pricing & Discussion`;
      subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="abilities" className="relative py-20 sm:py-28 bg-[#090D18]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            <span>Capabilities & Services</span>
          </div>
          <h2 className="section-title mb-4">
            Engineering services built for{' '}
            <span className="gradient-text">growth & scale</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300/80">
            From rapid MVP builds and multi-platform bug fixes to production enterprise deployments, we cover the full product lifecycle.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="glass-panel p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${svc.color} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-cyan-300 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-cyan-500/20 inline-block mb-2">
                    {svc.tag}
                  </span>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-300/85 leading-relaxed mb-4">
                    {svc.description}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-800/60 space-y-1.5 mb-4">
                    {svc.deliverables.map((item) => (
                      <div key={item} className="flex items-center space-x-2 text-[11px] text-slate-300 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleInquireService(svc.title)}
                    className="w-full text-xs font-semibold text-cyan-400 hover:text-white px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all flex items-center justify-between group/btn"
                  >
                    <span>Contact for Pricing</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Pricing & Discussion Banner */}
        <div className="mt-12 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <CircleDollarSign className="w-3.5 h-3.5" />
                <span>Transparent Milestone Pricing</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Have a project or bug fix in mind? Let's discuss pricing & timeline.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                Whether you need a fixed-scope MVP package, an emergency cross-platform bug fix sprint, or a dedicated developer retainer, we offer transparent pricing with clear milestones and no hidden surprises.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <button
                onClick={() => handleInquireService('Custom Project & Pricing Discussion')}
                className="btn-primary text-xs sm:text-sm px-6 py-3 flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Discuss Pricing & Scope</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AbilitiesSection;
