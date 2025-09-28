import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  // Debug logging
  console.log('DashboardScreen - User:', user);
  console.log('DashboardScreen - User Role:', user?.role);

  const getRoleColor = (role) => {
    const colors = {
      farmer: '#10B981',
      processor: '#3B82F6',
      distributor: '#F59E0B',
      retailer: '#8B5CF6',
      consumer: '#06B6D4',
      regulator: '#6B7280',
    };
    return colors[role] || '#6B7280';
  };

  const getRoleTitle = (role) => {
    const titles = {
      farmer: 'Farmer User',
      processor: 'Processor User',
      distributor: 'Distributor User',
      retailer: 'Retailer User',
      consumer: user?.name || 'John Doe',
      regulator: 'Regulator User',
    };
    return titles[role] || 'User';
  };

  const getRoleSubtitle = (role) => {
    const subtitles = {
      farmer: 'Farmer',
      processor: 'Processor',
      distributor: 'Distributor',
      retailer: 'Retailer',
      consumer: 'Consumer',
      regulator: 'Regulator',
    };
    return subtitles[role] || 'User';
  };

  const getQuickActions = (role) => {
    const actions = {
      farmer: [
        { title: 'Upload Harvest Data', icon: 'arrow-up-outline', action: () => navigation.navigate('UploadHarvest') },
        { title: 'View Analytics', icon: 'bar-chart-outline', action: () => navigation.navigate('Analytics') },
        { title: 'Generate QR Code', icon: 'qr-code-outline', action: () => navigation.navigate('QRCodeGenerator') },
      ],
      processor: [
        { title: 'Scan Batch', icon: 'qr-code-outline', action: () => navigation.navigate('QRScanner') },
        { title: 'Update Processing', icon: 'arrow-up-outline', action: () => Alert.alert('Action', 'Update Processing') },
        { title: 'Quality Check', icon: 'checkmark-circle-outline', action: () => Alert.alert('Action', 'Quality Check') },
      ],
      distributor: [
        { title: 'Track Shipments', icon: 'search-outline', action: () => Alert.alert('Action', 'Track Shipments') },
        { title: 'Update Location', icon: 'arrow-up-outline', action: () => Alert.alert('Action', 'Update Location') },
        { title: 'Logistics Report', icon: 'bar-chart-outline', action: () => Alert.alert('Action', 'Logistics Report') },
      ],
      retailer: [
        { title: 'Scan Products', icon: 'qr-code-outline', action: () => navigation.navigate('QRScanner') },
        { title: 'Update Inventory', icon: 'arrow-up-outline', action: () => Alert.alert('Action', 'Update Inventory') },
        { title: 'Verify Products', icon: 'checkmark-circle-outline', action: () => Alert.alert('Action', 'Verify Products') },
      ],
      consumer: [
        { title: 'Scan Product', icon: 'qr-code-outline', action: () => navigation.navigate('QRScanner') },
        { title: 'Track Product Origin', icon: 'search-outline', action: () => Alert.alert('Action', 'Track Product Origin') },
        { title: 'Purchase History', icon: 'time-outline', action: () => Alert.alert('Action', 'Purchase History') },
      ],
      regulator: [
        { title: 'Verify Batches', icon: 'checkmark-circle-outline', action: () => Alert.alert('Action', 'Verify Batches') },
        { title: 'Audit Trail', icon: 'search-outline', action: () => Alert.alert('Action', 'Audit Trail') },
        { title: 'Compliance Report', icon: 'bar-chart-outline', action: () => Alert.alert('Action', 'Compliance Report') },
      ],
    };
    return actions[role] || [];
  };

  const recentActivity = [
    { id: '1', title: 'Batch #12345 Organic Tomatoes', status: 'Verified', statusColor: '#10B981' },
    { id: '2', title: 'Batch #12344 Fresh Lettuce', status: 'In Transit', statusColor: '#F59E0B' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const roleColor = getRoleColor(user?.role);
  const roleTitle = getRoleTitle(user?.role);
  const roleSubtitle = getRoleSubtitle(user?.role);
  const quickActions = getQuickActions(user?.role);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: roleColor }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>{roleTitle}</Text>
            <Text style={styles.headerSubtitle}>{roleSubtitle}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={action.action}
              >
                <View style={[styles.actionIcon, { backgroundColor: roleColor + '20' }]}>
                  <Ionicons name={action.icon} size={24} color={roleColor} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>Tap to continue</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            {recentActivity.map((item) => (
              <View key={item.id} style={styles.activityItem}>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
                    <Text style={[styles.statusText, { color: item.statusColor }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
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
});

export default DashboardScreen;
