import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { submitContact } from '@/lib/api';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContact(formData);
      toast({
        title: 'Message sent!',
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const detail = error?.response?.data?.detail || 'Could not send message';
      toast({ title: 'Send failed', description: detail });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-[#0f1e36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="section-title mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-gray-400">
            Let's discuss your project and bring your ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-400">banerjeesharnabh@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-gray-400">+91 8287890962</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Location</h4>
                    <p className="text-gray-400">Ghaziabad, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
              <h4 className="text-xl font-bold text-white mb-4">Why Choose Us?</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Expert team with 5+ years experience</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>On-time delivery guaranteed</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>24/7 support and maintenance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Competitive pricing</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="floating-input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="floating-input peer"
                  placeholder=" "
                />
                <label className="floating-label">Your Name</label>
              </div>

              <div className="floating-input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="floating-input peer"
                  placeholder=" "
                />
                <label className="floating-label">Email Address</label>
              </div>

              <div className="floating-input-wrapper">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="floating-input peer"
                  placeholder=" "
                />
                <label className="floating-label">Subject</label>
              </div>

              <div className="floating-input-wrapper">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="floating-input peer resize-none"
                  placeholder=" "
                ></textarea>
                <label className="floating-label">Your Message</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;