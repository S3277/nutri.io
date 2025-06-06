import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
  route: any;
}

export default function WelcomeScreen({ navigation, route }: WelcomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate elements on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  const handleSkip = () => {
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F97316" />
      
      {/* Background with gradient overlay */}
      <LinearGradient
        colors={['#F97316', '#EA580C', '#DC2626']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Skip Button */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Logo and App Name */}
          <Animated.View 
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <Ionicons name="nutrition" size={60} color="#F97316" />
              </View>
            </View>
            <Text style={styles.appName}>Nutri.io</Text>
            <Text style={styles.tagline}>Smart Nutrition Tracking</Text>
          </Animated.View>

          {/* Main Content */}
          <Animated.View 
            style={[
              styles.contentSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Transform Your{'\n'}
                <Text style={styles.heroTitleAccent}>Health Journey</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                AI-powered nutrition tracking that makes healthy eating effortless and enjoyable
              </Text>
            </View>

            {/* Features Preview */}
            <View style={styles.featuresContainer}>
              <Animated.View 
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="camera" size={24} color="#F97316" />
                </View>
                <Text style={styles.featureText}>Snap & Track</Text>
                <Text style={styles.featureSubtext}>AI food recognition</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="analytics" size={24} color="#F97316" />
                </View>
                <Text style={styles.featureText}>Smart Analytics</Text>
                <Text style={styles.featureSubtext}>Progress insights</Text>
              </Animated.View>

              <Animated.View 
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                  }
                ]}
              >
                <View style={styles.featureIconContainer}>
                  <Ionicons name="fitness" size={24} color="#F97316" />
                </View>
                <Text style={styles.featureText}>AI Trainer</Text>
                <Text style={styles.featureSubtext}>Personal coaching</Text>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            style={[
              styles.actionSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F8F8']}
                style={styles.buttonGradient}
              >
                <Text style={styles.getStartedButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#F97316" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Social Proof */}
            <View style={styles.socialProof}>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>10K+</Text>
                  <Text style={styles.statLabel}>Users</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>4.8★</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1M+</Text>
                  <Text style={styles.statLabel}>Meals Tracked</Text>
                </View>
              </View>
            </View>

            <Text style={styles.bottomText}>
              Join thousands of users transforming their health
            </Text>
          </Animated.View>

          {/* Floating Elements */}
          <View style={styles.floatingElements}>
            <Animated.View 
              style={[
                styles.floatingCircle, 
                styles.circle1,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.floatingCircle, 
                styles.circle2,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.floatingCircle, 
                styles.circle3,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]} 
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 10,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleAccent: {
    color: '#FFF3CD',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 8,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  actionSection: {
    paddingBottom: 40,
  },
  getStartedButton: {
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F97316',
    marginRight: 8,
  },
  socialProof: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
  },
  circle1: {
    width: 80,
    height: 80,
    top: '20%',
    right: -40,
  },
  circle2: {
    width: 60,
    height: 60,
    top: '50%',
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: '25%',
    right: -50,
  },
});