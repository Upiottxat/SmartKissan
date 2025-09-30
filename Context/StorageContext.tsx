import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useEffect, useState } from "react";

// Define the shape of the user basic info object
export interface UserBasicInfo {
  language: string;
  cropType: string;
  landSize: number;
  location: string;
  locationCoordinates: {
    long: number;
    lati: number;
  };
}


// Add weather data and last update time to context
export interface WeatherData {
  list: any[];
}

interface StorageContextValue {
  userBasicInfo: UserBasicInfo | null;
  setUserBasicInfo: (data: UserBasicInfo) => void;
  weatherData: WeatherData | null;
  setWeatherData: (data: WeatherData) => void;
  lastWeatherUpdate: string | null;
  setLastWeatherUpdate: (iso: string) => void;
}

export const StorageContext = createContext<StorageContextValue | undefined>(undefined);

interface StorageProviderProps {
  children: ReactNode;
}


export const StorageProvider = ({ children }: StorageProviderProps) => {
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const userData = await AsyncStorage.getItem("userBasicInfo");
      if (userData) {
        setUserBasicInfo(JSON.parse(userData));
      }
      const weather = await AsyncStorage.getItem("weatherData");
      if (weather) {
        setWeatherData(JSON.parse(weather));
      }
      const lastUpdate = await AsyncStorage.getItem("lastWeatherUpdate");
      if (lastUpdate) {
        setLastWeatherUpdate(lastUpdate);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (userBasicInfo) {
      AsyncStorage.setItem("userBasicInfo", JSON.stringify(userBasicInfo));
      console.log("user basic info changed to ", userBasicInfo);
    }
  }, [userBasicInfo]);

  useEffect(() => {
    if (weatherData) {
      AsyncStorage.setItem("weatherData", JSON.stringify(weatherData));
      const now = new Date().toISOString();
      setLastWeatherUpdate(now);
      AsyncStorage.setItem("lastWeatherUpdate", now);
      // console.log("weather data changed to ", weatherData, "at", now);
    }
  }, [weatherData]);

  useEffect(() => {
    if (lastWeatherUpdate) {
      AsyncStorage.setItem("lastWeatherUpdate", lastWeatherUpdate);
    }
  }, [lastWeatherUpdate]);

  return (
    <StorageContext.Provider value={{ userBasicInfo, setUserBasicInfo, weatherData, setWeatherData, lastWeatherUpdate, setLastWeatherUpdate }}>
      {children}
    </StorageContext.Provider>
  );
};