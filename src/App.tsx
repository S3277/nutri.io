import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TrainerPage from './pages/TrainerPage';
import WorkoutAgendaPage from './pages/WorkoutAgendaPage';
import FAQPage from './pages/FAQPage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AboutPage from './pages/AboutPage';
import BillingPage from './pages/BillingPage';
import { AuthFormData, ProfileFormData, UserProfile } from './types';
import './index.css';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          if (error) {
            console.error('Profile fetch error:', error);
            setUser(null);
          } else if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleSignup = async (userData: AuthFormData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (error) throw error;

      // Create initial profile with name
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
          });
        
        if (profileError) throw profileError;
      }

      navigate('/profile-setup');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleLogin = async (userData: AuthFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });
      if (error) throw error;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setUser(null);
        navigate('/profile-setup');
      } else if (profile) {
        setUser(profile);
        navigate('/dashboard');
      } else {
        setUser(null);
        navigate('/profile-setup');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleProfileSetup = async (profileData: ProfileFormData, calculatedCalories: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No active session');
      }
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          height: profileData.height,
          weight: profileData.weight,
          age: profileData.age,
          gender: profileData.gender,
          weekly_activity: profileData.weekly_activity,
          goal: profileData.goal,
          weight_change: profileData.weight_change,
          target_calories: calculatedCalories,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      setUser(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile setup error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/login" element={<AuthPage onLogin={handleLogin} onSignup={handleSignup} onBackToLanding={() => navigate('/')} />} />
      <Route path="/signup" element={<AuthPage onLogin={handleLogin} onSignup={handleSignup} onBackToLanding={() => navigate('/')} />} />
      <Route path="/profile-setup" element={<ProfileSetupPage onSubmit={handleProfileSetup} />} />
      <Route path="/dashboard" element={user ? <DashboardPage profile={user} onLogout={handleLogout} onViewProfile={() => navigate('/profile')} onViewTrainer={() => navigate('/trainer')} /> : <LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/profile" element={user ? <ProfilePage profile={user} onBack={() => navigate('/dashboard')} /> : <LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/trainer" element={user ? <TrainerPage profile={user} onBack={() => navigate('/dashboard')} /> : <LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/workout-agenda" element={user ? <WorkoutAgendaPage /> : <LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/billing" element={user ? <BillingPage /> : <LandingPage onGetStarted={() => navigate('/login')} />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;