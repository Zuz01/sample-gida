
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.from(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      duration: 0.8,
      y: 40,
      opacity: 0,
      ease: 'power2.out'
    });

    if (titleRef.current) {
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        delay: 0.1,
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out'
      });
    }

    if (descRef.current) {
      gsap.from(descRef.current, {
        scrollTrigger: {
          trigger: descRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        delay: 0.2,
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
      });
    }

    if (buttonRef.current) {
      gsap.from(buttonRef.current, {
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        delay: 0.3,
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
      });

      gsap.to(buttonRef.current, {
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        delay: 1.1,
        boxShadow: '0 0 0 12px rgba(248, 249, 250, 0.3)',
        duration: 0.8,
        repeat: 2,
        ease: 'power1.inOut'
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-white">
      <div ref={containerRef} className="max-w-6xl mx-auto bg-[#E67E22] rounded-[40px] py-16 px-8 md:px-20 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 ref={titleRef} className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
            Ready to Simplify Your Property Management?
          </h2>
          <p ref={descRef} className="text-lg md:text-xl text-orange-50/90 max-w-2xl mx-auto mb-12 font-medium">
            Join hundreds of Nigerian landlords who trust GidaNa for their property management needs.
          </p>
          <button 
            ref={buttonRef}
            onClick={onCtaClick}
            className="bg-[#F8F9FA] text-[#E67E22] hover:bg-white px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all mx-auto shadow-xl"
          >
            Get Started Free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        </div>
        
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default CTA;
