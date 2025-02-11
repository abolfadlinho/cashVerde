import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/authProvider";
import FirebaseAPI from "@/firebase/endpoints";
import { Colors } from "@/constants/Colors";

interface LeaderboardEntry {
  rank: number;
  username: string;
  monthPoints: number;
  userId: string;
}

interface Community {
  name: string;
  rank: number;
  communityId?: string; //replaced with fieldName in public community
  code?: string; //replaced with fieldValue in public community
  owner?: string;
  createdAt?: string;
}

type RootStackParamList = {
  Community: undefined;
  Profile: { userId: string };
};

interface RouteParams {
  community: Community;
}

const Community = () => {
  const route =
    useRoute<RouteProp<{ params: { community: Community } }, "params">>();
  const { community } = route.params;
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchPrivateData = async () => {
      setLoading(true);
      FirebaseAPI.getLeaderboard(
        community.communityId || "",
        community.name
      ).then((leaderboard) => {
        setLeaderboard(leaderboard);
        setLoading(false);
      });
    };

    const fetchPublicData = async () => {
      setLoading(true);
      FirebaseAPI.getPublicLeaderboard(
        community.communityId || "",
        community.code
      ).then((leaderboard) => {
        setLeaderboard(leaderboard);
        setLoading(false);
      });
    };

    if (community.owner) {
      fetchPrivateData();
    } else {
      fetchPublicData();
    }
  }, [community.communityId]);

  const copyToClipboard = () => {
    Clipboard.setString(community.code?.toString() || "");
  };

  const navigateToProfile = (userId: string) => {
    navigation.navigate("Profile", { userId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Text style={styles.communityName}>{community.name}</Text>
          {community.owner && (
            <View style={styles.codeContainer}>
              <TouchableOpacity
                onPress={copyToClipboard}
                style={styles.copyButton}
              >
                <Text style={styles.code}>Code: {community.code}</Text>

                <Icon
                  name="clipboard-text"
                  size={24}
                  color={Colors.primaryColor}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.leaderboardSection}>
          <Text style={styles.leaderboardTitle}>Leaderboard</Text>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.headerText}>#</Text>
            <Text style={styles.headerText}>Username</Text>
            <Text style={styles.headerText}>Points</Text>
          </View>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <FlatList
              data={leaderboard}
              keyExtractor={(item) => item.userId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigateToProfile(item.userId)}
                  style={[
                    styles.leaderboardItem,
                    item.username === userDetails?.username && {
                      borderWidth: 3,
                      borderColor: Colors.primaryColor,
                      padding: 6,
                    },
                  ]}
                >
                  <Text style={styles.rank}>{item.rank}</Text>
                  <Text style={styles.name}>{item.username}</Text>
                  <Text style={styles.monthPoints}>{item.monthPoints}</Text>
                </TouchableOpacity>
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
  communityName: {
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
    marginTop: 3,
  },
  code: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.greenText,
  },
  copyButton: {
    padding: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  leaderboardSection: {
    paddingHorizontal: 16,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  leaderboardItem: {
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
  monthPoints: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.greenText,
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    paddingHorizontal: 0,
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
});

export default Community;
