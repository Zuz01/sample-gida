import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Container Animation
      gsap.fromTo(".cta-container",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".cta-container",
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          duration: 0.8,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
        }
      );

      // Staggered Text Animation
      gsap.fromTo([".cta-title", ".cta-desc", ".cta-btn"],
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".cta-container",
            start: 'top 75%',
          },
          delay: 0.2,
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );

      // Button Pulse Effect
      gsap.to(".cta-btn", {
        scrollTrigger: {
          trigger: ".cta-btn",
          start: 'top 85%',
        },
        delay: 1.5,
        boxShadow: '0 0 0 12px rgba(248, 249, 250, 0.3)',
        duration: 0.8,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut'
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-white">
      <div className="cta-container max-w-6xl mx-auto bg-[#E67E22] rounded-[40px] py-16 px-8 md:px-20 text-center text-white relative overflow-hidden opacity-0">
        <div className="relative z-10">
          <h2 className="cta-title text-3xl md:text-5xl font-extrabold mb-8 leading-tight opacity-0">
            Ready to Experience Better Renting?
          </h2>
          <p className="cta-desc text-lg md:text-xl text-orange-50/90 max-w-2xl mx-auto mb-12 font-medium opacity-0">
            Join thousands of Nigerian landlords and tenants simplifying property management with GidaNa.
          </p>
          <button 
            onClick={onCtaClick}
            className="cta-btn bg-[#F8F9FA] text-[#E67E22] hover:bg-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mx-auto shadow-xl opacity-0"
          >
            Get Started Free
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </section>
  );
};

export default CTA;