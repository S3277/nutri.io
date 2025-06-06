import React, { useState, useEffect } from 'react';
import { UserProfile, BodyAnalysis } from '../types';
import BodyAnalysisForm from '../components/trainer/BodyAnalysisForm';
import AnalysisResults from '../components/trainer/AnalysisResults';
import { analyzeBodyWithOpenAI } from '../services/bodyAnalysisTrainer';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface TrainerPageProps {
  profile: UserProfile;
  onBack: () => void;
}

const TrainerPage: React.FC<TrainerPageProps> = ({ profile, onBack }) => {
  const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const { data, error } = await supabase
          .from('body_analysis')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setAnalysis({
            bodyComposition: data.body_composition,
            recommendations: data.recommendations,
            areas: data.areas,
          });
        } else {
          setAnalysis(null);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError('Failed to fetch analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, [profile.id]);

  const handleAnalyze = async (
    imageData: string,
    userData: {
      height: number;
      weight: number;
      age: number;
      gender: string;
      activityLevel: number;
      goal: string;
    }
  ) => {
    setIsAnalyzing(true);
    setError(null);
    setShowUpgradeModal(false);
    
    try {
      // Check if user is on free plan and has already used their analysis
      if (profile.membership_type === 'free' && 
          !profile.email?.endsWith('@nutri.io') && 
          profile.analysis_count >= 1) {
        setShowUpgradeModal(true);
        return;
      }

      const result = await analyzeBodyWithOpenAI(imageData, userData);
      
      const { data, error: saveError } = await supabase
        .from('body_analysis')
        .insert({
          user_id: profile.id,
          body_composition: result.bodyComposition,
          recommendations: result.recommendations,
          areas: result.areas,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Only increment analysis count for free users who aren't developers
      if (profile.membership_type === 'free' && !profile.email?.endsWith('@nutri.io')) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ analysis_count: (profile.analysis_count || 0) + 1 })
          .eq('id', profile.id);

        if (updateError) throw updateError;
      }
      
      setAnalysis(result);
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze body composition. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartNew = () => {
    setAnalysis(null);
    setError(null);
    setShowUpgradeModal(false);
  };

  const handleUpgrade = () => {
    navigate('/billing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_linear)"/>
                  <path d="M27 15C27 19.9706 22.9706 24 18 24C13.0294 24 9 19.9706 9 15C9 10.0294 13.0294 6 18 6C22.9706 6 27 10.0294 27 15Z" fill="white"/>
                  <path d="M22.5 15C22.5 17.4853 20.4853 19.5 18 19.5C15.5147 19.5 13.5 17.4853 13.5 15C13.5 12.5147 15.5147 10.5 18 10.5C20.4853 10.5 22.5 12.5147 22.5 15Z" fill="url(#paint1_linear)"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="13.5" y1="10.5" x2="22.5" y2="19.5" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F97316"/>
                      <stop offset="1" stopColor="#EA580C"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Nutri.io
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md mx-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Pro</h3>
                <p className="text-gray-600 mb-6">
                  You've reached the maximum number of body analyses available on the free plan. 
                  Upgrade to Pro for unlimited analyses and personalized recommendations!
                </p>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpgrade}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Analyzing your body composition...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={handleStartNew}>
                  New Analysis
                </Button>
              </div>
              <AnalysisResults analysis={analysis} userId={profile.id} />
            </div>
          ) : (
            <BodyAnalysisForm profile={profile} onAnalyze={handleAnalyze} />
          )}

          {error && !showUpgradeModal && (
            <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainerPage;