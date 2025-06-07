import { useFocusEffect, useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebase';

type WorkoutLog = {
  id: string; // Add id field for keys
  date: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
  }[];
};

export default function WorkoutLoggerScreen() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (!auth.currentUser) return;

      // Query workouts for current user, ordered by createdAt descending
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const logs: WorkoutLog[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          logs.push({
            id: doc.id,
            date: data.date,
            duration: data.duration,
            exercises: data.exercises,
          });
        });
        setWorkoutLogs(logs);
      });

      return () => unsubscribe();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Workout</Text>
      <Text style={styles.subtitle}>Quick Start</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          router.push('/logger/screens/workout'); // Adjust path to your workout/timer screen
        }}
      >
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>

      <Text style={styles.loggerTitle}>Workout Logger</Text>

      <FlatList
        data={workoutLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.dateText}>{item.date}</Text>
            <View style={styles.durationRow}>
              <Text>{item.duration} mins</Text>
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
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 50 }}>
            No workouts logged yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 90, padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 35, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 10 },
  startButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: { color: '#fff', fontWeight: '600' },
  loggerTitle: { fontSize: 35, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: { fontWeight: 'bold' },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
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
