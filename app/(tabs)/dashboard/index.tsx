import { Ionicons } from '@expo/vector-icons';
import { Timestamp, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../../../firebase';

const screenWidth = Dimensions.get('window').width;

type FitnessGoal = 'Weight Loss' | 'Muscle Gain' | 'Endurance';

type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

// StatCard component integrated here
function StatCard({
  iconName,
  iconBgColor,
  statLabel,
  statValue,
  progressPercent,
  progressColor,
  unit,
}: {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconBgColor: string;
  statLabel: string;
  statValue: string | number;
  progressPercent?: number; // optional
  progressColor?: string;
  unit?: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.iconWrapper}>
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <Ionicons name={iconName} size={24} color={progressColor || '#000'} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.statValue}>
            {statValue}
            {unit && <Text style={styles.unitText}>{unit}</Text>}
          </Text>
          <Text style={styles.statLabel}>{statLabel}</Text>
        </View>
      </View>

      {progressPercent !== undefined && progressColor && (
        <>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: progressColor },
              ]}
            />
          </View>
          <Text style={[styles.progressPercent, { color: progressColor }]}>
            {Math.round(progressPercent)}%
          </Text>
        </>
      )}
    </View>
  );
}

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

  useEffect(() => {
    fetchUserGoal();
    fetchWorkoutData();
  }, []);

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
    const day = today.getDay(); // 0 = Sunday
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeekUTC = new Date(startOfWeek.getTime() - startOfWeek.getTimezoneOffset() * 60000);
    const endOfWeekUTC = new Date(endOfWeek.getTime() - endOfWeek.getTimezoneOffset() * 60000);

    const workoutRef = collection(db, 'workouts');
    const q = query(
      workoutRef,
      where('userId', '==', user.uid),
      where('createdAt', '>=', Timestamp.fromDate(startOfWeekUTC)),
      where('createdAt', '<=', Timestamp.fromDate(endOfWeekUTC))
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

      if (createdAt && durationStr && createdAt >= startOfWeekUTC && createdAt <= endOfWeekUTC) {
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
    setTopExercise(top?.[0] || '');
    setExerciseCount(top?.[1] || 0);

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
      <Text style={styles.title}>Weekly Progress</Text>

      <TouchableOpacity activeOpacity={0.8} onPress={() => setModalVisible(true)}>
        <LineChart
          data={{
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{ data: weeklyHours, strokeWidth: 2 }],
          }}
          width={screenWidth - 32}
          height={250}
          yAxisSuffix="h"
          withInnerLines={false}
          withOuterLines={true}
          chartConfig={{
            backgroundGradientFrom: '#f9f9f9',
            backgroundGradientTo: '#f9f9f9',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: () => '#333',
            propsForDots: { r: '5', strokeWidth: '2', stroke: '#2196f3' },
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
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.statsContainer}>
        <View style={styles.row}>
          <StatCard
            iconName="timer-outline"
            iconBgColor="#dde9fc"
            statLabel="Total Hours"
            statValue={totalHours.toFixed(1)}
            unit="h"
            progressPercent={Math.min((totalHours / 20) * 100, 100)}
            progressColor="#3b82f6"
          />
          <StatCard
            iconName="flame-outline"
            iconBgColor="#fee2e2"
            statLabel="Current Streak"
            statValue={currentStreak}
            progressPercent={Math.min((currentStreak / 7) * 100, 100)}
            progressColor="#ef4444"
          />
        </View>

        <View style={styles.row}>
          <StatCard
            iconName="barbell-outline"
            iconBgColor="#d1fae5"
            statLabel="Top Exercise"
            statValue={topExercise ? `${topExercise} (${exerciseCount}x)` : '—'}
          />
        </View>

        {userGoal && workoutFreqGoal && (
          <View style={styles.row}>
            <StatCard
              iconName="list-outline"
              iconBgColor="#fde68a"
              statLabel="Workout Target"
              statValue={`${totalWorkouts} / ${workoutFreqGoal}`}
              progressPercent={Math.min((totalWorkouts / workoutFreqGoal) * 100, 100)}
              progressColor={totalWorkouts >= workoutFreqGoal ? '#22c55e' : '#f97316'}
            />
          </View>
        )}

        <View style={styles.row}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.statTitle}>🏅 Badges</Text>
            {badges.length === 0 ? (
              <Text style={{ color: '#777' }}>None yet</Text>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  chart: {
    borderRadius: 16,
    marginBottom: 24,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statsContainer: { paddingBottom: 32 },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: { fontSize: 16, fontWeight: '600' },
  statValue: { fontSize: 16, color: '#555', marginTop: 4 },
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
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalText: { fontSize: 16, marginVertical: 4 },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
  },
  closeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  badgeIcon: { fontSize: 32 },
  badgeTitle: { fontWeight: '700', fontSize: 16 },
  badgeDesc: { fontSize: 14, color: '#555' },

  // Styles for StatCard:
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    marginLeft: 12,
    flexShrink: 1,
  },
  unitText: {
    fontSize: 14,
    color: '#555',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 14,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressPercent: {
    marginTop: 6,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'right',
  },
});
