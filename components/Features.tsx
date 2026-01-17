
import React from 'react';
import { Building2, Wallet, Users, BarChart3, ShieldCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all flex flex-col items-start gap-4 h-full">
    <div className="bg-[#FFF5ED] p-3 rounded-2xl text-[#E67E22]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#1A1A1A]">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm md:text-base">{description}</p>
  </div>
);

const Features: React.FC = () => {
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

  return (
    <section className="py-24 px-6 md:px-12 bg-white max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#1A1A1A] mb-4">
          Everything You Need to Manage Properties
        </h2>
        <p className="text-lg text-gray-500">Purpose-built features for the Nigerian rental market</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
