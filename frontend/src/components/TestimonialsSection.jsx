import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { fetchTestimonials } from '@/lib/api';
import { testimonials as fallbackTestimonials } from '@/data/mockData';

const TestimonialsSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchTestimonials();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          } else {
            setItems(fallbackTestimonials);
          }
        }
      } catch (error) {
        if (isMounted) {
          setItems(fallbackTestimonials);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="testimonials" className="relative py-20 sm:py-28 bg-[#0a0d14] border-t border-[rgba(233,237,243,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-label mb-4">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Engagements</span>
          </div>
          <h2 className="section-title mb-4">
            Direct feedback from <span className="accent-text">founders & leaders</span>.
          </h2>
          <p className="text-base text-slate-300">
            Read notes from founders and engineering leaders who partnered with SB Dev Studio to architect and launch their platforms.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {items.map((testimonial) => (
            <div
              key={testimonial.id || testimonial.name}
              className="studio-card p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Engagement category tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono text-[#5ab9fc] px-2 py-0.5 rounded bg-[rgba(90,185,252,0.1)] border border-[rgba(90,185,252,0.2)]">
                    {testimonial.tag || 'Verified Client Engagement'}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </div>
                </div>

                {/* Quote Content */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal mb-6">
                  "{testimonial.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[rgba(233,237,243,0.06)] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs text-[#8891a1] mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(TestimonialsSection);
