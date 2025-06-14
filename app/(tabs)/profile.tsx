import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;
const workoutFocusOptions = ['Strength', 'Cardio', 'Flexibility'] as const;
const fitnessGoals = ['Weight Loss', 'Muscle Gain', 'Endurance'] as const;

type FitnessLevel = typeof fitnessLevels[number];
type WorkoutFocus = typeof workoutFocusOptions[number];
type FitnessGoal = typeof fitnessGoals[number];

export default function UserProfile() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(fitnessLevels[0]);
  const [workoutFocus, setWorkoutFocus] = useState<WorkoutFocus[]>([]);
  const [goal, setGoal] = useState<FitnessGoal>(fitnessGoals[0]);
  const [workoutFrequency, setWorkoutFrequency] = useState<string>('');

  //for multi-select UI
  const toggleFocus = (focus: WorkoutFocus) => {
    setWorkoutFocus((prev) =>
      prev.includes(focus)
        ? prev.filter((f) => f !== focus)
        : [...prev, focus]
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAge(data.age || '');
          setWeight(data.weight || '');
          setHeight(data.height || '');
          setFitnessLevel(data.fitnessLevel || fitnessLevels[0]);
          setWorkoutFocus(data.workoutFocus || []);
          setGoal(data.goal || fitnessGoals[0]);
          setWorkoutFrequency(data.workoutFrequency || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const onSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const profileData = {
      age,weight,height,fitnessLevel,workoutFocus,goal,workoutFrequency,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'profiles', user.uid), profileData);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          keyboardType="number-pad"
          onChangeText={setAge}
          placeholder="Enter your age"
        />

        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          keyboardType="number-pad"
          onChangeText={setWeight}
          placeholder="Enter your weight"
        />

        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          keyboardType="number-pad"
          onChangeText={setHeight}
          placeholder="Enter your height"
        />

        <Text style={styles.label}>Fitness Level</Text>
        <View style={styles.pickerContainer}>
          {fitnessLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.pickerOption,
                fitnessLevel === level && styles.pickerOptionSelected,
              ]}
              onPress={() => setFitnessLevel(level)}>
              <Text
                style={[
                  styles.pickerOptionText,
                  fitnessLevel === level && styles.pickerOptionTextSelected,
                ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Workout Focus Areas</Text>
        <View style={styles.pickerContainer}>
          {workoutFocusOptions.map((focus) => (
            <TouchableOpacity
              key={focus}
              style={[
                styles.pickerOption,
                workoutFocus.includes(focus) && styles.pickerOptionSelected,
              ]}
              onPress={() => toggleFocus(focus)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  workoutFocus.includes(focus) && styles.pickerOptionTextSelected,
                ]}
              >
                {focus}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Fitness Goal</Text>
        <View style={styles.pickerContainer}>
          {fitnessGoals.map((g) => (
            <TouchableOpacity
              key={g}
              style={[
                styles.pickerOption,
                goal === g && styles.pickerOptionSelected,
              ]}
              onPress={() => setGoal(g)}
            >
              <Text
                style={[
                  styles.pickerOptionText,
                  goal === g && styles.pickerOptionTextSelected,
                ]}
              >
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Workout Frequency (days per week)</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="e.g. 3"
          value={workoutFrequency}
          onChangeText={setWorkoutFrequency}
        />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 20,paddingBottom: 40,backgroundColor: '#fff',},
  header: {fontSize: 32,fontWeight: '700',marginBottom: 5,textAlign: 'left',},
  label: {fontSize: 16,marginTop: 15,marginBottom: 8,fontWeight: '600',color: '#333',},
  input: {borderWidth: 1,borderColor: '#ccc',paddingHorizontal: 15,paddingVertical: 10,borderRadius: 8,fontSize: 16,},
  pickerContainer: {flexDirection: 'row',flexWrap: 'wrap',},
  pickerOption: {paddingHorizontal: 15,paddingVertical: 8,borderRadius: 20,borderWidth: 1,borderColor: '#aaa',marginRight: 10,marginBottom: 10,},
  pickerOptionSelected: {backgroundColor: '#4a90e2',borderColor: '#4a90e2',},
  pickerOptionText: {color: '#555',fontWeight: '600',},
  pickerOptionTextSelected: {color: '#fff',},
  saveButton: {marginTop: 30,backgroundColor: '#4a90e2',paddingVertical: 11,width: 280,borderRadius: 15,alignItems: 'center',borderWidth: 1,borderColor: '#ddd',alignSelf: 'center'},
  saveButtonText: {fontSize: 16,fontWeight: 'bold',color: '#f9f9f9',},
});
