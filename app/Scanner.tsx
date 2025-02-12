import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../contexts/authProvider";
import FirebaseAPI from "@/firebase/endpoints";
import { Colors } from "@/constants/Colors";

const Scanner = () => {
  const [machineName, setMachineName] = useState("");
  const [points, setPoints] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false); // Flag to track processing state
  const { userDetails } = useAuth();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleScan = async (data: string) => {
    setScanned(true); // Stop the camera temporarily
    try {
      data = data.replace(/'/g, '"');
      console.log("New data:", data);
      const parsedData = JSON.parse(data);
      if (parsedData.machineName && parsedData.points) {
        setMachineName(parsedData.machineName);
        setPoints(parsedData.points);
        await FirebaseAPI.scan(
          userDetails?.userId || "",
          parsedData.machineName,
          parsedData.points
        );
        Alert.alert(
          "Scan Successful",
          `You received ${parsedData.points} points!`
        );
      } else {
        Alert.alert(
          "Invalid QR Code",
          "The scanned QR code does not contain valid machine data."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Scanner Error", String(error));
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false); // Reset the scanner to allow scanning again
    setMachineName("");
    setPoints(0);
  };

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scanner</Text>
        </View>
        <View style={styles.bodySection}>
          {scanned ? (
            <View style={styles.scanResultContainer}>
              <Text style={styles.scanResultText}>
                Points received: {points}
              </Text>
              <Button title="Scan Again" onPress={resetScanner} />
            </View>
          ) : (
            <CameraView
              style={styles.camera}
              onBarcodeScanned={
                scanned || isProcessing
                  ? undefined
                  : (event) => {
                      if (!isProcessing) {
                        setIsProcessing(true);
                        handleScan(event.data);
                      }
                    }
              }
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            >
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>
                  Scan the QR code on the machine.
                </Text>
              </View>
            </CameraView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  topContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  bodySection: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayText: {
    fontSize: 18,
    color: Colors.whiteColor,
    textAlign: "center",
  },
  scanResultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scanResultText: {
    fontSize: 22,
    color: Colors.greenText,
    marginBottom: 16,
  },
});

export default Scanner;
