import React, { useState } from 'react';
import { AnalysisResult } from '../../types';
import { analyzeImageWithOpenAI } from '../../services/openai';
import Button from '../ui/Button';
import { Camera, Upload, X } from 'lucide-react';

interface FoodEntryFormProps {
  onAddEntry: (entry: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }) => Promise<void>;
}

const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddEntry }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    setAnalysisResult(null);
    
    if (!file.type.includes('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      const base64Image = await convertFileToBase64(file);
      const result = await analyzeImageWithOpenAI(base64Image);
      
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const clearImage = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!analysisResult) {
      setError('Please upload and analyze a food image first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await onAddEntry({
        ...analysisResult,
        mealType,
      });
      
      clearImage();
      
    } catch (error) {
      console.error('Failed to add food entry:', error);
      setError('Failed to add food entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 card-gradient">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add Food Entry</h2>
        
        {!imagePreview ? (
          <div 
            className="relative border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => document.getElementById('food-image')?.click()}
          >
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-700 mb-2">Take a photo or upload</p>
            <p className="text-sm text-gray-500">Click to upload or use your camera</p>
            <input
              id="food-image"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full h-64 object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {isUploading && (
              <div className="text-center py-4">
                <div className="animate-pulse flex space-x-2 justify-center">
                  <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-primary-500 rounded-full"></div>
                </div>
                <p className="text-gray-600 mt-2">Analyzing your food...</p>
              </div>
            )}

            {analysisResult && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{analysisResult.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-xl font-semibold text-gray-900">{analysisResult.calories} kcal</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-xl font-semibold text-gray-900">{analysisResult.protein}g</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-xl font-semibold text-gray-900">{analysisResult.carbs}g</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-xl font-semibold text-gray-900">{analysisResult.fat}g</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as typeof mealType)}
                className="flex-1 rounded-lg bg-white border border-gray-200 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              
              <Button
                onClick={handleSubmit}
                disabled={!analysisResult || isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
              >
                Add Entry
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodEntryForm;