import { Stack } from 'expo-router';

export default function TemplatesLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{  headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}
