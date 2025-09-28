import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BatchesScreen from './src/screens/BatchesScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BatchDetailScreen from './src/screens/BatchDetailScreen';
import UploadHarvestScreen from './src/screens/UploadHarvestScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import QRCodeGeneratorScreen from './src/screens/QRCodeGeneratorScreen';

// Import context
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  const { user } = useAuth();

  const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Search':
        iconName = focused ? 'search' : 'search-outline';
        break;
      case 'History':
        iconName = focused ? 'time' : 'time-outline';
        break;
      case 'Notifications':
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'home-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Search" component={BatchesScreen} />
      <Tab.Screen name="History" component={BatchesScreen} />
      <Tab.Screen name="Notifications" component={BatchesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen name="BatchDetail" component={BatchDetailScreen} />
            <Stack.Screen name="UploadHarvest" component={UploadHarvestScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="QRCodeGenerator" component={QRCodeGeneratorScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AuthProvider>
  );
}