import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <>
      {/* Set screen options here */}
      <Stack.Screen
        options={{
          title: 'WELCOME!',  // Custom title here
        }}
      />
      <View style={styles.container}>
        <Image
        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/029/128/904/original/cute-cat-wave-hand-cartoon-doodle-flat-style-png.png' }}  // Add this
        style={styles.image}
      /> 
        <Text style={styles.title}>Hello! Let's Get Started!</Text>
        <View style={styles.buttonContainer}> 
          <Button title="LOG IN" onPress={() => router.replace('/login')} /> 
        </View>
        <View style={styles.buttonContainer}>
          <Button title="SIGN UP" onPress={() => router.push('/signup')} />
        </View>
      </View>
    </>
  );
} // reminder: router.push is allows the screens to stack up so you can go back 
// but router.replace means you cant go back to prev page

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  image: {width: 190, height: 100, marginBottom: 20, resizeMode: 'contain'},
  buttonContainer: { marginVertical: 10, width: '60%' },
});
