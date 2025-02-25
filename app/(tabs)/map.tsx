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
import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import InfoModal from "../../components/InfoModal";
import FirebaseAPI from "../../firebase/endpoints";
import { Colors } from "@/constants/Colors";

const RecyclingMachines = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
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
  const [sortedMachines, setSortedMachines] = useState<
    {
      id: string;
      name: any;
      longitude: number | null;
      latitude: number | null;
      notes: any;
      active: any;
      createdAt: any;
      distance: number;
      maintenance: any;
    }[]
  >([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number | null,
    lon2: number | null
  ) => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371;
    if (lat2 === null || lon2 === null) {
      return Infinity;
    }
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchData = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      const fetchedMachines = await FirebaseAPI.getMachinesForDisplay();
      const validMachines = fetchedMachines.filter(
        (machine) => machine.latitude !== null && machine.longitude !== null
      );
      const sorted = validMachines
        .map((machine) => ({
          ...machine,
          distance: getDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            machine.latitude,
            machine.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
      setMachines(validMachines);
      setSortedMachines(sorted);
    } catch (error) {
      setErrorMsg("Error fetching location or machines");
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
        <Text style={styles.headerText}>Recycling Machines Near You</Text>
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
            {location && (
              <MapView
                style={styles.map}
                showsUserLocation={true}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
              >
                {sortedMachines.map(
                  (machine) =>
                    machine.latitude !== null &&
                    machine.longitude !== null && (
                      <Marker
                        key={machine.id}
                        coordinate={{
                          latitude: machine.latitude,
                          longitude: machine.longitude,
                        }}
                        pinColor={
                          machine.maintenance
                            ? Colors.secondaryColor
                            : Colors.primaryColor
                        }
                      >
                        <Callout
                          onPress={() =>
                            Linking.openURL(
                              `https://www.google.com/maps?q=${machine.latitude},${machine.longitude}`
                            )
                          }
                        >
                          <Text style={styles.machineName}>{machine.name}</Text>
                          {machine.maintenance ? (
                            <View style={styles.maintenanceInfo}>
                              <MaterialIcons
                                name="warning"
                                size={20}
                                color={Colors.warning}
                              />
                              <Text
                                style={styles.calloutText}
                              >{`Maintenance on ${new Date(
                                machine.maintenance.date
                              ).toLocaleDateString()} - ${
                                machine.maintenance.notes
                              }`}</Text>
                            </View>
                          ) : null}
                          <Text style={styles.calloutText}>
                            {machine.notes}
                          </Text>
                        </Callout>
                      </Marker>
                    )
                )}
              </MapView>
            )}
            <View style={{ height: 400 }}>
              <FlatList
                data={sortedMachines}
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
                      {item.maintenance ? (
                        <View style={styles.maintenanceInfo}>
                          <MaterialIcons
                            name="warning"
                            size={20}
                            color={Colors.warning}
                          />
                          <Text
                            style={styles.distanceText}
                          >{`Maintenance on ${item.maintenance.date.toLocaleDateString()} - ${
                            item.maintenance.notes
                          }`}</Text>
                        </View>
                      ) : null}
                      <Text style={styles.distanceText}>
                        Distance: {item.distance?.toFixed(2)} km
                      </Text>
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

export default RecyclingMachines;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.whiteColor, marginBottom: 30 },
  container: { flex: 1, padding: 16 },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.greenText,
    textAlign: "center",
    marginBottom: 10,
  },
  map: { flex: 1, borderRadius: 12 },
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
    marginRight: 10,
    width: 200,
  },
  maintenanceInfo: { flexDirection: "row", alignItems: "center", marginTop: 4 },
});
