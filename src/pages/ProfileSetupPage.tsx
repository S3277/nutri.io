import React from 'react';
import ProfileSetupForm from '../components/profile/ProfileSetupForm';
import { ProfileFormData } from '../types';

interface ProfileSetupPageProps {
  onSubmit: (data: ProfileFormData, calculatedCalories: number) => Promise<void>;
}

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({ onSubmit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      <header className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <span className="text-emerald-600 font-bold text-xl">SmartCalorieTracker</span>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Complete Your Profile</h1>
          <p className="text-gray-600 mb-8 text-center">
            We'll use this information to calculate your personalized calorie needs.
          </p>
          
          <ProfileSetupForm onSubmit={onSubmit} />
        </div>
      </main>
    </div>
  );
};

export default ProfileSetupPage;