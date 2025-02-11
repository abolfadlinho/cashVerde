import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import FirebaseAPI from "../../firebase/endpoints"; // Adjust path as needed
import { useAuth } from "../../contexts/authProvider"; // Adjust path as needed
import { auth } from "../../firebase/firebase";
import { Colors } from "@/constants/Colors";

const MachinesTab = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userDetails } = useAuth();

  const fetchMachines = async () => {
    try {
      //const snapshot = await FirebaseAPI.getMachinesForDisplay();
      const snapshot = await FirebaseAPI.fetchCommunitiesUingIds(
        userDetails?.communities
      );
      setMachines(snapshot);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMachines();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading machines...</Text>
          </View>
        ) : (
          <FlatList
            data={machines}
            keyExtractor={(item) => item?.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#0000ff"]}
              />
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.title}>{item?.name}</Text>
                <Text style={styles.info}>Longitude: {item?.longitude}</Text>
                <Text style={styles.info}>Latitude: {item?.latitude}</Text>
                <Text style={styles.info}>
                  Maintenance:{" "}
                  {item?.maintenance
                    ? `${item?.maintenance.date} - ${item?.maintenance.notes}`
                    : "null"}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  info: { fontSize: 14, color: "#555" },
});

export default MachinesTab;
