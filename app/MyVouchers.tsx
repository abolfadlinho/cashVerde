import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Clipboard,
  Image,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/authProvider";
import FirebaseAPI from "@/firebase/endpoints";
import { Colors } from "@/constants/Colors";

interface Voucher {
  id: string;
  text: string;
  image: string;
  expiry: string | null;
  promoCode: string;
}

const MyVouchers = () => {
  const route =
    useRoute<RouteProp<{ params: { voucherIds: string[] } }, "params">>();
  const { voucherIds } = route.params;
  const [loading, setLoading] = useState<boolean>(true);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const vouchers: Voucher[] = await FirebaseAPI.fetchMyVouchers(
          voucherIds
        );
        setVouchers(vouchers);
      } catch (err) {
        console.error("Error fetching vouchers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, [voucherIds]);

  const copyToClipboard = (code: string) => {
    Clipboard.setString(code?.toString() || "");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Vouchers</Text>
        </View>
        <View style={styles.bodySection}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : vouchers.length === 0 ? (
            <Text
              style={{
                fontSize: 20,
                color: Colors.greyText,
                fontStyle: "italic",
              }}
            >
              No vouchers yet
            </Text>
          ) : (
            <FlatList
              data={vouchers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.voucher}>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.slideImage}
                    />
                    <View style={styles.codeContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          copyToClipboard(item.promoCode);
                        }}
                        style={styles.copyButton}
                      >
                        <Text style={styles.name}>{item.promoCode}</Text>
                        <Icon
                          name="clipboard-text"
                          size={24}
                          color={Colors.primaryColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{ flexDirection: "column", flex: 1, marginLeft: 5 }}
                  >
                    <Text style={styles.rank}>
                      Expires: {item.expiry?.toString() || "N/A"}
                    </Text>
                    <Text style={styles.name}>{item.text}</Text>
                  </View>
                </View>
              )}
            />
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
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingLeft: 4,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 3,
  },
  code: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.greenText,
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  bodySection: {
    paddingHorizontal: 16,
  },
  voucher: {
    padding: 8,
    backgroundColor: "#fff",
    marginBottom: 2,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    borderColor: Colors.lightGreen,
    borderWidth: 1,
  },
  rank: {
    fontSize: 14,
    color: Colors.greyText,
    fontStyle: "italic",
  },
  name: {
    fontSize: 16,
    color: "#000",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.primaryColor,
    marginVertical: 20,
    fontWeight: "bold",
  },
  slideImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default MyVouchers;
