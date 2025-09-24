import React from 'react';
import { Modal, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../constants/styles';

interface ImagePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ visible, imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBg}>
        <Image source={{ uri: imageUrl }} style={styles.modalImage} resizeMode="contain" />
        <TouchableOpacity style={styles.modalClose} onPress={onClose}>
          <Ionicons name="close-circle" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ImagePreviewModal;

