import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors } from "@/constants/Colors";

const { width: screenWidth } = Dimensions.get("window");

interface Slide {
  id: string;
  image: string;
  text: string;
}

interface SliderProps {
  slides: Slide[];
  onRedeem: (slide: Slide) => void;
}

const Slider: React.FC<SliderProps> = ({ slides, onRedeem }) => {
  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slideContainer}>
      <Image source={{ uri: item.image }} style={styles.slideImage} />
      <Text style={styles.slideText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.redeemButton}
        onPress={() => onRedeem(item)}
      >
        <Text style={styles.redeemButtonText}>Redeem</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.carouselSection}>
      <FlatList
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselSection: {
    marginBottom: 24,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  slideContainer: {
    width: screenWidth * 0.8,
    marginHorizontal: screenWidth * 0.01,
    marginVertical: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  slideImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  slideText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
    color: "#333",
  },
  redeemButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
  },
  redeemButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default Slider;
