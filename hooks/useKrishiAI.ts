import { useState, useRef, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { GeminiService } from '../services/GeminiService';
import { LANGUAGES } from '../constants/languages';

export interface Message {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  imageUri?: string;
  hasAudio?: boolean;
}

export const useKrishiAI = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [langCode, setLangCode] = useState<string>('auto');
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      message: t('initialBotMessage'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true,
    }]);
  }, [t]);

  const getLangObj = (code: string) => LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  
  const speakMessage = (text: string) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: langCode !== 'auto' ? langCode : undefined, rate: 0.9 });
    } catch (e) { console.warn('TTS error', e); }
  };

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

    setMessages(prev => [...prev, userMessage]);
    if (!text) setCurrentMessage('');
    setLoading(true);

    const botMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: botMessageId, type: 'bot', message: '...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hasAudio: true,
    }]);
    
    const langInstruction = langCode !== 'auto'
      ? `Important: Your entire response must be in the ${getLangObj(langCode).name} language.`
      : "Important: Detect user's language and respond entirely in that language.";

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
        setLoading(false);
        setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, message: t('alerts.fallbackError') } : msg
        ));
        speakMessage(t('alerts.fallbackError'));
      }
      } as StreamChatResponseHandlers
    );
  };
  
  return { messages, currentMessage, setCurrentMessage, loading, langCode, setLangCode, scrollViewRef, handleSendMessage, getLangObj, i18n };
};

