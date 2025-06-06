import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';
import { UserProfile, FoodEntry } from '../types';

interface DashboardScreenProps {
  navigation?: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch today's food entries
      const today = new Date().toISOString().split('T')[0];
      const { data: entriesData } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: true });

      setFoodEntries(entriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
          },
        },
      ]
    );
  };

  const navigateToWorkout = () => {
    if (navigation) {
      navigation.navigate('Workout');
    }
  };

  const navigateToTrainer = () => {
    if (navigation) {
      navigation.navigate('Trainer');
    }
  };

  const navigateToProfile = () => {
    if (navigation) {
      navigation.navigate('Profile');
    }
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const targetCalories = profile?.target_calories || 2000;
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);

  // Calculate macros
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Navigation Buttons */}
        <LinearGradient
          colors={['#F97316', '#EA580C']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
              </Text>
              <Text style={styles.userName}>
                {profile?.name || profile?.email?.split('@')[0] || 'User'} 🌟
              </Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity style={styles.navButton} onPress={navigateToWorkout}>
              <Ionicons name="barbell-outline" size={20} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Workout Log</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={navigateToTrainer}>
              <Ionicons name="fitness-outline" size={20} color="#FFFFFF" />
              <Text style={styles.navButtonText}>AI Trainer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={navigateToProfile}>
              <Ionicons name="person-outline" size={20} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Calorie Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Daily Progress 🎯</Text>
          <View style={styles.progressContent}>
            <View style={styles.progressText}>
              <Text style={styles.caloriesConsumed}>{totalCalories}</Text>
              <Text style={styles.caloriesTarget}>of {targetCalories} kcal</Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>{Math.round(calorieProgress)}%</Text>
            </View>
          </View>
        </View>

        {/* Macros Summary */}
        <View style={styles.macrosCard}>
          <Text style={styles.cardTitle}>Today's Macros</Text>
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protein 🥩</Text>
              <Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs 🍚</Text>
              <Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fat 🥑</Text>
              <Text style={styles.macroValue}>{Math.round(totalFat)}g</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="camera" size={24} color="#F97316" />
              <Text style={styles.actionText}>Scan Food</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={24} color="#F97316" />
              <Text style={styles.actionText}>Add Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={navigateToWorkout}>
              <Ionicons name="barbell" size={24} color="#F97316" />
              <Text style={styles.actionText}>Log Workout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="analytics" size={24} color="#F97316" />
              <Text style={styles.actionText}>View Stats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Meals */}
        <View style={styles.mealsCard}>
          <Text style={styles.cardTitle}>Today's Meals</Text>
          {foodEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="restaurant-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No meals logged today</Text>
              <Text style={styles.emptySubtext}>Start tracking your nutrition! 📱</Text>
            </View>
          ) : (
            <View style={styles.mealsList}>
              {foodEntries.slice(0, 3).map((entry) => (
                <View key={entry.id} style={styles.mealItem}>
                  <View style={styles.mealContent}>
                    <Text style={styles.mealName}>{entry.name}</Text>
                    <Text style={styles.mealCalories}>{entry.calories} kcal</Text>
                    <Text style={styles.mealMacros}>
                      P: {Math.round(entry.protein)}g • C: {Math.round(entry.carbs)}g • F: {Math.round(entry.fat)}g
                    </Text>
                  </View>
                  <Text style={styles.mealType}>{entry.meal_type}</Text>
                </View>
              ))}
              {foodEntries.length > 3 && (
                <Text style={styles.moreText}>+{foodEntries.length - 3} more meals</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    marginBottom: 20,
  },
  greetingSection: {
    alignItems: 'center',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.9,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: -10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    flex: 1,
  },
  caloriesConsumed: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
  },
  caloriesTarget: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  macrosCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mealsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  mealsList: {
    gap: 12,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 12,
  },
  mealContent: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mealCalories: {
    fontSize: 14,
    color: '#F97316',
    marginTop: 4,
    fontWeight: '600',
  },
  mealMacros: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealType: {
    fontSize: 12,
    color: '#F97316',
    textTransform: 'capitalize',
    fontWeight: '600',
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  moreText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});