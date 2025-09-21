import { Ionicons } from '@expo/vector-icons';
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Your Gemini API Key
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

interface Message {
  id: number;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
  hasAudio?: boolean;
  hasSteps?: boolean;
  steps?: Array<{
    id: number;
    text: string;
    completed: boolean;
  }>;
}

// Custom instructions for the Gemini model
const KRISHIMITRA_PROMPT = `
You are kisanMirtra, an intelligent and friendly virtual assistant for farmers.  
Your role is to provide simple, reliable, and localized crop advisory to small and marginal farmers.  

Guidelines for responses:
1. Always respond in the farmer’s preferred language (detected or chosen by the user).  
2. Keep responses short, simple, and practical – avoid technical jargon unless asked.  
3. Provide guidance on:
   - Crop selection based on season, soil, and region.
   - Pest and disease identification + organic/chemical solutions.
   - Best practices for irrigation, fertilizer use, and harvesting.
   - Government schemes, subsidies, and market price info.  
4. If location data is available, give region-specific advice (weather, soil type, rainfall).  
5. If offline, provide cached/previously saved general advice and notify the farmer when online services are needed (like market rates or weather).  
6. Always be empathetic, supportive, and encouraging – like a knowledgeable village guide.  
7. If you don’t know an answer, guide the farmer to the nearest agricultural officer, Krishi Vigyan Kendra (KVK), or provide a trusted helpline number.`;

export default function Advisory() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm your crop advisory assistant. How can I help you today? 👋",
      timestamp: '10:30 AM',
      hasAudio: true,
    },
  ]);

  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false); // To handle network status

  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize Gemini model
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const quickActions = [
    { id: 1, text: 'Pest identification', icon: '🐛' },
    { id: 2, text: 'Disease diagnosis', icon: '🦠' },
    { id: 3, text: 'Irrigation advice', icon: '💧' },
    { id: 4, text: 'Fertilizer guide', icon: '🧪' },
    { id: 5, text: 'Weather planning', icon: '🌤️' },
    { id: 6, text: 'Harvest timing', icon: '🌾' },
  ];

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || loading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    // Simulate bot response with Gemini API
    try {
      if (offline) {
        const cachedResponse = await AsyncStorage.getItem(currentMessage.trim());
        const reply = cachedResponse
          ? cachedResponse
          : "I'm currently offline. Please check back later or try asking a general question.";
        const botResponse: Message = {
          id: messages.length + 2,
          type: 'bot',
          message: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasAudio: true,
        };
        setMessages(prev => [...prev, botResponse]);
      } else {
        const fullPrompt = `${KRISHIMITRA_PROMPT}\nUser query: ${currentMessage}`;
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        const botResponse: Message = {
          id: messages.length + 2,
          type: 'bot',
          message: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasAudio: true,
        };

        setMessages(prev => [...prev, botResponse]);
        await AsyncStorage.setItem(currentMessage.trim(), responseText);
      }
      setOffline(false); // Reset offline status on successful API call
    } catch (error) {
      console.error('Gemini API Error:', error);
      setOffline(true);
      let errorMessage = "There was a network error. I'll provide general advice or try again later.";
      
      // Check if the error is due to quota limits
      if (error.message && error.message.includes('429')) {
        errorMessage = "I'm getting a lot of requests right now. Please wait a minute and try again. 🙏";
      }

      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        message: errorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasAudio: true,
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setCurrentMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleStepCompletion = (messageId: number, stepId: number) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId && msg.hasSteps) {
          return {
            ...msg,
            steps: msg.steps?.map(step =>
              step.id === stepId ? { ...step, completed: !step.completed } : step
            ),
          };
        }
        return msg;
      })
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.type === 'user';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isUser && styles.messageContainerUser]}>
        <View style={[styles.avatarContainer, isUser && styles.avatarContainerUser]}>
          <View style={[styles.avatar, isUser ? styles.avatarUser : styles.avatarBot]}>
            <Ionicons
              name={isUser ? 'person' : 'chatbubble'}
              size={16}
              color={isUser ? '#666' : '#fff'}
            />
          </View>
        </View>

        <View style={[styles.messageContent, isUser && styles.messageContentUser]}>
          <View style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleBot]}>
            <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
              {message.message}
            </Text>

            {message.hasSteps && message.steps && (
              <View style={styles.stepsContainer}>
                {message.steps.map(step => (
                  <TouchableOpacity
                    key={step.id}
                    style={styles.stepItem}
                    onPress={() => toggleStepCompletion(message.id, step.id)}
                  >
                    <Ionicons
                      name={step.completed ? 'checkmark-circle' : 'ellipse-outline'}
                      size={16}
                      color={step.completed ? '#4CAF50' : '#666'}
                    />
                    <Text style={[styles.stepText, step.completed && styles.stepTextCompleted]}>
                      {step.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.messageFooter}>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
              {message.hasAudio && !isUser && (
                <TouchableOpacity style={styles.audioButton}>
                  <Ionicons name="volume-medium" size={12} color="#666" />
                  <Text style={styles.audioButtonText}>Play Audio</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.botAvatar}>
              <Ionicons name="chatbubble" size={24} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Crop Advisory Assistant</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online • Responds in Hindi/English</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4CAF50" />
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.quickActionsTitle}>Quick Actions:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.quickActionsScroll}
            >
              {quickActions.map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionButton}
                  onPress={() => handleQuickAction(action.text)}
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text style={styles.quickActionText}>{action.text}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <View style={styles.messageInput}>
              <TextInput
                style={styles.textInput}
                value={currentMessage}
                onChangeText={setCurrentMessage}
                placeholder="Ask about your crops..."
                multiline
                maxLength={500}
                editable={!loading}
              />
              <View style={styles.inputActions}>
                <TouchableOpacity
                  style={styles.inputActionButton}
                  onPress={() => setIsListening(!isListening)}
                  disabled={loading}
                >
                  <Ionicons
                    name="mic"
                    size={20}
                    color={isListening ? '#F44336' : '#666'}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputActionButton} disabled={loading}>
                  <Ionicons name="camera" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.sendButton, (!currentMessage.trim() || loading) && styles.sendButtonDisabled]}
              onPress={handleSendMessage}
              disabled={!currentMessage.trim() || loading}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {isListening && (
            <View style={styles.listeningIndicator}>
              <View style={styles.listeningDot} />
              <Text style={styles.listeningText}>Listening... (Tap mic to stop)</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageContainerUser: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatarContainerUser: {
    marginRight: 0,
    marginLeft: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBot: {
    backgroundColor: '#4CAF50',
  },
  avatarUser: {
    backgroundColor: '#E0E0E0',
  },
  messageContent: {
    flex: 1,
    maxWidth: '85%',
  },
  messageContentUser: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleBot: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageBubbleUser: {
    backgroundColor: '#4CAF50',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1a1a1a',
  },
  messageTextUser: {
    color: '#fff',
  },
  stepsContainer: {
    marginTop: 12,
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  stepTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#4CAF50',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  audioButtonText: {
    fontSize: 10,
    color: '#666',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickActionsSection: {
    marginBottom: 12,
  },
  quickActionsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  quickActionsScroll: {
    flexDirection: 'row',
  },
  quickActionButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionIcon: {
    fontSize: 14,
  },
  quickActionText: {
    fontSize: 11,
    color: '#666',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    minHeight: 36,
    textAlignVertical: 'center',
  },
  inputActions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  inputActionButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  listeningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  listeningText: {
    fontSize: 12,
    color: '#D32F2F',
  },
});