import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type CategoryType = {
  [key: string]: {
    [key: string]: {
      question: string;
      answer: string;
    }[];
  };
};

const categories: CategoryType = {
  General: {
    Recycling: [
      {
        question: "How to recycle?",
        answer: "Separate waste into recyclables and non-recyclables.",
      },
      {
        question: "What materials are recyclable?",
        answer: "Paper, plastic, metal, and glass are commonly recyclable.",
      },
      {
        question: "Why is recycling important?",
        answer:
          "It reduces waste, conserves resources, and protects the environment.",
      },
      {
        question: "Can all plastics be recycled?",
        answer:
          "Not all plastics are recyclable; check the recycling symbols on the packaging.",
      },
      {
        question: "How should I prepare recyclables?",
        answer: "Clean and dry them before placing them in the bin.",
      },
      {
        question: "What happens to recycled materials?",
        answer: "They are processed and turned into new products.",
      },
      {
        question: "Can I recycle food-contaminated items?",
        answer: "No, food waste contaminates recyclables.",
      },
    ],
    Points: [
      {
        question: "How to earn points?",
        answer: "Deposit recyclables in designated machines to earn points.",
      },
      {
        question: "How to redeem points?",
        answer: "Convert points into cash or rewards through the app.",
      },
      {
        question: "Do points expire?",
        answer: "Points may expire if not used within a certain period.",
      },
      {
        question: "How to check my points?",
        answer: "Go to the 'My Account' section in the app.",
      },
      {
        question: "Can I transfer points?",
        answer: "No, points are non-transferable.",
      },
      {
        question: "Are there bonus point events?",
        answer: "Yes, check the app for seasonal promotions and bonus events.",
      },
      {
        question: "What can I redeem with points?",
        answer: "Cash, discounts, and eco-friendly products.",
      },
    ],
    Rewards: [
      {
        question: "What kind of rewards are available?",
        answer: "Cash, discounts, and sustainable products.",
      },
      {
        question: "How do I claim a reward?",
        answer:
          "Go to the rewards section in the app and select an available item.",
      },
      {
        question: "Are rewards limited?",
        answer: "Yes, some rewards have a limited stock.",
      },
      {
        question: "Can I return a reward?",
        answer: "No, once redeemed, rewards are non-refundable.",
      },
      {
        question: "Are there exclusive rewards?",
        answer: "Yes, VIP users may access exclusive offers.",
      },
      {
        question: "How often do new rewards appear?",
        answer: "New rewards are added every month.",
      },
      {
        question: "Can I suggest new rewards?",
        answer: "Yes, contact support with your suggestions.",
      },
    ],
    Membership: [
      {
        question: "How do I become a member?",
        answer: "Simply sign up on the app to start earning points.",
      },
      {
        question: "Are there membership levels?",
        answer: "Yes, regular and VIP membership tiers are available.",
      },
      {
        question: "What are VIP benefits?",
        answer: "VIP members earn bonus points and exclusive rewards.",
      },
      {
        question: "How do I upgrade to VIP?",
        answer:
          "Earn a certain number of points or subscribe to a premium plan.",
      },
      {
        question: "Can I lose my membership?",
        answer:
          "Yes, inactivity for a long period may lead to account suspension.",
      },
      {
        question: "Is membership free?",
        answer: "Yes, the basic membership is free for all users.",
      },
      {
        question: "Can I refer friends?",
        answer: "Yes, referring friends earns you bonus points.",
      },
    ],
  },
  Deposit: {
    Locations: [
      {
        question: "Where are the deposit machines?",
        answer: "Check the app for the nearest deposit machine locations.",
      },
      {
        question: "Operating hours?",
        answer: "Machines are available 24/7 in most locations.",
      },
      {
        question: "Are machines available in rural areas?",
        answer: "We are expanding to more locations, including rural areas.",
      },
      {
        question: "Do machines accept all recyclables?",
        answer: "Each machine specifies the accepted materials.",
      },
      {
        question: "Can I suggest a new location?",
        answer: "Yes, use the app's feedback section to request new locations.",
      },
      {
        question: "How many machines are there?",
        answer: "We have over 1,000 machines nationwide.",
      },
      {
        question: "Do locations change?",
        answer: "Some machines may be relocated based on usage demand.",
      },
    ],
    Process: [
      {
        question: "How to use the machine?",
        answer: "Follow on-screen instructions to deposit recyclables.",
      },
      {
        question: "Accepted items?",
        answer:
          "Machines accept plastic bottles, aluminum cans, and glass bottles.",
      },
      {
        question: "Can I deposit in bulk?",
        answer:
          "Yes, but large quantities must be deposited in multiple sessions.",
      },
      {
        question: "Do machines issue receipts?",
        answer: "Yes, you can get an electronic receipt through the app.",
      },
      {
        question: "What if a machine is full?",
        answer:
          "Report the issue in the app, and we will send a team to empty it.",
      },
      {
        question: "How long does it take to process?",
        answer: "Depositing an item usually takes a few seconds.",
      },
      {
        question: "Can I deposit other waste types?",
        answer: "No, only specified recyclables are accepted.",
      },
    ],
  },
  Community: {
    Events: [
      {
        question: "Are there recycling events?",
        answer: "Yes, check the app for upcoming events and campaigns.",
      },
      {
        question: "How to join an event?",
        answer: "Register through the app or visit our website for details.",
      },
      {
        question: "Can I organize an event?",
        answer: "Yes, contact our team for collaboration opportunities.",
      },
      {
        question: "Do events have prizes?",
        answer: "Some events offer rewards and bonus points.",
      },
      {
        question: "Are events family-friendly?",
        answer: "Yes, we encourage community participation.",
      },
      {
        question: "How can I volunteer?",
        answer: "Sign up through our app to participate in eco-initiatives.",
      },
      {
        question: "Are events free?",
        answer:
          "Most events are free to join, but some may require registration.",
      },
    ],
  },
  Sustainability: {
    Education: [
      {
        question: "Why is sustainability important?",
        answer: "It ensures a better future by conserving resources.",
      },
      {
        question: "How can I live sustainably?",
        answer: "Reduce waste, recycle, and use eco-friendly products.",
      },
      {
        question: "What is a carbon footprint?",
        answer: "The total amount of greenhouse gases you produce.",
      },
      {
        question: "How to reduce my carbon footprint?",
        answer: "Use public transport, recycle, and conserve energy.",
      },
      {
        question: "Are paper bags better than plastic?",
        answer: "Yes, but reusables are the best option.",
      },
      {
        question: "What is upcycling?",
        answer: "Repurposing old items into new products.",
      },
      {
        question: "How does recycling help climate change?",
        answer: "It reduces emissions from waste production.",
      },
    ],
  },
  Rewards: {
    Donations: [
      {
        question: "Can I donate my points?",
        answer: "Yes, you can donate points to environmental charities.",
      },
      {
        question: "Who receives donations?",
        answer: "Registered eco-friendly organizations and NGOs.",
      },
      {
        question: "Is there a donation limit?",
        answer: "No, you can donate as many points as you wish.",
      },
      {
        question: "Do I get recognition for donations?",
        answer: "Yes, you may receive a badge in the app.",
      },
      {
        question: "Can I track my donation impact?",
        answer: "Yes, we provide updates on funded projects.",
      },
      {
        question: "Are donations tax-deductible?",
        answer: "Check your local tax laws for eligibility.",
      },
      {
        question: "Can businesses participate?",
        answer: "Yes, companies can sponsor donations too.",
      },
    ],
  },
};

