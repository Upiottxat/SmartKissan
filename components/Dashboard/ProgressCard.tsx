import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description A card that visualizes the user's progress on farm care tasks.
 */
const ProgressCard = () => {
  const progressPercentage = '60%'; // Example progress
  const completedTasks = 3;
  const totalTasks = 5;

  return (
    <View style={styles.card}>
      <View style={styles.progressHeader}>
        <Text style={styles.cardTitle}>Farm Care Progress</Text>
        <Text style={styles.progressCount}>
          {completedTasks}/{totalTasks} completed
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progressPercentage }]} />
      </View>

      <Text style={styles.progressMessage}>
        🌱 You're doing great! Complete {totalTasks - completedTasks} more tasks to earn the "Dedicated Farmer"
        badge.
      </Text>
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  progressCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden', // Ensures the fill stays within the bounds
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  progressMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});

export default ProgressCard;
