import React from 'react';
import { Globe, Smartphone, Server, Palette, Zap, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Web Engineering',
    tag: 'Frontend & Full-Stack',
    color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    description: 'High-speed SPAs, SSR web portals, and eCommerce platforms built with React, Next.js, and modern CSS architecture.',
    deliverables: ['Custom React & Next.js Apps', 'Responsive & Accessible UX', 'Core Web Vitals & SEO Tuning'],
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    tag: 'iOS & Android',
    color: 'from-indigo-500/20 to-violet-500/10 text-indigo-400 border-indigo-500/30',
    description: 'Native and cross-platform mobile apps using React Native & Flutter, delivering smooth 60fps animations and offline capability.',
    deliverables: ['iOS App Store & Google Play', 'Push Notifications & Deep Linking', 'Offline Sync & Local Caching'],
  },
  {
    icon: Server,
    title: 'Backend & Cloud APIs',
    tag: 'Microservices & DB',
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Ultra-low latency REST & GraphQL APIs engineered with FastAPI, Node.js, Supabase, and PostgreSQL.',
    deliverables: ['FastAPI & Express Backends', 'Supabase & PostgreSQL Pooling', 'JWT Authentication & RBAC'],
  },
  {
    icon: Palette,
    title: 'UI/UX Product Design',
    tag: 'Design Systems',
    color: 'from-pink-500/20 to-rose-500/10 text-pink-400 border-pink-500/30',
    description: 'Modern, clean, user-centric interfaces. Wireframing, interactive prototyping, and design systems in Figma.',
    deliverables: ['Design Systems & Component Kits', 'Interactive Prototypes', 'Conversion Rate Optimization'],
  },
  {
    icon: Zap,
    title: 'Cloud DevOps & Hosting',
    tag: 'Render, Vercel & AWS',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    description: 'Zero-downtime CI/CD deployment pipelines, containerization, custom domain setups, and 24/7 uptime monitoring.',
    deliverables: ['Render & Vercel Deployments', 'SSL Certificates & CDN Edge', 'UptimeRobot 24/7 Health Pings'],
  },
  {
    icon: ShieldCheck,
    title: 'API Integrations & Email',
    tag: 'Payments & Resend',
    color: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30',
    description: 'Robust third-party integrations including payment processors (Stripe, Razorpay) and transactional mailing via Resend.',
    deliverables: ['Resend & SendGrid Transactional Mail', 'Stripe & Razorpay Checkouts', 'Webhook & Background Task Handling'],
  },
];

const AbilitiesSection = () => {
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
            From initial wireframe to production cloud deployment, we cover the full product lifecycle.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${svc.color} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-0.5 rounded-full bg-slate-800/60 border border-slate-700/50">
                      {svc.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-slate-300/85 leading-relaxed mb-5">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 space-y-2">
                  {svc.deliverables.map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AbilitiesSection;
