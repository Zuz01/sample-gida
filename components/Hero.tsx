
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Play, MoveRight, Home, Key, Shield, Building2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeroProps {
  onCtaClick: () => void;
}

const FloatingIcon: React.FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({ children, className = "", delay = "0s" }) => (
  <div 
    className={`absolute pointer-events-none transition-transform duration-1000 ease-out hidden lg:block ${className}`}
    style={{ 
      animation: `drift 8s ease-in-out infinite alternate ${delay}`,
    }}
  >
    {children}
  </div>
);

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const [showDemo, setShowDemo] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const checksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate title
    if (titleRef.current) {
      gsap.from(titleRef.current.children, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }

    // Animate description
    if (descRef.current) {
      gsap.from(descRef.current, {
        delay: 0.3,
        duration: 0.8,
        y: 20,
        opacity: 0,
        ease: 'power2.out'
      });
    }

    // Animate buttons
    if (buttonsRef.current) {
      gsap.from(buttonsRef.current.children, {
        delay: 0.5,
        duration: 0.6,
        y: 20,
        opacity: 0,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    // Animate checks
    if (checksRef.current) {
      gsap.from(checksRef.current.children, {
        delay: 0.7,
        duration: 0.6,
        opacity: 0,
        stagger: 0.12,
        ease: 'power2.out'
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 px-6 md:px-12 flex flex-col items-center text-center max-w-full mx-auto overflow-hidden">
      {/* Background patterns as seen in design intent */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 2px 2px, #E67E22 1px, transparent 0)', 
               backgroundSize: '48px 48px',
               animation: 'bgMove 100s linear infinite'
             }}>
        </div>
      </div>

      {/* Floating Interactive Elements */}
      <FloatingIcon className="top-[15%] left-[10%]" delay="0s">
        <div className="p-5 bg-white rounded-[24px] shadow-2xl border border-gray-50 rotate-[-12deg] hover:rotate-0 hover:scale-110 transition-all pointer-events-auto cursor-help">
          <Home size={42} className="text-[#E67E22]" strokeWidth={1.5} />
        </div>
      </FloatingIcon>
      
      <FloatingIcon className="top-[20%] right-[10%]" delay="2s">
        <div className="p-4 bg-white rounded-[24px] shadow-2xl border border-gray-50 rotate-[15deg] hover:rotate-0 hover:scale-110 transition-all pointer-events-auto cursor-help">
          <Key size={34} className="text-blue-400" strokeWidth={1.5} />
        </div>
      </FloatingIcon>

      <FloatingIcon className="bottom-[15%] left-[12%]" delay="1.5s">
        <div className="p-5 bg-white rounded-[24px] shadow-2xl border border-gray-50 rotate-[8deg] hover:rotate-0 hover:scale-110 transition-all pointer-events-auto cursor-help text-[#008751]">
          <Building2 size={38} strokeWidth={1.5} />
        </div>
      </FloatingIcon>

      <FloatingIcon className="bottom-[30%] right-[15%]" delay="3s">
        <div className="p-5 bg-white rounded-[24px] shadow-2xl border border-gray-50 rotate-[-5deg] hover:rotate-0 hover:scale-110 transition-all pointer-events-auto cursor-help flex items-center justify-center min-w-[76px] min-h-[76px]">
          <span className="text-4xl font-black text-[#E67E22]">₦</span>
        </div>
      </FloatingIcon>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        <h1 ref={titleRef} className="text-[42px] sm:text-[64px] md:text-[84px] font-[800] text-[#2D2D2D] leading-[1.05] mb-8 md:mb-10 flex flex-col items-center tracking-tight">
          <span className="block">Property Management</span>
          <span className="text-[#E67E22] block">Made Simple</span>
        </h1>
        
        <p ref={descRef} className="text-lg md:text-xl text-gray-500 max-w-3xl mb-12 md:mb-14 leading-relaxed font-medium">
          The all-in-one platform for Nigerian landlords to manage properties, 
          collect rent via Bank Transfer & Paystack, and track everything in real-time.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-20 w-full sm:w-auto">
          <button 
            onClick={onCtaClick}
            className="bg-[#E67E22] hover:bg-[#D35400] text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-200 active:scale-95 group"
          >
            Start Free Trial
            <MoveRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => setShowDemo(!showDemo)}
            className="bg-white border border-gray-200 text-[#2D2D2D] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {showDemo ? 'Hide Demo' : 'Watch Demo'}
          </button>
        </div>

        <div ref={checksRef} className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <CheckCircle2 className="text-[#27AE60]" size={22} />
            <span>No setup fees</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <CheckCircle2 className="text-[#27AE60]" size={22} />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <CheckCircle2 className="text-[#27AE60]" size={22} />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Browser Demo Experience */}
        <div className={`
          w-full max-w-5xl transition-all duration-1000 ease-in-out overflow-hidden
          ${showDemo ? 'max-h-[1200px] opacity-100 mb-12 translate-y-0 scale-100' : 'max-h-0 opacity-0 translate-y-20 scale-95'}
        `}>
          <div className="relative bg-white rounded-[32px] p-2 sm:p-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100">
            <div className="bg-gray-50 rounded-t-2xl border-b border-gray-100 p-4 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              </div>
              <div className="bg-white px-8 py-1.5 rounded-xl text-xs text-gray-400 font-semibold mx-auto border border-gray-100 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                gidana.ng/landlord/dashboard
              </div>
            </div>
            <div className="relative aspect-[16/10] bg-gray-50 rounded-b-2xl overflow-hidden">
              <img 
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRydjZpYnljMGtkYzh6am4yazRybW5qMXZrdTV6bjVremZ3azR6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKVUn7iM8FMEU24/giphy.gif" 
                alt="Dashboard View"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
          <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Interactive Dashboard Experience</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift {
          0% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-25px) rotate(-6deg); }
          100% { transform: translateY(0) rotate(-12deg); }
        }
        @keyframes bgMove {
          0% { background-position: 0 0; }
          100% { background-position: 2000px 2000px; }
        }
      `}} />
    </section>
  );
};

export default Hero;
