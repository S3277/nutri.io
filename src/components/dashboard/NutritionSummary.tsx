import React from 'react';
import { FoodEntry } from '../../types';

interface NutritionSummaryProps {
  entries: FoodEntry[];
  dailyCalories: number;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ entries, dailyCalories }) => {
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = entries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = entries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = entries.reduce((sum, entry) => sum + entry.fat, 0);
  
  const recProtein = (dailyCalories * 0.3) / 4;
  const recCarbs = (dailyCalories * 0.45) / 4;
  const recFat = (dailyCalories * 0.25) / 9;
  
  const proteinPercent = Math.min(Math.round((totalProtein / recProtein) * 100), 100);
  const carbsPercent = Math.min(Math.round((totalCarbs / recCarbs) * 100), 100);
  const fatPercent = Math.min(Math.round((totalFat / recFat) * 100), 100);
  
  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nutrition Summary</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-blue-600">Protein</span>
            <span className="text-gray-600">
              {Math.round(totalProtein)}g / {Math.round(recProtein)}g
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-orange-500">Carbs</span>
            <span className="text-gray-600">
              {Math.round(totalCarbs)}g / {Math.round(recCarbs)}g
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-emerald-600">Fat</span>
            <span className="text-gray-600">
              {Math.round(totalFat)}g / {Math.round(recFat)}g
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Macronutrient Breakdown</h3>
        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden flex">
          <div
            className="bg-blue-500 transition-all duration-500 ease-out"
            style={{
              width: `${totalCalories === 0 ? 0 : Math.round((totalProtein * 4 * 100) / totalCalories)}%`,
            }}
          />
          <div
            className="bg-orange-500 transition-all duration-500 ease-out"
            style={{
              width: `${totalCalories === 0 ? 0 : Math.round((totalCarbs * 4 * 100) / totalCalories)}%`,
            }}
          />
          <div
            className="bg-emerald-500 transition-all duration-500 ease-out"
            style={{
              width: `${totalCalories === 0 ? 0 : Math.round((totalFat * 9 * 100) / totalCalories)}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Protein</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Carbs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;