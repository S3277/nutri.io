import React, { useState, useEffect } from 'react';
import { UserProfile, FoodEntry } from '../types';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FoodEntryForm from '../components/dashboard/FoodEntryForm';
import FoodEntriesList from '../components/dashboard/FoodEntriesList';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';

interface DashboardPageProps {
  profile: UserProfile;
  onLogout: () => void;
  onViewProfile: () => void;
  onViewTrainer: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  profile, 
  onLogout, 
  onViewProfile,
  onViewTrainer
}) => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', profile.id)
          .eq('date', today)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setFoodEntries(data || []);
      } catch (error) {
        console.error('Error fetching food entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodEntries();
  }, [profile.id]);
  
  useEffect(() => {
    const calories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const protein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
    const carbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
    const fat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);
    
    setTotalCalories(calories);
    setMacros({ protein, carbs, fat });
  }, [foodEntries]);
  
  const handleAddEntry = async (entry: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }) => {
    const now = new Date();
    const newEntry: FoodEntry = {
      id: uuidv4(),
      user_id: profile.id,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbs: entry.carbs,
      fat: entry.fat,
      meal_type: entry.mealType,
      date: now.toISOString().split('T')[0],
      created_at: now.toISOString()
    };
    
    try {
      const { data, error } = await supabase
        .from('food_entries')
        .insert(newEntry)
        .select()
        .single();
      
      if (error) throw error;
      
      setFoodEntries([...foodEntries, data]);
    } catch (error) {
      console.error('Error adding food entry:', error);
      throw error;
    }
  };
  
  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setFoodEntries(foodEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };
  
  // Calculate BMI
  const bmi = profile.weight && profile.height 
    ? Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10
    : null;

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getActivityLevel = (days: number | null) => {
    if (!days) return 'Sedentary';
    if (days >= 6) return 'Very Active';
    if (days >= 3) return 'Moderately Active';
    if (days >= 1) return 'Lightly Active';
    return 'Sedentary';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-10">
          <DashboardHeader 
            profile={profile} 
            caloriesConsumed={totalCalories}
            onLogout={onLogout}
            onViewProfile={onViewProfile}
            onViewTrainer={onViewTrainer}
            macros={macros}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              <FoodEntryForm onAddEntry={handleAddEntry} />
              
              {/* Body Stats Card */}
              <div className="stat-card">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Body Stats</h3>
                </div>
                {bmi && (
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">BMI</p>
                      <p className="text-2xl font-bold text-emerald-600">{bmi}</p>
                      <p className="text-sm text-gray-600">{getBmiCategory(bmi)}</p>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((bmi / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Level Card */}
              <div className="stat-card">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Activity Level</h3>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {getActivityLevel(profile.weekly_activity)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {profile.weekly_activity || 0} days/week
                  </p>
                </div>
              </div>

              {/* Goal Card */}
              <div className="stat-card">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Goal</h3>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 capitalize">
                    {profile.goal || 'Not set'}
                  </p>
                  {profile.weight_change !== 0 && profile.weight_change !== null && (
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.abs(profile.weight_change)} kg/week
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-10">
              <FoodEntriesList 
                entries={foodEntries} 
                onDeleteEntry={handleDeleteEntry} 
              />
              
              <NutritionSummary 
                entries={foodEntries} 
                dailyCalories={profile.target_calories || 0} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;