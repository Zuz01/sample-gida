
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="py-20 px-6 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A1A] leading-tight mb-8">
        Property Management <span className="text-[#E67E22]">Made Simple</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-500 max-w-3xl mb-12 leading-relaxed">
        The all-in-one platform for Nigerian landlords to manage properties, 
        collect rent via Bank Transfer & Paystack, and track everything in real-time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
        <button 
          onClick={onCtaClick}
          className="bg-[#E67E22] hover:bg-[#D35400] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
        >
          Start Free Trial
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </button>
        <button className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
          Watch Demo
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <CheckCircle2 className="text-[#27AE60]" size={20} />
          <span>No setup fees</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <CheckCircle2 className="text-[#27AE60]" size={20} />
          <span>14-day free trial</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 font-medium">
          <CheckCircle2 className="text-[#27AE60]" size={20} />
          <span>Cancel anytime</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
