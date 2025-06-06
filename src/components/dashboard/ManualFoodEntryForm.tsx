import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Save, X } from 'lucide-react';

interface ManualFoodEntryFormProps {
  onSubmit: (entry: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  }) => Promise<void>;
  onCancel: () => void;
}

const ManualFoodEntryForm: React.FC<ManualFoodEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'lunch' as 'breakfast' | 'lunch' | 'dinner' | 'snack',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }
    
    if (!formData.calories || Number(formData.calories) <= 0) {
      newErrors.calories = 'Please enter valid calories';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name: formData.name.trim(),
        calories: Number(formData.calories) || 0,
        protein: Number(formData.protein) || 0,
        carbs: Number(formData.carbs) || 0,
        fat: Number(formData.fat) || 0,
        mealType: formData.mealType,
      });
      
      // Reset form
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: 'lunch',
      });
    } catch (error) {
      console.error('Failed to add food entry:', error);
      setErrors({ submit: 'Failed to add food entry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 card-gradient">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add Food Manually</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {errors.submit}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Food Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Grilled Chicken Breast"
              error={errors.name}
              required
            />
            
            <Input
              label="Calories"
              type="number"
              value={formData.calories}
              onChange={(e) => handleChange('calories', e.target.value)}
              placeholder="0"
              min="0"
              error={errors.calories}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Protein (g)"
              type="number"
              value={formData.protein}
              onChange={(e) => handleChange('protein', e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
            
            <Input
              label="Carbs (g)"
              type="number"
              value={formData.carbs}
              onChange={(e) => handleChange('carbs', e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
            
            <Input
              label="Fat (g)"
              type="number"
              value={formData.fat}
              onChange={(e) => handleChange('fat', e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <Select
            label="Meal Type"
            value={formData.mealType}
            onChange={(value) => handleChange('mealType', value)}
            options={[
              { value: 'breakfast', label: 'Breakfast' },
              { value: 'lunch', label: 'Lunch' },
              { value: 'dinner', label: 'Dinner' },
              { value: 'snack', label: 'Snack' },
            ]}
            required
          />

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
              leftIcon={<Save size={18} />}
            >
              Add Food Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualFoodEntryForm;