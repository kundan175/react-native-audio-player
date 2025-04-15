import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal 
} from 'react-native';
import Slider from '@react-native-community/slider';

interface VolumeModalProps {
  visible: boolean;
  volume: number;
  onClose: () => void;
  onVolumeChange: (value: number) => void;
}

const VolumeModal: React.FC<VolumeModalProps> = ({
  visible,
  volume,
  onClose,
  onVolumeChange
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.volumeModalContainer}>
          <Text style={styles.volumeTitle}>Volume</Text>
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={onVolumeChange}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#4D4D4D"
            thumbTintColor="#FFFFFF"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  volumeModalContainer: {
    backgroundColor: '#2D2D2D',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  volumeTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Inter-Medium',
  },
  volumeSlider: {
    width: '100%',
    height: 40,
  },
});

export default VolumeModal; 