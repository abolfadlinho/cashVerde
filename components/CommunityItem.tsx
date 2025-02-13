import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

interface Community {
  name: string;
  rank: number;
  communityId?: string;
  code?: string;
  owner?: string;
  createdAt?: string;
}

interface CommunityItemProps {
  community: Community;
  onPress: (community: Community) => void;
}

const CommunityItem: React.FC<CommunityItemProps> = ({
  community,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.communityItem}
      onPress={() => onPress(community)}
    >
      <Text style={styles.communityRank}>{community.rank}</Text>
      <Text style={styles.communityName}>{community.name}</Text>
      <IconSymbol
        name="medal.fill"
        size={24}
        color={
          community.rank === 1
            ? "gold"
            : community.rank === 2
            ? "silver"
            : community.rank === 3
            ? "#CD7F32"
            : "transparent"
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  communityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  communityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  communityRank: {
    fontSize: 14,
    color: Colors.greyText,
    fontStyle: "italic",
  },
});

export default CommunityItem;
