import React from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { styles } from '../../constants/styles';
import { usePermissions } from '../../hooks/usePermissions';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (text: string) => void;
  handleSendMessage: (text?: string, imageAsset?: ImagePicker.ImagePickerAsset) => void;
  handleMicPress: () => void;
  isListening: boolean;
  isTranscribing: boolean;
  loading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ currentMessage, setCurrentMessage, handleSendMessage, handleMicPress, isListening, isTranscribing, loading }) => {
  const { t } = useTranslation();
  const { requestCameraPermission } = usePermissions();

  const handleCameraPress = async () => {
    const granted = await requestCameraPermission();
    if (!granted) {
      Alert.alert(t('alerts.permission'), t('alerts.cameraPermission'));
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6, base64: true });
      if (!result.canceled) await handleSendMessage(undefined, result.assets[0]);
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.cameraError'));
    }
  };

  const quickActions = [
    { id: 1, text: t('quickActions.pestId'), icon: '🐛' },
    { id: 2, text: t('quickActions.diseaseCheck'), icon: '🌿' },
    { id: 3, text: t('quickActions.irrigationAdvice'), icon: '💧' },
  ];

  return (
    <View style={styles.inputArea}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickScroll}>
        {quickActions.map(q => (
          <TouchableOpacity key={q.id} style={styles.quickChip} onPress={() => handleSendMessage(q.text)}>
            <Text style={styles.quickIcon}>{q.icon}</Text>
            <Text style={styles.quickText}>{q.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCameraPress}>
          <Ionicons name="camera-outline" size={26} color="#346E3D" />
        </TouchableOpacity>
        <TextInput
          value={currentMessage}
          onChangeText={setCurrentMessage}
          placeholder={t('placeholder')}
          placeholderTextColor="#888"
          style={styles.input}
          multiline
          editable={!isTranscribing && !loading}
        />
        <TouchableOpacity style={[styles.iconButton, styles.micButton, isListening && styles.micButtonActive]} onPress={handleMicPress}>
          <Ionicons name="mic-outline" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, styles.sendButton, (!currentMessage.trim() || loading) && styles.sendButtonDisabled]} disabled={!currentMessage.trim() || loading} onPress={() => handleSendMessage()}>
          <Ionicons name="arrow-up" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      {(isListening || isTranscribing) && (
        <View style={styles.listeningBox}>
          <ActivityIndicator size="small" color="#c66601" />
          <Text style={styles.listeningText}>{isTranscribing ? t('transcribing') : t('listening')}</Text>
        </View>
      )}
    </View>
  );
};

export default ChatInput;

