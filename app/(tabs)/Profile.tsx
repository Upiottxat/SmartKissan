import { StorageContext } from '@/Context/StorageContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


import { SafeAreaView } from 'react-native-safe-area-context';
interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

interface Stat {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface Activity {
  action: string;
  time: string;
  icon: string;
}
  const achievements: Achievement[] = [
    { id: 1, name: 'Water Saver', icon: '💧', description: 'Saved 30% water this season', earned: true },
    { id: 2, name: 'Healthy Crops', icon: '🌱', description: 'Maintained 95% crop health', earned: true },
    { id: 3, name: 'Community Helper', icon: '🤝', description: 'Helped 10+ farmers', earned: true },
    { id: 4, name: 'Early Adopter', icon: '⚡', description: 'Tried 3+ new techniques', earned: false },
    { id: 5, name: 'Expert Advisor', icon: '🎓', description: 'Provide expert advice', earned: false },
  ];

  const stats: Stat[] = [
    { label: 'Seasons Tracked', value: '3', icon: 'calendar-outline', color: '#2196F3' },
    { label: 'Yield Improvement', value: '+15%', icon: 'trending-up-outline', color: '#4CAF50' },
    { label: 'Water Saved', value: '30%', icon: 'leaf-outline', color: '#2196F3' },
    { label: 'Community Points', value: '245', icon: 'star-outline', color: '#FF9800' },
  ];

  const recentActivity: Activity[] = [
    { action: 'Completed irrigation task', time: '2 hours ago', icon: '💧' },
    { action: 'Shared pest control tip', time: '1 day ago', icon: '🐛' },
    { action: 'Updated crop health status', time: '2 days ago', icon: '🌱' },
    { action: 'Applied for PM-KISAN scheme', time: '3 days ago', icon: '🏛️' },
  ];


export default function Profile() {
  const{userBasicInfo}=useContext(StorageContext)
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials("Farmer singh ")}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{"Farmer Singh"}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{userBasicInfo.location}</Text>
              </View>
              <View style={styles.badgesContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{userBasicInfo.cropType} Farmer</Text>
                </View>
                <View style={[styles.badge, styles.badgeOutline]}>
                  <Text style={styles.badgeOutlineText}>{userBasicInfo.landSize} acres</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
 
        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trophy-outline" size={20} color="#FF9800" />
              <Text style={styles.cardTitle}>Achievements</Text>
            </View>
          </View>
          <View style={styles.achievementsContainer}>
            {achievements.map(achievement => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementItem,
                  achievement.earned ? styles.achievementEarned : styles.achievementLocked,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{achievement.name}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedBadgeText}>Earned</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="time-outline" size={20} color="#2196F3" />
              <Text style={styles.cardTitle}>Recent Activity</Text>
            </View>
          </View>
          <View style={styles.activityContainer}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="settings-outline" size={20} color="#666" />
              <Text style={styles.cardTitle}>Settings & Preferences</Text>
            </View>
          </View>
          <View style={styles.settingsContainer}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Weather alerts & reminders</Text>
                </View>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="globe-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Language</Text>
                  <Text style={styles.settingDescription}>हिंदी / English</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="flash-outline" size={20} color="#666" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Offline Mode</Text>
                  <Text style={styles.settingDescription}>Download data for offline use</Text>
                </View>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={styles.supportCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="help-circle-outline" size={20} color="#666" />
              <Text style={styles.cardTitle}>Support & Help</Text>
            </View>
          </View>
          <View style={styles.supportContainer}>
            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="help-circle-outline" size={16} color="#666" />
              <Text style={styles.supportText}>FAQ & Help Center</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={styles.supportText}>Contact Support</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name="star-outline" size={16} color="#666" />
              <Text style={styles.supportText}>Rate the App</Text>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={16} color="#F44336" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Smart Crop Advisory v2.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  badgeText: {
    fontSize: 10,
    color: '#666',
  },
  badgeOutlineText: {
    fontSize: 10,
    color: '#666',
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  achievementsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  achievementsContainer: {
    gap: 8,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  achievementEarned: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  achievementLocked: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  earnedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earnedBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
  },
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  settingsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsContainer: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  supportCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  supportContainer: {
    gap: 12,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  supportText: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    marginBottom: 20,
  },
});