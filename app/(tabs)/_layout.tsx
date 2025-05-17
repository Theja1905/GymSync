import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: React.ComponentProps<typeof Ionicons>['name'];

        if (route.name === 'home') {
          iconName = 'home-outline';
        } else if (route.name === 'profile') {
          iconName = 'person-outline';
        } else {
          iconName = 'alert-circle-outline'; // fallback icon
        }

        return {
          headerShown: false, // hide top header to remove (tabs) title
          tabBarActiveTintColor: '#4a90e2',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
        };
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}

