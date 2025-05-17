import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;
const workoutFocusOptions = ['Strength', 'Cardio', 'Flexibility'] as const;

type FitnessLevel = typeof fitnessLevels[number];
type WorkoutFocus = typeof workoutFocusOptions[number];

export default function UserProfile() {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(fitnessLevels[0]);
  const [workoutFocus, setWorkoutFocus] = useState<WorkoutFocus[]>([]);

  // Toggle selection of workout focus
  const toggleFocus = (focus: WorkoutFocus) => {
    if (workoutFocus.includes(focus)) {
      setWorkoutFocus(workoutFocus.filter((f) => f !== focus));
    } else {
      setWorkoutFocus([...workoutFocus, focus]);
    }
  };

  const onSave = () => {
    const profileData = { age, weight, height, fitnessLevel, workoutFocus };
    console.log('Profile saved:', profileData);
     Alert.alert('Success', 'Profile saved successfully!');
    // TODO: Save to context or AsyncStorage
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>User Profile</Text>

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
            onPress={() => setFitnessLevel(level)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                fitnessLevel === level && styles.pickerOptionTextSelected,
              ]}
            >
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

      <Button title="Save Profile" onPress={onSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 10,
    marginBottom: 10,
  },
  pickerOptionSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  pickerOptionText: {
    color: '#555',
    fontWeight: '600',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
});

