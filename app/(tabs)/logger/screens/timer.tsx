import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../../firebase';

export default function TimerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { routineTitle, exercises } = params;
  const parsedExercises = exercises ? JSON.parse(exercises as string) : [];

  // Parse seconds and isRunning from params, fallback to defaults
  const initialSeconds = params.seconds ? parseInt(params.seconds as string) : 0;
  const initialIsRunning = params.isRunning === 'false' ? false : true;

  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [restSeconds, setRestSeconds] = useState(60);

  useEffect(() => {
    if (params.isRunning !== undefined) {
      setIsRunning(params.isRunning === 'true');
    }
    if (params.seconds !== undefined) {
      const sec = parseInt(params.seconds as string);
      if (!isNaN(sec)) setSeconds(sec);
    }
  }, [params.isRunning, params.seconds]);

  useFocusEffect(
    useCallback(() => {
      if (!isRunning) return;

      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, [isRunning])
  );

  const formatTime = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handlePause = () => {
    setIsRunning(false);
    router.push({
      pathname: '/(tabs)/logger/screens/rest',
      params: {
        restSeconds: restSeconds.toString(),
        seconds: seconds.toString(),
        routineTitle,
        exercises,
      },
    });
  };

  const handleFinishWorkout = async () => {
    setIsRunning(false);
    try {
      await addDoc(collection(db, 'workouts'), {
        routineTitle,
        exercises: parsedExercises,
        duration: Math.floor(seconds / 60), // store as minutes
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

      <View style={styles.timerDisplay}>
        <MaterialCommunityIcons name="timer-outline" size={40} color="#4a90e2" />
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      {/* Exercise List */}
      {parsedExercises.map((ex: any, index: number) => (
        <Text key={index} style={styles.exerciseText}>
          {ex.name} - {ex.sets} sets × {ex.reps} reps
        </Text>
      ))}

      <View style={styles.restSection}>
        <Text style={styles.restLabel}>Select Rest Duration</Text>
        <View style={styles.restOptions}>
          {[30, 60, 90].map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.restButton,
                restSeconds === time && styles.restButtonSelected,
              ]}
              onPress={() => setRestSeconds(time)}
            >
              <Text style={styles.restButtonText}>{time}s</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isRunning && (
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseText}>Pause for Rest</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout}>
        <Text style={styles.finishText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 170,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  restSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  restLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  restOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  restButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  restButtonSelected: {
    backgroundColor: '#2196f3',
  },
  restButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#7e57c2',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 30,
    marginBottom: 20,
  },
  pauseText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#3a8a43',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  finishText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
