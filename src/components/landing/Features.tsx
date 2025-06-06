import React from 'react';
import { Camera, BarChart3, Award, Sparkles, Brain, Dumbbell, Scale, Clock, Target } from 'lucide-react';

const features = [
  {
    icon: <Camera className="w-8 h-8 text-emerald-500" />,
    title: 'AI Image Recognition',
    description: 'Simply snap a photo of your meal and our advanced AI will analyze and provide accurate nutritional information in seconds.',
    highlight: 'Instant Analysis',
  },
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: 'Smart Recommendations',
    description: 'Get personalized meal suggestions and nutrition tips based on your goals, preferences, and eating patterns.',
    highlight: 'AI-Powered',
  },
  {
    icon: <Scale className="w-8 h-8 text-purple-500" />,
    title: 'Macro Tracking',
    description: 'Track your protein, carbs, and fats with precision. Visual breakdowns help you maintain the perfect balance.',
    highlight: 'Precision Tracking',
  },
  {
    icon: <Dumbbell className="w-8 h-8 text-orange-500" />,
    title: 'Workout Integration',
    description: 'Sync your nutrition with your workouts. Get exercise-specific meal plans and timing recommendations.',
    highlight: 'Fitness Sync',
  },
  {
    icon: <Target className="w-8 h-8 text-red-500" />,
    title: 'Goal Setting',
    description: 'Set and track personalized goals. Whether it\'s weight loss, muscle gain, or maintenance, we\'ve got you covered.',
    highlight: 'Custom Goals',
  },
  {
    icon: <Clock className="w-8 h-8 text-teal-500" />,
    title: 'Meal Timing',
    description: 'Optimize your meal timing with smart reminders and scheduling. Perfect for intermittent fasting or meal planning.',
    highlight: 'Smart Scheduling',
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
    title: 'Progress Analytics',
    description: 'Visualize your journey with detailed charts and insights. Track trends and celebrate your achievements.',
    highlight: 'Visual Insights',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    title: 'Recipe Analysis',
    description: 'Upload your favorite recipes and get instant nutritional breakdowns. Save and share your healthy creations.',
    highlight: 'Recipe Magic',
  },
];

const Features: React.FC = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-white via-orange-50/50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 w-16 h-16 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-6">
                    {feature.icon}
                  </div>
                </div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium mb-3">
                  {feature.highlight}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <h3 className="text-3xl font-bold text-white mb-6 relative z-10">Ready to Transform Your Nutrition?</h3>
          <p className="text-xl mb-8 text-white/90 relative z-10 max-w-2xl mx-auto">
            Join thousands of users who have already improved their health with our AI-powered platform.
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 relative z-10">
            Get Started Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;