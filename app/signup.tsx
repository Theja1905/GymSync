import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // 👈 Update this to match your Firebase init path


export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }


    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }


    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase signup successful:', userCredential.user);


      Alert.alert('Success', 'Signup successful!');
      router.push('/login');
    } catch (error: any) {
      console.error('❌ Firebase signup error:', error);
      Alert.alert('Signup failed', error.message || 'Something went wrong');
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>


      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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
        />
      </View>


      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>


      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>


      <View style={styles.loginRedirect}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#fff' },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 4, fontWeight: '500', color: '#333' },
  input: { height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, borderColor: '#ccc', backgroundColor: '#fff', fontSize: 16 },
  button: { backgroundColor: '#4b0082', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  loginRedirect: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 16, color: '#333' },
  loginLink: { fontSize: 16, fontWeight: 'bold', color: '#4b0082' },
});


