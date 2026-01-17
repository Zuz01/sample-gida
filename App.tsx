
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'auth' | 'dashboard'>('home');

  const navigateToAuth = () => setView('auth');
  const navigateToHome = () => setView('home');
  const navigateToDashboard = () => setView('dashboard');

  if (view === 'dashboard') {
    return <Dashboard onLogout={navigateToHome} />;
  }

  if (view === 'auth') {
    return <Auth onBack={navigateToHome} onLoginSuccess={navigateToDashboard} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSignInClick={navigateToAuth} onSignUpClick={navigateToAuth} />
      <main className="flex-grow">
        <Hero onCtaClick={navigateToAuth} />
        <Features />
        <Testimonials />
        <CTA onCtaClick={navigateToAuth} />
      </main>
      <Footer />
    </div>
  );
};

export default App;
