import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
  }
});

export const isDeveloper = async (): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email?.endsWith('@nutri.io') || false;
};

function calculateBMR({ gender, weight, height, age }: {
  gender: string | null;
  weight: number;
  height: number;
  age: number;
}): number {
  if (!weight || !height || !age || !gender) {
    throw new Error('Missing required data for BMR calculation');
  }
  
  // Mifflin-St Jeor Equation
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

function getActivityMultiplier(weeklyActivity: number): number {
  if (weeklyActivity >= 6) return 1.725;    // Active (6-7 days/week)
  if (weeklyActivity >= 3) return 1.55;     // Moderate (3-5 days/week)
  if (weeklyActivity >= 1) return 1.375;    // Light (1-3 days/week)
  return 1.2;                               // Sedentary (little or no exercise)
}

function getCalorieAdjustment(weightChangePerWeek: number): number {
  // Each kg of weight change requires approximately 7700 calories
  const dailyAdjustment = (weightChangePerWeek * 7700) / 7;
  
  // Cap the adjustment at ±1000 calories per day for safety
  return Math.max(Math.min(dailyAdjustment, 1000), -1000);
}

interface CalorieCalculationData {
  height: number;
  weight: number;
  age: number;
  gender: string;
  weekly_activity: number;
  weight_change?: number | null;
}

export const calculateDailyCalories = (data: CalorieCalculationData): number => {
  const { height, weight, age, gender, weekly_activity, weight_change } = data;

  if (!height || !weight || !age || !gender || weekly_activity === undefined) {
    console.error('Missing data:', { height, weight, age, gender, weekly_activity });
    throw new Error('Missing required profile data for calorie calculation');
  }

  // Step 1: Calculate BMR using Mifflin-St Jeor Equation
  const bmr = calculateBMR({ gender, weight, height, age });
  
  // Step 2: Apply activity multiplier to get TDEE
  const activityMultiplier = getActivityMultiplier(weekly_activity);
  const tdee = bmr * activityMultiplier;
  
  // Step 3: Adjust based on weight change goal
  const adjustment = weight_change ? getCalorieAdjustment(weight_change) : 0;
  
  // Return rounded result
  return Math.round(tdee + adjustment);
};