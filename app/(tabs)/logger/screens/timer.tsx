import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../../firebase'; // Adjust this path if needed

export default function TimerScreen() {
  const router = useRouter();
  const { routineTitle, exercises } = useLocalSearchParams();
  const parsedExercises = exercises ? JSON.parse(exercises as string) : [];
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleFinishWorkout = async () => {
    setIsRunning(false);

    try {
      await addDoc(collection(db, 'workouts'), {
        routineTitle,
        exercises: parsedExercises,
        duration: formatTime(),
        createdAt: Timestamp.now(),
        userId: auth.currentUser?.uid,
        date: new Date().toLocaleDateString(),
      });
      router.push('/logger');
    } catch (error) {
      console.error('Error saving workout: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Timer</Text>
      <Text style={styles.timer}>{formatTime()}</Text>
      <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout}>
        <Text style={styles.finishText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 50, fontWeight: 'bold', marginBottom: 40 },
  timer: { fontSize: 48, fontWeight: 'bold', marginBottom: 40 },
  finishButton: {backgroundColor: '#4caf50',paddingVertical: 10,paddingHorizontal: 70,borderRadius: 30,},
  finishText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
