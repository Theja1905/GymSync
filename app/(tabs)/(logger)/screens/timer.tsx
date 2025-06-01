import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TimerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Timer</Text>

      {/* Example timer text */}
      <Text style={styles.timer}>00:30</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back to Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  timer: { fontSize: 48, fontWeight: 'bold', marginVertical: 20 },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: '#fff' },
});
