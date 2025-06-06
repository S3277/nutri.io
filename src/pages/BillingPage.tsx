import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CreditCard, Lock } from 'lucide-react';
import { createCheckoutSession } from '../services/stripe';
import { products } from '../stripe-config';
import { supabase } from '../services/supabase';

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setHasSession(!!session);
    if (!session) {
      setError('Please log in to continue with your purchase');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!hasSession) {
      setError('Please log in to continue with your purchase');
      return;
    }
    
    try {
      setIsLoading(true);
      const checkoutUrl = await createCheckoutSession(products.pro.priceId, products.pro.mode);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Profile
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-orange-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h1>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
                {!hasSession && (
                  <button
                    onClick={() => navigate('/auth')}
                    className="mt-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Log in now →
                  </button>
                )}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan Benefits</h2>
              <ul className="space-y-2 text-gray-600">
                <li>✓ Unlimited body analysis</li>
                <li>✓ Custom workout schedules</li>
                <li>✓ Advanced nutrition tracking</li>
                <li>✓ Priority support</li>
              </ul>
            </div>

            <div className="mb-8">
              <div className="bg-orange-50 rounded-lg p-6 flex items-center">
                <Lock className="w-6 h-6 text-orange-500 mr-3" />
                <div>
                  <p className="text-orange-800 font-medium">Secure Payment</p>
                  <p className="text-orange-600 text-sm">
                    Your payment information is processed securely by Stripe
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-2xl font-bold text-gray-900">${products.pro.mode === 'subscription' ? '9.99' : '99'}</p>
                  <p className="text-gray-500">{products.pro.mode === 'subscription' ? 'per month' : 'one-time payment'}</p>
                </div>
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!hasSession || isLoading}
                  leftIcon={<CreditCard size={18} />}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;