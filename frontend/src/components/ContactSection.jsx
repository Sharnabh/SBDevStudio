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
        title: 'Inquiry received',
        description: "Thank you for reaching out. An engineer will reply within 24 hours.",
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
    <section id="contact" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-label mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Inquiry</span>
          </div>
          <h2 className="section-title mb-4">
            Start a <span className="accent-text">technical consultation</span>.
          </h2>
          <p className="text-base text-slate-300">
            Tell us about your product, timeline, or engineering bottleneck. You'll speak directly with a technical lead.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Info & Trust Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="studio-card p-6 space-y-5">
              <h3 className="text-base font-semibold text-white tracking-tight">
                Studio Communications
              </h3>

              <div className="space-y-3.5">
                <a
                  href="mailto:support@sbdevstudio.in"
                  className="flex items-start space-x-3.5 p-3 rounded-md hover:bg-[#182030] transition-colors group"
                >
                  <div className="p-2 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] text-[#5ab9fc] group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#8891a1] block">Direct Email</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#5ab9fc] transition-colors">
                      support@sbdevstudio.in
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+918287890962"
                  className="flex items-start space-x-3.5 p-3 rounded-md hover:bg-[#182030] transition-colors group"
                >
                  <div className="p-2 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] text-[#5ab9fc] group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#8891a1] block">Phone / WhatsApp</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#5ab9fc] transition-colors">
                      +91 8287890962
                    </span>
                  </div>
                </a>

                <div className="flex items-start space-x-3.5 p-3 rounded-md">
                  <div className="p-2 rounded-md bg-[#182030] border border-[rgba(233,237,243,0.08)] text-emerald-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#8891a1] block">Location</span>
                    <span className="text-sm font-medium text-white">
                      Ghaziabad, Uttar Pradesh, India
                    </span>
                    <span className="text-xs text-[#8891a1] block mt-0.5">Serving clients worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time & NDA Promise Card */}
            <div className="studio-card p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>24-Hour Response Commitment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Every technical inquiry is reviewed within 24 hours. We provide standard mutual Non-Disclosure Agreements (NDAs) prior to discovery calls.
              </p>
              <div className="flex items-center space-x-2 text-xs text-[#8891a1] pt-2 border-t border-[rgba(233,237,243,0.06)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5ab9fc]" />
                <span>Confidential & Direct Engineer Communication</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="studio-card p-6 sm:p-7">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Inquiry Received</h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    Your message has been delivered directly to our engineering leads. We will review your requirements and respond within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-xs px-4 py-2 mt-2"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Name <span className="text-[#5ab9fc]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Alex Morgan"
                        className="studio-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                        Work Email <span className="text-[#5ab9fc]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        className="studio-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. MVP Launch / Web Application / iOS App"
                      className="studio-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Project Scope & Goals <span className="text-[#5ab9fc]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your product requirements, current stack, and target launch timeline..."
                      className="studio-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
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
