import React, { useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { useAuth } from "../contexts/authProvider";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

const Index = () => {
  const auth = useAuth();
  const router = useRouter();
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);

    const timer = setTimeout(() => {
      if (auth?.userLoggedIn) {
        router.replace({ pathname: "/(tabs)/home" });
      } else {
        router.replace({ pathname: "/Sign" });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [auth?.userLoggedIn]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/CashVerde.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.emoji, animatedStyle]}>💸</Animated.Text>
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
    fontSize: 52,
    position: "absolute",
    bottom: 320, // Adjusted to position below the logo
  },
});

export default Index;
