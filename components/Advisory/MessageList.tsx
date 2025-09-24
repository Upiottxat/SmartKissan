import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { styles } from '../../constants/styles';
import { Message } from '../../hooks/useKrishiAI';
import TText from '../TText';
import { useTranslation } from 'react-i18next';

interface MessageListProps {
  messages: Message[];
  scrollViewRef: React.RefObject<ScrollView>;
  loading: boolean;
  onImagePress: (uri: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, scrollViewRef, loading, onImagePress }) => {
  const { t } = useTranslation();
  
  const renderMessage = (msg: Message) => (
    <View key={msg.id} style={[styles.messageRow, msg.type === 'user' ? styles.messageRowUser : styles.messageRowBot]}>
      {msg.type === 'bot' && <View style={styles.avatar}><Text>🌱</Text></View>}
      <View style={[styles.bubble, msg.type === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
        {msg.imageUri && (
          <TouchableOpacity onPress={() => onImagePress(msg.imageUri!)}>
            <Image source={{ uri: msg.imageUri }} style={styles.messageImage} />
          </TouchableOpacity>
        )}
        {msg.type === 'bot' ? (
          <Markdown style={{ body: { fontSize: 16, lineHeight: 24 } }}>{msg.message || ''}</Markdown>
        ) : (
          <Text style={[styles.messageText, styles.messageTextUser]}>{msg.message}</Text>
        )}
        <Text style={styles.timestamp}>{msg.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView ref={scrollViewRef} style={styles.messagesArea} contentContainerStyle={styles.messagesContent} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
      {messages.map(renderMessage)}
      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator color="#346E3D" />
          <TText style={styles.typingText}>{t('typingIndicator')}</TText>
        </View>
      )}
    </ScrollView>
  );
};

export default MessageList;

