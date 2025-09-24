import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { styles } from '../../constants/styles';
import TText from '../TText';

interface ChatHeaderProps {
  langCode: string;
  getLangObj: (code: string) => { native: string };
  onLanguagePress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ langCode, getLangObj, onLanguagePress }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <Ionicons name="leaf-outline" size={28} color="#fff" />
      <View>
        <TText style={styles.headerTitle}>{t('headerTitle')}</TText>
        <TText style={styles.headerSub}>{t('headerSub')}</TText>
      </View>
      <TouchableOpacity style={styles.langBtn} onPress={onLanguagePress}>
        <Ionicons name="language-outline" size={22} color="#fff" />
        <Text style={styles.langBtnText}>{getLangObj(langCode).native}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;

