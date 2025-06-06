import React from 'react';
import Button from '../ui/Button';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
  isLoading?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  isPopular,
  onSubscribe,
  isLoading,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 border-2 ${
        isPopular ? 'border-orange-500 ring-2 ring-orange-500 ring-opacity-50' : 'border-gray-100'
      } relative`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
      
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-gray-600">/month</span>
      </div>

      <p className="text-gray-600 mb-6">{description}</p>

      <ul className="space-y-4 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-center text-gray-600">
            <Check className="w-5 h-5 text-orange-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={isPopular ? 'primary' : 'outline'}
        fullWidth
        onClick={onSubscribe}
        isLoading={isLoading}
      >
        Get Started
      </Button>
    </div>
  );
};

export default PricingCard;