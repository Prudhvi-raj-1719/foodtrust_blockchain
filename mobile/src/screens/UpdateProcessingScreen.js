import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UpdateProcessingScreen = ({ navigation, route }) => {
  const { batchId } = route.params || {};
  
  const [formData, setFormData] = useState({
    batchId: batchId || '',
    processingMethod: '',
    temperature: '',
    duration: '',
    qualityScore: '',
    notes: '',
    status: 'Processing',
  });

  const processingMethods = [
    'Washing',
    'Cutting',
    'Packaging',
    'Freezing',
    'Drying',
    'Canning',
    'Pasteurization',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.batchId || !formData.processingMethod || !formData.temperature || !formData.duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Mock submission
    Alert.alert(
      'Success',
      'Processing update recorded successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Processing</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Batch ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Batch ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., BATCH-123456"
              value={formData.batchId}
              onChangeText={(value) => handleInputChange('batchId', value)}
            />
          </View>

          {/* Processing Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Processing Method *</Text>
            <View style={styles.methodsContainer}>
              {processingMethods.map((method, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.methodButton,
                    formData.processingMethod === method && styles.selectedMethodButton
                  ]}
                  onPress={() => handleInputChange('processingMethod', method)}
                >
                  <Text style={[
                    styles.methodButtonText,
                    formData.processingMethod === method && styles.selectedMethodButtonText
                  ]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Temperature and Duration */}
          <View style={styles.rowContainer}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Temperature (°C) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.temperature}
                onChangeText={(value) => handleInputChange('temperature', value)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Duration (hours) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={formData.duration}
                onChangeText={(value) => handleInputChange('duration', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Quality Score */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quality Score (%)</Text>
            <View style={styles.qualityContainer}>
              <TextInput
                style={[styles.input, styles.qualityInput]}
                placeholder="0"
                value={formData.qualityScore}
                onChangeText={(value) => handleInputChange('qualityScore', value)}
                keyboardType="numeric"
              />
              <View style={styles.qualitySlider}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderFill, { width: `${formData.qualityScore || 0}%` }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Status */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {['Processing', 'Completed', 'Quality Check', 'Packaged'].map((status, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.statusButton,
                    formData.status === status && styles.selectedStatusButton
                  ]}
                  onPress={() => handleInputChange('status', status)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === status && styles.selectedStatusButtonText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional processing notes..."
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Update Processing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#3B82F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  methodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  selectedMethodButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedMethodButtonText: {
    color: '#FFFFFF',
  },
  qualityContainer: {
    gap: 12,
  },
  qualityInput: {
    width: 100,
  },
  qualitySlider: {
    flex: 1,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  selectedStatusButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedStatusButtonText: {
    color: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpdateProcessingScreen;
