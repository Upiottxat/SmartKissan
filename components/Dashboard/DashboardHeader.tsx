import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileModel from '../models/ProfileModel';

/**
 * @description Header component for the dashboard screen. Displays a greeting,
 * season info, and a profile icon.
 */
const DashboardHeader = () => {
  const [showProfileModel, setShowProfileModel] = useState(false)
  const handleProfilePress = () => {
    setShowProfileModel((prev)=>!prev)
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View>
          <Text style={styles.greeting}>Good Morning, राम-राम जी! 🌅</Text>
          <Text style={styles.seasonInfo}>Kharif Season • Day 45</Text>
        </View>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        
        <Modal
          animationType='slide'
          transparent={true}
          visible={showProfileModel}
          onRequestClose={()=>{
            handleProfilePress()
          }}

        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowProfileModel(false)}>
              <Ionicons name="arrow-back" size={28} color="#222" />
            </TouchableOpacity>

            <ProfileModel />
          </View>
        </Modal>

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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',

  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },


});

export default DashboardHeader;
