import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase, calculateDailyCalories } from '../services/supabase';
import { ProfileFormData } from '../types';

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    weekly_activity: 3,
    goal: 'maintain',
    weight_change: 0,
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.height || !formData.weight || !formData.age) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    }
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No active session');

      const calculatedCalories = calculateDailyCalories(formData);

      const { error } = await supabase
        .from('profiles')
        .update({
          height: formData.height,
          weight: formData.weight,
          age: formData.age,
          gender: formData.gender,
          weekly_activity: formData.weekly_activity,
          goal: formData.goal,
          weight_change: formData.weight_change,
          target_calories: calculatedCalories,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help us personalize your nutrition goals
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(currentStep / 2) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep} of 2
            </Text>
          </View>

          {currentStep === 1 ? (
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.height.toString()}
                  onChangeText={(text) =>
                    setFormData({ ...formData, height: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="170"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.weight.toString()}
                  onChangeText={(text) =>
                    setFormData({ ...formData, weight: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="70"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={formData.age.toString()}
                  onChangeText={(text) =>
                    setFormData({ ...formData, age: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  placeholder="30"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderContainer}>
                  {['male', 'female', 'other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderButton,
                        formData.gender === gender && styles.genderButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, gender: gender as any })
                      }
                    >
                      <Text
                        style={[
                          styles.genderText,
                          formData.gender === gender && styles.genderTextActive,
                        ]}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Fitness Goals</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Weekly Activity (days)</Text>
                <View style={styles.activityContainer}>
                  {[0, 2, 4, 6].map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.activityButton,
                        formData.weekly_activity === days && styles.activityButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, weekly_activity: days })
                      }
                    >
                      <Text
                        style={[
                          styles.activityText,
                          formData.weekly_activity === days && styles.activityTextActive,
                        ]}
                      >
                        {days === 0 ? 'Sedentary' : `${days}+ days`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Goal</Text>
                <View style={styles.goalContainer}>
                  {[
                    { key: 'lose', label: 'Lose Weight', icon: 'trending-down' },
                    { key: 'maintain', label: 'Maintain', icon: 'remove' },
                    { key: 'gain', label: 'Gain Weight', icon: 'trending-up' },
                  ].map((goal) => (
                    <TouchableOpacity
                      key={goal.key}
                      style={[
                        styles.goalButton,
                        formData.goal === goal.key && styles.goalButtonActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, goal: goal.key as any })
                      }
                    >
                      <Ionicons
                        name={goal.icon as any}
                        size={24}
                        color={
                          formData.goal === goal.key ? '#FFFFFF' : '#F97316'
                        }
                      />
                      <Text
                        style={[
                          styles.goalText,
                          formData.goal === goal.key && styles.goalTextActive,
                        ]}
                      >
                        {goal.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {currentStep === 1 ? (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setCurrentStep(1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginLeft: 10 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F97316',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  activityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  activityButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  activityText: {
    fontSize: 14,
    color: '#666',
  },
  activityTextActive: {
    color: '#FFFFFF',
  },
  goalContainer: {
    gap: 10,
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  goalButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  goalText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  goalTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  footerButtons: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
});