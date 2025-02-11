import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/authProvider";
import { auth } from "../../firebase/firebase";
import { StackNavigationProp } from "@react-navigation/stack";
import OneInputModal from "@/components/OneInputModal";
import FirebaseAPI from "@/firebase/endpoints";
import { ActivityIndicator } from "react-native";
import CommunityItem from "@/components/CommunityItem";
import { Colors } from "@/constants/Colors";

interface Community {
  name: string;
  rank: number;
  communityId?: string;
  code?: string;
  owner?: string;
  createdAt?: string;
}

type RootStackParamList = {
  Communities: undefined;
  Community: { community: Community };
};

const calculateTimeLeft = () => {
  const now = new Date();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const difference = endOfMonth.getTime() - now.getTime();

  const timeLeft = {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };

  return timeLeft;
};

export default function Communities() {
  type CommunitiesScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "Communities"
  >;
  const navigation = useNavigation<CommunitiesScreenNavigationProp>();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [communityName, setCommunityName] = useState("");
  const { userDetails } = useAuth();
  const name = userDetails?.username;
  const score = userDetails?.monthPoints;
  const [publicCommunities, setPublicCommunities] = useState<Community[]>([]);
  const [privateCommunities, setPrivateCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getRank = async (fieldName: string, fieldValue: string) => {
    return (
      (await FirebaseAPI.getUserRank(
        userDetails?.monthPoints,
        fieldName,
        fieldValue
      )) || -1
    );
  };

  const getPrivateCommunities = async () => {
    try {
      const snapshot = await FirebaseAPI.fetchCommunitiesUingIds(
        userDetails?.communities
      );

      const communities: Community[] = await Promise.all(
        snapshot.map(
          async (community: {
            id: string;
            name?: string;
            code?: string;
            owner?: string;
            createdAt?: string;
          }) => ({
            name: community.name ?? `Community ${community.id}`,
            rank: await getRank("community", community.id),
            code: community.code,
            communityId: community.id,
            owner: community.owner,
            createdAt: community.createdAt,
          })
        )
      );

      setPrivateCommunities(communities);
    } catch (error) {
      console.error("Error fetching private communities:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userDetails) {
        const publicCommunities: Community[] = [];
        if (userDetails.neighbourhood) {
          publicCommunities.push({
            name: userDetails.neighbourhood,
            rank: await getRank("neighbourhood", userDetails?.neighbourhood),
            communityId: "neighbourhood",
            code: userDetails?.neighbourhood,
          });
        }
        if (userDetails.city) {
          publicCommunities.push({
            name: userDetails.city,
            rank: await getRank("city", userDetails.city),
            communityId: "city",
            code: userDetails?.city,
          });
        }
        if (userDetails.dob) {
          const year = new Date(userDetails.dob).getFullYear().toString();
          const yearRank = await getRank("year", year);
          publicCommunities.push({
            name: year,
            rank: yearRank,
            communityId: "year",
            code: year,
          });
        }
        publicCommunities.push({
          name: "Overall",
          rank: await getRank("overall", ""),
          communityId: "overall",
          code: "overall",
        });
        getPrivateCommunities();
        setPublicCommunities(publicCommunities);
      }
    };

    fetchData();
  }, [userDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateCommunity = async () => {
    if (!communityName.trim()) {
      console.error("Community name cannot be empty");
      return;
    }

    try {
      const newCommunity = await FirebaseAPI.createCommunity(
        userDetails?.userId,
        communityName
      );
      setPrivateCommunities([
        ...privateCommunities,
        {
          ...newCommunity,
          createdAt: newCommunity.createdAt.toISOString(),
          rank: 1,
        },
      ]);
      setCreateModalVisible(false);
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!code.trim()) {
      console.error("Code name cannot be empty");
      return;
    }

    try {
      const newCommunity = await FirebaseAPI.joinCommunityUsingCode(
        userDetails?.userId,
        code
      );
      setPrivateCommunities([
        ...privateCommunities,
        { ...newCommunity, rank: 0 } as Community,
      ]);
      setJoinModalVisible(false);
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  const handleCommunityPress = (community: Community) => {
    navigation.navigate("Community", { community });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
          <Text style={styles.loadingText}>Loading communities...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View style={styles.headerSection}>
            <Text style={styles.timerText}>{name}</Text>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.timerText}>
              ⏳ Points Reset: {timeLeft.days}d {timeLeft.hours}h{" "}
              {timeLeft.minutes}m {timeLeft.seconds}s
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Communities</Text>
            {privateCommunities.map((community, index) => (
              <CommunityItem
                key={index}
                community={community}
                onPress={handleCommunityPress}
              />
            ))}
            <View>
              <TouchableOpacity
                style={[styles.actionButton, { margin: 10 }]}
                onPress={() => setJoinModalVisible(true)}
              >
                <IconSymbol
                  name="person.2.fill"
                  size={20}
                  color={Colors.greenText}
                />
                <Text style={styles.actionButtonText}>Join Community</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { margin: 10 }]}
                onPress={() => setCreateModalVisible(true)}
              >
                <IconSymbol
                  name="plus.circle"
                  size={20}
                  color={Colors.greenText}
                />
                <Text style={styles.actionButtonText}>Create Community</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Public Communities</Text>
            {publicCommunities.map((community, index) => (
              <CommunityItem
                key={index}
                community={community}
                onPress={handleCommunityPress}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <OneInputModal
        visible={joinModalVisible}
        title="Enter 6-Character Code"
        inputValue={code}
        setInputValue={setCode}
        placeholder="Enter Code"
        onClose={() => setJoinModalVisible(false)}
        onAction={handleJoinCommunity}
        actionText="Join"
        inputType="default"
        minCharacters={6}
        maxCharacters={6}
      />
      <OneInputModal
        visible={createModalVisible}
        title="Enter Community Name"
        inputValue={communityName}
        setInputValue={setCommunityName}
        placeholder="Community Name"
        onClose={() => setCreateModalVisible(false)}
        onAction={handleCreateCommunity}
        actionText="Create"
        inputType="default"
        minCharacters={3}
        maxCharacters={25}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  timerText: {
    fontSize: 16,
    color: Colors.greyText,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
    textAlign: "center",
    letterSpacing: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: Colors.greenText,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.greenText,
  },
});
