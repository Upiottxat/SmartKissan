import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CROP_HEALTH_METRICS = [
  { icon: 'water-outline', label: 'Soil Moisture', value: '85%', color: '#3b82f6' },
  { icon: 'bug-outline', label: 'Pest Risk', value: 'Low', color: '#f59e0b' },
  { icon: 'leaf-outline', label: 'Growth', value: 'Good', color: '#22c55e' },
];

/**
 * @description A card to display key metrics related to crop health.
 */
const CropHealthCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="leaf-outline" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Crop Health</Text>
        </View>
        <View style={styles.healthBadge}>
          <Text style={styles.healthBadgeText}>Healthy</Text>
        </View>
      </View>
      <View style={styles.healthGrid}>
        {CROP_HEALTH_METRICS.map((metric, index) => (
          <View key={index} style={styles.healthItem}>
            <Ionicons name={metric.icon as any} size={24} color={metric.color} />
            <Text style={styles.healthLabel}>{metric.label}</Text>
            <Text style={styles.healthValue}>{metric.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  healthBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  healthItem: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    flex: 1,
  },
  healthLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  healthValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 2,
  },
});

export default CropHealthCard;
