import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, value, onValueChange }) => {
  const toggleCheckbox = () => {
    onValueChange(!value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggleCheckbox}
        style={styles.checkboxContainer}
      >
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
          {value && <View style={styles.checkmark} />}
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#27ae60",
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default Checkbox;
