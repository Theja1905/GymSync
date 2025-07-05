import { useFocusEffect, useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../firebase';


type WorkoutLog = {
  id: string;
  date: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
  }[];
};


export default function WorkoutLoggerScreen() {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const router = useRouter();


  useFocusEffect(
    useCallback(() => {
      if (!auth.currentUser) return;


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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Start Workout</Text>
      <Text style={styles.subtitle}>Quick Start</Text>


      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          router.push('/logger/screens/workout');
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
              <View style={styles.columnWide}><Text style={styles.columnTitle}>Exercise</Text></View>
              <View style={styles.column}><Text style={styles.columnTitle}>Sets</Text></View>
              <View style={styles.column}><Text style={styles.columnTitle}>Reps</Text></View>
            </View>


            {item.exercises.map((ex, i) => (
              <View key={i} style={styles.row}>
                <View style={styles.columnWide}><Text>{ex.name}</Text></View>
                <View style={styles.column}><Text>{ex.sets}</Text></View>
                <View style={styles.column}><Text>{ex.reps}</Text></View>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'left', marginTop: 0, fontSize: 15 }}>
            No workouts logged yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 35, fontWeight: 'bold' },
  subtitle: { color: '#666', marginBottom: 20, marginTop: 7 },
  startButton: {backgroundColor: '#4a90e2',paddingVertical: 9,paddingHorizontal: 10,borderRadius: 20,alignItems: 'center',marginBottom: 20},
  startButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loggerTitle: { fontSize: 35, fontWeight: 'bold', marginBottom: 10 },
  card: {backgroundColor: '#f9f9f9',padding: 15,borderRadius: 10,marginBottom: 10,},
  dateText: { fontWeight: 'bold' },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  headerRow: {flexDirection: 'row',marginTop: 10},
  columnTitle: { fontWeight: 'bold' },
  row: {flexDirection: 'row',paddingVertical: 3,},
  column: {flex: 1,},
  columnWide: {flex: 2,},
});
