import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function WorkoutScreen() {
  const router = useRouter();

  const [routineTitle, setRoutineTitle] = useState('');
  const [exercises, setExercises] = useState([
    { id: Date.now().toString(), name: '', reps: '', sets: '' },
  ]);

  type Exercise = {
    id: string;
    name: string;
    reps: string;
    sets: string;
  };

  const updateExercise = (
    id: string,
    field: keyof Exercise,
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };


  const addExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', reps: '', sets: '' },
    ]);
  };

  const handleStartTimer = () => {
    if (!routineTitle.trim()) {
      Alert.alert('Please enter a workout routine title');
      return;
    }
    const incomplete = exercises.some(
      (ex) => !ex.name || !ex.reps || !ex.sets
    );
    if (incomplete) {
      Alert.alert('Please complete all exercise fields');
      return;
    }

    // Navigate to the timer screen
    router.push('/logger/screens/timer');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Exercises</Text>

      <TextInput
        style={styles.routineInput}
        placeholder="Workout Routine Title (e.g. Morning Workout)"
        value={routineTitle}
        onChangeText={setRoutineTitle}
      />

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Exercise</Text>
          <Text style={styles.headerText}>Reps</Text>
          <Text style={styles.headerText}>Sets</Text>
        </View>

        {exercises.map((exercise, index) => (
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
              keyboardType="numeric"
              value={exercise.reps}
              onChangeText={(text) =>
                updateExercise(exercise.id, 'reps', text)
              }
            />
            <TextInput
              style={styles.inputSmall}
              placeholder="Sets"
              keyboardType="numeric"
              value={exercise.sets}
              onChangeText={(text) =>
                updateExercise(exercise.id, 'sets', text)
              }
            />
          </View>
        ))}

        <TouchableOpacity onPress={addExerciseRow}>
          <Text style={styles.plusButton}>＋ Add Exercise</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.timerButton} onPress={handleStartTimer}>
        <Text style={styles.timerText}>Start Timer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.timerButton, styles.backButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.timerText}>Back to Logger</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  routineInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  headerText: { fontWeight: 'bold', width: '30%' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputExercise: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
  },
  plusButton: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 10,
    textAlign: 'center',
  },
  timerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#999',
  },
  timerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
