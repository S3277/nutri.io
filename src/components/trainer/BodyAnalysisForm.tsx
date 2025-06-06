import React, { useState } from 'react';
import { UserProfile } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Camera, Upload, X } from 'lucide-react';

interface BodyAnalysisFormProps {
  profile: UserProfile;
  onAnalyze: (imageData: string, userData: {
    height: number;
    weight: number;
    age: number;
    gender: string;
    activityLevel: number;
    goal: string;
  }) => Promise<void>;
}

const BodyAnalysisForm: React.FC<BodyAnalysisFormProps> = ({ profile, onAnalyze }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    height: profile.height || 170,
    weight: profile.weight || 70,
    age: profile.age || 30,
    gender: profile.gender || 'male',
    activityLevel: profile.weekly_activity || 3,
    goal: profile.goal || 'maintain',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError(null);
    
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
    } catch (error) {
      console.error('Failed to process image:', error);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview) {
      setError('Please upload a full-body photo');
      return;
    }
    
    try {
      await onAnalyze(imagePreview, formData);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Body Analysis</h2>
        
        <div className="space-y-6">
          {!imagePreview ? (
            <div 
              className="relative border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500 transition-colors"
              onClick={() => document.getElementById('body-image')?.click()}
            >
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">Upload a full-body photo</p>
              <p className="text-sm text-gray-500">Click to upload or use your camera</p>
              <input
                id="body-image"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="Body preview"
                className="w-full h-96 object-cover"
              />
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                min={100}
                max={250}
                required
              />
              
              <Input
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                min={30}
                max={300}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                min={18}
                max={100}
                required
              />
              
              <Select
                label="Gender"
                value={formData.gender}
                onChange={(value) => setFormData({ ...formData, gender: value })}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                required
              />
            </div>

            <Select
              label="Activity Level (days per week)"
              value={formData.activityLevel}
              onChange={(value) => setFormData({ ...formData, activityLevel: Number(value) })}
              options={[
                { value: 0, label: 'Sedentary (little or no exercise)' },
                { value: 2, label: 'Light (1-3 days per week)' },
                { value: 4, label: 'Moderate (3-5 days per week)' },
                { value: 6, label: 'Active (6-7 days per week)' },
              ]}
              required
            />

            <Select
              label="Goal"
              value={formData.goal}
              onChange={(value) => setFormData({ ...formData, goal: value })}
              options={[
                { value: 'lose', label: 'Lose Weight' },
                { value: 'maintain', label: 'Maintain Weight' },
                { value: 'gain', label: 'Build Muscle' },
              ]}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                disabled={!imagePreview || isUploading}
              >
                Analyze Body Composition
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BodyAnalysisForm;