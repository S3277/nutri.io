import React from 'react';
import { BodyAnalysis } from '../../types';
import { Activity, Dumbbell, Apple } from 'lucide-react';
import WorkoutSchedule from './WorkoutSchedule';

interface AnalysisResultsProps {
  analysis: BodyAnalysis;
  userId: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, userId }) => {
  // Calculate actual training days based on frequency
  const getTrainingDays = (frequency: number) => {
    if (frequency <= 2) return 'Full body training 1-2 times per week';
    if (frequency === 3) return 'Push/Pull/Legs split 3 times per week';
    if (frequency === 4) return 'Push/Pull/Legs split 4 times per week';
    if (frequency === 5) return 'Push/Pull/Legs split 5 times per week';
    return 'Push/Pull/Legs split 6 times per week';
  };

  return (
    <div className="space-y-8">
      {/* Body Composition Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Body Composition Analysis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-50 rounded-xl p-6">
              <p className="text-sm font-medium text-orange-600 mb-2">Body Fat Percentage</p>
              <p className="text-3xl font-bold text-orange-700">
                {analysis.bodyComposition.bodyFatPercentage}%
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <p className="text-sm font-medium text-blue-600 mb-2">Muscle Mass</p>
              <p className="text-3xl font-bold text-blue-700">
                {analysis.bodyComposition.muscleMass}
              </p>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-6">
              <p className="text-sm font-medium text-emerald-600 mb-2">Body Type</p>
              <p className="text-3xl font-bold text-emerald-700">
                {analysis.bodyComposition.bodyType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Schedule */}
      <WorkoutSchedule 
        userId={userId}
        exercises={analysis.recommendations.workout.exercises}
        frequency={analysis.recommendations.workout.frequency}
      />

      {/* Workout Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Dumbbell className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Workout Plan</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <p className="text-gray-600">Recommended Training</p>
                <p className="text-xl font-semibold text-gray-900">{getTrainingDays(analysis.recommendations.workout.frequency)}</p>
              </div>
              <div>
                <p className="text-gray-600">Frequency</p>
                <p className="text-xl font-semibold text-gray-900">{analysis.recommendations.workout.frequency}x / week</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Recommended Exercises</h3>
              <div className="grid gap-4">
                {analysis.recommendations.workout.exercises.map((exercise, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                    <p className="font-medium text-gray-900">{exercise.name}</p>
                    <p className="text-gray-600">{exercise.sets} sets × {exercise.reps} reps</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Apple className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Nutrition Plan</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-lg font-medium text-gray-900 mb-4">Daily Calorie Target</p>
              <p className="text-4xl font-bold text-orange-600">{analysis.recommendations.nutrition.dailyCalories} kcal</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Macro Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-600 mb-1">Protein</p>
                  <p className="text-2xl font-bold text-blue-700">{analysis.recommendations.nutrition.macroSplit.protein}g</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-orange-600 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-orange-700">{analysis.recommendations.nutrition.macroSplit.carbs}g</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-emerald-600 mb-1">Fat</p>
                  <p className="text-2xl font-bold text-emerald-700">{analysis.recommendations.nutrition.macroSplit.fat}g</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Meal Timing</h3>
              <div className="space-y-2">
                {analysis.recommendations.nutrition.mealTiming.map((timing, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700">{timing}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Areas of Focus */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Activity className="w-8 h-8 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Areas of Focus</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-emerald-600 mb-4">Strengths</h3>
              <div className="space-y-2">
                {analysis.areas.strengths.map((strength, index) => (
                  <div key={index} className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-emerald-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-orange-600 mb-4">Areas for Improvement</h3>
              <div className="space-y-2">
                {analysis.areas.improvements.map((improvement, index) => (
                  <div key={index} className="bg-orange-50 rounded-lg p-3">
                    <p className="text-orange-700">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;