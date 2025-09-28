import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

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

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person-outline',
      action: () => Alert.alert('Action', 'Personal Information'),
    },
    {
      title: 'Account Settings',
      icon: 'settings-outline',
      action: () => Alert.alert('Action', 'Account Settings'),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      action: () => Alert.alert('Action', 'Notifications'),
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-outline',
      action: () => Alert.alert('Action', 'Privacy & Security'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: () => Alert.alert('Action', 'Help & Support'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      action: () => Alert.alert('Action', 'About'),
    },
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: roleColor }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.name || user?.username}</Text>
          <Text style={styles.userRole}>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</Text>
          <Text style={styles.userOrganization}>{user?.organization}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.action}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: roleColor + '20' }]}>
                  <Ionicons name={item.icon} size={20} color={roleColor} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  userOrganization: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  logoutContainer: {
    margin: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
});

export default ProfileScreen;
