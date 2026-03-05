import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

// Get bottom inset from initial metrics (works even inside Modal on Android)
const BOTTOM_INSET = initialWindowMetrics?.insets?.bottom ?? 0;

const CustomBottomSheet = ({ visible, children, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={[styles.container, { paddingBottom: 20 + BOTTOM_INSET }]}>
          <View style={styles.dragger} />
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    backgroundColor: '#fff',
  },
  dragger: {
    width: 40,
    height: 5,
    borderRadius: 10,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default CustomBottomSheet;
