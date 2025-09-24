import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';

export const usePermissions = () => {
  const { t } = useTranslation();

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    return true;
  };

  const requestAudioPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    return true;
  };

  return { requestCameraPermission, requestAudioPermission };
};

