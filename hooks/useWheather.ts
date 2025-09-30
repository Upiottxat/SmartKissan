// hooks/useWeather.ts
import { useCallback, useContext, useEffect, useState } from 'react';
import { StorageContext, WeatherData } from '../Context/StorageContext';

interface ForecastListItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  dt_txt: string;
}
// WeatherData is now imported from StorageContext

export default function useWeather() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageContext = useContext(StorageContext);
  if (!storageContext) throw new Error('useWeather must be used within a StorageProvider');
  const { userBasicInfo, weatherData, setWeatherData ,lastWeatherUpdate} = storageContext;

  const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = useCallback(async () => {
    const { lati: lat, long: lon } = userBasicInfo?.locationCoordinates ?? {};
    if (!lat || !lon || !API_KEY) return;

    setLoading(true);
    setError(null);
    const controller = new AbortController();

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error('Weather data not found.');
      const data: WeatherData = await res.json();
      setWeatherData(data); // Save to context (and AsyncStorage)
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
      // If fetch fails, keep using cached weatherData from context
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [userBasicInfo?.locationCoordinates, API_KEY, setWeatherData]);

  useEffect(() => {
    // Only fetch if online, otherwise rely on cached data
    fetchWeather();
  }, [fetchWeather]);

  return { weatherData, loading, error, refetch: fetchWeather ,lastWeatherUpdate};
}
