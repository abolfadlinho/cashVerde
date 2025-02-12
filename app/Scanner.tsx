import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../contexts/authProvider";
import FirebaseAPI from "@/firebase/endpoints";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

const Scanner = () => {
  const [machineName, setMachineName] = useState("");
  const [points, setPoints] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [confirmed, setConfirmed] = useState(false);
  const { userDetails } = useAuth();
  const router = useRouter();

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
      } else {
        Alert.alert(
          "Invalid QR Code",
          "The scanned QR code does not contain valid machine data."
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Scanner Error", String(error));
    }
  };

  const handleSubmit = async () => {
    try {
      setConfirmed(true);
      await FirebaseAPI.scan(userDetails?.userId || "", machineName, points);
      Alert.alert("Scan Successful", `You received ${points} points!`);
      router.replace({ pathname: "/(tabs)/home" });
    } catch (error) {
      setConfirmed(false);
      console.log(error);
      Alert.alert("Error", "Machine was scanned less than 5 minutes ago.");
      router.replace({ pathname: "/(tabs)/home" });
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
          <Ionicons name="qr-code-outline" size={36} color="white" />
          <Text style={styles.headerTitle}>QR Scanner</Text>
        </View>

        <View style={styles.bodySection}>
          {scanned ? (
            <View style={styles.scanResultContainer}>
              <Text style={styles.scanResultText}>
                <Text style={styles.bold}>{machineName}</Text>
              </Text>
              <Text style={styles.scanResultText}>
                ⚡<Text style={styles.bold}>{points}</Text> points earned!
              </Text>

              {!confirmed && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleSubmit}
                >
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              )}
              {confirmed && (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              )}
              <Image
                source={require("../assets/images/krabs.gif")}
                resizeMode="contain"
                style={{ width: "90%" }}
              />
              <TouchableOpacity
                style={styles.scanAgainButton}
                onPress={resetScanner}
              >
                <Ionicons name="refresh-circle" size={24} color="white" />
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {!scanned && (
                <CameraView
                  style={styles.camera}
                  onBarcodeScanned={(event) => handleScan(event.data)}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                >
                  <View style={styles.overlay}>
                    <Ionicons name="scan-outline" size={50} color="white" />
                    <Text style={styles.overlayText}>
                      Scan the QR code on the machine 📷
                    </Text>
                  </View>
                </CameraView>
              )}
            </>
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
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
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
    marginTop: 10,
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
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  scanAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondaryColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  scanAgainButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Scanner;
