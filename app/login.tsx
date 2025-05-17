// app/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View, } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate async login API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Login successful!');
      router.replace('/home'); // Navigate to home and remove login from history
    }, 1500);
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
          editable={!loading} //not editable when loading is true
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

      {loading ? ( //loading button if true spinner comes up
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )} 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,justifyContent: 'center',paddingHorizontal: 20,backgroundColor: '#gff',},
  inputGroup: {marginBottom: 15,},
  label: {fontSize: 16,fontWeight: '600',marginBottom: 5,color: '#333',},
  input: {height: 50,borderWidth: 1,borderColor: '#ccc',borderRadius: 8,paddingHorizontal: 10,fontSize: 16,backgroundColor: '#fff',},
});