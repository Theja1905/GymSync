import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to GymSync!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={() => router.push('/login')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  buttonContainer: { marginVertical: 10, width: '60%' },
});