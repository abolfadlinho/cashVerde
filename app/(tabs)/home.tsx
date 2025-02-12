import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../contexts/authProvider";
import { useNavigation } from "@react-navigation/native";
import FirebaseAPI from "../../firebase/endpoints";
import ConfirmationModal from "../../components/ConfirmationModal";
import HelpModal from "@/components/HelpModal";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

interface Slide {
  id: string;
  image: string;
  text: string;
  points: number;
}

type RootStackParamList = {
  Chat: undefined;
  Scanner: undefined;
};

const HomePage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const { userDetails } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const vouchers: Slide[] =
          (await FirebaseAPI.fetchVouchers()) as Slide[];
        setSlides(vouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVouchers();
  }, []);

  const handleRedeem = (slide: Slide) => {
    setSelectedSlide(slide);
    setModalVisible(true);
  };

  const confirmRedeem = () => {
    if (selectedSlide) {
      FirebaseAPI.redeemVoucher(
        userDetails?.userId,
        selectedSlide.id,
        selectedSlide.points
      );
      setModalVisible(false);
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    const isDisabled =
      item.points > (userDetails?.currentPoints || 0) ||
      userDetails?.voucherIds.includes(item.id); // Disable if points are greater

    return (
      <View style={styles.slideContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.slideImage}
          defaultSource={require("../../assets/images/CashVerde.png")} // Add a placeholder image
        />
        <Text style={styles.slideText}>{item.text}</Text>
        <TouchableOpacity
          style={[styles.redeemButton, isDisabled && styles.disabledButton]} // Apply disabled style
          onPress={() => handleRedeem(item)}
          disabled={isDisabled} // Disable button if points are greater
        >
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleChat = () => {
    setHelpModalVisible(false);
    navigation.navigate("Chat");
  };

  const handleScanner = () => {
    navigation.navigate("Scanner");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image
            source={require("../../assets/images/wide.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.statsSection}>
          <Text style={styles.statsText}>
            👋 Hi <Text style={styles.highlight}>{userDetails?.username}</Text>{" "}
            !
          </Text>
          <Text style={styles.statsText}>
            Waste Diverted:{" "}
            <Text style={styles.highlight}>
              {userDetails?.totalPoints /*some calculation*/} kg
            </Text>
          </Text>
          <Text style={styles.statsText}>
            Carbon Emissions Reduced:{" "}
            <Text style={styles.highlight}>
              {userDetails?.totalPoints /*some calculation*/} kg
            </Text>
          </Text>
          <Text style={styles.statsText}>
            Points:{" "}
            <Text style={styles.highlight}>{userDetails?.currentPoints}</Text>
          </Text>
          <Text style={styles.encouragingText}>
            {userDetails?.totalPoints === 0
              ? "Start making an impact! 🏁"
              : "Keep it up! 🌟"}
          </Text>
        </View>

        <View style={styles.carouselSection}>
          <Text style={styles.carouselTitle}>🚀 Rewards</Text>
          <FlatList
            data={slides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {selectedSlide && (
          <ConfirmationModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onConfirm={confirmRedeem}
            title="Redeem Voucher"
            description={selectedSlide.text}
            imageUri={selectedSlide.image}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleScanner}>
          <Ionicons
            name="scan-outline"
            size={40}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Scan Machine QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setHelpModalVisible(true)}
        >
          <Icon name="help-circle-outline" size={32} color="white" />
        </TouchableOpacity>

        <HelpModal
          visible={helpModalVisible}
          onClose={() => setHelpModalVisible(false)}
          onChatPress={handleChat}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.primaryColor,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  highlight: {
    color: Colors.secondaryColor,
  },
  encouragingText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 12,
  },
  carouselSection: {
    marginBottom: 14,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  slideContainer: {
    width: screenWidth * 0.5,
    marginHorizontal: screenWidth * 0.01,
    marginVertical: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "space-between",
  },
  slideImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  slideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#000",
  },
  redeemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5, // Make the button look disabled
  },
  redeemButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  helpButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 25,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 300,
    height: 100,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    width: "60%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Shadow for Android
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
