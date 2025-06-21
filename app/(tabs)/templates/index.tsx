import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { db } from '../../../firebase';

type Template = {
  id: string;
  name: string;
  exercises: string[];
  sets?: number[];
  reps?: number[];
};

const exampleTemplates: Template[] = [
  {
    id: '2',
    name: 'Back and Biceps',
    exercises: ['Deadlift', 'Seated Row', 'Lat Pulldown'],
    sets: [4, 3, 4],
    reps: [6, 10, 12],
  },
  {
    id: '3',
    name: 'Legs',
    exercises: ['Squat', 'Leg Extension', 'Flat Leg Raise'],
    sets: [5, 4, 3],
    reps: [8, 10, 15],
  },
  {
    id: '4',
    name: 'Chest and Triceps',
    exercises: ['Bench Press', 'Tricep Dips', 'Push Ups'],
    sets: [4, 3, 5],
    reps: [8, 12, 15],
  },
  {
    id: '5',
    name: 'Shoulders and Abs',
    exercises: ['Overhead Press', 'Lateral Raise', 'Plank'],
    sets: [4, 4, 3],
    reps: [10, 12, 30],
  },
  {
    id: '6',
    name: 'Full Body',
    exercises: ['Squat', 'Deadlift', 'Push Ups', 'Pull Ups', 'Burpees'],
    sets: [3, 4, 5, 4, 3],
    reps: [10, 8, 15, 6, 20],
  },
];

export default function TemplatesScreen() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);

  const openTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setModalVisible(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchTemplates = async () => {
        const snapshot = await getDocs(collection(db, 'templates'));
        const templates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Template[];

        setMyTemplates(templates);
      };

      fetchTemplates();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Templates</Text>

        <Pressable
          style={styles.templateButton}
          onPress={() => router.push('/templates/create')}
        >
          <Text style={styles.templateButtonText}>Create your own Template</Text>
        </Pressable>

        <Text style={styles.sectionHeader}>My Templates</Text>
        {myTemplates.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openTemplate(item)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.exercises.join(', ')}</Text>
          </Pressable>
        ))}

        <Text style={styles.sectionHeader}>Example Templates</Text>
        {exampleTemplates.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openTemplate(item)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.exercises.join(', ')}</Text>
          </Pressable>
        ))}

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{selectedTemplate?.name}</Text>
            <View style={styles.modalContent}>
              <View style={styles.column}>
                <Text style={styles.columnHeader}>Exercise</Text>
                {selectedTemplate?.exercises.map((exercise, index) => (
                  <Text key={index}>{exercise}</Text>
                ))}
              </View>
              {selectedTemplate?.sets && (
                <View style={styles.column}>
                  <Text style={styles.columnHeader}>Sets</Text>
                  {selectedTemplate.sets.map((set, index) => (
                    <Text key={index}>{set}</Text>
                  ))}
                </View>
              )}
              {selectedTemplate?.reps && (
                <View style={styles.column}>
                  <Text style={styles.columnHeader}>Reps</Text>
                  {selectedTemplate.reps.map((rep, index) => (
                    <Text key={index}>{rep}</Text>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              style={styles.startButton}
              onPress={() => {
                setModalVisible(false);

                if (!selectedTemplate) return;

                const routineExercises = selectedTemplate.exercises.map((name, i) => ({
                  name,
                  sets: selectedTemplate.sets?.[i] ?? '',
                  reps: selectedTemplate.reps?.[i] ?? '',
                }));

                router.push({
                  pathname: '/logger/screens/timer',
                  params: {
                    routineTitle: selectedTemplate.name,
                    exercises: JSON.stringify(routineExercises),
                  },
                });
              }}
            >
              <Text style={styles.startButtonText}>Start Workout</Text>
            </Pressable>

            <Text style={styles.modalClose} onPress={() => setModalVisible(false)}>
              ✕
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  pageTitle: { fontSize: 34, fontWeight: 'bold', marginBottom: 16 },
  templateButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  templateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionHeader: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardSub: { marginTop: 4, color: '#555' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    position: 'relative',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: { flex: 1 },
  columnHeader: { fontWeight: 'bold', marginBottom: 8 },
  startButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: { color: '#fff', fontWeight: '600' },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 16,
    fontSize: 20,
    color: '#999',
  },
});
