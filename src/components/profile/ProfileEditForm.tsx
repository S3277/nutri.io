import React, { useState } from 'react';
import { UserProfile } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { calculateDailyCalories, supabase } from '../../services/supabase';

interface ProfileEditFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onCancel, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    height: profile.height || 170,
    weight: profile.weight || 70,
    age: profile.age || 30,
    gender: profile.gender || 'male',
    weekly_activity: profile.weekly_activity || 3,
    goal: profile.goal || 'maintain',
    weight_change: profile.weight_change || 0,
  });

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : Number(value),
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'weight_change' ? Number(value) : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Please enter a valid height (100-250 cm)';
    }
    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = 'Please enter a valid weight (30-300 kg)';
    }
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age (18-100 years)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate new daily calories based on updated profile data
      const calculatedCalories = calculateDailyCalories({
        height: formData.height,
        weight: formData.weight,
        age: formData.age,
        gender: formData.gender,
        weekly_activity: formData.weekly_activity,
        weight_change: formData.weight_change,
      });
      
      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update({
          height: formData.height,
          weight: formData.weight,
          age: formData.age,
          gender: formData.gender,
          weekly_activity: formData.weekly_activity,
          goal: formData.goal,
          weight_change: formData.weight_change,
          target_calories: calculatedCalories,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      onSave(data);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ 
        submit: 'Failed to update profile. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="text-red-600 text-sm mb-4">
              {errors.submit}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
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
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditForm;