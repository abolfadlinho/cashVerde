import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import InfoModal from "../components/InfoModal";
import FirebaseAPI from "../firebase/endpoints";
import { Colors } from "@/constants/Colors";

const MaintenanceLog = () => {
  const [machines, setMachines] = useState<
    {
      id: string;
      name: any;
      longitude: number | null;
      latitude: number | null;
      notes: any;
      active: any;
      createdAt: any;
      maintenance: any;
    }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const fetchedMachines = await FirebaseAPI.getMaintenanceLog();
      setMachines(fetchedMachines);
    } catch (error) {
      setErrorMsg("Error fetching maintenance log");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Maintenance Logs</Text>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primaryColor}
            style={styles.loader}
          />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <>
            <View style={{ flex: 1, padding: 10 }}>
              <FlatList
                data={machines}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      setRefreshing(true);
                      fetchData();
                    }}
                  />
                }
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
                        )
                      }
                      style={styles.cardContent}
                    >
                      <Text style={styles.machineName}>{item.name}</Text>
                      {Array.isArray(item.maintenance) &&
                      item.maintenance.length > 0 ? (
                        <View style={styles.maintenanceInfo}>
                          {item.maintenance.map(
                            (maintenance: any, index: number) => (
                              <View key={index} style={{ marginTop: 5 }}>
                                {/* Ensures each is separate */}
                                <Text style={styles.distanceText}>
                                  {`Maintenance on ${new Date(
                                    maintenance.date
                                  ).toLocaleDateString()} - ${
                                    maintenance.notes
                                  }`}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedNotes(item.notes);
                        setModalVisible(true);
                      }}
                      style={styles.infoIcon}
                    >
                      <MaterialIcons
                        name="info-outline"
                        size={24}
                        color={Colors.greenText}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </>
        )}
      </View>
      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Machine Notes"
        content={selectedNotes}
      />
    </SafeAreaView>
  );
};

export default MaintenanceLog;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  loader: { marginTop: 20 },
  errorText: { fontSize: 16, color: Colors.negativeRed, textAlign: "center" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  machineName: { fontSize: 16, fontWeight: "bold", color: Colors.greenText },
  distanceText: {
    fontSize: 14,
    color: Colors.greyText,
    marginRight: 10,
  },
  cardContent: { flex: 1 },
  infoIcon: { marginLeft: 10 },
  calloutText: {
    fontSize: 14,
    color: Colors.greyText,
    marginLeft: 5,
    marginRight: 10,
    width: 200,
  },
  maintenanceInfo: {
    alignItems: "flex-start",
    marginTop: 4,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
});
