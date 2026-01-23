import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onHomeClick?: () => void; // Added optional home click handler
}

const Navbar: React.FC<NavbarProps> = ({ onSignInClick, onSignUpClick, onHomeClick }) => {
  return (
    <nav className="border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50 transition-all">
      {/* Logo Section */}
      <div 
        onClick={onHomeClick} 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="bg-[#E67E22] p-1.5 rounded-lg text-white shadow-sm">
          <Home size={24} />
        </div>
        <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">GidaNa</span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-4 md:gap-6">
        <button 
          onClick={onSignInClick}
          className="text-gray-600 font-bold text-sm hover:text-[#E67E22] transition-colors hidden md:block"
        >
          Sign In
        </button>
        
        <button 
          onClick={onSignUpClick}
          className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-orange-100 hover:shadow-lg active:scale-95"
        >
          Get Started
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;