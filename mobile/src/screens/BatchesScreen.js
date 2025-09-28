import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BatchesScreen = ({ navigation }) => {
  const mockBatches = [
    {
      id: '1',
      batchId: 'BATCH-001',
      crop: 'Organic Tomatoes',
      status: 'Verified',
      statusColor: '#10B981',
      harvestDate: '2024-01-15',
      location: 'Green Valley Farms',
    },
    {
      id: '2',
      batchId: 'BATCH-002',
      crop: 'Fresh Lettuce',
      status: 'In Transit',
      statusColor: '#F59E0B',
      harvestDate: '2024-01-14',
      location: 'Sunrise Agriculture',
    },
    {
      id: '3',
      batchId: 'BATCH-003',
      crop: 'Organic Carrots',
      status: 'Processing',
      statusColor: '#3B82F6',
      harvestDate: '2024-01-13',
      location: 'Mountain View Farms',
    },
  ];

  const renderBatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.batchItem}
      onPress={() => navigation.navigate('BatchDetail', { batchId: item.batchId })}
    >
      <View style={styles.batchHeader}>
        <Text style={styles.batchId}>{item.batchId}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: item.statusColor }]}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text style={styles.cropName}>{item.crop}</Text>
      <View style={styles.batchDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.harvestDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Batches</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockBatches}
        renderItem={renderBatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    padding: 20,
  },
  batchItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batchId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  batchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
});

export default BatchesScreen;
