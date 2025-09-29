import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * @description Displays crop recommendations based on soil and weather data.
 * Currently shows placeholder data.
 */
const CropRecommendationScreen = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🌱 Crop Recommendations</Text>
      <View style={styles.card}>
        <Text style={styles.recommendationText}>
          Based on your soil and weather: Rice, Maize
        </Text>
        <Text style={styles.placeholderText}>
          (Later replaced with JSON/ML logic)
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#6b7280',
    marginTop: 6,
  },
});

export default CropRecommendationScreen;
