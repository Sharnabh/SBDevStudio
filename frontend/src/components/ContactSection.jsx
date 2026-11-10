import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { submitContact } from '@/lib/api';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: 'Missing fields', description: 'Please fill out your name, email, and message.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContact(formData);
      setSubmitted(true);
      toast({
        title: 'Message sent successfully!',
        description: "Thanks for reaching out! We'll reply within 24 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const detail = error?.response?.data?.detail || 'Could not send message. Please try again.';
      toast({ title: 'Send failed', description: detail });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 bg-[#090D18]">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="section-title mb-4">
            Let's build something{' '}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p className="text-base text-slate-300/80">
            Have an idea or need an engineering team to scale your product? Tell us about your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Trust Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-white mb-2">
                Contact Information
              </h3>

              <div className="space-y-4">
                <a
                  href="mailto:support@sbdevstudio.in"
                  className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Email Us</span>
                    <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      support@sbdevstudio.in
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+918287890962"
                  className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Direct Line</span>
                    <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      +91 8287890962
                    </span>
                  </div>
                </a>

                <div className="flex items-start space-x-3.5 p-3 rounded-xl">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Location</span>
                    <span className="text-sm font-semibold text-white">
                      Ghaziabad, Uttar Pradesh, India
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Serving clients globally</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time & NDA Promise Card */}
            <div className="glass-panel p-6 rounded-2xl space-y-3.5">
              <div className="flex items-center space-x-2.5 text-xs text-emerald-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Quick Response Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                We review every project inquiry within 24 hours. We are also happy to sign a Non-Disclosure Agreement (NDA) prior to project discovery.
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Confidential & Secure</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Thank You!</h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Your message has been delivered to our engineering team. We'll be in touch shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-xs px-5 py-2 mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. New Web App / Mobile App / Consultation"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Project Details <span className="text-cyan-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your project, timeline, and goals..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3.5 text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default React.memo(ContactSection);
