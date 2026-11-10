import React, { useEffect, useState } from 'react';
import { Star, MessageSquareQuote, BadgeCheck } from 'lucide-react';
import { fetchTestimonials } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const TestimonialsSection = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTestimonials();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        toast({ title: 'Could not load testimonials', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-[#070B14]">
      {/* Soft background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>
          <h2 className="section-title mb-4">
            Trusted by founders &{' '}
            <span className="gradient-text">engineering leaders</span>
          </h2>
          <p className="text-base text-slate-300/80">
            Real feedback from companies that partnered with SB Dev Studio to design and ship their products.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card-static rounded-2xl p-7 animate-pulse h-48 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-4 bg-slate-800/50 rounded w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center glass-card-static rounded-2xl max-w-md mx-auto">
            <p className="text-slate-400 font-medium">No reviews published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Verified Chip */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>Verified Client</span>
                    </div>
                  </div>

                  {/* Quote Content */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal italic mb-6">
                    "{item.content}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-3.5 pt-4 border-t border-slate-800/60">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-cover border border-slate-700/60 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://i.pravatar.cc/150?img=12';
                    }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);
