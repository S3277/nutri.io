import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Crown, CreditCard } from 'lucide-react';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface BillingSectionProps {
  profile: UserProfile;
}

const BillingSection: React.FC<BillingSectionProps> = ({ profile }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/billing');
  };

  const getMembershipLabel = () => {
    if (profile.email?.endsWith('@nutri.io')) return 'Dev Account';
    if (profile.membership_type === 'pro') return 'Paid Member';
    return 'Free Member';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Billing</h2>
        
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Crown 
                className={profile.membership_type === 'pro' || profile.email?.endsWith('@nutri.io') ? 'text-orange-500' : 'text-gray-400'} 
                size={24} 
              />
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">
                  {getMembershipLabel()}
                </h3>
                <p className="text-sm text-gray-500">
                  {profile.membership_type === 'free' && !profile.email?.endsWith('@nutri.io')
                    ? `${profile.analysis_count}/1 body analyses used`
                    : 'Unlimited access to all features'}
                </p>
              </div>
            </div>
            {profile.membership_type === 'free' && !profile.email?.endsWith('@nutri.io') && (
              <Button
                onClick={handleUpgrade}
                leftIcon={<CreditCard size={18} />}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>

          {/* Features */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile.membership_type === 'pro' || profile.email?.endsWith('@nutri.io')) ? (
                <>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">✓ Unlimited body analysis</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">✓ Custom workout schedules</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">✓ Advanced nutrition tracking</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700">✓ Priority support</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">✓ One-time body analysis</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">✓ Basic workout tracking</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">✓ Basic nutrition tracking</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">✓ Community support</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSection;