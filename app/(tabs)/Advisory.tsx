import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatHeader from '../../components/Advisory/ChatHeader';
import ChatInput from '../../components/Advisory/ChatInput';
import ImagePreviewModal from '../../components/Advisory/ImagePreviewModal';
import LanguageModal from '../../components/Advisory/LanguageModal';
import MessageList from '../../components/Advisory/MessageList';
import { styles as commonStyles } from '../../constants/styles';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useKrishiAI } from '../../hooks/useKrishiAI';
import { offlineDetector } from '../../services/detector/OfflineDetector';

// ----------- Types -----------
interface Message {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  imageUri?: string;
}

// ----------- Component -----------
export default function Advisory() {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    loading,
    langCode,
    setLangCode,
    scrollViewRef,
    handleSendMessage,
    getLangObj,
    i18n,
  } = useKrishiAI();

  const { t } = useTranslation();
  const { isListening, isTranscribing, handleMicPress } = useAudioRecorder({
    langCode,
    onTranscriptionComplete: (text) => setCurrentMessage(text),
  });

  const [langModalVisible, setLangModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    offlineDetector.loadModel();
  }, []);

  // -------- Camera Capture + Offline Scan ----------
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('alerts.permission'), t('alerts.cameraPermission'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      const imageAsset = result.assets[0];
      // show user image in chat
      const userMsg: Message = {
        id: Date.now(),
        type: 'user',
        message: t('chat.photoPlaceholder') || "Here's a photo of my plant.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        imageUri: imageAsset.uri,
      };
      handleAddMessage(userMsg);

      // offline disease detection
      const detection = await offlineDetector.detectDisease(imageAsset.uri);
      if (detection) {
        const botMsg: Message = {
          id: Date.now() + 1,
          type: 'bot',
          message: `The offline scan suggests **${detection.disease}** (confidence ${(detection.confidence * 100).toFixed(
            0
          )}%).\n\nWould you like detailed treatment advice?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        handleAddMessage(botMsg);
        setCurrentMessage(`My plant might have ${detection.disease}. Please provide detailed steps.`);
      } else {
        // fallback to online AI
        handleSendMessage(t('chat.defaultQuery') || 'What can you tell me about this plant?', imageAsset);
      }
    }
  };

  const handleAddMessage = (msg: Message) => {
    // we rely on useKrishiAI for messages array; append seamlessly
    messages.push(msg);
  };

  // -------- UI --------
  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ChatHeader
          langCode={langCode}
          getLangObj={getLangObj}
          onLanguagePress={() => setLangModalVisible(true)}
          onCameraPress={handleCameraPress}
        />
        <MessageList
          messages={messages}
          scrollViewRef={scrollViewRef}
          loading={loading}
          onImagePress={(uri) => setPreviewImage(uri)}
        />
        <ChatInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          handleMicPress={handleMicPress}
          isListening={isListening}
          isTranscribing={isTranscribing}
          loading={loading}
        />

        <LanguageModal
          visible={langModalVisible}
          onClose={() => setLangModalVisible(false)}
          currentLangCode={langCode}
          onSaveLanguage={(code) => {
            setLangCode(code);
            const base = code.split('-')[0];
            if (base !== 'auto') i18n.changeLanguage(base);
          }}
        />

        <ImagePreviewModal
          visible={!!previewImage}
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={styles.loadingText}>{t('common.loading') || 'Analyzing...'}</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// -------- Styles specific to this screen --------
const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loadingText: {
    marginTop: 8,
    color: '#fff',
    fontSize: 16,
  },
});
