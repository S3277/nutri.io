import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Get Supabase credentials from environment variables or use fallback
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://your-project.supabase.co';
const supabaseKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'your-anon-key';

// Custom storage implementation for React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const calculateDailyCalories = (data: any): number => {
  const { height, weight, age, gender, weekly_activity, weight_change } = data;

  if (!height || !weight || !age || !gender || weekly_activity === undefined) {
    throw new Error('Missing required profile data for calorie calculation');
  }

  // Mifflin-St Jeor Equation
  const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
  const bmr = gender === 'male' ? baseBMR + 5 : baseBMR - 161;
  
  // Activity multiplier
  let activityMultiplier = 1.2;
  if (weekly_activity >= 6) activityMultiplier = 1.725;
  else if (weekly_activity >= 3) activityMultiplier = 1.55;
  else if (weekly_activity >= 1) activityMultiplier = 1.375;
  
  const tdee = bmr * activityMultiplier;
  const adjustment = weight_change ? (weight_change * 7700) / 7 : 0;
  
  return Math.round(tdee + adjustment);
};