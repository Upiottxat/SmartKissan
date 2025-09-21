// hooks/useWeather.ts
import { useCallback, useContext, useEffect, useState } from 'react';
import { StorageContext } from '../Context/StorageContext';

interface ForecastListItem {
  dt: number;
  main: { temp: number; humidity: number };
  weather: { description: string; icon: string }[];
  dt_txt: string;
}
interface WeatherData {
  list: ForecastListItem[];
}

export default function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageContext = useContext(StorageContext);
  if (!storageContext) throw new Error('useWeather must be used within a StorageProvider');
  const { userBasicInfo } = storageContext;

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
      setWeatherData(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [userBasicInfo?.locationCoordinates, API_KEY]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { weatherData, loading, error, refetch: fetchWeather };
}
