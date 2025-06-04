import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TimerScreen() {
  const router = useRouter();
  const { routineTitle, exercises } = useLocalSearchParams();

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins} : ${secs}`;
  };

  const handleFinishWorkout = () => {
    // Pass workout summary to logger
    router.push({
      pathname: '/logger',
      params: {
        routineTitle,
        exercises,
        duration: formatTime(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Ongoing</Text>

      <View style={styles.iconWrapper}>
        <Image
          source={{ uri: 'https://static.vecteezy.com/system/resources/previews/019/923/746/non_2x/clock-face-icon-black-and-white-transparent-background-free-png.png' }}
          style={styles.clockIcon}
        />
        <Image
          source={{ uri: 'https://icon-library.com/images/dumbbell-icon-png/dumbbell-icon-png-27.jpg' }}
          style={[styles.weightIcon, { marginLeft: 15 }]}
        />
      </View>

      <View style={styles.timerWrapper}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>

      <TouchableOpacity
        style={styles.finishButton}
        onPress={handleFinishWorkout}
      >
        <Text style={styles.finishText}>Finish Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 35, fontWeight: 'bold', marginBottom: 20},
  iconWrapper: {flexDirection: 'column',marginBottom: 30,justifyContent: 'center',alignItems: 'center',},
  clockIcon: {width: 130,height: 130,resizeMode: 'contain',marginBottom: -30,},
  weightIcon: {width: 130,height: 130,resizeMode: 'contain',marginLeft: 15,},
  timerWrapper: {backgroundColor: '#e0e0e0',paddingVertical: 10,paddingHorizontal: 30,borderRadius: 25,marginBottom: 40,},
  timerText: {fontSize: 32,fontWeight: '600',color: '#333',},
  finishButton: {backgroundColor: '#28a745',paddingVertical: 14,paddingHorizontal: 40,borderRadius: 25,},
  finishText: {color: '#fff',fontSize: 16,fontWeight: '600',},
});
