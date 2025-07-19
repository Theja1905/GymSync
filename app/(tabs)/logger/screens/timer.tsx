import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../../firebase';

export default function TimerScreen() {
  const router = useRouter();
  const { routineTitle, exercises, seconds: secondsParam, isRunning: isRunningParam } = useLocalSearchParams();

  // Parse exercises JSON string to array
  const parsedExercises = exercises ? JSON.parse(exercises as string) : [];

  // Parse seconds and isRunning from params or default
  const initialSeconds = secondsParam ? parseInt(secondsParam as string) : 0;
  const initialIsRunning = isRunningParam === 'false' ? false : true;

  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [restSeconds, setRestSeconds] = useState(60); // default rest duration

  // Start timer if isRunning is true, increment seconds every second
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Pause button navigates to RestScreen with current timer state and restSeconds
  const handlePause = () => {
    setIsRunning(false);
    router.push({
      pathname: '/(tabs)/logger/screens/rest',
      params: {
        restSeconds: restSeconds.toString(),
        seconds: seconds.toString(),
        routineTitle,
        exercises: JSON.stringify(parsedExercises),
      },
    });
  };

  // Finish workout: save data and navigate back to logger
  const handleFinishWorkout = async () => {
    setIsRunning(false);

    try {
      await addDoc(collection(db, 'workouts'), {
        routineTitle,
        exercises: parsedExercises,
        duration: formatTime(seconds),
        durationSeconds: seconds, 
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
        <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      </View>

      {/* Exercise List */}
      {parsedExercises.map((ex: any, index: number) => (
        <Text key={index} style={styles.exerciseText}>
          {ex.name} - {ex.sets} sets × {ex.reps} reps
        </Text>
      ))}

      {/* Rest duration selection */}
      <View style={styles.restSection}>
        <Text style={styles.restLabel}>Select Rest Duration</Text>
        <View style={styles.restOptions}>
          {[30, 60, 90].map(time => (
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

      {/* Pause for Rest Button */}
      {isRunning && (
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <Text style={styles.pauseText}>Pause for Rest</Text>
        </TouchableOpacity>
      )}

      {/* Finish Workout Button */}
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#222',
  },
  timerDisplay: {
    marginBottom: 30,
  },
  timerText: {
    fontSize: 75,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  exerciseText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  restSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  restLabel: {
    fontSize: 16,
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
    paddingHorizontal: 90,
    borderRadius: 30,
    marginBottom: 15,
    marginTop: 40,
  },
  pauseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#3a8a43',
    paddingVertical: 12,
    paddingHorizontal: 90,
    borderRadius: 30,
  },
  finishText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
