import React, { useState } from 'react';
import { UserProfile } from '../types';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import BillingSection from '../components/profile/BillingSection';

interface ProfilePageProps {
  profile: UserProfile;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  const handleSave = (updatedProfile: UserProfile) => {
    setCurrentProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)"/>
                  <path d="M27 15C27 19.9706 22.9706 24 18 24C13.0294 24 9 19.9706 9 15C9 10.0294 13.0294 6 18 6C22.9706 6 27 10.0294 27 15Z" fill="white"/>
                  <path d="M22.5 15C22.5 17.4853 20.4853 19.5 18 19.5C15.5147 19.5 13.5 17.4853 13.5 15C13.5 12.5147 15.5147 10.5 18 10.5C20.4853 10.5 22.5 12.5147 22.5 15Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="13.5" y1="10.5" x2="22.5" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Nutri.io
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {isEditing ? (
            <ProfileEditForm
              profile={currentProfile}
              onCancel={() => setIsEditing(false)}
              onSave={handleSave}
            />
          ) : (
            <>
              <ProfileOverview
                profile={currentProfile}
                onEdit={() => setIsEditing(true)}
              />
              <BillingSection profile={currentProfile} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;