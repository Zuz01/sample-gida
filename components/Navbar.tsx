
import React from 'react';
import { Home } from 'lucide-react';

interface NavbarProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignInClick, onSignUpClick }) => {
  return (
    <nav className="border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="bg-[#E67E22] p-1.5 rounded-lg text-white">
          <Home size={24} />
        </div>
        <span className="text-xl font-bold text-[#1A1A1A]">GidaNa</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onSignInClick}
          className="text-gray-600 font-medium hover:text-[#E67E22] transition-colors hidden md:block"
        >
          Sign In
        </button>
        <button 
          onClick={onSignUpClick}
          className="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm"
        >
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
