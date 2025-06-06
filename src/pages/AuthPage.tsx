import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm';
import { AuthFormData } from '../types';

interface AuthPageProps {
  onLogin: (userData: AuthFormData) => Promise<void>;
  onSignup: (userData: AuthFormData) => Promise<void>;
  onBackToLanding: () => void;
  error?: string | null;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup, onBackToLanding, error }) => {
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  
  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'signup' : 'login');
  };
  
  const handleSubmit = async (data: AuthFormData) => {
    if (authType === 'login') {
      await onLogin(data);
    } else {
      await onSignup(data);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <header className="py-4">
        <div className="container mx-auto px-4">
          <button
            onClick={onBackToLanding}
            className="text-emerald-600 font-medium hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          <AuthForm 
            type={authType}
            onSubmit={handleSubmit}
            onToggleAuthType={toggleAuthType}
          />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;