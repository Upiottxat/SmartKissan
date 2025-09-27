// OnboardingScreen.tsx
import TText from "@/components/TText";
import { StorageContext, UserBasicInfo } from "@/Context/StorageContext";
import Slider from "@react-native-assets/slider";
import { Picker } from "@react-native-picker/picker";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import i18next from "i18next";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import "../src/i18n/i18n";

interface OnboardingScreenProps {
  onComplete: (data: UserBasicInfo) => void;
}

export default function Index({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<string>("");
  const [cropType, setCropType] = useState<string>("");
  const [landSize, setLandSize] = useState<number>(2);
  const [location, setLocation] = useState<string>("");
  const [locationCoordinates, setLocationCoordinates] = useState<{ long: number; lati: number }>({
    long: 0.00000,
    lati: 0.00000,
  });
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { t, i18n } = useTranslation();
  const storageContext = useContext(StorageContext);
  const router = useRouter();

  if (!storageContext) {
    throw new Error("StorageContext must be used within a StorageProvider");
  }

  const { userBasicInfo, setUserBasicInfo } = storageContext;

  const languages = [
    { value: "hi", label: "हिंदी", flag: "🇮🇳" },
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "te", label: "తెలుగు", flag: "🇮🇳" },
    { value: "ta", label: "தமிழ்", flag: "🇮🇳" },
    { value: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  const cropTypes = [
    { id: "wheat", name: "Wheat", icon: "🌾" },
    { id: "rice", name: "Rice", icon: "🌾" },
    { id: "corn", name: "Corn", icon: "🌽" },
    { id: "fruits", name: "Fruits", icon: "🥭" },
    { id: "vegetables", name: "Vegetables", icon: "🥕" },
    { id: "cotton", name: "Cotton", icon: "🌿" },
  ];

  const locations = [
    "punjab",
    "haryana",
    "up",
    "bihar",
    "mp",
    "maharashtra",
    "karnataka",
    "tamil-nadu",
    "andhra-pradesh",
    "telangana",
  ];


  useEffect(() => {
    if (userBasicInfo && userBasicInfo.cropType && userBasicInfo.landSize && userBasicInfo.language && userBasicInfo.location) {
      router.push("/(tabs)/Dashboard");
    }
  }, [userBasicInfo]);

  useEffect(() => {
    if (language) i18next.changeLanguage(language);
  }, [language]);

  const getLocationAsync = async () => {
    setLocationStatus("loading");
    try {
      let providerStatus = await Location.getProviderStatusAsync();
      if (!providerStatus.locationServicesEnabled) {
        setLocationStatus("error");
        Alert.alert("Location Services Disabled", "Please turn on your location services to use this feature.");
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus("error");
        Alert.alert("Permission Denied", "Permission to access location was denied. Please enable it in your device settings.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});

      setLocationCoordinates({
        long: currentLocation.coords.longitude,
        lati: currentLocation.coords.latitude
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });

      if (geocode.length > 0) {
        const { city, district, subregion, region } = geocode[0];
        let detectedLocation = '';

        if (city) {
          detectedLocation = city;
        } else if (district) {
          detectedLocation = district;
        } else if (subregion) {
          detectedLocation = subregion.replace(/ Division/i, '');
        }

        if (detectedLocation && region) {
          detectedLocation = `${detectedLocation}, ${region}`;
        } else if (region) {
          detectedLocation = region;
        }

        setLocation(detectedLocation || 'Location not found');
        setLocationStatus("success");
      } else {
        setLocation('Location not found');
        setLocationStatus("error");
      }
    } catch (error) {
      setLocationStatus("error");
      console.error("Error getting location:", error);
      Alert.alert("Location Error", "Could not get your current location.");
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const finalInfo: UserBasicInfo = {
        language,
        cropType,
        landSize,
        location,
        locationCoordinates,
      };
      setUserBasicInfo(finalInfo);
      router.push("/(tabs)/Dashboard");
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return language !== "";
      case 2:
        return location !== "";
      case 3:
        return true;
      case 4:
        return cropType !== "";
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.contentContainer}>
            <TText style={styles.cardTitle}>chooseLanguage</TText>
            <TText style={styles.cardDescription}>
              selectPreferredLanguage
            </TText>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => {
                  setLanguage(lang.value);
                  i18n.changeLanguage(lang.value);
                }}
                style={[
                  styles.optionButton,
                  language === lang.value && styles.selectedOption,
                ]}
              >
                <Text style={styles.optionEmoji}>{lang.flag}</Text>
                <Text style={styles.optionText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View style={styles.contentContainer}>
            <TText style={styles.cardTitle}>Location</TText>
            <TText style={styles.cardDescription}>Whereisyourfarmlocated?</TText>

            {locationStatus === 'loading' && <Text style={styles.loadingText}>Detecting location...</Text>}
            {location && locationStatus === 'success' && <Text style={styles.detectedLocationText}>{location}</Text>}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={location}
                onValueChange={(itemValue) => setLocation(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select your state/region" value="" />
                {locations.map((loc) => (
                  <Picker.Item key={loc} label={loc} value={loc} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getLocationAsync}
              disabled={locationStatus === 'loading'}
            >
              <TText style={styles.locationButtonText}>
                {locationStatus === 'loading' ? 'Detecting...' : 'UseCurrentLocation'}
              </TText>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.contentContainer}>
            <TText style={styles.cardTitle}>LandSize</TText>
            <TText style={styles.cardDescription}>Howmuchlanddoyouhave?</TText>
            <View style={styles.sliderDisplay}>
              <Text style={styles.sliderValueText}>{landSize} acres</Text>
            </View>
            <Slider
              style={styles.slider}
              value={landSize}
              onValueChange={(value: number) => setLandSize(parseFloat(value.toFixed(1)))}
              minimumValue={0.5}
              maximumValue={50}
              step={0.5}
              minimumTrackTintColor="#34D399"
              maximumTrackTintColor="#D1D5DB"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>0.5 acres</Text>
              <Text style={styles.sliderLabelText}>50+ acres</Text>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.contentContainer}>
            <TText style={styles.cardTitle}>SelectCropType</TText>
            <TText style={styles.cardDescription}>Whatcropsdoyougrow?</TText>
            <View style={styles.gridContainer}>
              {cropTypes.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  onPress={() => setCropType(crop.id)}
                  style={[
                    styles.gridButton,
                    cropType === crop.id && styles.selectedGrid,
                  ]}
                >
                  <Text style={styles.gridEmoji}>{crop.icon}</Text>
                  <TText style={styles.gridText}>
                    {`crop.${crop.id}`}
                  </TText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressSteps}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.progressStep,
                i <= step && styles.progressStepActive,
              ]}
            >
              <Text style={styles.progressStepText}>{i}</Text>
            </View>
          ))}
        </View>
        <View style={styles.progressLine}>
          <View
            style={[
              styles.progressFill,
              { width: `${(step / 4) * 100}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.card}>
        {renderStepContent()}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.button, styles.outlineButton]}
              onPress={handlePrevious}
            >
              <Text style={styles.outlineButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, !isStepValid() && styles.disabledButton]}
            onPress={handleNext}
            disabled={!isStepValid()}
          >
            <Text style={styles.buttonText}>
              {step === 4 ? t("GetStarted") : t("Next")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerEmoji}>👨‍🌾</Text>
        <TText style={styles.footerText}>Letshelpyougrowbettercrops!</TText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F0F9FF",
    padding: 20,
    justifyContent: "space-between",
  },
  progressBarContainer: {
    marginBottom: 32,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepActive: {
    backgroundColor: "#34D399",
  },
  progressStepText: {
    color: "#4B5563",
  },
  progressLine: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#34D399",
    borderRadius: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: "#34D399",
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridButton: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  selectedGrid: {
    borderColor: "#34D399",
  },
  gridEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  gridText: {
    fontSize: 14,
  },
  sliderDisplay: {
    alignItems: "center",
  },
  sliderValueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34D399",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    width: "100%",
  },
  locationButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  locationButtonText: {
    fontSize: 16,
    color: "#34D399",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#34D399",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    marginRight: 8,
  },
  outlineButtonText: {
    color: "#6B7280",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#A1A1AA",
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  loadingText: {
    textAlign: 'center',
    color: '#34D399',
    marginBottom: 10,
  },
  detectedLocationText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
});