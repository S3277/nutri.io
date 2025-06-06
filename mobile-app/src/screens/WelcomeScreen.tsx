import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const handleLogin = () => {
    navigation.navigate('Auth', { mode: 'login' });
  };

  const handleSignUp = () => {
    navigation.navigate('Auth', { mode: 'signup' });
  };

  return (
    <View style={styles.container}>
      {/* Background with gradient overlay */}
      <LinearGradient
        colors={['rgba(249, 115, 22, 0.9)', 'rgba(234, 88, 12, 0.9)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Logo and App Name */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="nutrition" size={80} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>Nutri.io</Text>
            <Text style={styles.tagline}>Smart Nutrition Tracking</Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentSection}>
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
              <View style={styles.featureItem}>
                <Ionicons name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.featureText}>Snap & Track</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="analytics" size={24} color="#FFFFFF" />
                <Text style={styles.featureText}>Smart Analytics</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="fitness" size={24} color="#FFFFFF" />
                <Text style={styles.featureText}>AI Trainer</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F8F8']}
                style={styles.buttonGradient}
              >
                <Text style={styles.signUpButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#F97316" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Already have an account? Sign In</Text>
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
          </View>

          {/* Floating Elements */}
          <View style={styles.floatingElements}>
            <View style={[styles.floatingCircle, styles.circle1]} />
            <View style={[styles.floatingCircle, styles.circle2]} />
            <View style={[styles.floatingCircle, styles.circle3]} />
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
  logoSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 42,
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
    paddingVertical: 40,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleAccent: {
    color: '#FFF3CD',
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
    fontWeight: '400',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 90,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSection: {
    paddingBottom: 40,
  },
  signUpButton: {
    marginBottom: 16,
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
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F97316',
    marginRight: 8,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginButtonText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  socialProof: {
    marginTop: 32,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    width: 100,
    height: 100,
    top: '15%',
    right: -50,
  },
  circle2: {
    width: 60,
    height: 60,
    top: '45%',
    left: -30,
  },
  circle3: {
    width: 80,
    height: 80,
    bottom: '20%',
    right: -40,
  },
});