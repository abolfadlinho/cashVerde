import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

type HelpModalProps = {
  visible: boolean;
  onClose: () => void;
  onChatPress: () => void;
};

const HelpModal: React.FC<HelpModalProps> = ({
  visible,
  onClose,
  onChatPress,
}) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Need Help?</Text>
          <TouchableOpacity style={styles.helpItem} onPress={onChatPress}>
            <Icon
              name="chatbubble-outline"
              size={24}
              color={Colors.primaryColor}
            />
            <Text style={styles.helpText}>FAQs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Icon name="mail-outline" size={24} color={Colors.primaryColor} />
            <Text style={styles.helpText}>Email: support@example.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Icon name="call-outline" size={24} color={Colors.primaryColor} />
            <Text style={styles.helpText}>Phone: +123 456 7890</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  helpText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: Colors.primaryColor,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 7,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HelpModal;
