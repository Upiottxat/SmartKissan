import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QUICK_ACTIONS = [
  { icon: 'calendar-outline', label: 'Schedule Task' },
  { icon: 'chatbubble-ellipses-outline', label: 'Ask Expert' },
];

/**
 * @description A component displaying quick action buttons for common tasks.
 */
const QuickActions = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name={action.icon as any} size={24} color="#4b5563" />
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default QuickActions;
