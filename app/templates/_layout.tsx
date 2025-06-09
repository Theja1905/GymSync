import { Stack } from 'expo-router';

export default function TemplatesLayout() {
  return (
    <Stack>
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}
