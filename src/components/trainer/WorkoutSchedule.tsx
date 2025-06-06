import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { Calendar, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import Button from '../ui/Button';
import WorkoutSplitSelector from './WorkoutSplitSelector';

interface WorkoutScheduleProps {
  userId: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
  }>;
  frequency: number;
}

interface ScheduleEntry {
  id: string;
  exercise_name: string;
  sets: number;
  reps: string;
  day_of_week: number;
  week_number: number;
}

const WorkoutSchedule: React.FC<WorkoutScheduleProps> = ({ userId, exercises, frequency }) => {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSplit] = useState('push-pull-legs');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const workoutColors = {
    'Push': {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-600',
      card: 'bg-white border-blue-100',
      icon: 'text-blue-500'
    },
    'Pull': {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-600',
      card: 'bg-white border-purple-100',
      icon: 'text-purple-500'
    },
    'Legs': {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-600',
      card: 'bg-white border-emerald-100',
      icon: 'text-emerald-500'
    },
    'Full Body': {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-600',
      card: 'bg-white border-orange-100',
      icon: 'text-orange-500'
    },
    'default': {
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      text: 'text-gray-600',
      card: 'bg-white border-gray-100',
      icon: 'text-gray-500'
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [userId, selectedWeek]);

  const fetchSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_schedule')
        .select('*')
        .eq('user_id', userId)
        .eq('week_number', selectedWeek)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWorkoutDays = (): number[] => {
    if (frequency <= 2) {
      // For 1-2 days, do full body workouts
      return frequency === 1 ? [1] : [1, 4];
    }
    
    // For 3+ days, use PPL split
    switch (frequency) {
      case 3:
        return [1, 3, 5]; // Mon/Wed/Fri
      case 4:
        return [1, 2, 4, 5]; // Mon/Tue/Thu/Fri
      case 5:
        return [1, 2, 3, 5, 6]; // Mon/Tue/Wed/Fri/Sat
      default:
        return [1, 2, 3, 4, 5, 6]; // Mon through Sat
    }
  };

  const getWorkoutType = (dayIndex: number): string => {
    if (frequency <= 2) {
      return 'Full Body';
    }
    
    // For PPL split, rotate through Push/Pull/Legs
    return ['Push', 'Pull', 'Legs'][dayIndex % 3];
  };

  const getRandomExercises = (exercises: Array<{ name: string, sets: number, reps: string }>, count: number) => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getFullBodyExercises = () => {
    const exercises = [
      // Push exercises
      { name: 'Bench Press', sets: 3, reps: '8-12' },
      { name: 'Incline Bench Press', sets: 3, reps: '8-12' },
      { name: 'Dumbbell Press', sets: 3, reps: '8-12' },
      { name: 'Military Press', sets: 3, reps: '8-12' },
      { name: 'Machine Chest Press', sets: 3, reps: '10-15' },
      // Pull exercises
      { name: 'Barbell Rows', sets: 3, reps: '8-12' },
      { name: 'Pull-ups', sets: 3, reps: '8-12' },
      { name: 'Lat Pulldowns', sets: 3, reps: '8-12' },
      { name: 'Cable Rows', sets: 3, reps: '8-12' },
      { name: 'Dumbbell Rows', sets: 3, reps: '12-15' },
      // Leg exercises
      { name: 'Squats', sets: 3, reps: '8-12' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '8-12' },
      { name: 'Leg Press', sets: 3, reps: '8-12' },
      { name: 'Walking Lunges', sets: 3, reps: '10-12' },
      { name: 'Calf Raises', sets: 3, reps: '15-20' },
    ];
    
    return getRandomExercises(exercises, 9);
  };

  const getPushExercises = () => {
    const exercises = [
      // Chest
      { name: 'Bench Press', sets: 4, reps: '6-8' },
      { name: 'Incline DB Press', sets: 3, reps: '8-12' },
      { name: 'Decline Press', sets: 3, reps: '8-12' },
      { name: 'Cable Flyes', sets: 3, reps: '12-15' },
      { name: 'Machine Chest Press', sets: 3, reps: '12-15' },
      // Shoulders
      { name: 'Military Press', sets: 4, reps: '6-8' },
      { name: 'Arnold Press', sets: 3, reps: '8-12' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15' },
      { name: 'Front Raises', sets: 3, reps: '12-15' },
      { name: 'Machine Shoulder Press', sets: 3, reps: '10-12' },
      // Triceps
      { name: 'Tricep Pushdowns', sets: 3, reps: '10-12' },
      { name: 'Skull Crushers', sets: 3, reps: '10-12' },
      { name: 'Overhead Extensions', sets: 3, reps: '12-15' },
      { name: 'Close Grip Bench Press', sets: 3, reps: '8-12' },
      { name: 'Tricep Dips', sets: 3, reps: '10-12' },
    ];
    
    return getRandomExercises(exercises, 6);
  };

  const getPullExercises = () => {
    const exercises = [
      // Back
      { name: 'Barbell Rows', sets: 4, reps: '6-8' },
      { name: 'Pull-ups', sets: 3, reps: '8-12' },
      { name: 'Lat Pulldowns', sets: 3, reps: '8-12' },
      { name: 'T-Bar Rows', sets: 3, reps: '8-12' },
      { name: 'Meadows Rows', sets: 3, reps: '8-12' },
      { name: 'Cable Face Pulls', sets: 3, reps: '12-15' },
      { name: 'Cable Pulldowns', sets: 3, reps: '12-15' },
      // Biceps
      { name: 'Barbell Curls', sets: 3, reps: '10-12' },
      { name: 'Incline DB Curls', sets: 3, reps: '10-12' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15' },
      { name: 'Preacher Curls', sets: 3, reps: '10-12' },
      { name: 'Concentration Curls', sets: 3, reps: '12-15' },
      { name: 'Cable Curls', sets: 3, reps: '12-15' },
      // Rear Delts
      { name: 'Reverse Flyes', sets: 3, reps: '12-15' },
      { name: 'Machine Rear Delt Flyes', sets: 3, reps: '15-20' },
    ];
    
    return getRandomExercises(exercises, 6);
  };

  const getLegExercises = () => {
    const exercises = [
      // Quads
      { name: 'Squats', sets: 4, reps: '6-8' },
      { name: 'Front Squats', sets: 3, reps: '8-12' },
      { name: 'Leg Press', sets: 3, reps: '8-12' },
      { name: 'Hack Squats', sets: 3, reps: '8-12' },
      { name: 'Bulgarian Split Squats', sets: 3, reps: '10-12' },
      { name: 'Walking Lunges', sets: 3, reps: '12-15' },
      { name: 'Leg Extensions', sets: 3, reps: '12-15' },
      // Hamstrings
      { name: 'Romanian Deadlifts', sets: 4, reps: '6-8' },
      { name: 'Good Mornings', sets: 3, reps: '8-12' },
      { name: 'Leg Curls', sets: 3, reps: '12-15' },
      { name: 'Glute-Ham Raises', sets: 3, reps: '8-12' },
      // Calves
      { name: 'Standing Calf Raises', sets: 4, reps: '12-15' },
      { name: 'Seated Calf Raises', sets: 3, reps: '15-20' },
      { name: 'Smith Machine Calf Raises', sets: 3, reps: '15-20' },
      { name: 'Leg Press Calf Raises', sets: 3, reps: '15-20' },
    ];
    
    return getRandomExercises(exercises, 6);
  };

  const getExercisesForWorkoutType = (type: string) => {
    switch (type) {
      case 'Full Body':
        return getFullBodyExercises();
      case 'Push':
        return getPushExercises();
      case 'Pull':
        return getPullExercises();
      case 'Legs':
        return getLegExercises();
      default:
        return [];
    }
  };

  const generateSchedule = async () => {
    try {
      setIsLoading(true);

      // Clear existing schedule for the selected week
      await supabase
        .from('workout_schedule')
        .delete()
        .eq('user_id', userId)
        .eq('week_number', selectedWeek);

      const workoutDays = getWorkoutDays();
      const scheduleEntries = [];

      for (const day of workoutDays) {
        const workoutType = getWorkoutType(workoutDays.indexOf(day));
        const exercises = getExercisesForWorkoutType(workoutType);

        const entries = exercises.map((exercise) => ({
          user_id: userId,
          exercise_name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          day_of_week: day,
          week_number: selectedWeek,
        }));
        
        scheduleEntries.push(...entries);
      }

      const { error } = await supabase
        .from('workout_schedule')
        .insert(scheduleEntries);

      if (error) throw error;

      await fetchSchedule();
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setSelectedWeek((prev) => Math.max(1, prev - 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => Math.min(4, prev + 1));
  };

  const renderDayCell = (dayIndex: number) => {
    const dayExercises = schedule.filter((entry) => entry.day_of_week === dayIndex);
    const hasWorkout = dayExercises.length > 0;
    const workoutDays = getWorkoutDays();
    const workoutType = hasWorkout ? getWorkoutType(workoutDays.indexOf(dayIndex)) : null;
    
    const colors = workoutType ? (workoutColors[workoutType as keyof typeof workoutColors] || workoutColors.default) : workoutColors.default;

    return (
      <div 
        className={`h-[180px] p-3 border rounded-lg overflow-y-auto transition-colors duration-200 ${
          hasWorkout ? `${colors.bg} ${colors.border}` : 'bg-gray-50 border-gray-100'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium ${hasWorkout ? colors.text : 'text-gray-500'}`}>
            {daysOfWeek[dayIndex]}
          </span>
          {hasWorkout && (
            <div className="flex items-center">
              <span className={`text-xs ${colors.text} mr-1`}>{workoutType}</span>
              <Dumbbell className={`w-4 h-4 ${colors.icon}`} />
            </div>
          )}
        </div>
        
        {hasWorkout ? (
          <div className="space-y-2">
            {dayExercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`${colors.card} rounded-md p-2 shadow-sm border transition-all duration-200 hover:shadow-md`}
              >
                <p className="font-medium text-gray-900 text-xs">{exercise.exercise_name}</p>
                <p className={`${colors.text} text-xs mt-0.5`}>
                  {exercise.sets} × {exercise.reps}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs">Rest Day</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 text-orange-500 mr-2" />
            Monthly Workout Plan
          </h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousWeek}
              disabled={selectedWeek === 1}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className="text-base font-medium">Week {selectedWeek}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              disabled={selectedWeek === 4}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {schedule.length === 0 ? (
          <div className="text-center py-8">
            <WorkoutSplitSelector
              activityLevel={frequency}
              selectedSplit={selectedSplit}
              onSplitSelect={() => {}}
            />
            <Button onClick={generateSchedule}>Generate Schedule</Button>
          </div>
        ) : (
          <>
            <WorkoutSplitSelector
              activityLevel={frequency}
              selectedSplit={selectedSplit}
              onSplitSelect={() => {}}
            />
            <div className="grid grid-cols-7 gap-3">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 mb-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="relative">
                  {renderDayCell(index)}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={generateSchedule}
              >
                Regenerate Schedule
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutSchedule;