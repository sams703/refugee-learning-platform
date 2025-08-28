import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <LinearGradient
      colors={['#1976D2', '#1565C0']}
      style={styles.container}
    >
      <View style={styles.content}>
        <ActivityIndicator 
          size="large" 
          color="#FFFFFF" 
          style={styles.spinner}
        />
        <Text style={styles.text}>{message}</Text>
        <Text style={styles.subtitle}>
          Digital Learning Platform for Refugee and Rural Communities
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoadingScreen;
