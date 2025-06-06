import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';
import PricingSection from '../components/pricing/PricingSection';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const handleSectionNavigate = (section: string) => {
    const id = section === 'footer' ? 'footer' : section;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onGetStarted={onGetStarted} onSectionNavigate={handleSectionNavigate} />
      <main className="flex-grow">
        <Hero onGetStarted={onGetStarted} />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
      </main>
      <div id="footer">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;