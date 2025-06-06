import React, { useState } from 'react';
import { AuthFormData } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: AuthFormData) => Promise<void>;
  onToggleAuthType: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onToggleAuthType }) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
  });

  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof AuthFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (type === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (type === 'signup' && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {type === 'login' ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <Input
            label="Name"
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            leftIcon={<User size={18} />}
            error={errors.name}
            required
          />
        )}
        
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Mail size={18} />}
          error={errors.email}
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder={type === 'signup' ? 'Create a password' : 'Enter your password'}
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock size={18} />}
          error={errors.password}
          helperText={type === 'signup' ? 'Must be at least 6 characters' : undefined}
          required
        />
        
        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            rightIcon={<ArrowRight size={18} />}
          >
            {type === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={onToggleAuthType}
            className="text-emerald-600 font-medium hover:underline focus:outline-none"
          >
            {type === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;