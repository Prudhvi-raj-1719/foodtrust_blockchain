import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  // Mock data for charts
  const cropYieldData = [
    { crop: 'Tomatoes', yield: 1200, color: '#10B981' },
    { crop: 'Lettuce', yield: 800, color: '#3B82F6' },
    { crop: 'Carrots', yield: 950, color: '#F59E0B' },
    { crop: 'Onions', yield: 1100, color: '#8B5CF6' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4500 },
    { month: 'Feb', revenue: 5200 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Apr', revenue: 6100 },
    { month: 'May', revenue: 5800 },
    { month: 'Jun', revenue: 7200 },
  ];

  const distributionData = [
    { category: 'Organic', percentage: 65, color: '#10B981' },
    { category: 'Conventional', percentage: 25, color: '#3B82F6' },
    { category: 'Premium', percentage: 10, color: '#F59E0B' },
  ];

  const renderCropYieldChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Crop Yield (kg)</Text>
      <View style={styles.barChart}>
        {cropYieldData.map((item, index) => (
          <View key={index} style={styles.barItem}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.yield / 1200) * 100,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.crop}</Text>
            <Text style={styles.barValue}>{item.yield}kg</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderRevenueChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Revenue Trends</Text>
      <View style={styles.lineChart}>
        <View style={styles.lineChartContainer}>
          {revenueData.map((item, index) => (
            <View key={index} style={styles.linePoint}>
              <View
                style={[
                  styles.lineDot,
                  {
                    bottom: (item.revenue / 8000) * 100,
                  },
                ]}
              />
              <Text style={styles.lineLabel}>{item.month}</Text>
            </View>
          ))}
        </View>
        <View style={styles.lineChartLine} />
      </View>
    </View>
  );

  const renderDistributionChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Product Distribution</Text>
      <View style={styles.pieChart}>
        {distributionData.map((item, index) => (
          <View key={index} style={styles.pieItem}>
            <View
              style={[
                styles.pieColor,
                { backgroundColor: item.color },
              ]}
            />
            <Text style={styles.pieLabel}>{item.category}</Text>
            <Text style={styles.pieValue}>{item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStatsCard = (title, value, icon, color) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statsValue}>{value}</Text>
      </View>
      <Text style={styles.statsTitle}>{title}</Text>
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
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {renderStatsCard('Total Yield', '4,050 kg', 'leaf-outline', '#10B981')}
          {renderStatsCard('Revenue', '$28,400', 'cash-outline', '#3B82F6')}
          {renderStatsCard('Active Batches', '12', 'cube-outline', '#F59E0B')}
          {renderStatsCard('Quality Score', '94%', 'star-outline', '#8B5CF6')}
        </View>

        {/* Charts */}
        {renderCropYieldChart()}
        {renderRevenueChart()}
        {renderDistributionChart()}

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Tomato harvest completed</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
              <Text style={styles.activityValue}>1,200 kg</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Lettuce batch processed</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
              <Text style={styles.activityValue}>800 kg</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Quality check passed</Text>
                <Text style={styles.activityTime}>6 hours ago</Text>
              </View>
              <Text style={styles.activityValue}>94%</Text>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
  },
  barItem: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 30,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  barValue: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  lineChart: {
    height: 150,
    position: 'relative',
  },
  lineChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 100,
    alignItems: 'flex-end',
  },
  linePoint: {
    alignItems: 'center',
    flex: 1,
  },
  lineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    position: 'absolute',
  },
  lineLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  lineChartLine: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  pieChart: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  pieItem: {
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },
  pieColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  pieLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  pieValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  activityContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});

export default AnalyticsScreen;
