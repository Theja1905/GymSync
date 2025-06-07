import React, { useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, } from 'react-native';

type Template = {
  id: string;
  name: string;
  exercises: string[];
  sets?: number[];
};

const myTemplates: Template[] = [
  {
    id: '1',
    name: 'Night Workout',
    exercises: ['Bench Press', 'Squat', 'Leg Extension', 'Deadlift'],
    sets: [4, 5, 3, 4],
  },
];

const exampleTemplates: Template[] = [
  {
    id: '2',
    name: 'Back and Biceps',
    exercises: ['Deadlift', 'Seated Row', 'Lat Pulldown'],
  },
  {
    id: '3',
    name: 'Legs',
    exercises: ['Squat', 'Leg Extension', 'Flat Leg Raise'],
  },
];

export default function TemplatesScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>Templates</Text>

        <Pressable style={styles.templateButton} onPress={() => { /* handle create template */ }}>
          <Text style={styles.templateButtonText}>Create your own Template</Text>
        </Pressable>

        <Text style={styles.sectionHeader}>My Templates</Text>
        {myTemplates.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => openTemplate(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.exercises.join(', ')}</Text>
          </Pressable>
        ))}

        <Text style={styles.sectionHeader}>Example Templates</Text>
        {exampleTemplates.map((item) => (
          <Pressable key={item.id} style={styles.card} onPress={() => openTemplate(item)}>
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
                <Text style={styles.columnHeader}>Exercises</Text>
                {selectedTemplate?.exercises.map((exercise, index) => (
                  <Text key={index}>{`${index + 1} x ${exercise}`}</Text>
                ))}
              </View>
              {selectedTemplate?.sets && (
                <View style={styles.column}>
                  <Text style={styles.columnHeader}>No. of Sets</Text>
                  {selectedTemplate.sets.map((set, index) => (
                    <Text key={index}>{set}</Text>
                  ))}
                </View>
              )}
            </View>
            <Pressable style={styles.startButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.startButtonText}>Start Workout</Text>
            </Pressable>
            <Text
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              ✕
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1,backgroundColor: '#fff',},
  container: {padding: 20,},
  pageTitle: {fontSize: 32,fontWeight: 'bold',marginBottom: 16,},
  templateButton: {backgroundColor: '#4a90e2',paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12,alignItems: 'center',marginBottom: 24,},
  templateButtonText: {color: '#fff',fontSize: 16,fontWeight: '600',},
  sectionHeader: {fontWeight: 'bold',fontSize: 18,marginBottom: 8,},
  card: {backgroundColor: '#f2f2f2',padding: 12,borderRadius: 8,marginBottom: 12,},
  cardTitle: {fontWeight: 'bold',fontSize: 16,},
  cardSub: {marginTop: 4,color: '#555'},
  modalOverlay: {flex: 1,backgroundColor: 'rgba(0,0,0,0.4)',justifyContent: 'center',alignItems: 'center',},
  modal: {backgroundColor: '#fff',borderRadius: 16,padding: 20,width: '90%',position: 'relative',},
  modalTitle: {fontSize: 20,fontWeight: 'bold',marginBottom: 12,},
  modalContent: {flexDirection: 'row',justifyContent: 'space-between',marginBottom: 20,},
  column: {flex: 1,},
  columnHeader: {fontWeight: 'bold',marginBottom: 8,},
  startButton: {backgroundColor: '#4a90e2',paddingVertical: 12,borderRadius: 12,alignItems: 'center',marginTop: 8,},
  startButtonText: {color: '#fff',fontWeight: '600',},
  modalClose: {position: 'absolute',top: 10,right: 16,fontSize: 20,color: '#999',},
});
