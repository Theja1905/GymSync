import { Ionicons } from '@expo/vector-icons';
import {
  addDoc, collection, doc, getDoc, getDocs, query, setDoc, where, writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'] as const;
const workoutFocusOptions = ['Strength', 'Cardio', 'Flexibility'] as const;
const fitnessGoals = ['Weight Loss', 'Muscle Gain', 'Endurance'] as const;

type FitnessLevel = typeof fitnessLevels[number];
type WorkoutFocus = typeof workoutFocusOptions[number];
type FitnessGoal = typeof fitnessGoals[number];

type Template = {
  id?: string;
  name: string;
  exercises: string[];
  sets?: number[];
  reps?: number[];
  uid?: string;
  recommended?: boolean;
};

function getRecommendedTemplates(
  fitnessLevel: FitnessLevel,
  workoutFocus: WorkoutFocus[],
  goal: FitnessGoal
): Template[] {
  const templates: Template[] = [];


  // Base templates by fitness level
  const baseTemplates: Record<FitnessLevel, Template[]> = {
    Beginner: [
      {
        name: 'Bodyweight Basics',
        exercises: ['Bodyweight Squat', 'Push Ups', 'Plank'],
        sets: [3, 3, 2],
        reps: [12, 10, 30],
        recommended: true,
      },
    ],
    Intermediate: [
      {
        name: 'Intermediate Conditioning',
        exercises: ['Goblet Squat', 'Pull Ups', 'Lunges'],
        sets: [3, 3, 3],
        reps: [10, 8, 12],
        recommended: true,
      },
    ],
    Advanced: [
      {
        name: 'Advanced Strength',
        exercises: ['Deadlift', 'Bench Press', 'Barbell Row'],
        sets: [4, 4, 3],
        reps: [8, 8, 10],
        recommended: true,
      },
    ],
  };


  // Add-on templates by workout focus
  const focusTemplates: Record<WorkoutFocus, Template[]> = {
    Strength: [
      {
        name: 'Strength Builder',
        exercises: ['Deadlift', 'Bench Press', 'Barbell Row'],
        sets: [4, 4, 3],
        reps: [8, 8, 10],
        recommended: true,
      },
      {
        name: 'Power Lifts',
        exercises: ['Squat', 'Overhead Press', 'Deadlift'],
        sets: [3, 3, 3],
        reps: [5, 5, 5],
        recommended: true,
      },
    ],
    Cardio: [
      {
        name: 'Cardio Blast',
        exercises: ['Running', 'Jump Rope', 'Burpees'],
        sets: [3, 4, 3],
        reps: [30, 60, 15],
        recommended: true,
      },
      {
        name: 'HIIT Circuit',
        exercises: ['Sprints', 'Mountain Climbers', 'Jumping Jacks'],
        sets: [4, 4, 4],
        reps: [20, 30, 40],
        recommended: true,
      },
    ],
    Flexibility: [
      {
        name: 'Flexibility Flow',
        exercises: ['Yoga', 'Pilates', 'Dynamic Stretching'],
        sets: [1, 1, 1],
        reps: [60, 45, 30],
        recommended: true,
      },
      {
        name: 'Mobility Routine',
        exercises: ['Hip Circles', 'Shoulder Rolls', 'Cat-Cow Stretch'],
        sets: [2, 2, 2],
        reps: [15, 15, 15],
        recommended: true,
      },
    ],
  };


  // Add-on templates by fitness goal
  const goalTemplates: Record<FitnessGoal, Template[]> = {
    'Weight Loss': [
      {
        name: 'Fat Burner',
        exercises: ['Burpees', 'Jump Rope', 'Mountain Climbers'],
        sets: [3, 4, 3],
        reps: [15, 60, 20],
        recommended: true,
      },
      {
        name: 'Calorie Crusher',
        exercises: ['Cycling', 'Rowing', 'Jumping Jacks'],
        sets: [4, 4, 4],
        reps: [30, 30, 50],
        recommended: true,
      },
    ],
    'Muscle Gain': [
      {
        name: 'Muscle Builder',
        exercises: ['Bench Press', 'Deadlift', 'Squat'],
        sets: [4, 4, 4],
        reps: [8, 8, 8],
        recommended: true,
      },
      {
        name: 'Hypertrophy Split',
        exercises: ['Incline Dumbbell Press', 'Leg Press', 'Barbell Curl'],
        sets: [4, 3, 3],
        reps: [12, 10, 12],
        recommended: true,
      },
    ],
    Endurance: [
      {
        name: 'Endurance Booster',
        exercises: ['Running', 'Cycling', 'Rowing'],
        sets: [3, 3, 3],
        reps: [30, 30, 30],
        recommended: true,
      },
      {
        name: 'Long Distance Prep',
        exercises: ['Jogging', 'Swimming', 'Elliptical'],
        sets: [3, 3, 3],
        reps: [40, 30, 30],
        recommended: true,
      },
    ],
  };


  // Add base
  templates.push(...baseTemplates[fitnessLevel]);


  // Add 1-2 focus templates per focus selected (limit 2 per focus)
  workoutFocus.forEach((focus) => {
    templates.push(...focusTemplates[focus].slice(0, 2));
  });


  // Add up to 2 goal templates
  templates.push(...goalTemplates[goal].slice(0, 2));


  // Remove duplicates by template name
  const uniqueTemplates = Array.from(
    new Map(templates.map((t) => [t.name, t])).values()
  );


  // Limit total to max 4 templates
  return uniqueTemplates.slice(0, 4);
}

export default function UserProfile() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(fitnessLevels[0]);
  const [workoutFocus, setWorkoutFocus] = useState<WorkoutFocus[]>([]);
  const [goal, setGoal] = useState<FitnessGoal>(fitnessGoals[0]);
  const [workoutFrequency, setWorkoutFrequency] = useState('');

  const toggleFocus = (focus: WorkoutFocus) => {
    setWorkoutFocus((prev) =>
      prev.includes(focus) ? prev.filter((f) => f !== focus) : [...prev, focus]
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
      age,
      weight,
      height,
      fitnessLevel,
      workoutFocus,
      goal,
      workoutFrequency,
      updatedAt: new Date().toISOString(),
    };


    try {
      // Save profile
      await setDoc(doc(db, 'profiles', user.uid), profileData);


      // Generate recommended templates
      const recommendedTemplates = getRecommendedTemplates(fitnessLevel, workoutFocus, goal);


      // Reference to templates collection
      const templatesRef = collection(db, 'templates');


      // Fetch current user's templates
      const q = query(templatesRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);


      // Initialize batch
      const batch = writeBatch(db);


      // Delete old recommended templates for this user
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.recommended === true) {
          batch.delete(doc(db, 'templates', docSnap.id));
        }
      });


      await batch.commit();


      // Add new recommended templates
      for (const template of recommendedTemplates) {
        await addDoc(templatesRef, {
          ...template,
          uid: user.uid,
          recommended: true,
        });
      }


      Alert.alert('Success', 'Profile and Recommended Templates saved!');
    } catch (error) {
      console.error('Error saving profile or templates:', error);
      Alert.alert('Error', 'Failed to save profile or templates.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.label}>Age</Text>
          </View>
          <TextInput
            style={styles.input}
            value={age}
            keyboardType="number-pad"
            onChangeText={setAge}
            placeholder="Enter your age"
          />

          <View style={styles.inputGroup}>
            <Ionicons name="scale-outline" size={20} color="#666" />
            <Text style={styles.label}>Weight (kg)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={weight}
            keyboardType="number-pad"
            onChangeText={setWeight}
            placeholder="Enter your weight"
          />

          <View style={styles.inputGroup}>
            <Ionicons name="body-outline" size={20} color="#666" />
            <Text style={styles.label}>Height (cm)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={height}
            keyboardType="number-pad"
            onChangeText={setHeight}
            placeholder="Enter your height"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Ionicons name="fitness-outline" size={20} color="#666" />
            <Text style={styles.label}>Fitness Level</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {fitnessLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.pickerOptionSmall,
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
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Ionicons name="flash-outline" size={20} color="#666" />
            <Text style={styles.label}>Workout Focus Areas</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {workoutFocusOptions.map((focus) => (
              <TouchableOpacity
                key={focus}
                style={[
                  styles.pickerOptionSmall,
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
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Ionicons name="flag-outline" size={20} color="#666" />
            <Text style={styles.label}>Fitness Goal</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
            {fitnessGoals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.pickerOptionSmall,
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
          </ScrollView>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Ionicons name="repeat-outline" size={20} color="#666" />
            <Text style={styles.label}>Workout Frequency (Workouts per week)</Text>
          </View>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="e.g. 3"
            value={workoutFrequency}
            onChangeText={setWorkoutFrequency}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f8fc' },
  container: { paddingVertical: 25, paddingHorizontal: 20, paddingBottom: 40 },
  header: { fontSize: 34, fontWeight: '700', marginBottom: 20, color: '#222' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    backgroundColor: '#f0f3f7',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#222',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d1d9e6',
  },
  scrollRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  pickerOptionSmall: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fafbfc',
    marginRight: 10,
  },
  pickerOptionSelected: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
    elevation: 4,
  },
  pickerOptionText: {
    color: '#555',
    fontWeight: '600',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 15,
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#3a6ad9',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
