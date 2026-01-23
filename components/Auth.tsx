import React, { useState } from 'react';
import { Home, Chrome, Loader2, AlertCircle, Mail, ArrowRight, CheckCircle2, Lock, User, KeyRound, Building2 } from 'lucide-react';
import { auth, db } from '../firebase'; // Import from your new firebase.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
  onLogin: (role: 'LANDLORD' | 'TENANT', hasProperty?: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onBack, onLoginSuccess, onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [role, setRole] = useState<'LANDLORD' | 'TENANT'>('LANDLORD');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User exists, log them in
        const userData = userDoc.data();
        onLogin(userData.role, !!userData.unitId);
      } else {
        // New Google User -> Create default profile (Default to Tenant or ask)
        // For simplicity in this flow, we default to Tenant if they sign in with Google first
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName || "Google User",
          role: "TENANT", 
          createdAt: new Date()
        });
        onLogin("TENANT", false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // 2. Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        // --- SIGN UP (Firebase) ---
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create User Document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: name,
          role: role,
          createdAt: new Date(),
          unitId: null // Initialize as null
        });

        // Redirect immediately (Firebase doesn't require email confirm by default)
        onLogin(role, false);
      
      } else {
        // --- SIGN IN (Firebase) ---
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch User Role from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User profile not found.');
        }

        const userData = userDoc.data();

        // Determine if they have a property (For redirection logic)
        let hasProperty = false;

        if (userData.role === 'LANDLORD') {
          // Check if Landlord has created any properties in 'properties' collection
          const q = query(collection(db, "properties"), where("landlordId", "==", user.uid));
          const snapshot = await getDocs(q);
          hasProperty = !snapshot.empty;
        } else {
          // Check if Tenant has a unitId linked
          hasProperty = !!userData.unitId;
        }

        // Redirect logic
        onLogin(userData.role, hasProperty);
      }
    } catch (err: any) {
      console.error(err);
      // Friendly error messages
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  // --- RENDER: SUCCESS SCREEN (Optional - Kept for structure) ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center px-4 py-12 animate-in fade-in duration-500">
        <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
            <div className="absolute inset-0 rounded-full border-2 border-orange-100 animate-ping opacity-20"></div>
            <Mail size={40} className="text-[#E67E22]" />
            <div className="absolute -right-1 -top-1 bg-green-500 rounded-full p-1.5 border-4 border-white">
              <CheckCircle2 size={14} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Check your inbox</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            We've sent a confirmation link to <br/>
            <span className="font-bold text-gray-900">{email}</span>.
          </p>
          <button 
            onClick={() => {
              setShowSuccess(false);
              setMode('signin');
              setError(null);
            }}
            className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Back to Sign In
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN AUTH FORM ---
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
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-gray-500 font-medium">
            {mode === 'signin' ? 'Sign in to manage your properties' : 'Create your landlord account today'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Google Auth Button */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-gray-200 rounded-xl py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-8 font-semibold text-gray-700 shadow-sm disabled:opacity-50 hover:shadow-md"
        >
          {loading ? <Loader2 className="animate-spin text-gray-500" size={20} /> : <Chrome size={20} className="text-gray-900" />}
          Continue with Google
        </button>

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
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signin' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Role Toggle Switch (Only on Signup) */}
        {mode === 'signup' && (
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8 relative">
            <button 
              type="button"
              onClick={() => setRole('LANDLORD')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all z-10 ${role === 'LANDLORD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Building2 size={16}/> Landlord
            </button>
            <button 
              type="button"
              onClick={() => setRole('TENANT')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all z-10 ${role === 'TENANT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <User size={16}/> Tenant
            </button>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input required type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-100 transition-all"/>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input required type="email" placeholder="hello@gidana.ng" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-100 transition-all"/>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-orange-100 transition-all"/>
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-[#E67E22] text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 hover:bg-[#D35400] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'signin' ? <><KeyRound size={20}/> Sign In</> : 'Create Account')}
          </button>
        </form>
      </div>

      <p className="mt-12 text-sm text-gray-500 text-center max-w-xs leading-relaxed">
        By continuing, you agree to our <a href="#" className="underline font-medium text-gray-700">Terms of Service</a> and <a href="#" className="underline font-medium text-gray-700">Privacy Policy</a>
      </p>
    </div>
  );
};

export default Auth;