const Chat: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const [selectedQuestion, setSelectedQuestion] = useState<{
    question: string;
    answer: string;
  } | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSelectedQuestion(null);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
    setSelectedQuestion(null);
  };

  const handleBack = () => {
    if (selectedQuestion) {
      setSelectedQuestion(null);
      return;
    }
    if (selectedSubCategory) {
      setSelectedSubCategory(null);
      return;
    }
    if (selectedCategory) {
      setSelectedCategory(null);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        {selectedCategory && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{selectedCategory || "FAQs"}</Text>
      </View>

      <View style={styles.container}>
        {!selectedCategory ? (
          Object.keys(categories).map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.button}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.text}>{category}</Text>
            </TouchableOpacity>
          ))
        ) : !selectedSubCategory ? (
          Object.keys(categories[selectedCategory]).map((subCategory) => (
            <TouchableOpacity
              key={subCategory}
              style={styles.button}
              onPress={() => handleSubCategorySelect(subCategory)}
            >
              <Text style={styles.text}>{subCategory}</Text>
            </TouchableOpacity>
          ))
        ) : !selectedQuestion ? (
          categories[selectedCategory][selectedSubCategory].map((q) => (
            <TouchableOpacity
              key={q.question}
              style={styles.questionButton}
              onPress={() => setSelectedQuestion(q)}
            >
              <Text style={styles.questionText}>{q.question}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.answerContainer}>
            <Text style={styles.questionText}>{selectedQuestion.question}</Text>
            <Text style={styles.answerText}>{selectedQuestion.answer}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.whiteColor,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  questionButton: {
    backgroundColor: Colors.whiteColor,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    color: Colors.greenText,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  answerContainer: {
    backgroundColor: Colors.whiteColor,
    padding: 20,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  answerText: {
    color: "#000",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Chat;
