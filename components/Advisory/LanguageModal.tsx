import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../constants/styles';
import { LANGUAGES } from '../../constants/languages';
import { useTranslation } from 'react-i18next';
import TText from '../TText';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  currentLangCode: string;
  onSaveLanguage: (code: string) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, currentLangCode, onSaveLanguage }) => {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.langModalBg} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.langModal}>
            <TText style={styles.langModalTitle}>{t('langModalTitle')}</TText>
            <ScrollView>
              {LANGUAGES.map(l => (
                <TouchableOpacity key={l.code} style={[styles.langItem, l.code === currentLangCode && styles.langItemActive]} onPress={() => { onSaveLanguage(l.code); onClose(); }}>
                  <Text style={[styles.langName, l.code === currentLangCode && styles.langNameActive]}>{l.native} • {l.name}</Text>
                  {l.code === currentLangCode && <Ionicons name="checkmark-circle" size={22} color="#346E3D" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.langClose} onPress={onClose}>
              <TText style={styles.langCloseText}>{t('langModalClose')}</TText>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default LanguageModal;

