// Dashboard.tsx
import { StorageContext } from '@/Context/StorageContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';

import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import useWeather from "../../hooks/useWheather";

interface DashboardScreenProps {
  navigation: any;
}

const DashboardMain: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const router = useRouter();
  const animatedValue = new Animated.Value(0);
  const storageContext = useContext(StorageContext);
  const { weatherData, loading, error, fetchWeather } = useWeather();
  
  if (!storageContext) {
    throw new Error("StorageContext must be used within a StorageProvider");
  }
  const { userBasicInfo } = storageContext;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => clearInterval(timer);
  }, []);

  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const animatedStyle = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  const getFiveDayForecast = () => {
    if (!weatherData) return [];
  
    const dailyForecast: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
  
    // Filter weather data for one entry per day for the next 5 days
    const dates: string[] = [];
    weatherData.list.forEach(forecast => {
      const date = new Date(forecast.dt_txt);
      const day = date.toISOString().slice(0, 10);
      
      if (!dates.includes(day) && dailyForecast.length < 5) {
        dates.push(day);
        dailyForecast.push(forecast);
      }
    });
  
    // Map filtered data to the format needed for the component
    return dailyForecast.map((forecast, index) => {
      const date = new Date(forecast.dt_txt);
      const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const tempInCelsius = Math.round(forecast.main.temp);
      const humidity = forecast.main.humidity;
      
      // Select the most relevant weather icon
      let icon = '☀️';
      const weatherId = forecast.weather[0].id;
  
      if (weatherId >= 200 && weatherId < 600) icon = '⛈️'; // Thunderstorm & Rain
      else if (weatherId >= 600 && weatherId < 700) icon = '❄️'; // Snow
      else if (weatherId >= 700 && weatherId < 800) icon = '🌫️'; // Atmosphere
      else if (weatherId === 800) icon = '☀️'; // Clear
      else if (weatherId > 800) icon = '☁️'; // Clouds
      
      return {
        day: dayName,
        icon,
        temp: tempInCelsius,
        humidity,
      };
    });
  };

  const fiveDayForecast = getFiveDayForecast();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weather Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Animated.View style={animatedStyle}>
                <Ionicons name="rainy" size={20} color="#3b82f6" />
              </Animated.View>
              <Text style={styles.cardTitle}>Weather Forecast</Text>
            </View>
            <Text style={styles.cardLocation}>📍{userBasicInfo?.location}</Text>
          </View>
          {loading ? (
            <Text style={styles.loadingText}>Loading weather...</Text>
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <View style={styles.weatherGrid}>
              {fiveDayForecast.map((weather, index) => (
                <View key={index} style={styles.weatherItem}>
                  <Text style={styles.weatherDay}>{weather.day}</Text>
                  <Text style={styles.weatherIcon}>{weather.icon}</Text>
                  <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
                  <Text style={styles.weatherHumidity}>{weather.humidity}%</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Crop Health Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Animated.View style={animatedStyle}>
                <Ionicons name="leaf" size={20} color="#22c55e" />
              </Animated.View>
              <Text style={styles.cardTitle}>Crop Health</Text>
            </View>
            <View style={styles.healthBadge}>
              <Text style={styles.healthBadgeText}>Healthy</Text>
            </View>
          </View>

          <View style={styles.healthGrid}>
            {[
              { icon: 'water', label: 'Soil Moisture', value: '85%', color: '#3b82f6' },
              { icon: 'bug', label: 'Pest Risk', value: 'Low', color: '#f59e0b' },
              { icon: 'leaf', label: 'Growth', value: 'Good', color: '#22c55e' },
            ].map((metric, index) => (
              <View key={index} style={styles.healthItem}>
                <Ionicons name={metric.icon as any} size={18} color={metric.color} />
                <Text style={styles.healthLabel}>{metric.label}</Text>
                <Text style={styles.healthValue}>{metric.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Market Price Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="trending-up" size={20} color="#22c55e" />
              <Text style={styles.cardTitle}>Market Prices</Text>
            </View>
            <Text style={styles.updateTime}>Updated 2h ago</Text>
          </View>

          <View style={styles.marketList}>
            {[
              { crop: 'Rice (Common)', icon: '🌾', price: 2100, change: 50, isPositive: true },
              { crop: 'Rice (Premium)', icon: '🌾', price: 2350, change: -25, isPositive: false },
            ].map((item, index) => (
              <View key={index} style={styles.marketItem}>
                <View style={styles.marketItemLeft}>
                  <Text style={styles.marketIcon}>{item.icon}</Text>
                  <Text style={styles.marketCrop}>{item.crop}</Text>
                </View>
                <View style={styles.marketItemRight}>
                  <Text style={styles.marketPrice}>₹{item.price.toLocaleString()}/qtl</Text>
                  <View style={styles.marketChange}>
                    <Ionicons
                      name={item.isPositive ? 'trending-up' : 'trending-down'}
                      size={12}
                      color={item.isPositive ? '#22c55e' : '#ef4444'}
                    />
                    <Text
                      style={[
                        styles.marketChangeText,
                        { color: item.isPositive ? '#22c55e' : '#ef4444' },
                      ]}
                    >
                      {item.isPositive ? '+' : ''}
                      ₹{Math.abs(item.change)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Advisory Tip Card */}
        <TouchableOpacity
          style={styles.advisoryCard}
          onPress={() => router.push('/(tabs)/Advisory')}
        >
          <View style={styles.advisoryIconContainer}>
            <Ionicons name="bulb" size={20} color="#f59e0b" />
          </View>
          <View style={styles.advisoryContent}>
            <Text style={styles.advisoryTitle}>Today's Advisory</Text>
            <Text style={styles.advisoryText}>
              Rain expected tonight. Cover fertilizer bags and avoid field work tomorrow morning.
            </Text>
            <View style={styles.advisoryButton}>
              <Text style={styles.advisoryButtonText}>Get Full Advisory</Text>
              <Ionicons name="arrow-forward" size={16} color="#22c55e" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Progress Card */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Farm Care Progress</Text>
            <Text style={styles.progressCount}>3/5 completed</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>

          <Text style={styles.progressMessage}>
            🌱 You're doing great! Complete 2 more tasks to earn the "Dedicated Farmer" badge.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="calendar-outline" size={24} color="#666" />
              <Text style={styles.quickActionText}>Schedule Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Ionicons name="chatbubble-outline" size={24} color="#666" />
              <Text style={styles.quickActionText}>Ask Expert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 👇 Best Crops Card Teaser */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 8 }]}>🌾 Recommended Crops</Text>
          <Text>Rice, Maize</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Crop Recommendation Tab
const CropRecommendation = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
        🌱 Crop Recommendations
      </Text>
      <View style={styles.card}>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>
          Based on your soil and weather: Rice, Maize
        </Text>
        <Text style={{ color: '#6b7280', marginTop: 6 }}>
          (Later replaced with JSON/ML logic)
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

// TabView Wrapper
const initialLayout = { width: Dimensions.get('window').width };

export default function DashboardTabs() {
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Dashboard' },
    { key: 'recommendation', title: 'Recommendations' },
  ]);

  const renderScene = SceneMap({
    dashboard: DashboardMain,
    recommendation: CropRecommendation,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good Morning, राम जी! 🌅</Text>
            <Text style={styles.seasonInfo}>Kharif Season • Day 45</Text>
          </View>
          <View style={styles.profileContainer}>
            <Ionicons name="person" size={24} color="white" />
          </View>
        </View>

        <View style={styles.quickStatus}>
          <View style={styles.statusItem}>
            <Animated.Text style={styles.statusEmoji}>🌦</Animated.Text>
            <Text style={styles.statusText}>Rain Alert</Text>
          </View>
          <View style={styles.statusItem}>
            <Animated.Text style={styles.statusEmoji}>🌱</Animated.Text>
            <Text style={styles.statusText}>Healthy</Text>
          </View>
          <View style={styles.statusItem}>
            <Animated.Text style={styles.statusEmoji}>💰</Animated.Text>
            <Text style={styles.statusText}>₹2,100/qtl</Text>
          </View>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#22c55e' }}
            indicatorStyle={{ backgroundColor: 'white' }}
            labelStyle={{ fontWeight: '600' }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fdf8' },
  header: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '600', color: 'white' },
  seasonInfo: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statusItem: { alignItems: 'center' },
  statusEmoji: { fontSize: 20, marginBottom: 4, color: 'white' },
  statusText: { fontSize: 12, fontWeight: '500', color: 'white' },
  content: { flex: 1, padding: 16 },
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
  cardTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 },
  cardLocation: { fontSize: 12, color: '#6b7280' },
  weatherGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherItem: { alignItems: 'center' },
  weatherDay: { fontSize: 12, color: '#6b7280' },
  weatherIcon: { fontSize: 20, marginVertical: 4 },
  weatherTemp: { fontSize: 14, fontWeight: '600', color: '#374151' },
  weatherHumidity: { fontSize: 12, color: '#6b7280' },
  healthBadge: { backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  healthBadgeText: { fontSize: 12, fontWeight: '500', color: 'white' },
  healthGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  healthItem: { alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, flex: 1, marginHorizontal: 4 },
  healthLabel: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  healthValue: { fontSize: 12, fontWeight: '600', color: '#374151', marginTop: 2 },
  updateTime: { fontSize: 12, color: '#6b7280' },
  marketList: { gap: 8 },
  marketItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12 },
  marketItemLeft: { flexDirection: 'row', alignItems: 'center' },
  marketIcon: { fontSize: 18, marginRight: 8 },
  marketCrop: { fontSize: 14, color: '#374151' },
  marketItemRight: { alignItems: 'flex-end' },
  marketPrice: { fontSize: 14, fontWeight: '600', color: '#374151' },
  marketChange: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  marketChangeText: { fontSize: 12, marginLeft: 2 },
  advisoryCard: { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: 12, padding: 16, marginBottom: 16, flexDirection: 'row' },
  advisoryIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  advisoryContent: { flex: 1 },
  advisoryTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 4 },
  advisoryText: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  advisoryButton: { flexDirection: 'row', alignItems: 'center' },
  advisoryButtonText: { fontSize: 14, fontWeight: '500', color: '#22c55e', marginRight: 4 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressCount: { fontSize: 12, color: '#6b7280' },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginBottom: 12 },
  progressFill: { height: 8, backgroundColor: '#22c55e', borderRadius: 4 },
  progressMessage: { fontSize: 14, color: '#6b7280' },
  quickActionsContainer: { marginHorizontal: 16, marginTop: 16, marginBottom: 20 },
  quickActionsTitle: { fontSize: 14, color: '#666666', marginBottom: 12 },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, backgroundColor: '#ffffff', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  quickActionText: { fontSize: 10, color: '#666666', marginTop: 4, textAlign: 'center' },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#34D399' },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#ef4444' },
});