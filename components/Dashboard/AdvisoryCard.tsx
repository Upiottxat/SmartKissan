import { useTodayAdisory } from '@/hooks/useTodayAdisory';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * @description A card component that displays a brief advisory tip and navigates
 * to the full advisory screen on press.
 */
const AdvisoryCard = () => {
  const router = useRouter();
  const {Advisory,loading} =useTodayAdisory();

  return (
    <TouchableOpacity
      style={styles.advisoryCard}
      onPress={() => router.push('/(tabs)/Advisory')}
      activeOpacity={0.7}
    >
      <View style={styles.upperView}>
        {loading?<ActivityIndicator size={10}></ActivityIndicator>:<Text>✅</Text>}

        </View>
      <View  style={styles.lowerView}>
              <View style={styles.advisoryIconContainer}>
        <Ionicons name="bulb-outline" size={24} color="#d97706" />
      </View>
      <View style={styles.advisoryContent}>
        <Text style={styles.advisoryTitle}>Today's Advisory</Text>
        <Text style={styles.advisoryText}>
         {Advisory}
        </Text>
        <View style={styles.advisoryButton}>
          <Text style={styles.advisoryButtonText}>Get Full Advisory</Text>
          <Ionicons name="arrow-forward" size={16} color="#16a34a" />
        </View>
      </View>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  advisoryCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'center',
    elevation: 3,
  },
  advisoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  advisoryContent: {
    flex: 1,
  },
  advisoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b45309',
  },
  advisoryText: {
    fontSize: 14,
    color: '#78350f',
    marginVertical: 4,
    lineHeight: 20,
  },
  advisoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  advisoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
    marginRight: 4,
  },
  lowerView:{
    flexDirection:'row'
  },
    upperView:{
      flex:1,
      width:'100%',
      justifyContent:'flex-end',
      alignItems:'flex-end',
  }
});

export default AdvisoryCard;
