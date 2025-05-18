// app/home.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.welcomeText}>
          Welcome to GymSync where Goals meet Growth!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#fff',},
  centered: {flex: 1,justifyContent: 'center',alignItems: 'center',paddingHorizontal: 20,},
  welcomeText: {fontSize: 18,textAlign: 'center',},
});
