import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchTestimonials } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const TestimonialsSection = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTestimonials();
        setItems(data);
      } catch (error) {
        toast({ title: 'Could not load testimonials', description: 'Please try again later.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => items.length ? (prev + 1) % items.length : 0);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => items.length ? (prev - 1 + items.length) % items.length : 0);
  };

  return (
    <section id="testimonials" className="relative py-24 bg-[#0A1628]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="section-title mb-4">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-400">
            What our clients say about working with us
          </p>
        </div>

        <div className="relative">
          {loading ? (
            <p className="text-center text-gray-400">Loading testimonials...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-400">No testimonials yet.</p>
          ) : (
            <>
              <div className="testimonial-card">
                <div className="flex items-center mb-6">
                  <img
                    src={items[currentIndex].avatar}
                    alt={items[currentIndex].name}
                    className="w-16 h-16 rounded-full border-2 border-cyan-500 mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white">{items[currentIndex].name}</h4>
                    <p className="text-gray-400">{items[currentIndex].role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(items[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-lg text-gray-300 leading-relaxed italic">
                  "{items[currentIndex].content}"
                </p>
              </div>

              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-3 bg-white/5 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-cyan-400" />
                </button>

                <div className="flex gap-2">
                  {items.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-cyan-500 w-8'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  className="p-3 bg-white/5 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-cyan-400" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;