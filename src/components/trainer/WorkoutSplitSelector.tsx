import React from 'react';
import Select from '../ui/Select';

interface WorkoutSplitSelectorProps {
  activityLevel: number;
  onSplitSelect: (split: string) => void;
  selectedSplit: string;
}

const WorkoutSplitSelector: React.FC<WorkoutSplitSelectorProps> = ({
  activityLevel,
  onSplitSelect,
  selectedSplit,
}) => {
  const getSplitOptions = () => {
    return [
      { value: 'push-pull-legs', label: 'Push/Pull/Legs' },
    ];
  };

  const getDescription = (): string => {
    return 'Classic 3-day split targeting pushing, pulling, and leg movements';
  };

  return (
    <div className="mb-6 space-y-4">
      <Select
        label="Workout Split"
        value={selectedSplit}
        onChange={onSplitSelect}
        options={getSplitOptions()}
      />
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
        <h3 className="text-sm font-medium text-orange-800 mb-2">Split Description</h3>
        <p className="text-sm text-orange-700">
          {getDescription()}
        </p>
      </div>
    </div>
  );
};

export default WorkoutSplitSelector;