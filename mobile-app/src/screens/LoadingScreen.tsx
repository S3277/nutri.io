import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#F97316', '#EA580C']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="nutrition" size={80} color="#FFFFFF" />
        <Text style={styles.logoText}>Nutri.io</Text>
        <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
});