import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName: React.ComponentProps<typeof Ionicons>['name'];

        if (route.name === 'templates/index') {
          iconName = 'list-outline'; // icon for templates
        } else if (route.name === 'logger') {
          iconName = 'barbell-outline';
        } else if (route.name === 'profile') {
          iconName = 'person-outline';
        } else {
          iconName = 'alert-circle-outline'; // fallback icon
        }

        return {
          headerShown: false,
          headerBackVisible: false,
          gestureEnabled: false,
          tabBarActiveTintColor: '#4a90e2',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
        };
      }}
    >
      <Tabs.Screen
        name="templates/index"
        options={{ title: 'Templates', headerShown: false }}
      />
      <Tabs.Screen
        name="logger"
        options={{ title: 'Workout Logger', headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', headerShown: false }}
      />
    </Tabs>
  );
}
