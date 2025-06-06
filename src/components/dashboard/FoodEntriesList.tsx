import React from 'react';
import { FoodEntry } from '../../types';
import { Trash2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FoodEntriesListProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const FoodEntriesList: React.FC<FoodEntriesListProps> = ({ entries, onDeleteEntry }) => {
  const groupedEntries = entries.reduce((groups, entry) => {
    if (!groups[entry.meal_type]) {
      groups[entry.meal_type] = [];
    }
    groups[entry.meal_type].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);
  
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const mealTotals = mealTypes.map(mealType => {
    const mealEntries = groupedEntries[mealType] || [];
    return {
      calories: mealEntries.reduce((sum, entry) => sum + entry.calories, 0),
      protein: mealEntries.reduce((sum, entry) => sum + entry.protein, 0),
      carbs: mealEntries.reduce((sum, entry) => sum + entry.carbs, 0),
      fat: mealEntries.reduce((sum, entry) => sum + entry.fat, 0),
    };
  });

  const chartData = {
    labels: mealTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
    datasets: [
      {
        label: 'Calories',
        data: mealTotals.map(total => total.calories),
        backgroundColor: 'rgba(255, 87, 34, 0.8)', // primary-600
        borderRadius: 8,
      },
      {
        label: 'Protein (g)',
        data: mealTotals.map(total => total.protein),
        backgroundColor: 'rgba(66, 165, 245, 0.8)', // blue-400
        borderRadius: 8,
      },
      {
        label: 'Carbs (g)',
        data: mealTotals.map(total => total.carbs),
        backgroundColor: 'rgba(255, 167, 38, 0.8)', // orange-400
        borderRadius: 8,
      },
      {
        label: 'Fat (g)',
        data: mealTotals.map(total => total.fat),
        backgroundColor: 'rgba(76, 175, 80, 0.8)', // green-400
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#4B5563', // gray-600
          font: {
            family: 'Poppins',
          },
        },
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        titleFont: {
          size: 14,
          weight: 'bold',
          family: 'Poppins',
        },
        bodyFont: {
          size: 13,
          family: 'Poppins',
        },
        borderColor: 'rgba(229, 231, 235, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const label = context.dataset.label;
            return `${label}: ${value.toFixed(1)}${label === 'Calories' ? ' kcal' : 'g'}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#4B5563',
          font: {
            family: 'Poppins',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 0.8)',
        },
        ticks: {
          callback: (value: number) => `${value}`,
          color: '#4B5563',
          font: {
            family: 'Poppins',
          },
        },
      },
    },
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Today's Food Log</h2>
      
      {entries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-600">No food entries yet for today</p>
          <p className="text-sm text-gray-500 mt-1">
            Take a photo of your meal to track calories
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="h-80 bg-white p-6 rounded-xl border border-gray-100">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="space-y-6">
            {mealTypes.map((mealType) => {
              const mealEntries = groupedEntries[mealType] || [];
              if (mealEntries.length === 0) return null;
              
              return (
                <div key={mealType} className="border-b border-gray-100 pb-6 last:border-0">
                  <h3 className="font-medium text-gray-900 capitalize mb-4">{mealType}</h3>
                  
                  <div className="space-y-3">
                    {mealEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white rounded-xl p-4 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200 group animate-float"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{entry.name}</p>
                            <div className="flex space-x-3 text-sm text-gray-500 mt-1">
                              <span className="text-primary-600 font-medium">{entry.calories} kcal</span>
                              <span className="text-gray-300">•</span>
                              <span>P: {entry.protein}g</span>
                              <span>C: {entry.carbs}g</span>
                              <span>F: {entry.fat}g</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            className="text-gray-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            aria-label="Delete entry"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodEntriesList;