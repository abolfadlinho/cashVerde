import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
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
import FirebaseAPI from "@/firebase/endpoints";
import OneInputModal from "@/components/OneInputModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { RootStackParamList, User, Badge } from "@/constants/Types";

const dummyBadges: Badge[] = [
  {
    id: 1,
    name: "Eco Warrior",
    icon: "leaf",
    notes: "Collected 5+ points",
    threshold: 5,
  },
  {
    id: 2,
    name: "Recycle Master",
    icon: "star",
    notes: "Collected 10+ points",
    threshold: 10,
  },
  {
    id: 3,
    name: "Waste Reducer",
    icon: "trash",
    notes: "Collected 25+ points",
    threshold: 25,
  },
  {
    id: 4,
    name: "Green Innovator",
    icon: "bulb",
    notes: "Collected 50+ points",
    threshold: 50,
  },
  {
    id: 5,
    name: "Sustainability Champion",
    icon: "trophy",
    notes: "Collected 100+ points",
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
  const [isBankModalVisible, setBankModalVisible] = useState(false);
  const { userDetails } = useAuth();
  const [bankAccount, setBankAccount] = useState("");
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

  const handleConvertPoints = async () => {
    setConvertModalVisible(false);
    await FirebaseAPI.convertPointsToCash(userDetails?.userId);
  };

  const handleSendCash = async () => {
    setSendModalVisible(false);
    await FirebaseAPI.sendCashToBank(userDetails?.userId);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace({ pathname: "../../" });
  };

  const handleMyVouchersPress = async () => {
    navigation.navigate("MyVouchers", {
      voucherIds: userDetails?.voucherIds ?? [],
    });
  };

  const handleBankAccountInput = async () => {
    setBankModalVisible(false);
    await FirebaseAPI.setBankAccount(userDetails?.userId, bankAccount);
    setBankAccount("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View style={styles.headerSection}>
          <IconSymbol
            size={50}
            name="person.crop.circle"
            color={Colors.primaryColor}
          />
          <Text style={styles.userName}>{userDetails?.username}</Text>
          <Text style={styles.userPhone}>{userDetails?.email}</Text>
          <Text style={styles.userPhone}>
            {userDetails?.phone
              ? `${userDetails.phone.slice(0, 3)} ${userDetails.phone.slice(
                  3,
                  8
                )} ${userDetails.phone.slice(8)}`
              : ""}
          </Text>
        </View>
        <View style={styles.statisticsSection}>
          <Text style={styles.sectionTitle}>♻️ Recycling Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {userDetails?.currentPoints}
              </Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{userDetails?.monthPoints}</Text>
              <Text style={styles.statLabel}>Points this Month</Text>
            </View>
          </View>
          <View style={styles.walletButtonsRow}>
            <TouchableOpacity
              style={[
                styles.walletButton,
                userDetails?.currentPoints === 0 && styles.walletButtonDisabled, // Apply disabled style
              ]}
              onPress={() => setConvertModalVisible(true)}
              disabled={userDetails?.currentPoints === 0} // Disable button if currentPoints is 0
            >
              <Text style={styles.walletButtonText}>
                Convert Points to Cash
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statisticsSection}>
          <Text style={styles.sectionTitle}>💸 Wallet</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>
                {userDetails?.wallet !== undefined &&
                userDetails?.wallet !== null
                  ? userDetails.wallet.toFixed(2)
                  : "0.00"}
              </Text>
              <Text style={styles.statLabel}>EGP</Text>
            </View>
          </View>
          <View style={styles.walletButtonsRow}>
            <TouchableOpacity
              style={[
                styles.walletButton,
                (userDetails?.wallet ?? 0) < 50 && styles.walletButtonDisabled, // Apply disabled style
              ]}
              onPress={() => {
                setBankModalVisible(true);
              }}
              disabled={(userDetails?.wallet ?? 0) < 50} // Disable button if currentPoints is 0
            >
              <Text style={styles.walletButtonText}>Set Bank Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.walletButton,
                (!userDetails?.bankAccount ||
                  (userDetails?.wallet ?? 0) < 50) &&
                  styles.walletButtonDisabled, // Apply disabled style
              ]}
              onPress={() => setSendModalVisible(true)}
              disabled={
                !userDetails?.bankAccount || (userDetails?.wallet ?? 0) < 50
              }
            >
              <Text style={styles.walletButtonText}>Send Cash to Bank</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>🏅 Badges</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.badgeContainer,
                {
                  backgroundColor:
                    (userDetails?.totalPoints ?? 0) >= dummyBadges[0].threshold
                      ? Colors.primaryColor
                      : "#BDC3C7",
                },
              ]}
              onPress={() => openModal(dummyBadges[0])}
            >
              <Icon
                name={dummyBadges[0].icon}
                size={40}
                color="#fff"
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeName}>{dummyBadges[0].name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.badgeContainer,
                {
                  backgroundColor:
                    (userDetails?.totalPoints ?? 0) >= dummyBadges[1].threshold
                      ? Colors.primaryColor
                      : "#BDC3C7",
                },
              ]}
              onPress={() => openModal(dummyBadges[1])}
            >
              <Icon
                name={dummyBadges[1].icon}
                size={40}
                color="#fff"
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeName}>{dummyBadges[1].name}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.badgeContainer,
                {
                  backgroundColor:
                    (userDetails?.totalPoints ?? 0) >= dummyBadges[2].threshold
                      ? Colors.primaryColor
                      : "#BDC3C7",
                },
              ]}
              onPress={() => openModal(dummyBadges[2])}
            >
              <Icon
                name={dummyBadges[2].icon}
                size={40}
                color="#fff"
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeName}>{dummyBadges[2].name}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.badgeContainer,
                {
                  backgroundColor:
                    (userDetails?.totalPoints ?? 0) >= dummyBadges[3].threshold
                      ? Colors.primaryColor
                      : "#BDC3C7",
                },
              ]}
              onPress={() => openModal(dummyBadges[3])}
            >
              <Icon
                name={dummyBadges[3].icon}
                size={40}
                color="#fff"
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeName}>{dummyBadges[3].name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.badgeContainer,
                {
                  backgroundColor:
                    (userDetails?.totalPoints ?? 0) >= dummyBadges[4].threshold
                      ? Colors.primaryColor
                      : "#BDC3C7",
                },
              ]}
              onPress={() => openModal(dummyBadges[4])}
            >
              <Icon
                name={dummyBadges[4].icon}
                size={40}
                color="#fff"
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeName}>{dummyBadges[4].name}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>More</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMyVouchersPress}
          >
            <Icon
              name="ticket"
              size={24}
              color="#fff"
              style={styles.actionIcon}
            />
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
        <ConfirmationModal
          visible={isConvertModalVisible}
          onClose={() => setConvertModalVisible(false)}
          onConfirm={() => {
            handleConvertPoints();
          }}
          title="Are you sure?"
          description={`Do you want to convert your points to cash?\n \n You will receive ${
            (userDetails?.currentPoints ?? 0) / 10
          } EGP!`}
        />
        <ConfirmationModal
          visible={isSendModalVisible}
          onClose={() => setSendModalVisible(false)}
          onConfirm={() => {
            handleSendCash();
          }}
          title="Are you sure?"
          description={`Do you want to send cash to your bank account?\n \n ${
            userDetails?.wallet
          } EGP will be sent to ${
            typeof userDetails?.bankAccount === "string" &&
            userDetails.bankAccount
              ? "*".repeat((userDetails.bankAccount as string).length - 4) +
                (userDetails.bankAccount as string).slice(-4)
              : ""
          }.`}
        />
        <OneInputModal
          visible={isBankModalVisible}
          title={
            "BANK " +
            (typeof userDetails?.bankAccount === "string" &&
            userDetails.bankAccount
              ? "*".repeat((userDetails.bankAccount as string).length - 4) +
                (userDetails.bankAccount as string).slice(-4)
              : "")
          }
          onClose={() => setBankModalVisible(false)}
          onAction={handleBankAccountInput}
          placeholder="Enter your bank account number"
          actionText="Confirm"
          inputValue={bankAccount}
          setInputValue={setBankAccount}
          inputType="default"
          maxCharacters={16}
          minCharacters={10}
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
      </ScrollView>
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
    color: "#333",
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
    shadowColor: "#333",
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
  walletButtonDisabled: {
    backgroundColor: Colors.locked, // Greyed-out color for disabled state
  },
});

export default Profile;
