import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * @description Header component for the dashboard screen. Displays a greeting,
 * season info, and a profile icon.
 */
const DashboardHeader = () => {
  // Dummy handler for profile press
  const handleProfilePress = () => {
    console.log('Profile icon pressed');
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Good Morning, राम जी! 🌅</Text>
          <Text style={styles.seasonInfo}>Kharif Season • Day 45</Text>
        </View>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.quickStatus}>
        <View style={styles.statusItem}>
          <Text style={styles.statusEmoji}>🌦</Text>
          <Text style={styles.statusText}>Rain Alert</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusEmoji}>🌱</Text>
          <Text style={styles.statusText}>Healthy</Text>
        </View>
        <View style={styles.statusItem}>
          <Text style={styles.statusEmoji}>💰</Text>
          <Text style={styles.statusText}>₹2,100/qtl</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  seasonInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
});

export default DashboardHeader;
