import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BatchDetailScreen = ({ navigation, route }) => {
  const { batchId } = route.params;

  // Mock batch data
  const batchData = {
    batchId: batchId || 'BATCH-001',
    crop: 'Organic Tomatoes',
    status: 'Verified',
    statusColor: '#10B981',
    harvestDate: '2024-01-15',
    location: 'Green Valley Farms',
    farmer: 'John Smith',
    processor: 'Fresh Foods Co.',
    distributor: 'Logistics Plus',
    retailer: 'Green Market',
    qualityScore: 95,
    temperature: '22°C',
    humidity: '65%',
    ph: '6.2',
    certifications: ['Organic', 'Non-GMO', 'Fair Trade'],
    timeline: [
      { date: '2024-01-15', event: 'Harvested', location: 'Green Valley Farms' },
      { date: '2024-01-16', event: 'Processed', location: 'Fresh Foods Co.' },
      { date: '2024-01-17', event: 'Shipped', location: 'Logistics Plus' },
      { date: '2024-01-18', event: 'Delivered', location: 'Green Market' },
    ],
  };

  const renderTimelineItem = (item, index) => (
    <View key={index} style={styles.timelineItem}>
      <View style={styles.timelineDot} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineEvent}>{item.event}</Text>
        <Text style={styles.timelineLocation}>{item.location}</Text>
        <Text style={styles.timelineDate}>{item.date}</Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Batch Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Batch Info Card */}
        <View style={styles.card}>
          <View style={styles.batchHeader}>
            <Text style={styles.batchId}>{batchData.batchId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: batchData.statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: batchData.statusColor }]}>
                {batchData.status}
              </Text>
            </View>
          </View>
          <Text style={styles.cropName}>{batchData.crop}</Text>
          <View style={styles.batchInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>Harvest Date: {batchData.harvestDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.infoText}>Location: {batchData.location}</Text>
            </View>
          </View>
        </View>

        {/* Quality Metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{batchData.qualityScore}%</Text>
              <Text style={styles.metricLabel}>Quality Score</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{batchData.temperature}</Text>
              <Text style={styles.metricLabel}>Temperature</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{batchData.humidity}</Text>
              <Text style={styles.metricLabel}>Humidity</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{batchData.ph}</Text>
              <Text style={styles.metricLabel}>pH Level</Text>
            </View>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Certifications</Text>
          <View style={styles.certificationsContainer}>
            {batchData.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationBadge}>
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Supply Chain Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supply Chain Timeline</Text>
          <View style={styles.timeline}>
            {batchData.timeline.map((item, index) => renderTimelineItem(item, index))}
          </View>
        </View>

        {/* Stakeholders */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stakeholders</Text>
          <View style={styles.stakeholdersList}>
            <View style={styles.stakeholderItem}>
              <Text style={styles.stakeholderRole}>Farmer</Text>
              <Text style={styles.stakeholderName}>{batchData.farmer}</Text>
            </View>
            <View style={styles.stakeholderItem}>
              <Text style={styles.stakeholderRole}>Processor</Text>
              <Text style={styles.stakeholderName}>{batchData.processor}</Text>
            </View>
            <View style={styles.stakeholderItem}>
              <Text style={styles.stakeholderRole}>Distributor</Text>
              <Text style={styles.stakeholderName}>{batchData.distributor}</Text>
            </View>
            <View style={styles.stakeholderItem}>
              <Text style={styles.stakeholderRole}>Retailer</Text>
              <Text style={styles.stakeholderName}>{batchData.retailer}</Text>
            </View>
          </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    fontSize: 18,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  batchInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  certificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    marginRight: 16,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  timelineEvent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  timelineLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stakeholdersList: {
    gap: 12,
  },
  stakeholderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  stakeholderRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stakeholderName: {
    fontSize: 14,
    color: '#1F2937',
  },
});

export default BatchDetailScreen;
