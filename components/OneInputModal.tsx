import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";

type OneInputModalProps = {
  visible: boolean;
  title: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  onClose: () => void;
  onAction: () => void;
  actionText: string;
  inputType?: string;
  maxCharacters?: number;
  minCharacters?: number;
};

const OneInputModal: React.FC<OneInputModalProps> = ({
  visible,
  title,
  inputValue,
  setInputValue,
  placeholder,
  onClose,
  onAction,
  actionText,
  inputType = "default",
  maxCharacters = 6,
  minCharacters = 0,
}) => {
  const [error, setError] = useState<string>("");

  const handleAction = () => {
    if (
      inputValue.length >= minCharacters &&
      inputValue.length <= maxCharacters
    ) {
      setError("");
      onAction();
    } else {
      setError(
        `Input must be between ${minCharacters} and ${maxCharacters} characters.`
      );
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={inputValue}
            onChangeText={setInputValue}
            maxLength={maxCharacters}
            keyboardType={inputType === "number" ? "numeric" : "default"}
            placeholder={placeholder}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAction}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>{actionText}</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: Colors.negativeRed,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 45,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.negativeRed,
  },
  errorText: {
    color: Colors.negativeRed,
    marginBottom: 20,
  },
});

export default OneInputModal;
