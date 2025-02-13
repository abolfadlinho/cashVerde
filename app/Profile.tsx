import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import InfoModal from "@/components/InfoModal";
import FirebaseAPI from "@/firebase/endpoints";
import { ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { dummyBadges, Badge } from "@/constants/Types";

const Profile = () => {
  const route = useRoute<RouteProp<{ params: { userId: string } }, "params">>();
  const { userId } = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    FirebaseAPI.getUserProfile(userId).then((data) => setUserData(data));
  }, [userId]);

  const openModal = (badge: Badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBadge(null);
  };

  const renderBadges = ({ item }: { item: Badge }) => (
    <TouchableOpacity
      style={[
        styles.badgeContainer,
        {
          backgroundColor:
            (userData?.totalPoints ?? 0) >= item.threshold
              ? Colors.primaryColor
              : Colors.locked,
        },
      ]}
      onPress={() => openModal(item)}
    >
      <Icon name={item.icon} size={40} color="#fff" style={styles.badgeIcon} />
      <Text style={styles.badgeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: !userData ? Colors.whiteColor : Colors.primaryColor,
        },
      ]}
    >
      {userData ? (
        <View style={styles.topContainer}>
          <View style={styles.header}>
            <Text style={styles.communityName}>{userData.username}</Text>
          </View>
          <View style={{ padding: 16 }}>
            <View style={styles.statisticsSection}>
              <Text style={styles.sectionTitle}>♻️ Recycling Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {userData?.currentPoints}
                  </Text>
                  <Text style={styles.statLabel}>Total Points</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{userData?.monthPoints}</Text>
                  <Text style={styles.statLabel}>Points this Month</Text>
                </View>
              </View>
            </View>
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>🏅 Badges</Text>
              <FlatList
                data={dummyBadges}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                renderItem={renderBadges}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
      <InfoModal
        visible={isModalVisible}
        onClose={closeModal}
        title={selectedBadge?.name}
        content={selectedBadge?.notes ?? ""}
        showExtra={
          (userData?.totalPoints ?? 0) < (selectedBadge?.threshold ?? 0)
        }
        extraText={
          selectedBadge
            ? `${
                selectedBadge.threshold - (userData?.totalPoints ?? 0)
              } more points needed`
            : ""
        }
      />
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
  communityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  badgeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    elevation: 4,
  },
  badgeIcon: {
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  statisticsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.greyText,
  },
  badgesSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
