import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// --- Feature Data ---
// This array holds the information for each feature card.
// It makes the code cleaner and easier to add or remove features later.
const features = [
  {
    icon: '🌱',
    title: 'Crop Recommendation',
    subtitle: 'फसल सुझाव',
    description: 'Recommends the best crops for your soil and weather.',
    color: '#34D399', // Emerald
  },
  {
    icon: '🧪',
    title: 'Fertilizer Suggestion',
    subtitle: 'उर्वरक सुझाव',
    description: 'Suggests fertilizers based on crop and soil NPK values.',
    color: '#FBBF24', // Amber
  },
  {
    icon: '💡',
    title: 'Farming Advice',
    subtitle: 'कृषि सलाह',
    description: 'Provides common and effective farming advice.',
    color: '#60A5FA', // Blue
  },
  {
    icon: '🐞',
    title: 'Pest & Disease Help',
    subtitle: 'कीट एवं रोग सहायता',
    description: 'Learn to prevent and manage common crop pests.',
    color: '#F87171', // Red
  },
  {
    icon: '🗓️',
    title: 'Crop Calendar',
    subtitle: 'फसल कैलेंडर',
    description: 'Know the best time to sow and harvest your crops.',
    color: '#A78BFA', // Violet
  },
];

/**
 * @description A dashboard screen for an agricultural advisor app.
 * It displays various farming-related features in a card-based layout.
 */
const CropRecommendationScreen = () => {
  return (
    <View style={[[styles.container,{marginTop:8}]]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDF4" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>


        {/* Map through the features array to render a card for each feature */}
        <View style={styles.cardContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              activeOpacity={0.7}>
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                <Text style={styles.icon}>{feature.icon}</Text>
              </View>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
</View>
  );
};

// --- Styles ---
// All styles are organized here for better readability and maintenance.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4', // A very light green for a fresh look
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14532D', // Dark green
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#166534', // Medium green
    marginTop: 4,
  },
  cardContainer: {
    paddingHorizontal: 12
    ,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    // Adding a subtle shadow for depth (iOS and Android)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Dark gray
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280', // Medium gray
    marginBottom: 8,
    fontStyle: 'italic',
        marginTop: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563', // Lighter gray
    lineHeight: 20,
  },
});

export default CropRecommendationScreen;

