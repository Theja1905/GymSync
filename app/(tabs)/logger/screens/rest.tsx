import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const duration = params.restSeconds ? parseInt(params.restSeconds as string) : 60;
  const seconds = params.seconds ? parseInt(params.seconds as string) : 0;
  const routineTitle = params.routineTitle;
  const exercises = params.exercises;

  const [countdown, setCountdown] = useState(duration);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) {
      router.replace({
        pathname: '/(tabs)/logger/screens/timer',
        params: {
          seconds: seconds.toString(),
          isRunning: 'true',
          routineTitle,
          exercises,
        },
      });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finished, router, seconds, routineTitle, exercises]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSkipRest = () => {
    router.replace({
      pathname: '/(tabs)/logger/screens/timer',
      params: {
        seconds: seconds.toString(),
        isRunning: 'true',
        routineTitle,
        exercises,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rest Time</Text>
      <Text style={styles.countdown}>{formatTime(countdown)}</Text>
      <Text style={styles.info}>Auto-resuming workout after rest ends</Text>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkipRest}>
        <Text style={styles.skipText}> Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4a90e2',
  },
  countdown: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  info: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 30,
    backgroundColor: '#e53935',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
