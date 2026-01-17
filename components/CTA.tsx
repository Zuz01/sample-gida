
import React from 'react';

interface CTAProps {
  onCtaClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onCtaClick }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto bg-[#E67E22] rounded-[40px] py-16 px-8 md:px-20 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
            Ready to Simplify Your Property Management?
          </h2>
          <p className="text-lg md:text-xl text-orange-50/90 max-w-2xl mx-auto mb-12 font-medium">
            Join hundreds of Nigerian landlords who trust GidaNa for their property management needs.
          </p>
          <button 
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
