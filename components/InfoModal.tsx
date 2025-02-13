import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  content: string;
  extraText?: string | null;
  showExtra?: boolean;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  title,
  content,
  extraText = null,
  showExtra = false,
}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          <Text style={styles.modalText}>{content}</Text>

          {showExtra && extraText && (
            <Text style={styles.modalNotes}>{extraText}</Text>
          )}

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  modalNotes: {
    fontSize: 16,
    color: Colors.greyText,
    marginBottom: 16,
    textAlign: "center",
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
    color: Colors.greyText,
    marginBottom: 20,
  },
});

export default InfoModal;
