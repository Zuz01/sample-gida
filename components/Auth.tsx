
import React, { useState } from 'react';
import { Home, Chrome } from 'lucide-react';

interface AuthProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication logic
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center px-4 py-12">
      {/* Brand Logo Header */}
      <div 
        onClick={onBack}
        className="flex items-center gap-3 mb-10 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="bg-[#E67E22] p-2 rounded-xl text-white shadow-lg shadow-orange-100">
          <Home size={28} />
        </div>
        <span className="text-3xl font-extrabold text-[#333333]">GidaNa</span>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2 tracking-tight">Welcome</h1>
          <p className="text-gray-500 font-medium">Sign in to manage your properties</p>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={onLoginSuccess}
          className="w-full border border-gray-200 rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-8 font-semibold text-gray-700 shadow-sm"
        >
          <Chrome size={20} className="text-gray-900" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
            OR CONTINUE WITH EMAIL
          </span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Toggle Switches */}
        <div className="bg-[#F1F1F1] p-1.5 rounded-2xl flex mb-10">
          <button 
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signin' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Kamau"
                className="w-full bg-[#F9FAFB] border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all font-medium"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="officialarikpa@gmail.com"
              className="w-full bg-[#EDF4FF] border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-800 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#EDF4FF] border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all mt-4 active:scale-[0.98]"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>

      {/* Footer Text */}
      <p className="mt-12 text-sm text-gray-500 text-center max-w-xs leading-relaxed">
        By continuing, you agree to our <a href="#" className="underline font-medium text-gray-700">Terms of Service</a> and <a href="#" className="underline font-medium text-gray-700">Privacy Policy</a>
      </p>
    </div>
  );
};

export default Auth;
