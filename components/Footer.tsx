
import React from 'react';
import { Home } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 py-12 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex items-center gap-2">
          <div className="bg-[#E67E22] p-1.5 rounded-lg text-white">
            <Home size={20} />
          </div>
          <span className="text-lg font-bold text-[#1A1A1A]">GidaNa</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
          <div className="flex gap-8 text-gray-500 font-medium">
            <a href="#" className="hover:text-[#E67E22] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#E67E22] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#E67E22] transition-colors">Support</a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2026 GidaNa. Built for Nigerian landlords.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
