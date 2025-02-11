import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, Dimensions, Text } from "react-native";
import { useAuth } from "../contexts/authProvider";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

const NUM_EMOJIS = 30;

const Index = () => {
  const auth = useAuth();
  const router = useRouter();
  const emojiPositions = Array.from({ length: NUM_EMOJIS }, () => ({
    x: useSharedValue(Math.random() * width - 150),
    y: useSharedValue(-280),
    rotate: useSharedValue(Math.random() * 20 - 10),
  }));

  useEffect(() => {
    emojiPositions.forEach((emoji, index) => {
      emoji.y.value = withDelay(
        index * 100,
        withTiming(height - 60, { duration: 3000 })
      );
      emoji.rotate.value = withRepeat(
        withTiming(emoji.rotate.value + 360, { duration: 3000 }),
        -1,
        false
      );
    });

    const timer = setTimeout(() => {
      if (auth?.userLoggedIn) {
        router.replace({ pathname: "/(tabs)/home" });
      } else {
        router.replace({ pathname: "/Sign" });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [auth?.userLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.emojis}>
        {emojiPositions.map((emoji, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.emoji,
              useAnimatedStyle(() => ({
                transform: [
                  { translateX: emoji.x.value },
                  { translateY: emoji.y.value },
                  { rotate: `${emoji.rotate.value}deg` },
                ],
              })),
            ]}
          >
            💸
          </Animated.Text>
        ))}
      </View>
      <Image
        source={require("../assets/images/CashVerde.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  emoji: {
    zIndex: 1,
    position: "absolute",
    fontSize: 52,
  },
  emojis: {
    marginRight: 100,
  },
});

export default Index;
