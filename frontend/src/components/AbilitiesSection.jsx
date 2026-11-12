import React from 'react';
import { Globe, Smartphone, Server, Palette, Zap, ShieldCheck, Rocket, Wrench, ArrowUpRight, Check } from 'lucide-react';

const services = [
  {
    icon: Rocket,
    title: 'MVP Engineering & Launch',
    tag: '3–5 Week Delivery Sprint',
    description: 'Transform specifications into market-ready, investor-grade software with resilient architecture, clean schemas, and automated deployment pipelines.',
    deliverables: ['Full-stack architecture & data modeling', 'Core user workflows & auth systems', 'Production cloud infrastructure setup'],
  },
  {
    icon: Wrench,
    title: 'Platform Diagnostics & Bug Fixing',
    tag: 'Web • macOS • iOS • Backend',
    description: 'Urgent defect remediation, crash telemetry analysis, memory leak resolution, broken dependencies, and performance bottleneck elimination.',
    deliverables: ['Cross-platform root-cause analysis', 'Crash diagnostics & hotfixes', 'Core Web Vitals & speed optimizations'],
  },
  {
    icon: Globe,
    title: 'Full-Stack Web Engineering',
    tag: 'React • Next.js • SPAs',
    description: 'High-performance web applications, client dashboards, and responsive frontends engineered with modern React, TypeScript, and clean CSS.',
    deliverables: ['Component-driven modular architecture', 'Server-side rendering & static caching', 'Strict accessibility & SEO compliance'],
  },
  {
    icon: Smartphone,
    title: 'Native Apple & Mobile Apps',
    tag: 'macOS • iOS • Android',
    description: 'Native Apple ecosystem apps using Swift, SwiftUI, AppKit, and Metal, alongside cross-platform React Native solutions with fluid interactions.',
    deliverables: ['Apple App Store submission support', 'Hardware integration & local caching', 'Offline-first sync & push notifications'],
  },
  {
    icon: Server,
    title: 'Backend APIs & Databases',
    tag: 'FastAPI • Node.js • PostgreSQL',
    description: 'Ultra-low latency REST and GraphQL backends engineered with Python (FastAPI), Node.js, and relational PostgreSQL pooling.',
    deliverables: ['Strict type validation with Pydantic', 'Connection pooling & indexing', 'JWT Bearer auth & granular RBAC'],
  },
  {
    icon: Palette,
    title: 'UI/UX & Product Design',
    tag: 'Figma • Design Systems',
    description: 'Intuitive, conversion-oriented user interfaces, structured component libraries, and interactive high-fidelity prototypes.',
    deliverables: ['Production design systems & tokens', 'Interactive prototypes in Figma', 'Ergonomic user journey mapping'],
  },
  {
    icon: Zap,
    title: 'Cloud DevOps & Automation',
    tag: 'Docker • Render • AWS',
    description: 'Continuous deployment workflows, containerization, custom domain routing, SSL enforcement, and 24/7 health monitoring.',
    deliverables: ['Automated GitHub Actions CI/CD', 'DNS, SSL & edge caching rules', 'Production health telemetry & alerting'],
  },
  {
    icon: ShieldCheck,
    title: 'Payment Engines & Integrations',
    tag: 'Stripe • Razorpay • Resend',
    description: 'Direct payment processing integration, webhook idempotency, automated billing, and transactional email deliverability via Resend.',
    deliverables: ['Multi-currency checkout sessions', 'Resend transactional email triggers', 'Webhook event auditing & logging'],
  },
];

const AbilitiesSection = () => {
  const handleInquireService = (serviceTitle) => {
    const subjectInput = document.querySelector('input[name="subject"]');
    if (subjectInput) {
      subjectInput.value = `Inquiry: ${serviceTitle} - Discussion`;
      subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="abilities" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-label mb-4">
            <span>Capabilities & Services</span>
          </div>
          <h2 className="section-title mb-4">
            Engineering services built for{' '}
            <span className="accent-text">speed and scale</span>.
          </h2>
          <p className="text-base text-slate-300">
            From rapid MVP builds and multi-platform bug fixes to production enterprise deployments, we cover the full product lifecycle.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="studio-card p-5 sm:p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-9 w-9 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] flex items-center justify-center text-[#5ab9fc]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#5ab9fc] px-2 py-0.5 rounded bg-[rgba(90,185,252,0.1)] border border-[rgba(90,185,252,0.2)] inline-block mb-2.5">
                    {svc.tag}
                  </span>

                  <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                    {svc.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {svc.description}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-[rgba(233,237,243,0.06)]">
                    {svc.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-[11px] text-[#8891a1]">
                        <Check className="w-3.5 h-3.5 text-[#5ab9fc] flex-shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4">
                  <button
                    onClick={() => handleInquireService(svc.title)}
                    className="w-full text-xs font-medium text-[#e9edf3] hover:text-[#5ab9fc] flex items-center justify-between py-1.5 border-t border-[rgba(233,237,243,0.08)] transition-colors"
                  >
                    <span>Inquire for details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(AbilitiesSection);
