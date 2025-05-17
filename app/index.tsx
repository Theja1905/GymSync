import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <>
      {/* Set screen options here */}
      <Stack.Screen
        options={{
          title: 'Welcome!!',  // Custom title here
          // headerShown: false,        // Uncomment this line if you want to hide the header entirely
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Hello!! Let's Get Started!</Text>
        <View style={styles.buttonContainer}>
          <Button title="Log In" onPress={() => router.push('/login')} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={() => router.push('/signup')} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  buttonContainer: { marginVertical: 10, width: '60%' },
});
