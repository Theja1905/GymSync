import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../../../firebase';

export default function WorkoutScreen() {
  const router = useRouter();
  const [routineTitle, setRoutineTitle] = useState('');
  const [exercises, setExercises] = useState([
    { id: Date.now().toString(), name: '', reps: '', sets: '' },
  ]);

  const updateExercise = (
    id: string,
    field: 'name' | 'reps' | 'sets',
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const addExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', reps: '', sets: '' },
    ]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length === 1) {
      Alert.alert('You must have at least one exercise.');
      return;
    }
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleStartTimer = async () => {
    if (!routineTitle.trim()) {
      Alert.alert('Please enter a workout routine title');
      return;
    }

    if (exercises.some((ex) => !ex.name || !ex.reps || !ex.sets)) {
      Alert.alert('Please complete all exercise fields');
      return;
    }

    const workoutData = {
      routineTitle,
      exercises: exercises.map((e) => ({
        name: e.name,
        reps: e.reps,
        sets: e.sets,
      })),
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, 'workouts'), workoutData);

      router.push({
        pathname: '/logger/screens/timer',
        params: {
          routineTitle,
          exercises: JSON.stringify(
            workoutData.exercises.map(({ name, sets, reps }) => ({
              name,
              sets,
              reps,
            }))
          ),
          workoutId: docRef.id,
        },
      });
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error saving workout. Please try again.');
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Add Exercises</Text>

        <TextInput
          style={styles.routineInput}
          placeholder="Workout Routine Title"
          value={routineTitle}
          onChangeText={setRoutineTitle}
        />

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTextExercise}>Exercise</Text>
            <Text style={styles.headerTextSmall}>Reps</Text>
            <Text style={styles.headerTextSmall}>Sets</Text>
          </View>

          {exercises.map((exercise) => (
            <View style={styles.inputRow} key={exercise.id}>
              <TextInput
                style={styles.inputExercise}
                placeholder="Type"
                value={exercise.name}
                onChangeText={(text) =>
                  updateExercise(exercise.id, 'name', text)
                }
              />
              <TextInput
                style={styles.inputSmall}
                placeholder="Reps"
                value={exercise.reps}
                keyboardType="numeric"
                onChangeText={(text) =>
                  updateExercise(exercise.id, 'reps', text)
                }
              />
              <TextInput
                style={styles.inputSmall}
                placeholder="Sets"
                value={exercise.sets}
                keyboardType="numeric"
                onChangeText={(text) =>
                  updateExercise(exercise.id, 'sets', text)
                }
              />
              <TouchableOpacity
                onPress={() => removeExercise(exercise.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addExerciseRow}>
            <Text style={styles.addButtonText}>＋ Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.timerButton} onPress={handleStartTimer}>
          <Text style={styles.timerText}>Start Timer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timerButton, styles.backButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.timerText}>Back to Logger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 20 },
  routineInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  headerTextExercise: {
    width: '50%',
    fontWeight: '600',
    fontSize: 16,
  },
  headerTextSmall: {
    width: '22%',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  inputExercise: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 5,
    fontSize: 15,
    backgroundColor: '#f5f5f5',
  },
  inputSmall: {
    width: '22%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 3,
    fontSize: 15,
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 19,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 100,
    backgroundColor: '#e0f0ff',
    borderRadius: 30,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#007AFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  timerButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#BBBBBB',
  },
  timerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
  },
});
