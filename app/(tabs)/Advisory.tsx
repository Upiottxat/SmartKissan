import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';

import TText from '@/components/TText';

// Put your Gemini API key in env (EXPO_PUBLIC_GEMINI_API_KEY)
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

/** --- Language options (Indian languages + Auto detect) --- */
const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', native: 'ऑटो' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'en-IN', name: 'English', native: 'English' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as-IN', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur-IN', name: 'Urdu', native: 'اردو' },
];

interface Message {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  imageUri?: string;
  hasAudio?: boolean;
}

/** Krishi base prompt (keeps responses simple & practical) */
const KRISHIMITRA_PROMPT = `
You are "KrishiMitra" – a multilingual, farmer-friendly agriculture expert and friendly companion.
you are a female
Instructions:
1. Accept farmer’s text or optional image.
2. If an image is attached:
   - Detect the crop or plant type.
   - Identify any pest or disease symptoms.
3. Provide a concise report in **Markdown** with sections:
   ## Crop / Plant Info
   - Name
   - Short description
   - Growing tips

   ## Disease / Pest Info (if any)
   - Name
   - Symptoms
   - How it spreads

   ## Treatment & Prevention
   - Organic methods (preferred)
   - Chemical methods (only if necessary, with dosage and safety)
   - Preventive measures

   ## Quick Tips
   - Extra advice for healthy growth
4. If no disease/pest is found, provide general crop-care tips in the same Markdown format.
5. Support **casual conversation** (greetings, small talk, friendly tone) naturally along with technical advice.
6. Respond in the farmer’s language (supports all Indian languages).
7. Keep answers concise and clear.
8. Provide quantities in metric and common field measures.
9. End with a motivational or friendly closing line.

**Important:** Always output in Markdown only. Do not output plain text outside the structure. 

`;

export default function Advisory() {
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      message: t('initialBotMessage'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true,
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [langCode, setLangCode] = useState<string>('auto');
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const quickActions = [
    { id: 1, text: t('quickActions.pestId'), icon: '🐛' },
    { id: 2, text: t('quickActions.diseaseCheck'), icon: '🌿' },
    { id: 3, text: t('quickActions.irrigationAdvice'), icon: '💧' },
    { id: 4, text: t('quickActions.fertilizerSuggestion'), icon: '🌾' },
    { id: 5, text: t('quickActions.marketPrice'), icon: '📈' },
  ];
  
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('krishi_lang');
        if (savedLang) {
          setLangCode(savedLang);
          const langToSet = savedLang.split('-')[0];
          if (i18n.language !== langToSet) {
             i18n.changeLanguage(langToSet);
          }
        } else {
          const initialLangCode = i18n.language;
          const matchingLang = LANGUAGES.find(l => l.code.startsWith(initialLangCode));
          if (matchingLang) {
            setLangCode(matchingLang.code);
          }
        }
      } catch (e) {
        console.error("Failed to load language from storage", e);
      }
    })();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    return () => Speech.stop();
  }, [messages]);
  
  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 0 && prev[0].id === 1) {
        return [{...prev[0], message: t('initialBotMessage')}, ...prev.slice(1)];
      }
      return prev;
    });
  }, [t]);

  const saveLanguage = async (code: string) => {
    setLangCode(code);
    await AsyncStorage.setItem('krishi_lang', code).catch(() => {});
    const langToSet = code.split('-')[0];
    if (langToSet !== 'auto') {
      i18n.changeLanguage(langToSet);
    }
    setLangModalVisible(false);
  };

  const getLangObj = (code: string) => LANGUAGES.find(l => l.code === code) || LANGUAGES[0];

  const speakMessage = (text: string) => {
    try {
      Speech.stop();
      const options: any = { rate: 0.9 };
      if (langCode && langCode !== 'auto') options.language = langCode;
      Speech.speak(text, options);
    } catch (e) {
      console.warn('TTS error', e);
    }
  };

  const startRecording = async () => {
    try {
      if ((await Audio.getPermissionsAsync()).status !== 'granted') {
        await Audio.requestPermissionsAsync();
      }
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
      const result = await model.generateContent([`Transcribe to ${getLangObj(langCode).name}.`, audioPart]);
      const transcribed = result.response?.text() ?? '';
      if (transcribed.trim()) setCurrentMessage(transcribed);
      else Alert.alert(t('alerts.transcription'), t('alerts.transcriptionNoText'));
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.transcriptionFailed'));
    } finally {
      setRecording(undefined);
      setIsTranscribing(false);
    }
  };

  const handleMicPress = () => isListening ? stopRecordingAndTranscribe() : startRecording();

  const handleCameraPress = async () => {
    try {
      if ((await ImagePicker.getCameraPermissionsAsync()).status !== 'granted') {
         await ImagePicker.requestCameraPermissionsAsync();
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.6, base64: true });
      if (!result.canceled) await handleSendMessage(undefined, result.assets[0]);
    } catch (err) {
      Alert.alert(t('alerts.error'), t('alerts.cameraError'));
    }
  };

const handleSendMessage = async (text?: string, imageAsset?: ImagePicker.ImagePickerAsset) => {
  const messageText = text || currentMessage;
  if (!messageText.trim() && !imageAsset) return;

  const userMessage: Message = {
    id: Date.now(),
    type: 'user',
    message: imageAsset ? (messageText.trim() || t("imagePrompt")) : messageText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    imageUri: imageAsset?.uri,
  };
  setMessages(prev => [...prev, userMessage]);
  if (!text) setCurrentMessage('');
  setLoading(true);

  try {
    const langInstruction = langCode !== 'auto' 
      ? `Important: Your entire response must be in the ${getLangObj(langCode).name} language.` 
      : "Important: Detect the user's language from their message and respond entirely in that language.";
      
    let responseText;

    if (imageAsset?.base64) {
      const imagePart = {
        inlineData: {
          data: imageAsset.base64,
          mimeType: imageAsset.mimeType || 'image/jpeg',
        },
      };
      
      const userQuery = messageText.trim() ? `User's query about the image: "${messageText}"` : "Analyze this crop photo and provide a report.";

      // 💡 FIX: Each piece of text must be wrapped in its own { text: "..." } object for multimodal requests.
      const promptParts = [
        { text: KRISHIMITRA_PROMPT },
        { text: langInstruction },
        { text: userQuery },
        imagePart, // This is already a valid 'Part' object
      ];
      
      const result = await model.generateContent({ contents: [{ role: "user", parts: promptParts }] });
      responseText = result.response.text();
      
    } else {
      // Text-only requests can still use a simple string.
      const prompt = `${KRISHIMITRA_PROMPT}\n${langInstruction}\nUser's message: "${messageText}"`;
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    }

    if (!responseText) {
      throw new Error("Received an empty response from the API.");
    }

    const botMessage: Message = {
      id: Date.now() + 1,
      type: 'bot',
      message: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true,
    };
    setMessages(prev => [...prev, botMessage]);
    speakMessage(responseText);

  } catch (err) {
    console.error("Gemini API Error:", err);
    const fallback = t('alerts.fallbackError');
    setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', message: fallback, timestamp: new Date().toLocaleTimeString(), hasAudio: true }]);
    speakMessage(fallback);
  } finally {
    setLoading(false);
  }
};

  const renderMessage = (msg: Message) => (
      <View
      key={msg.id}
      style={[
        styles.messageRow,
        msg.type === 'user' ? styles.messageRowUser : styles.messageRowBot,
      ]}
    >
      {/* Optional bot avatar */}
      {msg.type === 'bot' && (
        <View style={styles.avatar}>
          <Text>🌱</Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          msg.type === 'user' ? styles.bubbleUser : styles.bubbleBot,
        ]}
      >
        {/* Optional image preview */}
        {msg.imageUri && (
          <TouchableOpacity
            onPress={() => {
              setPreviewImage(msg.imageUri!);
              setShowImageModal(true);
            }}
          >
            <Image source={{ uri: msg.imageUri }} style={styles.messageImage} />
          </TouchableOpacity>
        )}

        {/* Text / Markdown */}
        {msg.type === 'bot' ? (
          <Markdown
            style={{
              body: { fontSize: 16, lineHeight: 24 },
              heading1: { fontSize: 24, fontWeight: '700', color: '#2e7d32' },
              // add more markdown styles if you like
            }}
          >
            {msg.message || ''}
          </Markdown>
        ) : (
          <Text style={[styles.messageText, styles.messageTextUser]}>
            {msg.message}
          </Text>
        )}

        {/* Optional timestamp */}
        {msg.timestamp && (
          <Text style={styles.timestamp}>{msg.timestamp}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Ionicons name="leaf-outline" size={28} color="#fff" />
          <View>
            <TText style={styles.headerTitle}>headerTitle</TText>
            <TText style={styles.headerSub}>headerSub</TText>
          </View>
          <TouchableOpacity style={styles.langBtn} onPress={() => setLangModalVisible(true)}>
            <Ionicons name="language-outline" size={22} color="#fff" />
            <Text style={styles.langBtnText}>{getLangObj(langCode).native}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollViewRef} style={styles.messagesArea} contentContainerStyle={styles.messagesContent}>
          {messages.map(renderMessage)}
          
          {loading && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator color="#346E3D" />
              <TText style={styles.typingText}>typingIndicator</TText>
            </View>
          )}
        </ScrollView>

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

        <Modal visible={showImageModal} transparent animationType="fade">
          <View style={styles.modalBg}>
            <Image source={{ uri: previewImage! }} style={styles.modalImage} resizeMode="contain" />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowImageModal(false)}>
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={langModalVisible} transparent animationType="slide">
          <TouchableOpacity style={styles.langModalBg} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
            <TouchableWithoutFeedback>
              <View style={styles.langModal}>
                <TText style={styles.langModalTitle}>langModalTitle</TText>
                <ScrollView>
                  {LANGUAGES.map(l => (
                    <TouchableOpacity key={l.code} style={[styles.langItem, l.code === langCode && styles.langItemActive]} onPress={() => saveLanguage(l.code)}>
                      <Text style={[styles.langName, l.code === langCode && styles.langNameActive]}>{l.native} • {l.name}</Text>
                      {l.code === langCode && <Ionicons name="checkmark-circle" size={22} color="#346E3D" />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={styles.langClose} onPress={() => setLangModalVisible(false)}>
                  <TText style={styles.langCloseText}>langModalClose</TText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F2' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#346E3D', paddingHorizontal: 16, paddingVertical: 12, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#E1F0D7', fontSize: 13, marginTop: -2 },
  langBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  langBtnText: { color: '#fff', marginLeft: 6, fontSize: 14, fontWeight: '600' },
  messagesArea: { flex: 1 },
  messagesContent: { paddingHorizontal: 12, paddingVertical: 16 },
  messageRow: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
  messageRowBot: { alignSelf: 'flex-start' },
  messageRowUser: { alignSelf: 'flex-end' },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#E1F0D7' },
  bubble: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18 },
  bubbleBot: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  bubbleUser: { backgroundColor: '#E1F0D7', borderTopRightRadius: 4,maxWidth:'100% ' },
  messageImage: { width: 250, height: 180, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  messageText: { fontSize: 16, lineHeight: 24 },
  messageTextBot: { color: '#333' },
  messageTextUser: { color: '#25492b' },
  bubbleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timestamp: { fontSize: 12, color: '#888' },
  timestampUser: { color: '#5a785e' },
  playBtn: { marginLeft: 12, opacity: 0.8 },
  typingIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18, borderTopLeftRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  typingText: { marginLeft: 8, color: '#555', fontSize: 15 },
  inputArea: { borderTopWidth: 1, borderColor: '#E0E5DA', backgroundColor: '#F4F7F2', paddingVertical: 8, paddingHorizontal: 12, paddingBottom: Platform.OS === 'ios' ? 16 : 8 },
  quickScroll: { paddingBottom: 10, paddingLeft: 2 },
  quickChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E1F0D7', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
  quickIcon: { fontSize: 16, marginRight: 6 },
  quickText: { fontSize: 14, color: '#346E3D', fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  input: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 18, fontSize: 16, color: '#333', borderWidth: 1, borderColor: '#E0E5DA', paddingTop: Platform.OS === 'ios' ? 12 : 8, paddingBottom: Platform.OS === 'ios' ? 12 : 8, maxHeight: 120 },
  iconButton: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  micButton: { backgroundColor: '#346E3D' },
  micButtonActive: { backgroundColor: '#D32F2F' },
  sendButton: { backgroundColor: '#4CAF50' },
  sendButtonDisabled: { backgroundColor: '#B0C1B2' },
  listeningBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, padding: 8, backgroundColor: '#fff8e1', borderRadius: 12 },
  listeningText: { color: '#c66601', fontWeight: '600', marginLeft: 8 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalImage: { width: '100%', height: '80%' },
  modalClose: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
  langModalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  langModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 30, maxHeight: '70%' },
  langModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#333' },
  langItem: { paddingVertical: 14, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10, marginBottom: 4 },
  langItemActive: { backgroundColor: '#F0F7EC' },
  langName: { fontSize: 16, color: '#444' },
  langNameActive: { fontWeight: '600', color: '#346E3D' },
  langClose: { marginTop: 20, alignItems: 'center', backgroundColor: '#F0F7EC', padding: 12, borderRadius: 12 },
  langCloseText: { color: '#346E3D', fontWeight: 'bold', fontSize: 16 },
});

