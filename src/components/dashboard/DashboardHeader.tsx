import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../types';
import { ArrowUpRight, ArrowDownRight, Minus, User, Dumbbell, Calendar, Settings, BarChart3, Camera, Apple } from 'lucide-react';
import Button from '../ui/Button';

interface DashboardHeaderProps {
  profile: UserProfile;
  caloriesConsumed: number;
  onLogout: () => void;
  onViewProfile: () => void;
  onViewTrainer: () => void;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  profile, 
  caloriesConsumed,
  onLogout,
  onViewProfile,
  onViewTrainer,
  macros
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const percentConsumed = Math.min(Math.round((caloriesConsumed / (profile.target_calories || 1)) * 100), 100);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(percentConsumed);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentConsumed]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = profile.name || profile.email?.split('@')[0] || 'there';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Calculate recommended daily macros
  const targetProtein = Math.round((profile.target_calories || 2000) * 0.3 / 4); // 30% of calories from protein
  const targetCarbs = Math.round((profile.target_calories || 2000) * 0.45 / 4); // 45% of calories from carbs
  const targetFat = Math.round((profile.target_calories || 2000) * 0.25 / 9); // 25% of calories from fat

  // Calculate percentages
  const proteinPercent = Math.min(Math.round((macros.protein / targetProtein) * 100), 100);
  const carbsPercent = Math.min(Math.round((macros.carbs / targetCarbs) * 100), 100);
  const fatPercent = Math.min(Math.round((macros.fat / targetFat) * 100), 100);

  return (
    <div className="card p-4 md:p-8">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-100 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12">
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
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Nutri.io
            </h1>
            <p className="text-xs md:text-sm text-gray-500">Smart Nutrition Tracking</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewProfile}
            leftIcon={<User size={14} />}
            className="text-xs px-3 py-2"
          >
            <span className="hidden sm:inline">Profile</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            leftIcon={<Settings size={14} />}
            className="text-xs px-3 py-2"
          >
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <button
          onClick={() => window.location.href = '/workout-agenda'}
          className="nav-card group w-full"
        >
          <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[120px] md:min-h-[140px]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <h3 className="font-semibold text-blue-700 mb-1 text-sm md:text-base text-center">Workout Log</h3>
            <p className="text-xs text-blue-600 text-center leading-tight">Track exercises & progress</p>
          </div>
        </button>

        <button
          onClick={onViewTrainer}
          className="nav-card group w-full"
        >
          <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[120px] md:min-h-[140px]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Dumbbell size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <h3 className="font-semibold text-purple-700 mb-1 text-sm md:text-base text-center">AI Trainer</h3>
            <p className="text-xs text-purple-600 text-center leading-tight">Body analysis & plans</p>
          </div>
        </button>

        <button
          onClick={() => {/* Add food scanning functionality */}}
          className="nav-card group w-full"
        >
          <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[120px] md:min-h-[140px]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
              <Camera size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <h3 className="font-semibold text-emerald-700 mb-1 text-sm md:text-base text-center">Scan Food</h3>
            <p className="text-xs text-emerald-600 text-center leading-tight">AI food recognition</p>
          </div>
        </button>

        <button
          onClick={() => {/* Add nutrition insights functionality */}}
          className="nav-card group w-full"
        >
          <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[120px] md:min-h-[140px]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <h3 className="font-semibold text-orange-700 mb-1 text-sm md:text-base text-center">Analytics</h3>
            <p className="text-xs text-orange-600 text-center leading-tight">Progress insights</p>
          </div>
        </button>
      </div>

      {/* Greeting Section */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {getGreeting()}, <span className="text-emerald-600">{capitalizedName}</span> 🌟
        </h1>
        <p className="text-gray-500 mt-1">Track your daily nutrition journey 🥗</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Daily Progress 🎯</h2>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-emerald-600">{caloriesConsumed}</p>
              <p className="text-sm text-gray-500 mt-1">of {profile.target_calories} kcal</p>
            </div>
            <div className="h-20 w-20 md:h-24 md:w-24 relative">
              <svg className="transform -rotate-90 w-20 h-20 md:w-24 md:h-24">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  className="md:hidden"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  className="hidden md:block"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - animatedPercent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  className="md:hidden"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - animatedPercent / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  className="hidden md:block"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg md:text-xl font-semibold text-emerald-600">{animatedPercent}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-2 md:gap-4">
          <div className="stat-card">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Protein 🥩</h3>
            <p className="text-2xl md:text-3xl font-bold text-blue-700">{Math.round(macros.protein)}g</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {targetProtein}g</p>
          </div>
          
          <div className="stat-card">
            <h3 className="text-sm font-medium text-orange-600 mb-2">Carbs 🍚</h3>
            <p className="text-2xl md:text-3xl font-bold text-orange-700">{Math.round(macros.carbs)}g</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {targetCarbs}g</p>
          </div>
          
          <div className="stat-card">
            <h3 className="text-sm font-medium text-emerald-600 mb-2">Fat 🥑</h3>
            <p className="text-2xl md:text-3xl font-bold text-emerald-700">{Math.round(macros.fat)}g</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm" 
                style={{ width: `${fatPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: {targetFat}g</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;