import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2, Dumbbell, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Timer, Route } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { supabase } from '../services/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WorkoutEntry {
  id: string;
  exercise_name: string;
  sets: {
    weight: number;
    reps: number;
  }[] | {
    distance: number;
    time: number;
  }[];
  type: 'strength' | 'cardio';
  date: string;
}

interface SavedWorkout {
  id: string;
  user_level: number;
  total_xp: number;
}

// XP and Level System
const XP_PER_KG = 5;
const LEVEL_MULTIPLIER = 2.0;
const MAX_LEVEL = 50;

// Strength levels (in kg total volume)
const STRENGTH_LEVELS = [
  { name: 'Beginner', strength: 1000, emoji: '🏋️', description: 'Starting your strength journey' },
  { name: 'Novice', strength: 2500, emoji: '💪', description: 'Building foundational strength' },
  { name: 'Intermediate', strength: 5000, emoji: '🦾', description: 'Developing serious power' },
  { name: 'Advanced', strength: 10000, emoji: '⚡', description: 'Impressive strength gains' },
  { name: 'Elite', strength: 15000, emoji: '🔥', description: 'Elite power output' },
  { name: 'Master', strength: 20000, emoji: '👑', description: 'Mastery of strength' }
];

const calculateRequiredXP = (level: number) => {
  return Math.floor(1000 * Math.pow(LEVEL_MULTIPLIER, level - 1));
};

const calculateLevel = (totalXP: number) => {
  let level = 1;
  while (totalXP >= calculateRequiredXP(level + 1) && level < MAX_LEVEL) {
    level++;
  }
  return level;
};

const getLevelTitle = (level: number) => {
  if (level <= 5) return 'Novice Lifter';
  if (level <= 10) return 'Intermediate Athlete';
  if (level <= 15) return 'Advanced Powerhouse';
  if (level <= 20) return 'Elite Strongman';
  if (level <= 25) return 'Master of Iron';
  if (level <= 30) return 'Strength Legend';
  if (level <= 35) return 'Power Virtuoso';
  if (level <= 40) return 'Strength Sage';
  if (level <= 45) return 'Ultimate Powerlifter';
  return 'Strength Immortal';
};

const WorkoutAgendaPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    type: 'strength' as 'strength' | 'cardio',
    sets: [{ weight: 0, reps: 0 }]
  });

  useEffect(() => {
    fetchWorkouts();
  }, [selectedDate]);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_entries')
        .select('*')
        .eq('date', selectedDate)
        .order('created_at', { ascending: true });

      if (workoutError) throw workoutError;
      setEntries(workoutData || []);

      const { data: savedData, error: savedError } = await supabase
        .from('saved_workouts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (savedError) throw savedError;
      setSavedWorkouts(savedData || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Calculate total weight for current workout
    const total = entries.reduce((sum, entry) => {
      if (entry.type === 'strength') {
        return sum + (entry.sets as { weight: number; reps: number }[]).reduce((setSum, set) => setSum + (set.weight * set.reps), 0);
      }
      return sum;
    }, 0);
    
    setTotalWeight(total);

    // Get the highest level and XP from saved workouts
    const highestSavedWorkout = savedWorkouts[0];
    const savedLevel = highestSavedWorkout?.user_level || 1;
    const savedXP = highestSavedWorkout?.total_xp || 0;

    if (entries.length > 0) {
      // Only calculate new XP if there are entries for today
      const workoutXP = Math.floor(total * XP_PER_KG);
      const newTotalXP = savedXP + workoutXP;
      setTotalXP(newTotalXP);
      
      // Calculate new level but ensure it never decreases
      const newLevel = Math.max(calculateLevel(newTotalXP), savedLevel);
      setLevel(newLevel);
    } else {
      // If no entries for today, use the saved values
      setTotalXP(savedXP);
      setLevel(savedLevel);
    }
  }, [entries, savedWorkouts]);

  const handleDateChange = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleAddExercise = async () => {
    if (!newExercise.name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workout_entries')
        .insert({
          user_id: user.id,
          exercise_name: newExercise.name,
          sets: newExercise.sets,
          type: newExercise.type,
          date: selectedDate,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries([...entries, data]);
      setNewExercise({
        name: '',
        type: 'strength',
        sets: [{ weight: 0, reps: 0 }]
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Failed to add exercise. Please try again.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workout_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const addSet = () => {
    setNewExercise({
      ...newExercise,
      sets: [...newExercise.sets, { weight: 0, reps: 0 }]
    });
  };

  const updateSet = (index: number, field: 'weight' | 'reps', value: number) => {
    const updatedSets = [...newExercise.sets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setNewExercise({ ...newExercise, sets: updatedSets });
  };

  const removeSet = (index: number) => {
    if (newExercise.sets.length > 1) {
      const updatedSets = newExercise.sets.filter((_, i) => i !== index);
      setNewExercise({ ...newExercise, sets: updatedSets });
    }
  };

  const getStrengthLevel = () => {
    let level = STRENGTH_LEVELS[0];
    for (const strengthLevel of STRENGTH_LEVELS) {
      if (totalWeight <= strengthLevel.strength) {
        level = strengthLevel;
        break;
      }
    }
    return level;
  };

  const strengthLevel = getStrengthLevel();
  const nextLevel = level + 1;
  const currentLevelXP = calculateRequiredXP(level);
  const nextLevelXP = calculateRequiredXP(nextLevel);
  const xpProgress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-xl font-bold text-gray-900">Workout Log</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Level and XP Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Level {level}</h2>
                <p className="text-gray-600">{getLevelTitle(level)}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500">Total XP</p>
                <p className="text-xl font-bold text-orange-600">{totalXP.toLocaleString()}</p>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-orange-200 text-orange-600">
                    Progress to Level {nextLevel}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-orange-600">
                    {Math.round(xpProgress)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                <div
                  style={{ width: `${xpProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Strength Level */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Strength Level</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div>
                <p className="text-4xl mb-2">{strengthLevel.emoji}</p>
                <p className="text-lg font-medium text-gray-900">{strengthLevel.name}</p>
                <p className="text-sm text-gray-600">{strengthLevel.description}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-gray-500">Total Volume</p>
                <p className="text-2xl font-bold text-orange-600">{totalWeight.toLocaleString()} kg</p>
                {totalWeight < strengthLevel.strength && (
                  <p className="text-sm text-gray-600">
                    {(strengthLevel.strength - totalWeight).toLocaleString()} kg to next level
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                  <div
                    style={{ width: `${Math.min((totalWeight / strengthLevel.strength) * 100, 100)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workout Log */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
              <h2 className="text-xl font-bold text-gray-900">Workout Log</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateChange('prev')}
                    leftIcon={<ChevronLeft size={16} />}
                    className="px-3 py-2"
                  >
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <span className="text-gray-600 font-medium text-sm px-2">
                    {new Date(selectedDate).toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDateChange('next')}
                    rightIcon={<ChevronRight size={16} />}
                    className="px-3 py-2"
                  >
                    <span className="hidden sm:inline">Next</span>
                  </Button>
                </div>
                <Button
                  onClick={() => setShowAddForm(true)}
                  leftIcon={<Plus size={16} />}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Add Exercise
                </Button>
              </div>
            </div>

            {/* Add Exercise Form */}
            {showAddForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Exercise</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Exercise Name"
                      value={newExercise.name}
                      onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      placeholder="e.g., Bench Press"
                    />
                    <Select
                      label="Type"
                      value={newExercise.type}
                      onChange={(value) => setNewExercise({ ...newExercise, type: value as 'strength' | 'cardio' })}
                      options={[
                        { value: 'strength', label: 'Strength Training' },
                        { value: 'cardio', label: 'Cardio' }
                      ]}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">Sets</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSet}
                        leftIcon={<Plus size={14} />}
                      >
                        Add Set
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {newExercise.sets.map((set, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 w-12">Set {index + 1}:</span>
                          <Input
                            type="number"
                            placeholder="Weight (kg)"
                            value={set.weight || ''}
                            onChange={(e) => updateSet(index, 'weight', Number(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-gray-400">×</span>
                          <Input
                            type="number"
                            placeholder="Reps"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(index, 'reps', Number(e.target.value))}
                            className="flex-1"
                          />
                          {newExercise.sets.length > 1 && (
                            <button
                              onClick={() => removeSet(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddExercise}
                      leftIcon={<Save size={16} />}
                    >
                      Save Exercise
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No workouts logged for this day</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4"
                  leftIcon={<Plus size={18} />}
                >
                  Add Your First Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{entry.exercise_name}</h3>
                        <div className="mt-1 space-y-1">
                          {entry.type === 'strength' ? (
                            (entry.sets as { weight: number; reps: number }[]).map((set, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                Set {index + 1}: {set.weight} kg × {set.reps} reps
                              </p>
                            ))
                          ) : (
                            (entry.sets as { distance: number; time: number }[]).map((set, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                Set {index + 1}: {set.distance} km in {set.time} minutes
                              </p>
                            ))
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutAgendaPage;