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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UploadHarvestScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    batchId: '',
    quantity: '',
    harvestDate: '',
    location: '',
    notes: '',
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.cropName || !formData.batchId || !formData.quantity || !formData.harvestDate || !formData.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Mock submission
    Alert.alert(
      'Success',
      'Harvest data uploaded successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const generateBatchId = () => {
    const batchId = `BATCH-${Date.now().toString().slice(-6)}`;
    setFormData(prev => ({
      ...prev,
      batchId
    }));
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
        <Text style={styles.headerTitle}>Upload Harvest Data</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Crop Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Organic Tomatoes"
              value={formData.cropName}
              onChangeText={(value) => handleInputChange('cropName', value)}
            />
          </View>

          {/* Batch ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Batch ID *</Text>
            <View style={styles.batchIdContainer}>
              <TextInput
                style={[styles.input, styles.batchIdInput]}
                placeholder="e.g., BATCH-123456"
                value={formData.batchId}
                onChangeText={(value) => handleInputChange('batchId', value)}
              />
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateBatchId}
              >
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quantity */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity *</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.input, styles.quantityInput]}
                placeholder="0"
                value={formData.quantity}
                onChangeText={(value) => handleInputChange('quantity', value)}
                keyboardType="numeric"
              />
              <View style={styles.unitSelector}>
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          {/* Harvest Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Harvest Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={formData.harvestDate}
              onChangeText={(value) => handleInputChange('harvestDate', value)}
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Field A, Green Valley Farms"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional notes about the harvest..."
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Image Upload */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photos</Text>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Ionicons name="camera-outline" size={24} color="#10B981" />
              <Text style={styles.imageUploadText}>Add Photos</Text>
            </TouchableOpacity>
            {images.length > 0 && (
              <View style={styles.imagePreview}>
                <Text style={styles.imageCount}>{images.length} photos selected</Text>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Upload Harvest Data</Text>
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
    backgroundColor: '#10B981',
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
  batchIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batchIdInput: {
    flex: 1,
    marginRight: 12,
  },
  generateButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    marginRight: 12,
  },
  unitSelector: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  unitText: {
    fontSize: 16,
    color: '#6B7280',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    backgroundColor: '#F0FDF4',
  },
  imageUploadText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreview: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  imageCount: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#10B981',
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

export default UploadHarvestScreen;
