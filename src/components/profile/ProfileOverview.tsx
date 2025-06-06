import React from 'react';
import { UserProfile } from '../../types';
import { ArrowUpRight, ArrowDownRight, Minus, Activity, Scale, Ruler, Calendar, Crown } from 'lucide-react';
import Button from '../ui/Button';
import { isDeveloper } from '../../services/supabase';

interface ProfileOverviewProps {
  profile: UserProfile;
  onEdit?: () => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile, onEdit }) => {
  const getWeightGoalIcon = () => {
    if (profile.goal === 'lose') {
      return <ArrowDownRight className="text-blue-500\" size={24} />;
    } else if (profile.goal === 'gain') {
      return <ArrowUpRight className="text-orange-500\" size={24} />;
    } else {
      return <Minus className="text-emerald-500\" size={24} />;
    }
  };

  const getActivityLabel = (activity: number | null) => {
    if (!activity) return 'Sedentary';
    if (activity >= 6) return 'Very Active (6-7 days/week)';
    if (activity >= 3) return 'Moderate (3-5 days/week)';
    if (activity >= 1) return 'Light (1-3 days/week)';
    return 'Sedentary (little or no exercise)';
  };

  const getMembershipLabel = () => {
    if (profile.email?.endsWith('@nutri.io')) return 'Dev Account';
    if (profile.membership_type === 'pro') return 'Paid Member';
    return 'Free Member';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          {onEdit && (
            <Button
              variant="outline"
              onClick={onEdit}
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Membership Status */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center">
            <Crown className={profile.membership_type === 'pro' || profile.email?.endsWith('@nutri.io') ? 'text-orange-500' : 'text-gray-400'} size={24} />
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">
                {getMembershipLabel()}
              </h3>
              {profile.membership_type === 'free' && !profile.email?.endsWith('@nutri.io') && (
                <p className="text-sm text-gray-600">
                  {profile.analysis_count}/1 body analyses used
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-3 bg-emerald-100 rounded-full">
              {getWeightGoalIcon()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Weight Goal</h3>
              <p className="text-gray-600">
                {profile.goal === 'lose' 
                  ? 'Weight Loss' 
                  : profile.goal === 'gain' 
                    ? 'Weight Gain' 
                    : 'Maintain Weight'}
                {profile.weight_change !== 0 && profile.weight_change !== null && (
                  <span className="ml-1">
                    ({Math.abs(profile.weight_change)} kg/week)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Scale className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-medium">{profile.weight || '-'} kg</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Ruler className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="font-medium">{profile.height || '-'} cm</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">{profile.age || '-'} years</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Activity className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Activity Level</p>
                <p className="font-medium">{getActivityLabel(profile.weekly_activity)}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Daily Calorie Target</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {profile.target_calories || 0} kcal
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium capitalize">{profile.gender || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;