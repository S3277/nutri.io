import React from 'react';
import { Camera, Plus, BarChart3, Target, TrendingUp, Calendar } from 'lucide-react';

interface QuickActionsPanelProps {
  onScanFood: () => void;
  onAddManualEntry: () => void;
  onViewAnalytics: () => void;
  onViewMealPlan: () => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onScanFood,
  onAddManualEntry,
  onViewAnalytics,
}) => {
  const quickActions = [
    {
      id: 'scan',
      title: 'Scan Food',
      description: 'Use AI to identify food',
      icon: <Camera size={24} />,
      color: 'emerald',
      onClick: onScanFood,
    },
    {
      id: 'manual',
      title: 'Add Manually',
      description: 'Enter food details',
      icon: <Plus size={24} />,
      color: 'blue',
      onClick: onAddManualEntry,
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Progress insights',
      icon: <BarChart3 size={24} />,
      color: 'purple',
      onClick: onViewAnalytics,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200 hover:border-emerald-300',
        icon: 'bg-emerald-500',
        text: 'text-emerald-700',
        desc: 'text-emerald-600',
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200 hover:border-blue-300',
        icon: 'bg-blue-500',
        text: 'text-blue-700',
        desc: 'text-blue-600',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200 hover:border-purple-300',
        icon: 'bg-purple-500',
        text: 'text-purple-700',
        desc: 'text-purple-600',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
  };

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Ready to track</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => {
          const colors = getColorClasses(action.color);
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`group p-6 rounded-xl border-2 ${colors.bg} ${colors.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 ${colors.icon} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h3 className={`font-semibold ${colors.text} mb-2`}>
                  {action.title}
                </h3>
                <p className={`text-sm ${colors.desc}`}>
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Target size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Goal</p>
              <p className="font-semibold text-gray-900">Stay on track</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly Trend</p>
              <p className="font-semibold text-gray-900">Improving</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="font-semibold text-gray-900">7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;