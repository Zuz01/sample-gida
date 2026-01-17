
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  location: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, location }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-6">
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} fill="#F39C12" stroke="#F39C12" />
      ))}
    </div>
    <p className="text-lg text-gray-700 leading-relaxed italic">"{quote}"</p>
    <div>
      <h4 className="font-bold text-[#1A1A1A]">{name}</h4>
      <p className="text-gray-500 text-sm">{location}</p>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A1A] mb-4">
            Trusted by Landlords Across Nigeria
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <TestimonialCard 
            quote="GidaNa has transformed how I manage my 3 apartment buildings. The real-time payment tracking is a game changer."
            name="Emeka Obi"
            location="Property Owner, Lagos"
          />
          <TestimonialCard 
            quote="Finally, a property management system designed for how we do business in Nigeria. The payment integration will be incredible."
            name="Funke Adebayo"
            location="Landlord, Abuja"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
