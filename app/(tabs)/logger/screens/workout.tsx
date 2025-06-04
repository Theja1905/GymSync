import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

        {exercises.map((exercise) => (
          <View style={styles.inputRow} key={exercise.id}>
            <TextInput
              style={styles.inputExercise}
              placeholder="Type"
              value={exercise.name}
              onChangeText={(text) =>
                updateExercise(exercise.id, 'name', text)
              }
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.inputSmall}
              placeholder="Reps"
              keyboardType="numeric"
              value={exercise.reps}
              onChangeText={(text) =>
                updateExercise(exercise.id, 'reps', text)
              }
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.inputSmall}
              placeholder="Sets"
              keyboardType="numeric"
              value={exercise.sets}
              onChangeText={(text) =>
                updateExercise(exercise.id, 'sets', text)
              }
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addExerciseRow}>
          <Text style={styles.addButtonText}>＋ Add Exercise</Text>
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
  container: {paddingTop: 80,paddingHorizontal: 24,backgroundColor: '#fff',paddingBottom: 40,alignItems: 'stretch',},
  title: {fontSize: 32,fontWeight: '700',marginBottom: 20,color: '#111',fontFamily: 'System',},
  routineInput: {borderWidth: 1,borderColor: '#ccc',paddingVertical: 14,paddingHorizontal: 16,borderRadius: 12,marginBottom: 24,fontSize: 16,fontFamily: 'System',backgroundColor: '#fafafa',},
  card: {backgroundColor: '#fff',padding: 20,borderRadius: 16,borderWidth: 1,borderColor: '#ddd',marginBottom: 30,shadowColor: '#000',shadowOpacity: 0.05,shadowRadius: 10,shadowOffset: { width: 0, height: 4 },},
  headerRow: {flexDirection: 'row',justifyContent: 'space-between',paddingBottom: 12,borderBottomWidth: 1,borderColor: '#eee', },
  headerText: {fontWeight: '700',width: '30%',color: '#444',textAlign: 'center',fontSize: 15,},
  inputRow: {flexDirection: 'row',alignItems: 'center',marginTop: 15,},
  inputExercise: {flex: 2,borderWidth: 1,borderColor: '#ddd',borderRadius: 10,paddingVertical: 10,
    paddingHorizontal: 14,marginRight: 12,fontSize: 15,backgroundColor: '#f5f5f5',fontFamily: 'System',},
  inputSmall: {flex: 1, borderWidth: 1,borderColor: '#ddd',borderRadius: 10,paddingVertical: 10,
    paddingHorizontal: 12,marginRight: 12,fontSize: 15,backgroundColor: '#f5f5f5',fontFamily: 'System',},
  addButton: {marginTop: 20,alignSelf: 'flex-start',paddingVertical: 10,
    paddingHorizontal: 18,backgroundColor: '#e0f0ff',
    borderRadius: 12,},
  addButtonText: {fontSize: 16,fontWeight: '600',color: '#007AFF',},
  timerButton: {backgroundColor: '#191970',paddingVertical: 16,borderRadius: 14,alignItems: 'center',marginBottom: 12,},
  backButton: {backgroundColor: '#555',shadowColor: '#000',shadowOpacity: 0.2,shadowRadius: 6,shadowOffset: { width: 0, height: 3 },},
  timerText: {color: '#fff',fontWeight: '700',fontSize: 17,fontFamily: 'System',},
});
