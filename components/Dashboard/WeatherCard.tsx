import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface WeatherCardProps {
  loading: boolean;
  error: string | null;
  weatherData: any; // Consider creating a specific type for this
  location: string;
  lastWeatherUpdate: string | null;
}

// Helper to get a weather icon based on the weather condition ID
const getWeatherIcon = (weatherId: number): string => {
  if (weatherId >= 200 && weatherId < 600) return '⛈️'; // Thunderstorm & Rain
  if (weatherId >= 600 && weatherId < 700) return '❄️'; // Snow
  if (weatherId >= 700 && weatherId < 800) return '🌫️'; // Atmosphere
  if (weatherId === 800) return '☀️'; // Clear
  return '☁️'; // Clouds
};

/**
 * @description A card component to display the 5-day weather forecast.
 */
const WeatherCard: React.FC<WeatherCardProps> = ({ loading, error, weatherData, location,lastWeatherUpdate }) => {
  // useMemo will re-calculate the forecast only when weatherData changes
       console.log("last updated at ",lastWeatherUpdate)
  const fiveDayForecast = useMemo(() => {
    if (!weatherData?.list) return [];

    const dailyForecasts: { [key: string]: any } = {};
    weatherData.list.forEach((forecast: any) => {
      const day = forecast.dt_txt.split(' ')[0];
      if (!dailyForecasts[day]) {
        dailyForecasts[day] = forecast;
      }
    });

    return Object.values(dailyForecasts)
      .slice(0, 5)
      .map((forecast, index) => {
        const date = new Date(forecast.dt_txt);
        const dayName =
          index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayName,
          icon: getWeatherIcon(forecast.weather[0].id),
          temp: Math.round(forecast.main.temp),
          humidity: forecast.main.humidity,
        };
      });
  }, [weatherData]);

  const renderContent = () => {
    // if (loading) {
    //   return <ActivityIndicator size="large" color="#c" style={styles.centered} />;
    // }
    // if (error) {
    //   return <Text style={styles.errorText}>Error: {error}</Text>;
    // }
    return (
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
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="rainy-outline" size={20} color="#3b82f6" />
          <Text style={styles.cardTitle}>Weather Forecast</Text>
        </View>
        <Text style={styles.cardLocation}>📍 {location}</Text>
      </View>
      {renderContent()}
      <View style={styles.TimeStamp} >
        {loading?<ActivityIndicator size={10} color={"#22c55e"}></ActivityIndicator>: <Text style={styles.TimeStampText} >
      {
        lastWeatherUpdate
          ? (new Date(lastWeatherUpdate).getTime() - Date.now() < 0
              ? `✔️ Last updated at ${new Date(lastWeatherUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : "Updating...")
          : "Updating..."
      }
    </Text>}
   
       
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
  cardLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  centered: {
    marginVertical: 20,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    color: '#ef4444',
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherDay: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  weatherIcon: {
    fontSize: 24,
    marginVertical: 8,
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  weatherHumidity: {
    fontSize: 12,
    color: '#6b7280',
  },
  TimeStamp: {
    marginTop: 10,
    alignItems: 'flex-end',
  
  },
  TimeStampText:{
    fontSize: 10,
    color:'grey'
  }
});

export default WeatherCard;
