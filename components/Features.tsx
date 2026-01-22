import React, { useEffect, useRef } from 'react';
import { Building2, Wallet, Users, BarChart3, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps & { index: number }> = ({ icon, title, description, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      duration: 0.6,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    });

    cardRef.current.addEventListener('mouseenter', () => {
      gsap.to(cardRef.current, {
        duration: 0.3,
        y: -10,
        boxShadow: '0 20px 40px rgba(230, 126, 34, 0.15)',
        ease: 'power2.out'
      });
    });

    cardRef.current.addEventListener('mouseleave', () => {
      gsap.to(cardRef.current, {
        duration: 0.3,
        y: 0,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        ease: 'power2.out'
      });
    });
  }, []);

  return (
    <div ref={cardRef} className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all flex flex-col items-start gap-4 h-full">
      <div className="bg-[#FFF5ED] p-3 rounded-2xl text-[#E67E22]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#1A1A1A]">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const features = [
    {
      icon: <Building2 size={24} />,
      title: "Property Management",
      description: "Manage all your properties and units from a single dashboard with real-time updates."
    },
    {
      icon: <Wallet size={24} />,
      title: "Automated Rent Collection",
      description: "Integration with Paystack and Bank Transfers with automatic payment matching and confirmation (coming soon)."
    },
    {
      icon: <Users size={24} />,
      title: "Tenant Records",
      description: "Maintain comprehensive tenant records without requiring tenants to create accounts."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Financial Reports",
      description: "Detailed analytics on revenue, collection rates, and property performance."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Secure & Isolated",
      description: "Multi-tenant architecture ensures complete data isolation between landlords."
    }
  ];

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.from(headingRef.current, {
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      ease: 'power2.out'
    });
  }, []);

  return (
    <section className="py-24 px-6 md:px-12 bg-white max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 ref={headingRef} className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
          Everything You Need to Manage Properties
        </h2>
        <p className="text-lg text-gray-500">Purpose-built features for the Nigerian rental market</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} index={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
