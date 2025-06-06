import React, { useEffect, useState } from 'react';
import { UserProfile } from '../../types';
import { ArrowUpRight, ArrowDownRight, Minus, User, Dumbbell, Calendar } from 'lucide-react';
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
    <div className="card p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, <span className="text-emerald-600">{capitalizedName}</span> 🌟
          </h1>
          <p className="text-gray-500 mt-1">Track your daily nutrition journey 🥗</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/workout-agenda'}
            leftIcon={<Calendar size={18} />}
          >
            Workout Log
          </Button>
          <Button
            variant="outline"
            onClick={onViewTrainer}
            leftIcon={<Dumbbell size={18} />}
          >
            AI Trainer
          </Button>
          <Button
            variant="outline"
            onClick={onViewProfile}
            leftIcon={<User size={18} />}
          >
            Profile
          </Button>
          <Button
            variant="outline"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Daily Progress 🎯</h2>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold text-emerald-600">{caloriesConsumed}</p>
              <p className="text-sm text-gray-500 mt-1">of {profile.target_calories} kcal</p>
            </div>
            <div className="h-24 w-24 relative">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
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
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold text-emerald-600">{animatedPercent}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <div className="stat-card">
            <h3 className="text-sm font-medium text-blue-600 mb-2">Protein 🥩</h3>
            <p className="text-3xl font-bold text-blue-700">{Math.round(macros.protein)}g</p>
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
            <p className="text-3xl font-bold text-orange-700">{Math.round(macros.carbs)}g</p>
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
            <p className="text-3xl font-bold text-emerald-700">{Math.round(macros.fat)}g</p>
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