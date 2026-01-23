import React from 'react';
import { Home, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-100 py-12 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        
        {/* Brand Section */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#E67E22] p-1.5 rounded-lg text-white">
              <Home size={20} />
            </div>
            <span className="text-lg font-bold text-[#1A1A1A]">GidaNa</span>
          </div>
          <span className="hidden md:block text-gray-300">|</span>
          <p className="text-sm text-gray-500 font-medium">
            Bridging the gap between Landlords & Tenants.
          </p>
        </div>
        
        {/* Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="flex gap-6 text-sm font-bold text-gray-600">
            <a href="#" className="hover:text-[#E67E22] transition-colors">Landlords</a>
            <a href="#" className="hover:text-[#E67E22] transition-colors">Tenants</a>
            <a href="#" className="hover:text-[#E67E22] transition-colors">Support</a>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-gray-400 text-xs">
              © 2026 GidaNa. All rights reserved.
            </p>
            <p className="text-[10px] text-gray-300 flex items-center gap-1 font-medium">
              Made with <Heart size={10} className="text-red-400 fill-red-400" /> in Lagos
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;