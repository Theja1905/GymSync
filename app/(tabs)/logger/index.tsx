import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

type WorkoutLog = {
  date: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
  }[];
};

export default function WorkoutLoggerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      const { routineTitle, exercises, duration } = params;

      if (routineTitle && exercises && duration) {
        const parsedExercises =
          typeof exercises === 'string' ? JSON.parse(exercises) : [];

        const durationMinutes =
          typeof duration === 'string'
            ? parseInt(duration.split(':')[0])
            : 0;

        const newLog: WorkoutLog = {
          date: new Date().toISOString().split('T')[0],
          duration: durationMinutes,
          exercises: parsedExercises.map((ex: any) => ({
            name: ex.name,
            sets: parseInt(ex.sets),
          })),
        };

        setWorkoutLogs((prev) => [newLog, ...prev]);
      }
    }, [params])
  );

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
  container: { flex: 1, paddingTop: 90, padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 35, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 10 },
  startButton: {backgroundColor: '#4a90e2',padding: 12,borderRadius: 10,alignItems: 'center',marginBottom: 20,},
  startButtonText: { color: '#fff', fontWeight: '600' },
  loggerTitle: { fontSize: 35, fontWeight: 'bold', marginBottom: 10 },
  card: {backgroundColor: '#f9f9f9',padding: 15,borderRadius: 10,marginBottom: 10,},
  dateText: { fontWeight: 'bold' },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  durationText: { marginLeft: 5 },
  headerRow: {flexDirection: 'row',justifyContent: 'space-between',marginTop: 10,},
  columnTitle: { fontWeight: 'bold' },
  row: {flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 3,},
});
