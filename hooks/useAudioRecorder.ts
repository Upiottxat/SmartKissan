import { useState } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';
import { usePermissions } from './usePermissions';
import { LANGUAGES } from '../constants/languages';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface AudioRecorderProps {
  langCode: string;
  onTranscriptionComplete: (text: string) => void;
}

export const useAudioRecorder = ({ langCode, onTranscriptionComplete }: AudioRecorderProps) => {
  const { t } = useTranslation();
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { requestAudioPermission } = usePermissions();

  const startRecording = async () => {
    const granted = await requestAudioPermission();
    if (!granted) {
      Alert.alert(t('alerts.permission'), t('alerts.micPermission'));
      return;
    }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsListening(true);
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.startRecordingError'));
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) return;
    setIsListening(false);
    setIsTranscribing(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (!uri) throw new Error('No recording URI');

      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const audioPart = { inlineData: { data: base64, mimeType: 'audio/mp4' } };
      const langName = LANGUAGES.find(l => l.code === langCode)?.name || 'auto';
      const result = await model.generateContent([`Transcribe to ${langName}.`, audioPart]);
      const transcribed = result.response?.text() ?? '';

      if (transcribed.trim()) {
        onTranscriptionComplete(transcribed);
      } else {
        Alert.alert(t('alerts.transcription'), t('alerts.transcriptionNoText'));
      }
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.transcriptionFailed'));
    } finally {
      setRecording(undefined);
      setIsTranscribing(false);
    }
  };

  const handleMicPress = () => (isListening ? stopRecordingAndTranscribe() : startRecording());

  return { isListening, isTranscribing, handleMicPress };
};

