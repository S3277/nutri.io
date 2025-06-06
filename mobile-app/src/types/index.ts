export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: string | null;
  weekly_activity: number | null;
  goal: string | null;
  weight_change: number | null;
  target_calories: number | null;
  created_at: string | null;
  updated_at: string | null;
  membership_type: 'free' | 'pro';
  analysis_count: number;
}

export interface AnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  created_at: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

export interface ProfileFormData {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  weekly_activity: number;
  goal: 'lose' | 'maintain' | 'gain';
  weight_change?: number;
  name?: string;
}