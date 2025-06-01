import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WorkoutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout In Progress</Text>

      {/* Example UI elements */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('../(tabs)/logger/screens/timer')}
      >
        <Text style={styles.buttonText}>Go to Timer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back to Logger</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: { color: '#fff' },
  backButton: { backgroundColor: '#999' },
});
