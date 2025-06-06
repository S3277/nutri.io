import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from './PricingCard';
import { products } from '../../stripe-config';
import { createCheckoutSession } from '../../services/stripe';
import { isDeveloper } from '../../services/supabase';

interface PricingSectionProps {
  isAuthenticated?: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Skip payment for developers in development environment
    if (await isDeveloper()) {
      navigate('/dashboard');
      return;
    }

    try {
      setIsLoading(true);
      const checkoutUrl = await createCheckoutSession(products.pro.priceId, products.pro.mode);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that best fits your needs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price={0}
            description="Perfect for getting started with basic nutrition tracking."
            features={[
              'Create account and track meals',
              'Daily calorie estimation',
              'Meal scanning with AI',
              'One-time body analysis',
              'View strengths and weaknesses',
              'Basic nutrition insights'
            ]}
            onSubscribe={() => navigate('/signup')}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price={9.99}
            description={products.pro.description}
            features={[
              'Everything in Free, plus:',
              'Unlimited body analysis',
              'Custom workout schedules',
              'Advanced nutrition tracking',
              'Personalized meal plans',
              'Progress analytics',
              'Priority support'
            ]}
            isPopular
            onSubscribe={handleSubscribe}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;