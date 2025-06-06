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
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Level and XP Progress */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Level {level}</h2>
                <p className="text-gray-600">{getLevelTitle(level)}</p>
              </div>
              <div className="text-right">
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Strength Level</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl mb-2">{strengthLevel.emoji}</p>
                <p className="text-lg font-medium text-gray-900">{strengthLevel.name}</p>
                <p className="text-sm text-gray-600">{strengthLevel.description}</p>
              </div>
              <div className="text-right">
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Workout Log</h2>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleDateChange('prev')}
                  leftIcon={<ChevronLeft size={18} />}
                >
                  Previous
                </Button>
                <span className="text-gray-600 font-medium">
                  {new Date(selectedDate).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handleDateChange('next')}
                  rightIcon={<ChevronRight size={18} />}
                >
                  Next
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No workouts logged for this day</p>
                <Button
                  onClick={() => {/* Add new workout entry */}}
                  className="mt-4"
                  leftIcon={<Plus size={18} />}
                >
                  Add Workout
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
                      <div>
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
                        onClick={() => {/* Delete entry */}}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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