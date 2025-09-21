import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState, ReactNode } from "react";

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

// Define the shape of the context value
interface StorageContextValue {
  userBasicInfo: UserBasicInfo | null;
  setUserBasicInfo: (data: UserBasicInfo) => void;
}

export const StorageContext = createContext<StorageContextValue | undefined>(undefined);

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider = ({ children }: StorageProviderProps) => {
  const [userBasicInfo, setUserBasicInfo] = useState<UserBasicInfo | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem("userBasicInfo");
      if (data) {
        setUserBasicInfo(JSON.parse(data));
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

  return (
    <StorageContext.Provider value={{ userBasicInfo, setUserBasicInfo }}>
      {children}
    </StorageContext.Provider>
  );
};