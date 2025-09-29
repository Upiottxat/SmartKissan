import { StorageContext } from '@/Context/StorageContext';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdvisoryCard from './AdvisoryCard';
import CropHealthCard from './CropHealthCard';
import MarketPriceCard from './MarketPriceCard';
import ProgressCard from './ProgressCard';
import QuickActions from './QuickActions';
import WeatherCard from './WeatherCard';
import useWeather from '@/hooks/useWheather';

/**
 * @description This screen displays the main dashboard content, including weather,
 * crop health, market prices, and other widgets.
 */
const DashboardMainScreen = () => {
  const storageContext = useContext(StorageContext);
  const { weatherData, loading, error } = useWeather();

  if (!storageContext) {
    throw new Error('StorageContext must be used within a StorageProvider');
  }
  const { userBasicInfo } = storageContext;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <WeatherCard
          loading={loading}
          error={error}
          weatherData={weatherData}
          location={userBasicInfo?.location || 'N/A'}
        />
        <CropHealthCard />
        <MarketPriceCard />
        <AdvisoryCard />
        <ProgressCard />
        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default DashboardMainScreen;
