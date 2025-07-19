import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={({ navigation }) => ({
          title: "Log In",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('index')} >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        })}
      />
      <Stack.Screen 
        name="signup" 
        options={({ navigation }) => ({
          title: "Sign Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate('index')} >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerBackVisible: false,
        })}
       />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      <Stack.Screen name="templates" options={{ headerShown: false }} />
    </Stack>
  );
}
