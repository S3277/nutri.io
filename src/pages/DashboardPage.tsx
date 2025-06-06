import React, { useState, useEffect } from 'react';
import { UserProfile, FoodEntry } from '../types';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FoodEntryForm from '../components/dashboard/FoodEntryForm';
import FoodEntriesList from '../components/dashboard/FoodEntriesList';
import NutritionSummary from '../components/dashboard/NutritionSummary';
import QuickActionsPanel from '../components/dashboard/QuickActionsPanel';
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
  const [showFoodForm, setShowFoodForm] = useState(false);
  
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
      setShowFoodForm(false);
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

  const handleScanFood = () => {
    setShowFoodForm(true);
  };

  const handleAddManualEntry = () => {
    setShowFoodForm(true);
  };

  const handleViewAnalytics = () => {
    // Scroll to nutrition summary or implement analytics modal
    const analyticsSection = document.getElementById('nutrition-summary');
    if (analyticsSection) {
      analyticsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewMealPlan = () => {
    // Implement meal planning functionality
    console.log('Meal planning feature coming soon!');
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
          
          <QuickActionsPanel
            onScanFood={handleScanFood}
            onAddManualEntry={handleAddManualEntry}
            onViewAnalytics={handleViewAnalytics}
            onViewMealPlan={handleViewMealPlan}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              {showFoodForm && (
                <div className="relative">
                  <button
                    onClick={() => setShowFoodForm(false)}
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <FoodEntryForm onAddEntry={handleAddEntry} />
                </div>
              )}
              
              {/* Body Stats Card */}
              <div className="stat-card">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Body Stats</h3>
                </div>
                {profile.height && profile.weight && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">BMI</span>
                      <span className="font-semibold">
                        {Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Height</span>
                      <span className="font-semibold">{profile.height} cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Weight</span>
                      <span className="font-semibold">{profile.weight} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Goal</span>
                      <span className="font-semibold capitalize">{profile.goal}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-10">
              <FoodEntriesList 
                entries={foodEntries} 
                onDeleteEntry={handleDeleteEntry} 
              />
              
              <div id="nutrition-summary">
                <NutritionSummary 
                  entries={foodEntries} 
                  dailyCalories={profile.target_calories || 0} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;