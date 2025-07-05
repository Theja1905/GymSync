import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

type FitnessGoal = 'Weight Loss' | 'Muscle Gain' | 'Endurance';

type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export default function WeeklyDashboardScreen() {
  const [weeklyHours, setWeeklyHours] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [totalHours, setTotalHours] = useState(0);
  const [topExercise, setTopExercise] = useState('');
  const [exerciseCount, setExerciseCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [userGoal, setUserGoal] = useState<FitnessGoal | null>(null);
  const [workoutFreqGoal, setWorkoutFreqGoal] = useState<number | null>(null);

  // Load once on mount
  useEffect(() => {
    fetchUserGoal();
    fetchWorkoutData();
  }, []);

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchUserGoal();
      fetchWorkoutData();
    }, [])
  );

  const fetchUserGoal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserGoal(data.goal || null);
        const freq = Number(data.workoutFrequency);
        setWorkoutFreqGoal(!isNaN(freq) ? freq : null);
      }
    } catch (error) {
      console.error('Error fetching user goal:', error);
    }
  };

  const fetchWorkoutData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const today = new Date();

    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const workoutRef = collection(db, 'workouts');
    const q = query(
      workoutRef,
      where('userId', '==', user.uid),
      where('createdAt', '>=', Timestamp.fromDate(startOfWeek)),
      where('createdAt', '<=', Timestamp.fromDate(endOfWeek))
    );

    const snapshot = await getDocs(q);

    const tempHours = [0, 0, 0, 0, 0, 0, 0];
    const exerciseMap: Record<string, number> = {};
    let total = 0;
    let streak = 0;
    let lastDate = '';
    let workoutCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.();
      const durationStr = data.duration;

      if (
        createdAt &&
        durationStr &&
        createdAt >= startOfWeek &&
        createdAt <= endOfWeek
      ) {
        workoutCount++;

        const [mins, secs] = durationStr.split(':').map(Number);
        const totalMins = mins + secs / 60;
        const durationInHours = totalMins / 60;

        const day = createdAt.getDay();
        const index = day === 0 ? 6 : day - 1;

        tempHours[index] += durationInHours;
        total += durationInHours;

        if (Array.isArray(data.exercises)) {
          data.exercises.forEach((e: { name: string }) => {
            const name = e.name.toLowerCase();
            exerciseMap[name] = (exerciseMap[name] || 0) + 1;
          });
        }

        const dateStr = createdAt.toDateString();
        if (dateStr !== lastDate) {
          streak++;
          lastDate = dateStr;
        }
      }
    });

    setWeeklyHours(tempHours);
    setTotalHours(parseFloat(total.toFixed(1)));
    setCurrentStreak(streak);
    setTotalWorkouts(workoutCount);

    const top = Object.entries(exerciseMap).sort((a, b) => b[1] - a[1])[0];
    if (top) {
      setTopExercise(top[0]);
      setExerciseCount(top[1]);
    } else {
      setTopExercise('');
      setExerciseCount(0);
    }

    const earnedBadges: Badge[] = [];
    if (streak >= 7) {
      earnedBadges.push({
        id: 'oneWeekStrong',
        title: '1 Week Strong',
        description: 'You exercised 7 days in a row!',
        icon: '🏆',
      });
    }
    if (workoutCount >= 10) {
      earnedBadges.push({
        id: 'topPerformer',
        title: 'Top Performer',
        description: 'Completed 10+ workouts this week',
        icon: '🔥',
      });
    }

    setBadges(earnedBadges);
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h > 0 ? h + 'h ' : ''}${m}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Weekly Statistics</Text>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(true)}>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: weeklyHours, strokeWidth: 2 }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisSuffix="h"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: () => '#333',
            propsForDots: { r: '5', strokeWidth: '2', stroke: '#4a90e2' },
          }}
          bezier
          style={styles.chart}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Workout Duration Per Day</Text>
            {weeklyHours.map((hours, i) => (
              <Text key={i} style={styles.modalText}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}: {formatDuration(hours)}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.statsContainer}>
        <Text style={styles.statTitle}>Total Number Of Hours Of Exercise</Text>
        <Text style={styles.statValue}>{totalHours}h</Text>

        <Text style={styles.statTitle}>Most Frequently Done Exercise</Text>
        <Text style={styles.statValue}>
          {topExercise
            ? `You did ${topExercise} ${exerciseCount}x this week`
            : 'No exercises logged this week'}
        </Text>

        <Text style={styles.statTitle}>Current Streak</Text>
        <Text style={styles.statValue}>
          {currentStreak > 0
            ? `You exercised ${currentStreak} day${currentStreak > 1 ? 's' : ''} in a row!`
            : 'No exercise this week!'}
        </Text>

        {userGoal && workoutFreqGoal ? (
          <View style={styles.goalContainer}>
            <Text style={styles.statTitle}>Your Fitness Goal: {userGoal}</Text>
            <Text style={styles.statValue}>
              Workout Sessions This Week: {totalWorkouts} / {workoutFreqGoal}
            </Text>
            {totalWorkouts >= workoutFreqGoal ? (
              <Text style={styles.goalAchieved}>🎉 Goal Achieved! Keep it up!</Text>
            ) : (
              <Text style={styles.goalPending}>Keep going to meet your goal!</Text>
            )}
          </View>
        ) : null}

        <View style={styles.badgesContainer}>
          <Text style={[styles.statTitle, { marginBottom: 8 }]}>Badges Earned</Text>
          {badges.length === 0 ? (
            <Text style={{ color: '#777' }}>No badges earned yet. Keep going!</Text>
          ) : (
            badges.map(badge => (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDesc}>{badge.description}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  chart: { borderRadius: 16, marginBottom: 24 },
  statsContainer: { padding: 10 },
  statTitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  statValue: { fontSize: 16, color: '#555', marginTop: 4 },
  goalContainer: { marginTop: 20, padding: 10, backgroundColor: '#e3f2fd', borderRadius: 8 },
  goalAchieved: { color: 'green', fontWeight: '600', marginTop: 6 },
  goalPending: { color: 'orange', marginTop: 6 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 4,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  badgesContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  badgeDesc: {
    fontSize: 14,
    color: '#555',
  },
});
