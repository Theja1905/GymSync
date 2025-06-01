import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the structure of a workout log
type WorkoutLog = {
  date: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
  }[];
};

// Example data (can be empty initially)
const workoutLogs: WorkoutLog[] = [
  {
    date: '2024-05-25',
    duration: 45,
    exercises: [
      { name: 'Push-ups', sets: 3 },
      { name: 'Squats', sets: 4 },
    ],
  },
  {
    date: '2024-05-26',
    duration: 30,
    exercises: [{ name: 'Running', sets: 1 }],
  },
];

export default function WorkoutLoggerScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Workout</Text>
      <Text style={styles.subtitle}>Quick Start</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push('/logger/screens/workout')}
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>

      <Text style={styles.loggerTitle}>Workout Logger</Text>

      <FlatList
        data={workoutLogs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.durationRow}>
              <Ionicons name="time-outline" size={16} color="#333" />
              <Text style={styles.durationText}>{item.duration} mins</Text>
            </View>
            <View style={styles.headerRow}>
              <Text style={styles.columnTitle}>Exercise</Text>
              <Text style={styles.columnTitle}>No. of Sets</Text>
            </View>
            {item.exercises.map((ex, i) => (
              <View key={i} style={styles.row}>
                <Text>{ex.name}</Text>
                <Text>{ex.sets}</Text>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 10 },
  startButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: { color: '#fff', fontWeight: '600' },
  loggerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: { fontWeight: 'bold' },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  durationText: { marginLeft: 5 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  columnTitle: { fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
});