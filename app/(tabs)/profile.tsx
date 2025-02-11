import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../contexts/authProvider";
import { auth } from "../../firebase/firebase";
import { useRouter } from "expo-router";
import ConfirmationModal from "@/components/ConfirmationModal";
import InfoModal from "@/components/InfoModal";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface User {
  name: string;
  phoneNumber: string;
  totalRecycled: number;
  monthlyRecycled: number;
}

interface Badge {
  id: number;
  name: string;
  icon: string;
  notes: string;
  threshold: number;
}

type RootStackParamList = {
  Profile: undefined;
  MaintenanceLog: undefined;
  MyVouchers: { voucherIds: string[] };
};

const dummyBadges: Badge[] = [
  {
    id: 1,
    name: "Eco Warrior",
    icon: "leaf",
    notes: "Recycled 5+ items",
    threshold: 5,
  },
  {
    id: 2,
    name: "Recycle Master",
    icon: "star",
    notes: "Recycled 10+ items",
    threshold: 10,
  },
  {
    id: 3,
    name: "Waste Reducer",
    icon: "trash",
    notes: "Recycled 25+ items",
    threshold: 25,
  },
  {
    id: 4,
    name: "Green Innovator",
    icon: "bulb",
    notes: "Recycled 50+ items",
    threshold: 50,
  },
  {
    id: 5,
    name: "Sustainability Champion",
    icon: "trophy",
    notes: "Recycled 100+ items",
    threshold: 100,
  },
];

const Profile = () => {
  type CommunitiesScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Profile"
  >;
  const navigation = useNavigation<CommunitiesScreenNavigationProp>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isConvertModalVisible, setConvertModalVisible] = useState(false);
  const [isSendModalVisible, setSendModalVisible] = useState(false);
  const { userDetails } = useAuth();
  const router = useRouter();

  const openModal = (badge: Badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBadge(null);
  };

  const handleMaintenanceLog = () => {
    navigation.navigate("MaintenanceLog");
  };

  const renderBadges = ({ item }: { item: Badge }) => (
    <TouchableOpacity
      style={[
        styles.badgeContainer,
        {
          backgroundColor:
            (userDetails?.totalPoints ?? 0) >= item.threshold
              ? Colors.primaryColor
              : "#BDC3C7",
        },
      ]}
      onPress={() => openModal(item)}
    >
      <Icon name={item.icon} size={40} color="#fff" style={styles.badgeIcon} />
      <Text style={styles.badgeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderStatistics = () => (
    <>
      <View style={styles.statisticsSection}>
        <Text style={styles.sectionTitle}>♻️ Recycling Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userDetails?.currentPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userDetails?.monthPoints}</Text>
            <Text style={styles.statLabel}>Points this Month</Text>
          </View>
        </View>
        <View style={styles.walletButtonsRow}>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => setConvertModalVisible(true)}
          >
            <Text style={styles.walletButtonText}>Convert Points to Cash</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statisticsSection}>
        <Text style={styles.sectionTitle}>💸 Wallet</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userDetails?.wallet}</Text>
            <Text style={styles.statLabel}>EGP</Text>
          </View>
        </View>
        <View style={styles.walletButtonsRow}>
          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => setSendModalVisible(true)}
          >
            <Text style={styles.walletButtonText}>Send Cash to Bank</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderConfirmationModal = (
    isVisible: boolean,
    onClose: () => void,
    action: string
  ) => (
    <ConfirmationModal
      visible={isVisible}
      onClose={onClose}
      onConfirm={() => {
        onClose();
      }}
      title="Are you sure?"
      description={`Do you want to ${action}?`}
    />
  );

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace({ pathname: "../../" });
  };

  const handleMyVouchersPress = async () => {
    navigation.navigate("MyVouchers", {
      voucherIds: userDetails?.voucherIds ?? [],
    });
  };

  const renderActionButtons = () => (
    <View style={styles.actionsSection}>
      <Text style={styles.sectionTitle}>More</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleMyVouchersPress}
      >
        <Icon name="ticket" size={24} color="#fff" style={styles.actionIcon} />
        <Text style={styles.actionText}>Redeemed Vouchers</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Icon
          name="leaf-outline"
          size={24}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>View Recycling Tips</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => handleMaintenanceLog()}
      >
        <Icon
          name="time-outline"
          size={24}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>View Machine Maintenance Log</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButtonLogOut}
        onPress={() => handleSignOut()}
      >
        <Icon
          name="log-out-outline"
          size={24}
          color="#fff"
          style={styles.actionIcon}
        />
        <Text style={styles.actionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.userName}>{userDetails?.username}</Text>
      <Text style={styles.userPhone}>{userDetails?.email}</Text>
      <Text style={styles.userPhone}>{userDetails?.phone}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={[{}]}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            {renderStatistics()}
          </>
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>🏅 Badges</Text>
              <FlatList
                data={dummyBadges}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                renderItem={renderBadges}
              />
            </View>
            {renderActionButtons()}
            {renderConfirmationModal(
              isConvertModalVisible,
              () => setConvertModalVisible(false),
              "convert your points to cash"
            )}
            {renderConfirmationModal(
              isSendModalVisible,
              () => setSendModalVisible(false),
              "send cash to your bank account"
            )}
          </>
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        style={styles.container}
      />

      <InfoModal
        visible={isModalVisible}
        onClose={closeModal}
        title={selectedBadge?.name}
        content={selectedBadge?.notes ?? ""}
        showExtra={
          (userDetails?.totalPoints ?? 0) < (selectedBadge?.threshold ?? 0)
        }
        extraText={
          selectedBadge
            ? `${
                selectedBadge.threshold - (userDetails?.totalPoints ?? 0)
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
    marginBottom: 30,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.whiteColor,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  userPhone: {
    fontSize: 16,
    color: Colors.greyText,
  },
  statisticsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
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
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionButtonLogOut: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.negativeRed,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  badgesSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  walletButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  walletButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
  },
  walletButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Profile;
