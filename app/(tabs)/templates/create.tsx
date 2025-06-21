import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export default function CreateTemplateScreen() {
  const router = useRouter();
  const [templateName, setTemplateName] = useState('');
  const [exercises, setExercises] = useState<string[]>(['']);
  const [sets, setSets] = useState<number[]>([0]);
  const [reps, setReps] = useState<number[]>([0]);

  const addExercise = () => {
    setExercises([...exercises, '']);
    setSets([...sets, 0]);
    setReps([...reps, 0]);
  };

  const updateExercise = (index: number, value: string) => {
    const updated = [...exercises];
    updated[index] = value;
    setExercises(updated);
  };

  const updateSet = (index: number, value: string) => {
    const updated = [...sets];
    updated[index] = parseInt(value) || 0;
    setSets(updated);
  };

  const updateRep = (index: number, value: string) => {
    const updated = [...reps];
    updated[index] = parseInt(value) || 0;
    setReps(updated);
  };

  const saveTemplate = async () => {
    const validExercises = exercises.filter(e => e.trim() !== '');
    if (!templateName || validExercises.length === 0) return;

    const templatesRef = collection(db, 'templates');
    await addDoc(templatesRef, {
      name: templateName,
      exercises: validExercises,
      sets,
      reps,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Template</Text>

        <Text style={styles.label}>Template Name:</Text>
        <TextInput
          style={styles.inputTemplateName}
          placeholder="Enter template name"
          value={templateName}
          onChangeText={setTemplateName}
        />

        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseRow}>
            <View style={styles.exerciseColumn}>
              <Text style={styles.label}>Exercise:</Text>
              <TextInput
                style={styles.inputExerciseName}
                placeholder="Exercise Name"
                value={exercise}
                onChangeText={(text) => updateExercise(index, text)}
              />
            </View>

            <View style={styles.exerciseColumn}>
              <Text style={styles.label}>Sets:</Text>
              <TextInput
                style={styles.inputSetsReps}
                placeholder="Sets"
                keyboardType="numeric"
                value={sets[index]?.toString() || ''}
                onChangeText={(text) => updateSet(index, text)}
              />
            </View>

            <View style={styles.exerciseColumn}>
              <Text style={styles.label}>Reps:</Text>
              <TextInput
                style={styles.inputSetsReps}
                placeholder="Reps"
                keyboardType="numeric"
                value={reps[index]?.toString() || ''}
                onChangeText={(text) => updateRep(index, text)}
              />
            </View>
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addExercise}>
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={saveTemplate}>
          <Text style={styles.saveButtonText}>Save Template</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  inputTemplateName: {borderColor: '#ccc',borderWidth: 1,borderRadius: 8, padding: 10,width: 350,marginBottom: 12,textAlign: 'center',},
  inputExerciseName: {borderColor: '#ccc',borderWidth: 1,borderRadius: 8,padding: 10,width: 190,marginBottom: 12,textAlign: 'center',},
  inputSetsReps: {borderColor: '#ccc',borderWidth: 1,borderRadius: 8,padding: 10,paddingHorizontal: 20,width: 68,marginBottom: 12,textAlign: 'center',},
  exerciseRow: {flexDirection: 'row',alignItems: 'center',marginBottom: 20,justifyContent: 'space-between',width: '100%',},
  exerciseColumn: {flexDirection: 'column',marginRight: 12,},
  label: {fontWeight: 'bold',marginBottom: 4,},
  addButton: {backgroundColor: '#ddd',padding: 12,borderRadius: 8,alignItems: 'center',marginBottom: 20,},
  addButtonText: { fontWeight: 'bold' },
  saveButton: {backgroundColor: '#4a90e2',padding: 15,borderRadius: 12,alignItems: 'center'},
  saveButtonText: { color: '#fff', fontWeight: '600' },
  backButton: {backgroundColor: '#aaa',padding: 12,borderRadius: 8,alignItems: 'center',marginTop: 12,},
  backButtonText: {color: '#fff',fontWeight: '600'},
});
