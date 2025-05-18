import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Welcome to GymSync!',
        }}
      />
      <View style={styles.container}>
        <Image
          source={require('../assets/images/homescreen.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Welcome to GymSync</Text>
        <Text style={styles.subtitle}>where goals meet growth</Text>

        {/* LOG IN Button */}
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        {/* SIGN UP Button */}
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20,backgroundColor: '#FFFFFF',},
  title: {fontSize: 25, marginBottom: 5, fontWeight: 'bold',},
  subtitle: {fontSize: 16, marginBottom: 20, color: '#555',},
  image: {width: 300, height: 300, marginBottom: 20, resizeMode: 'contain',},
  button: {width: '60%',paddingVertical: 12,borderRadius: 25,alignItems: 'center',marginVertical: 10,},
  loginButton: {backgroundColor: '#191970',},
  signupButton: {backgroundColor: '#4B0082',},
  buttonText: {color: 'white',fontSize: 16,fontWeight: '600',},
});
