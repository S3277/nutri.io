import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImageWithOpenAI } from '../services/openai';

interface FoodEntryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (entry: any) => void;
}

export default function FoodEntryModal({ visible, onClose, onSubmit }: FoodEntryModalProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: 'lunch',
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to use this feature.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (uri: string) => {
    setAnalyzing(true);
    try {
      // Convert image to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const result = await analyzeImageWithOpenAI(base64);
          
          setFormData({
            name: result.name,
            calories: result.calories.toString(),
            protein: result.protein.toString(),
            carbs: result.carbs.toString(),
            fat: result.fat.toString(),
            mealType: formData.mealType,
          });
        } catch (error: any) {
          Alert.alert('Analysis Error', error.message);
        } finally {
          setAnalyzing(false);
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to analyze image');
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.calories) {
      Alert.alert('Error', 'Please fill in at least the food name and calories');
      return;
    }

    onSubmit({
      name: formData.name,
      calories: parseInt(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      mealType: formData.mealType,
    });

    // Reset form
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      mealType: 'lunch',
    });
    setImageUri(null);
  };

  const clearImage = () => {
    setImageUri(null);
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      mealType: formData.mealType,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Food Entry</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {!imageUri ? (
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                <Ionicons name="camera" size={32} color="#F97316" />
                <Text style={styles.imagePickerText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Ionicons name="image" size={32} color="#F97316" />
                <Text style={styles.imagePickerText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity style={styles.clearImageButton} onPress={clearImage}>
                <Ionicons name="close-circle" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          )}

          {analyzing && (
            <View style={styles.analyzingContainer}>
              <Text style={styles.analyzingText}>Analyzing your food...</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Food Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter food name"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Calories</Text>
                <TextInput
                  style={styles.input}
                  value={formData.calories}
                  onChangeText={(text) => setFormData({ ...formData, calories: text })}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={[styles.pickerButton, formData.mealType === 'breakfast' && styles.pickerButtonActive]}
                    onPress={() => setFormData({ ...formData, mealType: 'breakfast' })}
                  >
                    <Text style={[styles.pickerText, formData.mealType === 'breakfast' && styles.pickerTextActive]}>
                      Breakfast
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, formData.mealType === 'lunch' && styles.pickerButtonActive]}
                    onPress={() => setFormData({ ...formData, mealType: 'lunch' })}
                  >
                    <Text style={[styles.pickerText, formData.mealType === 'lunch' && styles.pickerTextActive]}>
                      Lunch
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, formData.mealType === 'dinner' && styles.pickerButtonActive]}
                    onPress={() => setFormData({ ...formData, mealType: 'dinner' })}
                  >
                    <Text style={[styles.pickerText, formData.mealType === 'dinner' && styles.pickerTextActive]}>
                      Dinner
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, formData.mealType === 'snack' && styles.pickerButtonActive]}
                    onPress={() => setFormData({ ...formData, mealType: 'snack' })}
                  >
                    <Text style={[styles.pickerText, formData.mealType === 'snack' && styles.pickerTextActive]}>
                      Snack
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.macrosTitle}>Macronutrients (optional)</Text>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 5 }]}>
                <Text style={styles.label}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.protein}
                  onChangeText={(text) => setFormData({ ...formData, protein: text })}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 5 }]}>
                <Text style={styles.label}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.carbs}
                  onChangeText={(text) => setFormData({ ...formData, carbs: text })}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 5 }]}>
                <Text style={styles.label}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fat}
                  onChangeText={(text) => setFormData({ ...formData, fat: text })}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  imagePickerButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#F97316',
    borderRadius: 12,
    borderStyle: 'dashed',
    flex: 0.45,
  },
  imagePickerText: {
    color: '#F97316',
    marginTop: 8,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  clearImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  analyzingText: {
    color: '#F97316',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  row: {
    flexDirection: 'row',
  },
  macrosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  pickerButtonActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  pickerText: {
    fontSize: 12,
    color: '#666',
  },
  pickerTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});