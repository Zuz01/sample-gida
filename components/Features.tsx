import React, { useLayoutEffect, useRef } from 'react';
import { Building2, Wallet, Users, BarChart3, ShieldCheck, Wrench } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Data ---
const FEATURES_DATA = [
  {
    icon: <Building2 size={24} />,
    title: "Property Management",
    description: "Manage all your properties and units from a single dashboard with real-time updates."
  },
  {
    icon: <Wallet size={24} />,
    title: "Automated Rent Collection",
    description: "Accept payments via Bank Transfer & Paystack. Auto-reconciliation for stress-free accounting."
  },
  {
    icon: <Users size={24} />,
    title: "Tenant Portal",
    description: "Tenants get their own login to view payment history, download receipts, and track lease status."
  },
  {
    icon: <Wrench size={24} />,
    title: "Maintenance Tracking",
    description: "Tenants can report issues instantly. Landlords can track repairs from report to resolution."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Financial Reports",
    description: "Detailed analytics on revenue, collection rates, and property performance."
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Secure & Reliable",
    description: "Bank-grade security ensures your financial data and tenant records are safe."
  }
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-card bg-white p-8 rounded-3xl border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all flex flex-col items-start gap-4 h-full opacity-0 translate-y-8 group">
      <div className="bg-[#FFF5ED] p-3 rounded-2xl text-[#E67E22] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#1A1A1A]">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Heading
      gsap.fromTo(".feature-heading",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".feature-heading",
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          duration: 0.8,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
        }
      );

      // Animate Cards Staggered
      gsap.fromTo(".feature-card",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".feature-grid",
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          duration: 0.6,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-white max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="feature-heading opacity-0">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
            Everything You Need to Manage Properties
          </h2>
          <p className="text-lg text-gray-500">Purpose-built features for Landlords and Tenants</p>
        </div>
      </div>

      <div className="feature-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES_DATA.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;