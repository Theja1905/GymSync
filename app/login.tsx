import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      setLoading(false);
      Alert.alert('Success', 'Login successful!');
      router.replace('/(tabs)/profile'); 
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        Alert.alert('Login Failed', err.message);
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred.');
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4B0082" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      )}

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/signup')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'flex-start', paddingTop: 25, paddingHorizontal: 20,backgroundColor: '#FFFFFF',},
  inputGroup: {marginBottom: 15,},
  label: {fontSize: 16,fontWeight: '600',marginBottom: 5,color: '#333',},
  input: {height: 50,borderWidth: 1,borderColor: '#ccc',borderRadius: 8,paddingHorizontal: 10,fontSize: 15,backgroundColor: '#fff',},
  loginButton: {backgroundColor: '#191970',paddingVertical: 12,borderRadius: 30,alignItems: 'center',marginTop: 10,},
  loginButtonText: {color: 'white',fontSize: 16,fontWeight: 'bold',},
  signupContainer: {flexDirection: 'row',justifyContent: 'center',marginTop: 20,},
  signupText: {fontSize: 15,color: '#333',},
  signupLink: {fontSize: 15,color: '#191970',fontWeight: 'bold',},
});