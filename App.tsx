import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Loader2 } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard'; // Landlord Dashboard
import TenantDashboard from './components/TenantDashboard'; // Tenant Dashboard
import PropertyLink from './components/PropertyLink'; // Tenant Linking Screen

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'home' | 'auth'>('home');
  
  // Auth Data State
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<'LANDLORD' | 'TENANT' | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPropertyLink, setNeedsPropertyLink] = useState(false);

  // --- 1. Monitor Auth Status ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Fetch Role & Unit Status from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
            
            // Check if Tenant needs to link a property
            if (userData.role === 'TENANT' && !userData.unitId) {
              setNeedsPropertyLink(true);
            } else {
              setNeedsPropertyLink(false);
            }
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        // User is signed out
        setUser(null);
        setRole(null);
        setNeedsPropertyLink(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. Action Handlers ---

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setView('home'); // Go back to landing page
  };

  const handleLinkSuccess = () => {
    setNeedsPropertyLink(false);
    // Reloading triggers the useEffect to fetch fresh unit data
    window.location.reload(); 
  };

  // Helper passed to Auth component to update state immediately (optional optimization)
  const handleLogin = (userRole: 'LANDLORD' | 'TENANT') => {
    setRole(userRole);
  };

  // --- 3. Render Views ---

  // A. Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#E67E22]" size={40} />
      </div>
    );
  }

  // B. Authenticated View (Dashboards)
  if (user) {
    // 1. Tenant: Needs to Link Property
    if (role === 'TENANT' && needsPropertyLink) {
      return <PropertyLink onLinkSuccess={handleLinkSuccess} />;
    }

    // 2. Tenant: Standard Dashboard
    if (role === 'TENANT') {
      return <TenantDashboard onLogout={handleLogout} />;
    }

    // 3. Landlord: Standard Dashboard
    if (role === 'LANDLORD') {
      return <Dashboard onLogout={handleLogout} />;
    }

    // 4. Fallback (Fetching Role)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#E67E22]" size={40} />
      </div>
    );
  }

  // C. Unauthenticated: Auth Screen
  if (view === 'auth') {
    return (
      <Auth 
        onLogin={handleLogin} 
        onBack={() => setView('home')} 
      />
    );
  }

  // D. Unauthenticated: Landing Page
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar 
        onSignInClick={() => setView('auth')} 
        onSignUpClick={() => setView('auth')} 
        onHomeClick={() => setView('home')}
      />
      <main className="flex-grow">
        <Hero onCtaClick={() => setView('auth')} />
        <Features />
        <Testimonials />
        <CTA onCtaClick={() => setView('auth')} />
      </main>
      <Footer />
    </div>
  );
};

export default App;