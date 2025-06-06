import React, { useState } from 'react';
import { ProfileFormData } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { calculateDailyCalories } from '../../services/supabase';

interface ProfileSetupFormProps {
  onSubmit: (data: ProfileFormData, calculatedCalories: number) => Promise<void>;
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  
  const [formData, setFormData] = useState<ProfileFormData>({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    weekly_activity: 3,
    goal: 'maintain',
    weight_change: 0,
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }));
    
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weight_change' ? Number(value) : value,
    }));
    
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ProfileFormData> = {};
    
    if (step === 1) {
      if (!formData.height || formData.height < 100 || formData.height > 250) {
        newErrors.height = 'Please enter a valid height (100-250 cm)';
      }
      if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
        newErrors.weight = 'Please enter a valid weight (30-300 kg)';
      }
      if (!formData.age || formData.age < 18 || formData.age > 100) {
        newErrors.age = 'Please enter a valid age (18-100 years)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const calculatedCalories = calculateDailyCalories({
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        gender: formData.gender,
        weekly_activity: formData.weekly_activity,
        weight_change: formData.weight_change,
      });
      
      await onSubmit(formData, calculatedCalories);
    } catch (error) {
      console.error('Profile setup error:', error);
      setErrors({ height: 'Failed to set up profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getWeightChangeOptions = () => {
    if (formData.goal === 'lose') {
      return [
        { value: -0.25, label: 'Slow (0.25 kg per week)' },
        { value: -0.5, label: 'Moderate (0.5 kg per week)' },
        { value: -1, label: 'Fast (1 kg per week)' },
      ];
    } else if (formData.goal === 'gain') {
      return [
        { value: 0.25, label: 'Slow (0.25 kg per week)' },
        { value: 0.5, label: 'Moderate (0.5 kg per week)' },
        { value: 1, label: 'Fast (1 kg per week)' },
      ];
    } else {
      return [{ value: 0, label: 'Maintain current weight' }];
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 2 && (
                <div
                  className={`h-1 w-16 ${
                    step < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {currentStep === 1 ? 'Basic Information' : 'Fitness Goals'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 ? (
          <div className="space-y-4">
            <Input
              label="Height (cm)"
              type="number"
              name="height"
              value={formData.height}
              onChange={handleNumberChange}
              error={errors.height}
              min={100}
              max={250}
              required
            />
            
            <Input
              label="Weight (kg)"
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleNumberChange}
              error={errors.weight}
              min={30}
              max={300}
              required
            />
            
            <Input
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleNumberChange}
              error={errors.age}
              min={18}
              max={100}
              required
            />
            
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange('gender')}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            
            <div className="pt-4">
              <Button type="button" fullWidth onClick={handleNextStep}>
                Next Step
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Select
              label="Weekly Activity (days per week)"
              name="weekly_activity"
              value={formData.weekly_activity}
              onChange={handleSelectChange('weekly_activity')}
              options={[
                { value: 0, label: 'Sedentary (little or no exercise)' },
                { value: 2, label: 'Light (1-3 days per week)' },
                { value: 4, label: 'Moderate (3-5 days per week)' },
                { value: 6, label: 'Active (6-7 days per week)' },
              ]}
              required
            />
            
            <Select
              label="Weight Goal"
              name="goal"
              value={formData.goal}
              onChange={handleSelectChange('goal')}
              options={[
                { value: 'lose', label: 'Lose Weight' },
                { value: 'maintain', label: 'Maintain Weight' },
                { value: 'gain', label: 'Gain Weight' },
              ]}
              required
            />
            
            {formData.goal !== 'maintain' && (
              <Select
                label="Rate of Weight Change"
                name="weight_change"
                value={formData.weight_change}
                onChange={handleSelectChange('weight_change')}
                options={getWeightChangeOptions()}
                required
              />
            )}
            
            <div className="pt-4 space-y-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handlePrevStep}
              >
                Back
              </Button>
              
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
              >
                Complete Profile
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileSetupForm;