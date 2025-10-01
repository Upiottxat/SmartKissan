import NetInfo from "@react-native-community/netinfo";
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { LANGUAGES } from '../constants/languages';
import { GeminiService } from '../services/GeminiService';

// Interface for a chat message
export interface Message {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  imageUri?: string;
  hasAudio?: boolean;
}

// Interfaces for the Gemini service call
interface StreamChatResponseParams {
  messageText: string;
  imageAsset?: any;
  langInstruction: string;
}

interface StreamChatResponseHandlers {
  onChunk: (streamingText: string) => void;
  onComplete: (finalText: string) => void;
  onError: () => void;
}

// A simple dictionary for offline keyword-based replies.
// This can be expanded with more keywords and responses.
const offlineReplies: { [key: string]: string } = {
  "hello": "Hello! How can I assist you offline?",
  "hi": "Hello! How can I assist you offline?",
  "help": "For assistance, please connect to the internet.",
  "weather": "I am sorry, I cannot fetch weather information while offline.",
  "price": "I need an internet connection to get current market prices.",
};

/**
 * Custom hook to manage the Krishi AI chat logic.
 */
export const useKrishiAI = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    // Set the initial welcome message directly
    {
      id: 1,
      type: 'bot',
      message: "Hello! I am your crop advisory assistant.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [langCode, setLangCode] = useState<string>('auto');
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Finds the language object based on a language code
  const getLangObj = (code: string) => LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  
  // Speaks the given text using Expo's Speech module
  const speakMessage = (text: string) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: langCode !== 'auto' ? langCode : undefined, rate: 0.9 });
    } catch (e) { 
      console.warn('Text-to-speech error', e); 
    }
  };

  // Gets an offline reply using the simple keyword matching dictionary
  const getOfflineReply = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    for (const keyword in offlineReplies) {
      if (message.includes(keyword)) {
        return offlineReplies[keyword];
      }
    }
    // Default fallback message if no keyword is matched
    return "I have limited functionality offline. Please connect to the internet for full assistance.";
  };

  // Handles sending a new message (both online and offline)
  const handleSendMessage = async (text?: string, imageAsset?: any) => {
    const messageText = text || currentMessage;
    if (!messageText.trim() && !imageAsset) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      message: imageAsset ? (messageText.trim() || t("imagePrompt")) : messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUri: imageAsset?.uri,
    };

    const botMessageId = Date.now() + 1;
    const botPlaceholderMessage: Message = {
        id: botMessageId,
        type: 'bot',
        message: '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasAudio: true,
    };

    setMessages(prev => [...prev, userMessage, botPlaceholderMessage]);
    if (!text) setCurrentMessage('');
    setLoading(true);

    const isOnline = await NetInfo.fetch().then(state => state.isConnected);

    if (isOnline) {
      const langInstruction = langCode !== 'auto'
        ? `Important: Your entire response must be in the ${getLangObj(langCode).name} language.`
        : "Important: Detect user's language and respond entirely in that language.";
      
      await GeminiService.streamChatResponse(
        { messageText, imageAsset, langInstruction } as StreamChatResponseParams,
        {
          onChunk: (streamingText: string) => {
            setMessages(prev => prev.map(msg => 
              msg.id === botMessageId ? { ...msg, message: streamingText } : msg
            ));
          },
          onComplete: (finalText: string) => {
            setLoading(false);
            speakMessage(finalText);
          },
          onError: () => {
            const errorMessage = t('alerts.fallbackError');
            setMessages(prev => prev.map(msg => 
              msg.id === botMessageId ? { ...msg, message: errorMessage } : msg
            ));
            speakMessage(errorMessage);
            setLoading(false);
          }
        } as StreamChatResponseHandlers
      );
    } else {
      // Simplified Offline Logic
      const reply = getOfflineReply(messageText);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, message: reply } : msg
      ));
      speakMessage(reply);
      setLoading(false);
    }
  };
  
  return { messages, currentMessage, setCurrentMessage, loading, langCode, setLangCode, scrollViewRef, handleSendMessage, getLangObj, i18n };
};

